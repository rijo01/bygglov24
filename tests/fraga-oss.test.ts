import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Intake } from "../src/lib/bygglovskoll/types";

/**
 * Tillägget «Fråga oss»: mejlet till info@bygglov24.se går bara när sessionen
 * är betald OCH avser tilläggspriset, klar-sidan får leveranstexten bara då,
 * och frågan finns aldrig i Stripe-metadatan.
 */

process.env.STRIPE_SECRET_KEY = "sk_test_dummy_for_signing";
process.env.STRIPE_PRICE_BYGGLOVSKOLL = "price_test_bygglovskoll";
process.env.STRIPE_PRICE_BYGGLOVSKOLL_SVAR = "price_test_bygglovskoll_svar";
process.env.BYGGLOVSKOLL_ENABLED = "true";

const retrieve = vi.fn();
const update = vi.fn();

vi.mock("stripe", () => ({
  default: class {
    checkout = { sessions: { retrieve, update } };
  },
}));

const cookieVarde = { current: undefined as string | undefined };
vi.mock("next/headers", () => ({
  cookies: async () => ({ get: () => (cookieVarde.current ? { value: cookieVarde.current } : undefined) }),
}));

const fetchMock = vi.fn();
vi.stubGlobal("fetch", fetchMock);

const { GET } = await import("../src/app/api/bygglovskoll/verify-session/route");
const { intakeTillMetadata, intakeHash, signera } = await import("../src/lib/bygglovskoll/state");

const FRAGA = "Räknas mitt gamla uthus mot potten?";

const intake: Intake = {
  atgard: "fristaende", placering: "fristaende", yta: 12, hojd: 2.5, langd: null,
  avstandTomtgrans: 6, fastighetstyp: "villa", kommun: "Uppsala",
  fastighetsbeteckning: "UPPSALA KVARNBO 1:23", detaljplan: "ja", naraVatten: "nej",
  kulturSamfallighet: "nej", befintligaKomplement: "nej", befintligKomplementYta: null,
  installation: "nej", fritext: "", fraga: FRAGA, epost: "anna@exempel.se",
};

/** Samma intake men med en flagga, så att utfallet blir B. */
const intakeB: Intake = { ...intake, naraVatten: "vetej" };

function session(over: Record<string, unknown> = {}, i: Intake = intake) {
  return {
    id: "cs_test_123",
    payment_status: "paid",
    line_items: { data: [{ price: { id: "price_test_bygglovskoll_svar" } }] },
    metadata: {
      ...intakeTillMetadata(i),
      intakeHash: intakeHash(i),
      rulesVersion: "RB-2026-09-08",
      outcome: "A",
      reasons: "",
      regelspar: "mall-komplementbyggnad-1.0",
      classification: "komplementbyggnad",
    },
    ...over,
  };
}

function req() {
  return {
    nextUrl: new URL("https://bygglov24.se/api/bygglovskoll/verify-session?session_id=cs_test_123"),
  } as never;
}

/** Web3Forms-anropet, om det gjordes. */
function brev() {
  const anrop = fetchMock.mock.calls.find(([url]) => String(url).includes("web3forms"));
  return anrop ? JSON.parse(anrop[1].body as string) : null;
}

beforeEach(() => {
  retrieve.mockReset();
  update.mockReset().mockResolvedValue({});
  fetchMock.mockReset().mockResolvedValue({ ok: true } as never);
  cookieVarde.current = signera(intake);
});

