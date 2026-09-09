import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { saneraKonsultCta } from "../src/lib/cta";

const ROOT = path.resolve(__dirname, "..");

/** Alla MDX-filer som innehåller en konsult-CTA. */
function mdxMedKonsultlank(): Array<[string, string]> {
  const ut: Array<[string, string]> = [];
  for (const dir of ["content/kommuner", "content/guider", "content/atgarder"]) {
    const full = path.join(ROOT, dir);
    if (!fs.existsSync(full)) continue;
    for (const f of fs.readdirSync(full)) {
      const p = path.join(full, f);
      const raw = fs.readFileSync(p, "utf8");
      if (raw.includes("](/konsult)")) ut.push([path.join(dir, f), raw]);
    }
  }
  return ut;
}

const FILER = mdxMedKonsultlank();

describe("CTA-sanering i MDX", () => {
  it("hittar konsult-CTA:er att sanera", () => {
    expect(FILER.length).toBeGreaterThan(300);
  });

  it("flaggan av lämnar källan orörd", () => {
    for (const [namn, raw] of FILER) {
      expect(saneraKonsultCta(raw, false), `${namn} ändrades trots att flaggan är av`).toBe(raw);
    }
  });

  it("flaggan på lämnar ingen /konsult-länk kvar", () => {
    for (const [namn, raw] of FILER) {
      expect(saneraKonsultCta(raw, true), `${namn} har kvar en /konsult-länk`).not.toContain("](/konsult)");
    }
  });

  it("flaggan på lämnar inga löften om kostnadsfritt eller svarstid i CTA-raderna", () => {
    for (const [namn, raw] of FILER) {
      const cta = saneraKonsultCta(raw, true)
        .split("\n")
        .filter((r) => r.includes("/bygglovskoll"))
        .join(" ");
      expect(cta.toLowerCase(), `${namn}`).not.toMatch(/kostnadsfri|gratis|24 timmar|konsultmatchning/);
    }
  });

  it("varje sanerad fil länkar till /bygglovskoll", () => {
    for (const [namn, raw] of FILER) {
      expect(saneraKonsultCta(raw, true), namn).toContain("](/bygglovskoll)");
    }
  });

  it("listmarkörer överlever bytet", () => {
    const mdx = "5. Eller [begär en kostnadsfri bedömning](/konsult) från en lokal konsult";
    expect(saneraKonsultCta(mdx, true)).toMatch(/^5\. \[Gör en Bygglovskoll/);
  });

  it("kalkylatorlänken bevaras när den fanns på samma rad", () => {
    const mdx = "[Begär en kostnadsfri bedömning](/konsult) av en konsult. Eller använd vår [bygglovskalkylator](/kalkylator) för att räkna.";
    const ut = saneraKonsultCta(mdx, true);
    expect(ut).toContain("](/kalkylator)");
    expect(ut).not.toContain("](/konsult)");
  });

  it("rör inte text utan konsultlänk", () => {
    const mdx = "Kommunen erbjuder ofta kostnadsfri rådgivning innan du skickar in din ansökan.";
    expect(saneraKonsultCta(mdx, true)).toBe(mdx);
  });
});
