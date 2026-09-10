import { describe, it, expect, vi } from "vitest";
import { triage } from "../src/lib/bygglovskoll/triage";
import { byggOrientering } from "../src/lib/bygglovskoll/templates";
import * as copy from "../src/lib/bygglovskoll/copy";
import type { Intake } from "../src/lib/bygglovskoll/types";
import fs from "node:fs";
import path from "node:path";

/**
 * Spec avsnitt 0 och 3: förbjudna formuleringar får inte förekomma i UI-copy,
 * mallar, PDF-text eller e-postcopy. Negationerna i "Vad det inte är" är
 * uttryckligen undantagna — där är fraserna själva poängen.
 */

const FORBJUDNA = [
  "svaret",
  "rätt svar",
  "få besked",
  "vi avgör",
  "du behöver inte bygglov",
  "du kan bygga",
  "garanterat",
  "juridiskt bindande",
  "hundratals",
  "nöjda kunder",
];

/**
 * Undantagna blocken: negationer där frasen är avsedd, plus förbehållet för
 * tillägget «Fråga oss». Det sista innehåller ordet «svaret» i betydelsen «det
 * skriftliga svar vi skickar» — inte «rätt svar på lovfrågan», som är den
 * betydelse listan är skriven mot. Listan FORBJUDNA är oförändrad.
 */
// Längsta först: ett kortare undantag ("juridisk rådgivning") är en del av ett
// längre, och stryks det först matchar det längre aldrig.
const UNDANTAG: string[] = [...copy.VAD_DET_INTE_AR, copy.C_BROD, copy.FRAGA_FORBEHALL].sort(
  (a, b) => b.length - a.length,
);

function stryckUndantag(text: string): string {
  let ut = text;
  for (const u of UNDANTAG) ut = ut.split(u).join(" ");
  return ut;
}

function granska(namn: string, text: string) {
  const t = stryckUndantag(text).toLowerCase();
  for (const fras of FORBJUDNA) {
    expect(t.includes(fras), `"${fras}" förekommer i ${namn}`).toBe(false);
  }
}

function bas(over: Partial<Intake> = {}): Intake {
  return {
    atgard: "fristaende", placering: "fristaende", yta: 12, hojd: 2.5, langd: null,
    avstandTomtgrans: 6, fastighetstyp: "villa", kommun: "Uppsala", fastighetsbeteckning: "",
    detaljplan: "ja", naraVatten: "nej", kulturSamfallighet: "nej", befintligaKomplement: "nej",
    befintligKomplementYta: null, installation: "nej", fritext: "", fraga: "", epost: "a@b.se", ...over,
  };
}

/** Ett A-fall per regelspår, så att alla mallgrenar granskas. */
const A_FALL: Array<[string, Intake]> = [
  ["komplementbyggnad", bas()],
  ["tillbyggnad", bas({ atgard: "tillbyggnad", placering: "fast", yta: 18, hojd: 3.2 })],
  // 1,1 m ligger under den lägre tröskeln i 19 § och är därför A utan att
  // avståndet till närmaste byggnad behöver vara känt.
  ["plank_mur", bas({ atgard: "plank", placering: null, yta: null, hojd: 1.1, langd: 8 })],
  ["fasadandring", bas({ atgard: "fasadandring", placering: null, yta: null, hojd: null })],
  ["komplementbyggnad utanför dp", bas({ detaljplan: "nej", yta: 15, hojd: 3.8 })],
  ["komplementbyggnad vet ej dp", bas({ detaljplan: "vetej" })],
];

