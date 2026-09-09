import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Intake } from "../src/lib/bygglovskoll/types";

/**
 * Leveransen ska klara sig på enbart session_id. Testet kör rutten helt utan
 * cookie och kontrollerar att underlaget ändå byggs komplett ur metadatan.
 */

process.env.STRIPE_SECRET_KEY = "sk_test_dummy_for_signing";
process.env.STRIPE_PRICE_BYGGLOVSKOLL = "price_test_bygglovskoll";

const retrieve = vi.fn();

vi.mock("stripe", () => ({
  default: class {
    checkout = { sessions: { retrieve } };
  },
}));

// Ingen cookie alls — precis det scenario som tidigare gav 410.
const cookieGet = vi.fn(() => undefined);
vi.mock("next/headers", () => ({
  cookies: async () => ({ get: cookieGet }),
}));

const { GET } = await import("../src/app/api/bygglovskoll/verify-session/route");
const { intakeTillMetadata, intakeHash } = await import("../src/lib/bygglovskoll/state");

const intake: Intake = {
  atgard: "fristaende", placering: "fristaende", yta: 12, hojd: 2.5, langd: null,
  avstandTomtgrans: 6, fastighetstyp: "villa", kommun: "Uppsala",
  fastighetsbeteckning: "UPPSALA KVARNBO 1:23", detaljplan: "ja", naraVatten: "nej",
  kulturSamfallighet: "nej", befintligaKomplement: "nej", befintligKomplementYta: null,
  installation: "nej", fritext: "en fritext som aldrig skickas till Stripe", epost: "a@b.se",
};

function session(over: Record<string, unknown> = {}) {
  return {
    id: "cs_test_123",
    payment_status: "paid",
    line_items: { data: [{ price: { id: "price_test_bygglovskoll" } }] },
    metadata: {
      ...intakeTillMetadata(intake),
      intakeHash: intakeHash(intake),
      rulesVersion: "RB-2026-09-08",
      regelspar: "mall-komplementbyggnad-1.0",
      classification: "komplementbyggnad",
    },
    ...over,
  };
}

function req(url: string) {
  return { nextUrl: new URL(url) } as never;
}

const URL_OK = "https://bygglov24.se/api/bygglovskoll/verify-session?session_id=cs_test_123";

beforeEach(() => {
  retrieve.mockReset();
  cookieGet.mockClear();
});

describe("verify-session utan cookie", () => {
  it("returnerar komplett underlag från enbart session_id", async () => {
    retrieve.mockResolvedValue(session());
    const res = await GET(req(URL_OK));
    expect(res.status).toBe(200);
    const data = await res.json();

    // Alla åtta avsnitt, i ordning.
    expect(data.orientering.avsnitt.map((a: { nummer: number }) => a.nummer)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    expect(data.klassning).toBe("komplementbyggnad");

    const text = JSON.stringify(data.orientering);
    // Fälten ur metadatan har återuppstått.
    expect(text).toContain("Uppsala");
    expect(text).toContain("UPPSALA KVARNBO 1:23");
    expect(text).toContain("12,0 m²");
    expect(text).toContain("2,5 m");
    // Fritexten fanns aldrig i metadatan och skrivs som tankstreck, inte gissad.
    expect(text).not.toContain("en fritext som aldrig skickas till Stripe");
    expect(text).toContain("Din beskrivning: —");
    // Verbatim-förbehållet finns kvar.
    expect(text).toContain("det bindande beskedet ges av din kommuns byggnadsnämnd");

    // Cookien lästes, men var inte ett villkor.
    expect(cookieGet).toHaveBeenCalled();
  });

  it("410 när session_id saknas", async () => {
    const res = await GET(req("https://bygglov24.se/api/bygglovskoll/verify-session"));
    expect(res.status).toBe(410);
    expect((await res.json()).error).toContain("Återbetalning vid tekniskt fel");
    expect(retrieve).not.toHaveBeenCalled();
  });

  it("410 när sessionen inte finns", async () => {
    retrieve.mockRejectedValue(new Error("No such checkout.session"));
    const res = await GET(req(URL_OK));
    expect(res.status).toBe(410);
  });

  it("410 när sessionen inte är betald", async () => {
    retrieve.mockResolvedValue(session({ payment_status: "unpaid" }));
    const res = await GET(req(URL_OK));
    expect(res.status).toBe(410);
  });

  it("409 när betalningen avser ett annat pris", async () => {
    retrieve.mockResolvedValue(session({ line_items: { data: [{ price: { id: "price_nagot_annat" } }] } }));
    const res = await GET(req(URL_OK));
    expect(res.status).toBe(409);
  });

  it("felmeddelandet hänvisar aldrig till att höra av sig", async () => {
    retrieve.mockResolvedValue(session({ payment_status: "unpaid" }));
    const res = await GET(req(URL_OK));
    const { error } = await res.json();
    expect(error.toLowerCase()).not.toContain("hör av dig");
    expect(error.toLowerCase()).not.toContain("kontakta oss");
  });
});

describe("metadata-serialisering", () => {
  it("tur och retur bevarar allt utom fritexten", async () => {
    const { metadataTillIntake } = await import("../src/lib/bygglovskoll/state");
    const tillbaka = metadataTillIntake(intakeTillMetadata(intake));
    expect(tillbaka).toEqual({ ...intake, fritext: "" });
  });

  it("håller sig inom Stripes gränser", () => {
    const m = intakeTillMetadata(intake);
    expect(Object.keys(m).length).toBeLessThanOrEqual(46); // 50 minus våra fyra egna
    for (const [k, v] of Object.entries(m)) {
      expect(k.length, `nyckeln ${k} är för lång`).toBeLessThanOrEqual(40);
      expect(v.length, `värdet för ${k} är för långt`).toBeLessThanOrEqual(500);
    }
  });
});
