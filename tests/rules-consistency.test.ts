import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

/**
 * Binder rules/RB-2026-09-08.json till regelbanken. Poängen är att en siffra
 * aldrig ska kunna leva i JSON:en utan att stå i regelbanken med status V.
 * Ändras en tröskel i regelbanken failar detta test tills JSON:en följer med,
 * och tvärtom.
 */

const ROOT = path.resolve(__dirname, "..");
const rules = JSON.parse(fs.readFileSync(path.join(ROOT, "rules/RB-2026-09-08.json"), "utf8"));
const markdown = fs.readFileSync(path.join(ROOT, "docs/regelbank/RB-2026-09-08.md"), "utf8");

/** Plockar ut en regelbanksrad (| N | ... |) som cellista. */
function radCeller(radnummer: number): string[] | null {
  for (const line of markdown.split("\n")) {
    const m = line.match(/^\|\s*(\d+)\s*\|(.*)\|\s*$/);
    if (!m || Number(m[1]) !== radnummer) continue;
    return line.split("|").slice(1, -1).map((c) => c.trim());
  }
  return null;
}

/**
 * Regelbanken skriver tal med svenskt decimalkomma och utelämnar ibland
 * decimalen (45 m², inte 45,0 m²). Godta båda formerna.
 */
function talFinns(rad: string, värde: number): boolean {
  const kandidater = new Set<string>();
  kandidater.add(värde.toFixed(1).replace(".", ","));
  if (Number.isInteger(värde)) kandidater.add(String(värde));
  return [...kandidater].some((k) => new RegExp(`(?<![\\d,])${k.replace(",", "[,.]")}(?![\\d])`).test(rad));
}

/** Alla numeriska trösklar i JSON:en, plattade till [sökväg, värde]. */
function trösklar(obj: unknown, prefix = ""): Array<[string, number]> {
  const ut: Array<[string, number]> = [];
  if (obj && typeof obj === "object" && !Array.isArray(obj)) {
    for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
      if (k === "radnummer") continue;
      if (typeof v === "number") ut.push([prefix + k, v]);
      else ut.push(...trösklar(v, `${prefix}${k}.`));
    }
  }
  return ut;
}

const regelposter = [
  ...Object.entries(rules.regler as Record<string, Record<string, unknown>>),
  ["handlaggningstidLov", rules.handlaggningstidLov as Record<string, unknown>] as const,
] as Array<[string, Record<string, unknown>]>;

describe("rules-JSON mot regelbanken", () => {
  it("regelbanken går att läsa och innehåller en tabell", () => {
    expect(markdown).toContain("## Regelbank");
    expect(radCeller(2)).not.toBeNull();
  });

  it("metadatastämpeln är ordagrann ur regelbankens huvud", () => {
    const { verifieradTom, kontrolleradDatum, nastaKontroll } = rules.metadata;
    expect(markdown).toContain(`Verifierad t.o.m. ${verifieradTom}, kontrollerad ${kontrolleradDatum}`);
    expect(markdown).toContain(nastaKontroll);
    // Stämpeln som skrivs i PDF-sidfoten måste gå att härleda ur samma rad.
    expect(rules.metadata.stampel).toContain(verifieradTom);
    expect(rules.metadata.stampel).toContain(kontrolleradDatum);
    expect(rules.metadata.stampel).toContain(nastaKontroll);
  });

  describe.each(regelposter)("regel %s", (nyckel, regel) => {
    const radnummer = regel.radnummer as number;
    const celler = radCeller(radnummer);

    it("har en motsvarande rad i regelbanken", () => {
      expect(celler, `regel ${nyckel} pekar på rad ${radnummer} som inte finns`).not.toBeNull();
    });

    it("raden har status V", () => {
      const status = celler![celler!.length - 1];
      expect(status, `rad ${radnummer} (${nyckel}) har status ${status}, inte V`).toBe("V");
      expect(regel.status).toBe("V");
    });

    it("lagrummet i JSON:en står i regelbanksraden", () => {
      const lagrum = regel.lagrum as string | null;
      if (!lagrum) return;
      const radtext = celler!.join(" | ");
      // Jämför på den inledande paragrafhänvisningen; regelbanken lägger till
      // lydelseparenteser som JSON:en också bär men inte tecken för tecken.
      const kärna = lagrum.split(" (")[0].trim();
      expect(radtext, `lagrum "${kärna}" saknas i rad ${radnummer}`).toContain(kärna);
    });

    it("varje numerisk tröskel återfinns i regelbanksraden", () => {
      const radtext = celler!.join(" | ");
      for (const [sökväg, värde] of trösklar(regel)) {
        expect(
          talFinns(radtext, värde),
          `${nyckel}.${sökväg} = ${värde} finns inte i regelbanksrad ${radnummer}`,
        ).toBe(true);
      }
    });
  });
});
