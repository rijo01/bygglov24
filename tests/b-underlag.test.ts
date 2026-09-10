import { describe, it, expect } from "vitest";
import { triage } from "../src/lib/bygglovskoll/triage";
import { byggOrientering } from "../src/lib/bygglovskoll/templates";
import * as copy from "../src/lib/bygglovskoll/copy";
import type { Intake } from "../src/lib/bygglovskoll/types";

/**
 * v1.1: utfall B levereras som underlag i stället för att avvisas. Testet
 * bevakar det som skiljer B-varianten från A:
 *
 *   1. varje utlöst flagga blir en egen punkt i avsnitt 5, med vad kunden
 *      angav, varför det spelar roll, vad hon ska kontrollera och frågan till
 *      nämnden,
 *   2. avsnitt 7 erbjuder utredningen och motiverar den ur samma flaggor,
 *   3. ingen mening antyder att projektet är lovfritt,
 *   4. inga förbjudna fraser.
 */

function bas(over: Partial<Intake> = {}): Intake {
  return {
    atgard: "fristaende", placering: "fristaende", yta: 12, hojd: 2.5, langd: null,
    avstandTomtgrans: 6, fastighetstyp: "villa", kommun: "Uppsala", fastighetsbeteckning: "",
    detaljplan: "ja", naraVatten: "nej", kulturSamfallighet: "nej", befintligaKomplement: "nej",
    befintligKomplementYta: null, installation: "nej", fritext: "", fraga: "", epost: "a@b.se",
    ...over,
  };
}

const NU = new Date("2026-09-09T10:00:00Z");

/** Ett B-fall per flagga, så att varje gren i flaggtexterna körs. */
const B_FALL: Array<[string, Intake]> = [
  ["B1 flerbostad", bas({ fastighetstyp: "flerbostad" })],
  ["B2 vatten ja", bas({ naraVatten: "ja" })],
  ["B2 vatten vet ej", bas({ naraVatten: "vetej" })],
  ["B3 kultur ja", bas({ kulturSamfallighet: "ja" })],
  ["B3 kultur vet ej", bas({ kulturSamfallighet: "vetej" })],
  ["B4 nära gräns", bas({ avstandTomtgrans: 2 })],
  ["B4 vet ej gräns", bas({ avstandTomtgrans: null })],
  ["B5 installation ja", bas({ installation: "ja" })],
  ["B5 installation vet ej", bas({ installation: "vetej" })],
  ["B6 oklar placering", bas({ atgard: "tillbyggnad", placering: "oklart" })],
  ["B7 pool", bas({ atgard: "pool", placering: null, yta: 32, hojd: null })],
  ["B8 annat", bas({ atgard: "annat", placering: null, fritext: "en carport-liknande sak" })],
  ["B9 tillbyggnad nära potten", bas({ atgard: "tillbyggnad", placering: "fast", yta: 26, hojd: 3.2 })],
  ["B10 komplement nära taket", bas({ yta: 28, hojd: 4.2 })],
  ["B11 komplement utanför dp", bas({ detaljplan: "nej", yta: 48, hojd: 4.4 })],
  ["B12 altan fristående", bas({ atgard: "altan", placering: "fristaende", yta: 20 })],
  ["B13 plank 1,9 m", bas({ atgard: "plank", placering: null, yta: null, hojd: 1.9, langd: 8 })],
  ["plankspannet", bas({ atgard: "plank", placering: null, yta: null, hojd: 1.4, langd: 8 })],
  ["B14 pott", bas({ befintligaKomplement: "ja", befintligKomplementYta: 40, yta: 20 })],
  ["B14 pott okänd", bas({ befintligaKomplement: "ja", befintligKomplementYta: null })],
  ["B15 fritext", bas({ fritext: "uppfört i efterhand, rädd för sanktionsavgift" })],
  ["B16 tvetydig", bas({ atgard: "altan", placering: "fast", yta: 14, fritext: "skjutbart glastak, väggar på två sidor" })],
  ["flera flaggor", bas({ naraVatten: "vetej", kulturSamfallighet: "ja", installation: "ja", avstandTomtgrans: 1.5 })],
];

const FORBJUDNA = [
  "svaret", "rätt svar", "få besked", "vi avgör", "du behöver inte bygglov",
  "du kan bygga", "garanterat", "juridiskt bindande", "hundratals", "nöjda kunder",
];