describe("förbjudna fraser", () => {
  it("all statisk produktcopy är ren", () => {
    for (const [namn, varde] of Object.entries(copy)) {
      if (typeof varde === "string") granska(`copy.${namn}`, varde);
      else if (Array.isArray(varde)) granska(`copy.${namn}`, JSON.stringify(varde));
      else if (typeof varde === "function") continue;
    }
    granska("copy.forbehall", copy.forbehall("2026-09-09"));
    granska("copy.bGratischunk", copy.bGratischunk("Uppsala"));
    granska("copy.cHanvisning", copy.cHanvisning("Uppsala"));
  });

  it.each(A_FALL)("genererad orientering är ren: %s", (namn, intake) => {
    const t = triage(intake);
    expect(t.outcome, `${namn} skulle vara A men blev ${t.outcome}`).toBe("A");
    const o = byggOrientering(intake, t, new Date("2026-09-09T10:00:00Z"));
    granska(`orientering ${namn}`, JSON.stringify(o));
  });

  it("alla B- och C-orsakstexter är rena", () => {
    const bFall: Intake[] = [
      bas({ avstandTomtgrans: 2 }), bas({ naraVatten: "ja" }), bas({ kulturSamfallighet: "vetej" }),
      bas({ installation: "ja" }), bas({ placering: "oklart" }), bas({ atgard: "pool" }),
      bas({ atgard: "annat" }), bas({ yta: 28, hojd: 4.2 }), bas({ fastighetstyp: "flerbostad" }),
      bas({ befintligaKomplement: "ja", befintligKomplementYta: 40 }),
      bas({ fritext: "strandskydd och dispens" }),
      bas({ atgard: "annat", yta: null, hojd: null, fritext: "kan jag avstycka tomten" }),
    ];
    for (const i of bFall) {
      const r = triage(i);
      granska(`orsaker (${r.outcome})`, r.reasons.map((x) => x.text).join(" "));
    }
  });

  it("verbatim-förbehållet finns i orienteringens sista avsnitt", () => {
    const t = triage(bas());
    const o = byggOrientering(bas(), t, new Date("2026-09-09T10:00:00Z"));
    const sista = o.avsnitt[o.avsnitt.length - 1];
    expect(sista.nummer).toBe(8);
    expect(sista.stycken[0]).toBe(copy.forbehall("2026-09-09"));
    expect(sista.stycken[0]).toContain("det bindande beskedet ges av din kommuns byggnadsnämnd");
  });

  it("inga kronbelopp för taxa eller sanktionsavgift skrivs ut", () => {
    for (const [namn, intake] of A_FALL) {
      const t = triage(intake);
      const text = JSON.stringify(byggOrientering(intake, t, new Date("2026-09-09T10:00:00Z")));
      // Enda tillåtna kronbeloppet är vårt eget utredningspris i avsnitt 7.
      // Kommunal taxa, byggsanktionsavgift och prisbasbelopp får aldrig bli siffror.
      const belopp = [...text.matchAll(/([\d][\d\s ]*)\s?kr\b/g)].map((m) => m[1].replace(/[\s ]/g, ""));
      expect(belopp, `oväntat kronbelopp i ${namn}`).toEqual(belopp.filter((b) => b === "2950"));
      expect(text, `prisbasbelopp i ${namn}`).not.toMatch(/prisbasbelopp|59\s?200/i);
      expect(text, `sanktionsbelopp i ${namn}`).not.toMatch(/sanktionsavgift(en)?\s+(är|blir|uppgår)/i);
      // Taxan får bara omnämnas som hänvisning, aldrig med ett belopp.
      for (const mening of text.split(/(?<=[.!?])\s/)) {
        if (/taxa|avgift/i.test(mening)) {
          expect(mening, `belopp i avgiftsmening (${namn}): ${mening}`).not.toMatch(/\d[\d\s ]*\s?kr\b/);
        }
      }
    }
  });

  it("avsnitt 5 är identiskt oavsett regelspår, bortsett från ifyllda värden", () => {
    const rubriker = A_FALL.map(([, i]) => {
      const o = byggOrientering(i, triage(i), new Date("2026-09-09T10:00:00Z"));
      return o.avsnitt[4].punkter!.length;
    });
    expect(new Set(rubriker).size).toBe(1);
    expect(rubriker[0]).toBe(5);
  });

  it("PBF 6 kap. 3 §-meningen finns i avsnitt 5", () => {
    const o = byggOrientering(bas(), triage(bas()), new Date("2026-09-09T10:00:00Z"));
    const a5 = o.avsnitt[4].punkter!.join(" ");
    expect(a5).toContain("PBF 6 kap. 3 §");
    expect(a5).toContain("t.o.m. november 2027");
  });

  it("areatypen skrivs alltid ut i avsnitt 4", () => {
    for (const nyckel of ["komplementbyggnad", "tillbyggnad"] as const) {
      const intake = A_FALL.find(([n]) => n === nyckel)![1];
      const o = byggOrientering(intake, triage(intake), new Date("2026-09-09T10:00:00Z"));
      const a4 = o.avsnitt[3].stycken.join(" ");
      expect(a4).toMatch(/BYA|BTA|OPA/);
    }
  });

  it("produktsidornas egna strängar är rena", () => {
    // Spec avsnitt 3 kräver lint mot copy OCH renderer. copy.ts och mallarna
    // täcks ovan; här skannas sidornas och komponenternas literaler.
    const filer = [
      "src/app/bygglovskoll/page.tsx",
      "src/app/bygglovskoll/BygglovskollForm.tsx",
      "src/app/bygglovskoll/klar/page.tsx",
      "src/app/bygglovskoll/klar/KlarKlient.tsx",
      "src/lib/bygglovskoll/templates.ts",
      "src/lib/bygglovskoll/triage.ts",
    ];
    for (const rel of filer) {
      const kalla = fs.readFileSync(path.resolve(__dirname, "..", rel), "utf8");
      // Kommentarer bort — lintet gäller det som når användaren.
      const utanKommentarer = kalla
        .replace(/\/\*[\s\S]*?\*\//g, " ")
        .replace(/^\s*\/\/.*$/gm, " ");
      granska(rel, utanKommentarer);
    }
  });

  it("säljytorna lovar inget kostnadsfritt när flaggan är på", () => {
    // Punkt 7: dessa fyra är tillåtna bara i flagg-av-läget. Filerna nedan
    // renderas bara när Bygglovskoll är påslagen, eller innehåller enbart
    // flagg-på-grenen, så de får aldrig bära löftena.
    const SALJFRASER = ["kostnadsfri", "gratis bedömning", "svar inom 24h", "svar inom 24 timmar", "konsultmatchning"];
    // Endast filer utan flagg-av-gren. Komponenter med båda grenarna (LeadForm,
    // UtredningCta, startsidan, om-oss, Header) måste tvärtom behålla den gamla
    // copyn — det kontrolleras i nästa test.
    const filer = [
      "src/components/HeroVal.tsx",
      "src/lib/cta.ts",
      "src/app/bygglovskoll/page.tsx",
      "src/app/bygglovskoll/BygglovskollForm.tsx",
    ];
    for (const rel of filer) {
      const kalla = fs
        .readFileSync(path.resolve(__dirname, "..", rel), "utf8")
        .replace(/\/\*[\s\S]*?\*\//g, " ")
        .replace(/^\s*\/\/.*$/gm, " ")
        .toLowerCase();
      for (const fras of SALJFRASER) {
        expect(kalla.includes(fras), `"${fras}" förekommer i ${rel}`).toBe(false);
      }
    }
  });

  /**
   * De fyra sista gratis-CTA:erna låg utanför flagg-grenen och nådde
   * produktion vid lanseringen: startsidan, guideindex och kontaktsidan
   * erbjöd fortfarande «Få kostnadsfri konsultation» och länkade till
   * /konsult, som numera 301:as till en sida med prissatta tjänster.
   *
   * Källkoden går inte att skanna här — filerna bär med avsikt BÅDA grenarna,
   * och flagg-av-grenen ska innehålla just de orden. Testet renderar därför
   * sidorna med flaggan på och granskar det som faktiskt når besökaren.
   */
  it.each([
    ["startsidan", "../src/app/page", true],
    ["guideindex", "../src/app/guide/page", true],
    ["kontaktsidan", "../src/app/kontakt/page", true],
    ["kalkylatorn", "../src/app/kalkylator/page", false],
    // Bygglovskollsidan ÄR ingången; den länkar inte till sig själv.
    ["bygglovskollsidan", "../src/app/bygglovskoll/page", false],
  ])("%s lovar inget kostnadsfritt när flaggan är på", async (namn, modul, kravBkLank) => {
    const ursprung = process.env.BYGGLOVSKOLL_ENABLED;
    process.env.BYGGLOVSKOLL_ENABLED = "true";
    vi.resetModules();
    try {
      const { renderToStaticMarkup } = await import("react-dom/server");
      const { default: Page } = await import(modul);
      const html = renderToStaticMarkup(Page() as never);
      // «konsultmatchning» lovar ett nätverk som inte finns, och /konsult är
      // borta: en länk dit fungerar bara via 301 och ska inte finnas i koden.
      for (const fras of ["kostnadsfri", "gratis", "24 timmar", "24h", "konsultmatchning", "/konsult"]) {
        expect(html.toLowerCase().includes(fras), `"${fras}" renderas på ${namn}`).toBe(false);
      }
      // Sanity: sidan renderade faktiskt något, och där en Bygglovskoll-ingång
      // hör hemma finns den.
      expect(html.length, `${namn} renderade nästan ingenting`).toBeGreaterThan(500);
      if (kravBkLank) expect(html, `${namn} saknar Bygglovskoll-ingången`).toContain("/bygglovskoll");
    } finally {
      if (ursprung === undefined) delete process.env.BYGGLOVSKOLL_ENABLED;
      else process.env.BYGGLOVSKOLL_ENABLED = ursprung;
      vi.resetModules();
    }
  });

  it("flagg-av-grenen får behålla den gamla copyn", () => {
    // Sidor med båda grenarna: den gamla texten ska finnas kvar, annars har
    // flagg-av-läget ändrats — och då ser sajten inte längre ut som idag.
    // Varje fil med två grenar: det som måste finnas kvar i flagg-av-läget.
    const MARKOR: Array<[string, string]> = [
      ["src/app/page.tsx", "Konsultmatchning"],
      ["src/app/om-oss/page.tsx", "Tjänsten är kostnadsfri"],
      ["src/components/Header.tsx", "Få offert gratis"],
      ["src/components/LeadForm.tsx", "Helt kostnadsfritt"],
      ["src/components/UtredningCta.tsx", "Osäker på om ditt projekt kräver bygglov?"],
    ];
    for (const [rel, markor] of MARKOR) {
      const kalla = fs.readFileSync(path.resolve(__dirname, "..", rel), "utf8");
      expect(kalla, `${rel} saknar flagg-av-grenen: "${markor}"`).toContain(markor);
    }
  });

  it("LeadForm bär båda grenarna", () => {
    const kalla = fs.readFileSync(path.resolve(__dirname, "../src/components/LeadForm.tsx"), "utf8");
    // Flagg av: ursprunglig konsultcopy. Flagg på: offertcopy utan löften.
    expect(kalla).toContain("Få hjälp av en bygglovskonsult");
    expect(kalla).toContain("Begär offert på handlingar, ritningar eller ansökan");
    expect(kalla).toContain("bygglovskoll");
  });

  it("sidfoten bär verifieringsstämpeln", () => {
    const o = byggOrientering(bas(), triage(bas()), new Date("2026-09-09T10:00:00Z"));
    const rules = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../rules/RB-2026-09-08.json"), "utf8"));
    expect(o.sidfot).toContain(rules.metadata.stampel);
    expect(o.sidfot).toContain("2026-09-09");
  });
});
