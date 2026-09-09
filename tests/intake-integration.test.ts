import { describe, it, expect, vi, beforeEach } from "vitest";

/**
 * Kopplingen formulär → API → triage. Triagetesterna anropar triage() direkt
 * och säger därför ingenting om vad som faktiskt når den när svaren har gått
 * genom formulärets state, JSON-serialiseringen och rutten. Det här testet kör
 * den riktiga rutthanteraren med exakt den payload BygglovskollForm skickar och
 * läser av vad triagen fick — Stripe-metadatan är facit, eftersom den skrivs ur
 * samma intake som triagen bedömde.
 */

process.env.STRIPE_SECRET_KEY = "sk_test_dummy_for_signing";
process.env.STRIPE_PRICE_BYGGLOVSKOLL = "price_test_bygglovskoll";
process.env.BYGGLOVSKOLL_ENABLED = "true";

const create = vi.fn();

vi.mock("stripe", () => ({
  default: class {
    checkout = { sessions: { create } };
  },
}));

const { POST } = await import("../src/app/api/bygglovskoll/checkout/route");

/**
 * Payloaden ordagrant som BygglovskollForm.betala() bygger den: hela utkastet
 * som `intake`, samtyckena som `samtycken`. Basfallet är uppdragets repro —
 * plank 1,1 m, 5 m till gräns, villa, detaljplan ja, nej på alla tre tvingande
 * frågor.
 */
function payload(over: Record<string, unknown> = {}) {
  return {
    intake: {
      atgard: "plank",
      placering: null,
      yta: null,
      hojd: 1.1,
      langd: 6,
      avstandTomtgrans: 5,
      fastighetstyp: "villa",
      kommun: "Uppsala",
      fastighetsbeteckning: "",
      detaljplan: "ja",
      naraVatten: "nej",
      kulturSamfallighet: "nej",
      befintligaKomplement: "nej",
      befintligKomplementYta: null,
      installation: "nej",
      fritext: "",
      epost: "test@exempel.se",
      ...over,
    },
    samtycken: { vagledning: true, angerratt: true },
  };
}

function req(kropp: unknown) {
  return { json: async () => kropp } as never;
}

beforeEach(() => {
  create.mockReset();
  create.mockResolvedValue({ id: "cs_test_123", url: "https://checkout.stripe.com/c/pay/cs_test_123" });
});

describe("intag: formulärets payload hela vägen till triagen", () => {
  it("(a) nej på alla tre + plank 1,1 m ger A och startar betalningen", async () => {
    const res = await POST(req(payload()));
    expect(res.status).toBe(200);
    expect((await res.json()).url).toContain("checkout.stripe.com");

    // Exakt vad triagen tog emot för de tre fälten.
    const { metadata } = create.mock.calls[0][0];
    expect(metadata.naraVatten).toBe("nej");
    expect(metadata.kulturSamfallighet).toBe("nej");
    expect(metadata.installation).toBe("nej");
    expect(metadata.regelspar).toBe("mall-plank-mur-1.0");
    expect(metadata.classification).toBe("plank_mur");
  });

  it("(b) ja på vatten, nej på övriga ger B med enbart vattenorsaken", async () => {
    const res = await POST(req(payload({ naraVatten: "ja" })));
    expect(res.status).toBe(409);
    const data = await res.json();
    expect(data.outcome).toBe("B");
    expect(data.reasons).toEqual(["B2"]);
    expect(create).not.toHaveBeenCalled();
  });

  it("(c) obesvarat fält ger valideringsfel, inte ett tyst B", async () => {
    for (const falt of ["naraVatten", "kulturSamfallighet", "installation"]) {
      create.mockClear();
      const res = await POST(req(payload({ [falt]: null })));
      expect(res.status, `${falt} obesvarat`).toBe(400);
      const data = await res.json();
      expect(data.kod).toBe("OFULLSTANDIGT_INTAKE");
      expect(data.error).toMatch(/måste besvaras/);
      expect(data.outcome, `${falt} fick ett utfall trots att svaret saknades`).toBeUndefined();
      expect(create).not.toHaveBeenCalled();
    }
  });

  it("tomt strängvärde är lika obesvarat som null", async () => {
    const res = await POST(req(payload({ naraVatten: "" })));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/hav, sjö eller vattendrag/);
  });

  it("varje flagga skiljer på ja och vet ej i orsakstexten", async () => {
    const { triage } = await import("../src/lib/bygglovskoll/triage");
    const kombinationer: Array<["naraVatten" | "kulturSamfallighet" | "installation", string]> = [
      ["naraVatten", "B2"],
      ["kulturSamfallighet", "B3"],
      ["installation", "B5"],
    ];
    for (const [falt, kod] of kombinationer) {
      const ja = triage(payload({ [falt]: "ja" }).intake as never);
      const vetej = triage(payload({ [falt]: "vetej" }).intake as never);
      const jaText = ja.reasons.find((r) => r.kod === kod)!.text;
      const vetejText = vetej.reasons.find((r) => r.kod === kod)!.text;
      expect(jaText).not.toBe(vetejText);
      expect(vetejText).toContain("du inte vet");
      expect(jaText).not.toContain("du inte vet");
      // Den gamla, tvetydiga formuleringen får inte komma tillbaka.
      expect(jaText).not.toMatch(/eller så är det oklart|eller att du inte vet/);
    }
  });

  it("B blockeras även när klienten kryssat i allt", async () => {
    const res = await POST(req(payload({ installation: "vetej" })));
    expect(res.status).toBe(409);
    expect((await res.json()).reasons).toEqual(["B5"]);
    expect(create).not.toHaveBeenCalled();
  });

  it("samtycken krävs före allt annat", async () => {
    const res = await POST(req({ ...payload(), samtycken: { vagledning: true, angerratt: false } }));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toContain("kryssrutorna");
    expect(create).not.toHaveBeenCalled();
  });

  it("feature-flaggan stänger rutten helt", async () => {
    process.env.BYGGLOVSKOLL_ENABLED = "false";
    const res = await POST(req(payload()));
    expect(res.status).toBe(404);
    expect(create).not.toHaveBeenCalled();
    process.env.BYGGLOVSKOLL_ENABLED = "true";
  });
});