/** Meningar som skulle läsa som ett besked om att projektet är lovfritt. */
const LOVFRITT = [
  /(?:projektet|åtgärden|byggnaden|tillbyggnaden|planket)\s+(?:är|blir)\s+(?:alltså\s+|därmed\s+|därför\s+)?lovfri/i,
  /kräver\s+(?:alltså\s+|därmed\s+)?inte\s+(?:bygg)?lov/i,
  /krävs\s+(?:alltså\s+|därmed\s+)?inget\s+(?:bygg)?lov/i,
  /behöver\s+(?:du\s+)?inte\s+söka\s+(?:bygg)?lov/i,
  /ingen\s+lovplikt\s+(?:gäller|träffar)/i,
  /du\s+kan\s+bygga/i,
];

/**
 * En mening som uttryckligen förnekar påstår ingenting — «Det betyder inte att
 * åtgärden är lovfri eller lovpliktig» är själva hedgingen och ska stå kvar.
 */
const NEKANDE = /\b(betyder inte|innebär inte|säger inte)\b/i;

function meningar(text: string): string[] {
  return text.split(/(?<=[.!?])\s+/).filter(Boolean);
}

describe("B-underlaget", () => {
  it.each(B_FALL)("%s: varje utlöst flagga blir en egen punkt i avsnitt 5", (namn, intake) => {
    const t = triage(intake);
    expect(t.outcome, `${namn} skulle vara B men blev ${t.outcome}`).toBe("B");
    const o = byggOrientering(intake, t, NU);

    expect(o.utfall).toBe("B");
    expect(o.regelspar).toBeNull();
    expect(o.avsnitt.map((a) => a.nummer)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);

    const a5 = o.avsnitt[4];
    expect(a5.rubrik).toContain("Det som avgör ditt fall");
    // En punkt per orsak — inte färre, inte hopslagna.
    expect(a5.punkter).toHaveLength(t.reasons.length);

    a5.punkter!.forEach((punkt, idx) => {
      const orsak = t.reasons[idx];
      // (ii) varför det spelar roll: triagens egen orsakstext, ordagrant.
      expect(punkt, `${namn}/${orsak.kod} saknar orsakstexten`).toContain(orsak.text);
      // (iii) vad hon ska kontrollera och vilken fråga hon ska ställa.
      expect(punkt, `${namn}/${orsak.kod} saknar kontrollsteget`).toContain("Kontrollera:");
      expect(punkt, `${namn}/${orsak.kod} saknar frågan till nämnden`).toMatch(
        /Fråga till Uppsalas byggnadsnämnd: «.+\?»/,
      );
    });
  });

  it("B2, B3 och B5 återger kundens eget svar, ja skilt från vet ej", () => {
    const par: Array<["naraVatten" | "kulturSamfallighet" | "installation", string]> = [
      ["naraVatten", "B2"],
      ["kulturSamfallighet", "B3"],
      ["installation", "B5"],
    ];
    for (const [falt, kod] of par) {
      const punkt = (svar: "ja" | "vetej") => {
        const intake = bas({ [falt]: svar } as Partial<Intake>);
        const t = triage(intake);
        const idx = t.reasons.findIndex((r) => r.kod === kod);
        return byggOrientering(intake, t, NU).avsnitt[4].punkter![idx];
      };
      expect(punkt("vetej")).toContain("du inte vet");
      expect(punkt("ja")).not.toContain("du inte vet");
      expect(punkt("ja")).not.toBe(punkt("vetej"));
    }
  });

  it("(i) vad kunden angav finns i punkten även för flaggor utan ja/vet ej", () => {
    const intake = bas({ avstandTomtgrans: 2 });
    const t = triage(intake);
    const a5 = byggOrientering(intake, t, NU).avsnitt[4].punkter!.join(" ");
    expect(a5).toContain("Du angav 2,0 m till närmaste tomtgräns");

    const okand = bas({ avstandTomtgrans: null });
    const a5b = byggOrientering(okand, triage(okand), NU).avsnitt[4].punkter!.join(" ");
    expect(a5b).toContain("Du angav att du inte vet avståndet");
  });

  it.each(B_FALL)("%s: avsnitt 7 erbjuder utredningen ur samma flaggor", (namn, intake) => {
    const t = triage(intake);
    const a7 = byggOrientering(intake, t, NU).avsnitt[6];
    const text = [...a7.stycken, ...(a7.punkter ?? [])].join(" ");
    expect(a7.nummer).toBe(7);
    expect(text, `${namn}: utredningen nämns inte`).toContain("Bygglovsutredning (2 950 kr)");
    // En motiveringsrad per unik flagga.
    const unika = new Set(t.reasons.map((r) => r.kod));
    const motiveringar = a7.punkter!.filter((p) => p.includes("utredningen tar fram"));
    expect(motiveringar, `${namn}: fel antal motiveringar`).toHaveLength(unika.size);
  });

  it.each(B_FALL)("%s: avsnitt 4 håller kvar måtten mot trösklarna", (namn, intake) => {
    const a4 = byggOrientering(intake, triage(intake), NU).avsnitt[3];
    expect(a4.nummer).toBe(4);
    expect(a4.rubrik).toBe("Så här ligger ditt projekt mot trösklarna");
    expect(a4.stycken.join(" ")).toContain("Det betyder inte att åtgärden är lovfri eller lovpliktig");
  });

  it.each(B_FALL)("%s: ingen mening antyder att projektet är lovfritt", (namn, intake) => {
    const o = byggOrientering(intake, triage(intake), NU);
    const text = o.avsnitt.flatMap((a) => [...a.stycken, ...(a.punkter ?? [])]).join(" ");
    for (const mening of meningar(text)) {
      if (NEKANDE.test(mening)) continue;
      for (const monster of LOVFRITT) {
        expect(monster.test(mening), `${namn}: «${mening}»`).toBe(false);
      }
    }
    // Förbehållet står kvar sist, ordagrant.
    const sista = o.avsnitt[o.avsnitt.length - 1];
    expect(sista.nummer).toBe(8);
    expect(sista.stycken[0]).toBe(copy.forbehall("2026-09-09"));
  });

  it.each(B_FALL)("%s: inga förbjudna fraser", (namn, intake) => {
    const text = JSON.stringify(byggOrientering(intake, triage(intake), NU)).toLowerCase();
    for (const fras of FORBJUDNA) {
      expect(text.includes(fras), `"${fras}" förekommer i ${namn}`).toBe(false);
    }
  });

  it.each(B_FALL)("%s: enda kronbeloppet är utredningspriset", (namn, intake) => {
    const text = JSON.stringify(byggOrientering(intake, triage(intake), NU));
    const belopp = [...text.matchAll(/([\d][\d\s ]*)\s?kr\b/g)].map((m) => m[1].replace(/[\s ]/g, ""));
    expect(belopp, `oväntat kronbelopp i ${namn}`).toEqual(belopp.filter((b) => b === "2950"));
  });

  it("tillägget lägger sitt förbehåll i avsnitt 8, annars inte", () => {
    const intake = bas({ naraVatten: "ja" });
    const t = triage(intake);
    const utan = byggOrientering(intake, t, NU);
    const med = byggOrientering(intake, t, NU, { personligtSvar: true });
    expect(utan.personligtSvar).toBe(false);
    expect(utan.avsnitt[7].stycken).toHaveLength(1);
    expect(med.personligtSvar).toBe(true);
    expect(med.avsnitt[7].stycken).toEqual([copy.forbehall("2026-09-09"), copy.FRAGA_FORBEHALL]);
  });

  it("A-underlaget är oförändrat: avsnitt 5 har sina fem fasta punkter", () => {
    const intake = bas();
    const t = triage(intake);
    expect(t.outcome).toBe("A");
    const o = byggOrientering(intake, t, NU);
    expect(o.utfall).toBe("A");
    expect(o.regelspar).toBe("mall-komplementbyggnad-1.0");
    expect(o.avsnitt[4].punkter).toHaveLength(5);
    expect(o.avsnitt[6].stycken.join(" ")).toContain("Bygglovsutredning (2 950 kr)");
  });

  it("C levereras aldrig som underlag", () => {
    const intake = bas({ atgard: "annat", placering: null, yta: null, hojd: null, fritext: "kan jag avstycka tomten" });
    const t = triage(intake);
    expect(t.outcome).toBe("C");
    expect(() => byggOrientering(intake, t, NU)).toThrowError(/A eller B/);
  });
});
