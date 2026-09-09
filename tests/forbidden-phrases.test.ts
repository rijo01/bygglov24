import { describe, it, expect } from "vitest";
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

/** Undantagna blocken: negationer där frasen är avsedd. */
const UNDANTAG: string[] = [
  ...copy.VAD_DET_INTE_AR,
  copy.C_BROD,
];

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
    befintligKomplementYta: null, installation: "nej", fritext: "", epost: "a@b.se", ...over,
  };
}

/** Ett A-fall per regelspår, så att alla mallgrenar granskas. */
const A_FALL: Array<[string, Intake]> = [
  ["komplementbyggnad", bas()],
  ["tillbyggnad", bas({ atgard: "tillbyggnad", placering: "fast", yta: 18, hojd: 3.2 })],
  ["plank_mur", bas({ atgard: "plank", placering: null, yta: null, hojd: 1.4, langd: 8 })],
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

  it("sidfoten bär verifieringsstämpeln", () => {
    const o = byggOrientering(bas(), triage(bas()), new Date("2026-09-09T10:00:00Z"));
    const rules = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../rules/RB-2026-09-08.json"), "utf8"));
    expect(o.sidfot).toContain(rules.metadata.stampel);
    expect(o.sidfot).toContain("2026-09-09");
  });
});