describe("mejlet till info@bygglov24.se", () => {
  it("skickas vid betald session med tillägget, med källa fraga-oss", async () => {
    retrieve.mockResolvedValue(session());
    const res = await GET(req());
    expect(res.status).toBe(200);

    const b = brev();
    expect(b).not.toBeNull();
    expect(b.message).toContain("fraga-oss");
    // Frågan, intaget, utfallet och kundens e-post.
    expect(b.message).toContain(FRAGA);
    expect(b.message).toContain("UPPSALA KVARNBO 1:23");
    expect(b.message).toContain("Utfall:             A");
    expect(b.message).toContain("Klassning:          komplementbyggnad");
    expect(b.email).toBe("anna@exempel.se");
    expect(b.message).toContain("anna@exempel.se");
  });

  it("bär utfall och flaggor även vid B", async () => {
    cookieVarde.current = signera(intakeB);
    retrieve.mockResolvedValue(
      session({ metadata: { ...session({}, intakeB).metadata, outcome: "B", reasons: "B2", regelspar: "" } }, intakeB),
    );
    const res = await GET(req());
    expect(res.status).toBe(200);
    expect(brev().message).toContain("Utfall:             B");
    expect(brev().message).toContain("B2");
  });

  it("skickas inte utan tillägget", async () => {
    retrieve.mockResolvedValue(session({ line_items: { data: [{ price: { id: "price_test_bygglovskoll" } }] } }));
    const res = await GET(req());
    expect(res.status).toBe(200);
    expect(brev()).toBeNull();
  });

  it("skickas inte när sessionen inte är betald", async () => {
    retrieve.mockResolvedValue(session({ payment_status: "unpaid" }));
    const res = await GET(req());
    expect(res.status).toBe(410);
    expect(brev()).toBeNull();
  });

  it("skickas inte om vi redan mejlat frågan", async () => {
    retrieve.mockResolvedValue(
      session({ metadata: { ...session().metadata, fragaSkickad: "med-fraga" } }),
    );
    await GET(req());
    expect(brev()).toBeNull();
    expect(update).not.toHaveBeenCalled();
  });

  it("stämplar sessionen så att en omladdning inte mejlar om", async () => {
    retrieve.mockResolvedValue(session());
    await GET(req());
    expect(update).toHaveBeenCalledWith("cs_test_123", {
      metadata: expect.objectContaining({ fragaSkickad: "med-fraga" }),
    });
  });

  it("utan cookie går brevet ändå, märkt att frågan saknas", async () => {
    cookieVarde.current = undefined;
    retrieve.mockResolvedValue(session());
    await GET(req());
    const b = brev();
    expect(b.message).toContain("kunde inte återskapas");
    expect(b.message).not.toContain(FRAGA);
    expect(update).toHaveBeenCalledWith("cs_test_123", {
      metadata: expect.objectContaining({ fragaSkickad: "utan-fraga" }),
    });
  });

  it("ett brev utan frågan skickas om när frågan dyker upp", async () => {
    retrieve.mockResolvedValue(
      session({ metadata: { ...session().metadata, fragaSkickad: "utan-fraga" } }),
    );
    await GET(req());
    expect(brev().message).toContain(FRAGA);
    expect(update).toHaveBeenCalledWith("cs_test_123", {
      metadata: expect.objectContaining({ fragaSkickad: "med-fraga" }),
    });
  });

  it("leveransen fortsätter även om brevet inte går fram", async () => {
    fetchMock.mockResolvedValue({ ok: false } as never);
    retrieve.mockResolvedValue(session());
    const res = await GET(req());
    expect(res.status).toBe(200);
    // Inget stämplat: brevet får en ny chans vid nästa laddning.
    expect(update).not.toHaveBeenCalled();
  });
});

describe("klar-sidans leveranstext", () => {
  it("visas bara när tillägget är betalt", async () => {
    retrieve.mockResolvedValue(session());
    const med = await (await GET(req())).json();
    expect(med.personligtSvar).toEqual({ epost: "anna@exempel.se" });
    expect(med.orientering.personligtSvar).toBe(true);

    fetchMock.mockClear();
    retrieve.mockResolvedValue(session({ line_items: { data: [{ price: { id: "price_test_bygglovskoll" } }] } }));
    const utan = await (await GET(req())).json();
    expect(utan.personligtSvar).toBeNull();
    expect(utan.orientering.personligtSvar).toBe(false);
  });

  it("texten namnger e-postadressen och två arbetsdagar", async () => {
    const { fragaLeverans } = await import("../src/lib/bygglovskoll/copy");
    const text = fragaLeverans("anna@exempel.se");
    expect(text).toBe(
      "Din Bygglovskoll är klar nedan. Ditt personliga svar skickas till anna@exempel.se inom två arbetsdagar.",
    );
  });
});

describe("förbjudna fraser i tilläggets copy", () => {
  it("brevtexten och förbehållet är rena", async () => {
    const { byggBrevtext } = await import("../src/lib/bygglovskoll/fraga-oss");
    const { triage } = await import("../src/lib/bygglovskoll/triage");
    const { FRAGA_FORBEHALL, FRAGA_KRYSS, FRAGA_ETIKETT, FRAGA_HJALP } = await import(
      "../src/lib/bygglovskoll/copy"
    );
    const FORBJUDNA = [
      "rätt svar", "få besked", "vi avgör", "du behöver inte bygglov",
      "du kan bygga", "garanterat", "juridiskt bindande", "hundratals", "nöjda kunder",
    ];
    const texter = [
      byggBrevtext(intake, triage(intake), "cs_test_123"),
      FRAGA_KRYSS,
      FRAGA_ETIKETT,
      FRAGA_HJALP,
      // FRAGA_FORBEHALL innehåller «svaret» i betydelsen skriftligt svar; det
      // ordet prövas därför inte här, se undantaget i forbidden-phrases.
      FRAGA_FORBEHALL,
    ];
    for (const text of texter) {
      for (const fras of FORBJUDNA) {
        expect(text.toLowerCase().includes(fras), `"${fras}" i «${text.slice(0, 40)}…»`).toBe(false);
      }
    }
  });
});
