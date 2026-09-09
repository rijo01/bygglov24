import { describe, it, expect } from "vitest";
import { triage } from "../src/lib/bygglovskoll/triage";
import type { Intake, Klassning, Utfall } from "../src/lib/bygglovskoll/types";

/** Neutral bas: allt som kan vara "nej" är nej, avstånd väl över 4,5 m. */
function bas(over: Partial<Intake> = {}): Intake {
  return {
    atgard: "fristaende",
    placering: "fristaende",
    yta: 12,
    hojd: 2.5,
    langd: null,
    avstandTomtgrans: 6,
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
  };
}

interface Fall {
  nr: number;
  namn: string;
  intake: Intake;
  utfall: Utfall;
  klassning: Klassning;
  /** Minst en av dessa koder ska finnas bland orsakerna. */
  koder?: string[];
}

const FALL: Fall[] = [
  { nr: 1, namn: "Växthus 12 m² vid tomtgräns", intake: bas({ avstandTomtgrans: 2 }), utfall: "B", klassning: "komplementbyggnad", koder: ["B4"] },
  { nr: 2, namn: "Växthus 12 m² mitt på tomten", intake: bas(), utfall: "A", klassning: "komplementbyggnad" },
  { nr: 3, namn: "Uterum 26 m² fäst i huset", intake: bas({ atgard: "tillbyggnad", placering: "fast", yta: 26, hojd: 3.2, avstandTomtgrans: 5 }), utfall: "B", klassning: "tillbyggnad", koder: ["B9"] },
  { nr: 4, namn: "Uterum 18 m² fäst", intake: bas({ atgard: "tillbyggnad", placering: "fast", yta: 18, hojd: 3.2, avstandTomtgrans: 5 }), utfall: "A", klassning: "tillbyggnad" },
  { nr: 5, namn: "Fristående lamelltak 20 m² kustnära", intake: bas({ atgard: "altan", placering: "fristaende", yta: 20, naraVatten: "ja" }), utfall: "B", klassning: "tvetydig", koder: ["B2", "B12", "B16"] },
  { nr: 6, namn: "Balkong vinklad till rak i radhus", intake: bas({ atgard: "fasadandring", placering: null, yta: null, hojd: null, kulturSamfallighet: "vetej", avstandTomtgrans: 5 }), utfall: "B", klassning: "fasadandring", koder: ["B3"] },
  { nr: 7, namn: "Balkong rak i villa, kultur nej", intake: bas({ atgard: "fasadandring", placering: null, yta: null, hojd: null, avstandTomtgrans: 8 }), utfall: "A", klassning: "fasadandring" },
  { nr: 8, namn: "Plank 1,9 m", intake: bas({ atgard: "plank", placering: null, yta: null, hojd: 1.9, langd: 8, avstandTomtgrans: 5 }), utfall: "B", klassning: "plank_mur", koder: ["B13"] },
  // Spec avsnitt 3 hade A här. Utfallet är ändrat till B: 1,4 m ligger mellan
  // de två trösklarna i PBL 9 kap. 19 § och intaket frågar inte efter avståndet
  // till närmaste byggnad, så vilken tröskel som gäller går inte att avgöra.
  { nr: 9, namn: "Plank 1,4 m vid uteplats", intake: bas({ atgard: "plank", placering: null, yta: null, hojd: 1.4, langd: 8, avstandTomtgrans: 5 }), utfall: "B", klassning: "plank_mur", koder: ["PLANK_HOJD_KRAVER_BYGGNADSAVSTAND"] },
  { nr: 10, namn: "Komplement 28 m² nock 4,2 m", intake: bas({ yta: 28, hojd: 4.2 }), utfall: "B", klassning: "komplementbyggnad", koder: ["B10"] },
  { nr: 11, namn: "Komplement 20 m² + befintliga 30 m²", intake: bas({ yta: 20, befintligaKomplement: "ja", befintligKomplementYta: 30 }), utfall: "B", klassning: "komplementbyggnad", koder: ["B14"] },
  { nr: 12, namn: "Förråd 15 m² utanför detaljplan", intake: bas({ yta: 15, hojd: 3.8, detaljplan: "nej", avstandTomtgrans: 8 }), utfall: "A", klassning: "komplementbyggnad" },
  { nr: 13, namn: "Flerbostad uterum 10 m²", intake: bas({ atgard: "tillbyggnad", placering: "fast", yta: 10, fastighetstyp: "flerbostad" }), utfall: "B", klassning: "tillbyggnad", koder: ["B1"] },
  { nr: 14, namn: "Eldstad i friggebod 12 m²", intake: bas({ yta: 12, hojd: 2.8, installation: "ja" }), utfall: "B", klassning: "komplementbyggnad", koder: ["B5"] },
  { nr: 15, namn: "Byggt i efterhand 10 m²", intake: bas({ yta: 10, fritext: "uppfört i efterhand, rädd för sanktionsavgift" }), utfall: "B", klassning: "komplementbyggnad", koder: ["B15"] },
  { nr: 16, namn: "Grannes attefall", intake: bas({ atgard: "annat", placering: null, yta: null, hojd: null, fritext: "behöver grannen lov för sitt attefall?" }), utfall: "C", klassning: "ingen", koder: ["C1"] },
  { nr: 17, namn: "Avstyckning", intake: bas({ atgard: "annat", placering: null, yta: null, hojd: null, fritext: "kan jag avstycka tomten" }), utfall: "C", klassning: "ingen", koder: ["C1"] },
  { nr: 18, namn: "Skjutbart tak 14 m²", intake: bas({ atgard: "altan", placering: "fast", yta: 14, hojd: 2.8, fritext: "skjutbart glastak, väggar på två sidor" }), utfall: "B", klassning: "tvetydig", koder: ["B16"] },
  { nr: 19, namn: "Fasad kulör + kultur ja", intake: bas({ atgard: "fasadandring", placering: null, yta: null, hojd: null, kulturSamfallighet: "ja" }), utfall: "B", klassning: "fasadandring", koder: ["B3"] },
  { nr: 20, namn: "Pool 4x8 villa inland", intake: bas({ atgard: "pool", placering: null, yta: 32, hojd: null }), utfall: "B", klassning: "anlaggning", koder: ["B7"] },

  // Extra kontrollfall enligt spec.
  { nr: 21, namn: "Vet ej strand, annars perfekt A", intake: bas({ naraVatten: "vetej" }), utfall: "B", klassning: "komplementbyggnad", koder: ["B2"] },
  { nr: 22, namn: "Vet ej avstånd, annars perfekt A", intake: bas({ avstandTomtgrans: null }), utfall: "B", klassning: "komplementbyggnad", koder: ["B4"] },
  { nr: 23, namn: "Tillbyggnad 30,0 m² exakt", intake: bas({ atgard: "tillbyggnad", placering: "fast", yta: 30.0, hojd: 3.2 }), utfall: "B", klassning: "tillbyggnad", koder: ["B9"] },
  { nr: 24, namn: "Fasad + inglasning av balkong", intake: bas({ atgard: "fasadandring", placering: null, yta: null, hojd: null, fritext: "inglasning av balkong" }), utfall: "B", klassning: "tvetydig", koder: ["B16"] },
  { nr: 25, namn: "Har jag redan bygglov sedan 2019", intake: bas({ atgard: "annat", placering: null, yta: null, hojd: null, fritext: "har jag redan bygglov sedan 2019?" }), utfall: "C", klassning: "ingen", koder: ["C1"] },

  // Randfall från uppdraget.
  { nr: 26, namn: "Randfall: exakt 30,0 m² tillbyggnad", intake: bas({ atgard: "tillbyggnad", placering: "fast", yta: 30.0, hojd: 3.0, avstandTomtgrans: 7 }), utfall: "B", klassning: "tillbyggnad", koder: ["B9"] },
  { nr: 27, namn: "Randfall: 15 m² tak fäst i huset, tom pott", intake: bas({ atgard: "altan", placering: "fast", yta: 15.0, hojd: 2.8, befintligaKomplement: "nej" }), utfall: "A", klassning: "tillbyggnad" },
  { nr: 28, namn: "Randfall: komplement 29 m² + befintlig 20 m²", intake: bas({ yta: 29, hojd: 3.0, befintligaKomplement: "ja", befintligKomplementYta: 20 }), utfall: "B", klassning: "komplementbyggnad", koder: ["B14"] },
  { nr: 29, namn: "Randfall: plank 1,3 m, byggnadsavstånd okänt", intake: bas({ atgard: "plank", placering: null, yta: null, hojd: 1.3, langd: 6, avstandTomtgrans: 6 }), utfall: "B", klassning: "plank_mur", koder: ["PLANK_HOJD_KRAVER_BYGGNADSAVSTAND"] },
  { nr: 30, namn: "Randfall: balkonginglasning i flerbostadshus", intake: bas({ atgard: "fasadandring", placering: null, yta: null, hojd: null, fastighetstyp: "flerbostad", fritext: "inglasning av balkong" }), utfall: "B", klassning: "tvetydig", koder: ["B1", "B16"] },

  // Plankgränserna i PBL 9 kap. 19 §, båda sidor om den lägre tröskeln.
  { nr: 31, namn: "Plank 1,1 m, 4,5 m från gräns", intake: bas({ atgard: "plank", placering: null, yta: null, hojd: 1.1, langd: 6, avstandTomtgrans: 4.5 }), utfall: "A", klassning: "plank_mur" },
  { nr: 32, namn: "Plank 1,5 m", intake: bas({ atgard: "plank", placering: null, yta: null, hojd: 1.5, langd: 6, avstandTomtgrans: 6 }), utfall: "B", klassning: "plank_mur", koder: ["PLANK_HOJD_KRAVER_BYGGNADSAVSTAND"] },
];

describe("triage — spec avsnitt 3 samt randfall", () => {
  it.each(FALL)("fall $nr: $namn -> $utfall", ({ intake, utfall, klassning, koder }) => {
    const r = triage(intake);
    expect(r.outcome).toBe(utfall);
    expect(r.classification).toBe(klassning);
    if (koder) {
      const funna = r.reasons.map((x) => x.kod);
      for (const k of koder) expect(funna, `saknar orsak ${k}, fick ${funna.join(",")}`).toContain(k);
    }
  });

  it("A ger alltid ett låst regelspår, B och C aldrig", () => {
    for (const f of FALL) {
      const r = triage(f.intake);
      if (r.outcome === "A") expect(r.regelspar).toMatch(/^mall-/);
      else expect(r.regelspar).toBeNull();
    }
  });

  it("A ger aldrig några orsaker, B ger alltid minst en", () => {
    for (const f of FALL) {
      const r = triage(f.intake);
      if (r.outcome === "A") expect(r.reasons).toHaveLength(0);
      if (r.outcome === "B") expect(r.reasons.length).toBeGreaterThan(0);
    }
  });

  it("är deterministisk", () => {
    for (const f of FALL) {
      expect(triage(f.intake)).toEqual(triage(f.intake));
    }
  });
});
