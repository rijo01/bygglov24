import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

/**
 * Feature-flaggan är av som standard. Testet kör med flaggan både av och på och
 * kontrollerar att den avstängda vägen verkligen 404:ar och att sitemapen inte
 * läcker URL:en — annars indexeras en sida som svarar 404.
 */

const URSPRUNG = process.env.BYGGLOVSKOLL_ENABLED;

/** /konsult-posten i next.config.ts, för den flagga som är satt just nu. */
async function konsultRedirect() {
  vi.resetModules();
  const { default: config } = await import("../next.config");
  const poster = await config.redirects!();
  return poster.find((r) => r.source === "/konsult");
}

beforeEach(() => {
  vi.resetModules();
});

afterEach(() => {
  if (URSPRUNG === undefined) delete process.env.BYGGLOVSKOLL_ENABLED;
  else process.env.BYGGLOVSKOLL_ENABLED = URSPRUNG;
});

describe("flaggan av", () => {
  beforeEach(() => {
    process.env.BYGGLOVSKOLL_ENABLED = "false";
  });

  it("/bygglovskoll ger 404", async () => {
    const { default: Page } = await import("../src/app/bygglovskoll/page");
    // notFound() kastar ett NEXT_HTTP_ERROR_FALLBACK;404-fel.
    expect(() => Page()).toThrowError(/404|NEXT_NOT_FOUND|NEXT_HTTP_ERROR_FALLBACK/);
  });

  it("/bygglovskoll/klar ger 404", async () => {
    const { default: Page } = await import("../src/app/bygglovskoll/klar/page");
    expect(() => Page()).toThrowError(/404|NEXT_NOT_FOUND|NEXT_HTTP_ERROR_FALLBACK/);
  });

  it("sitemapen saknar posten", async () => {
    const { default: sitemap } = await import("../src/app/sitemap");
    const urls = sitemap().map((e) => e.url);
    expect(urls).not.toContain("https://bygglov24.se/bygglovskoll");
    // Sanity: sitemapen är i övrigt hel.
    expect(urls).toContain("https://bygglov24.se/hjalp-med-bygglov");
    expect(urls.length).toBeGreaterThan(10);
  });

  it("sitemapen innehåller /konsult", async () => {
    const { default: sitemap } = await import("../src/app/sitemap");
    expect(sitemap().map((e) => e.url)).toContain("https://bygglov24.se/konsult");
  });

  it("/konsult redirectas inte alls — sidan renderar", async () => {
    expect(await konsultRedirect()).toBeUndefined();
  });

  it("MDX-CTA:erna lämnas orörda", async () => {
    const { saneraKonsultCta } = await import("../src/lib/cta");
    const mdx = "En lokal bygglovskonsult. [Begär en kostnadsfri konsultbedömning](/konsult) – svar inom 24 timmar.";
    expect(saneraKonsultCta(mdx)).toBe(mdx);
  });

  it("hjälpfunktionen returnerar false även för avvikande värden", async () => {
    for (const v of ["", "false", "1", "TRUE", "yes", " true"]) {
      vi.resetModules();
      process.env.BYGGLOVSKOLL_ENABLED = v;
      const { bygglovskollAktiv } = await import("../src/lib/bygglovskoll/flag");
      expect(bygglovskollAktiv(), `värdet ${JSON.stringify(v)} borde stänga tjänsten`).toBe(false);
    }
  });

  it("flaggan är av när variabeln inte är satt alls", async () => {
    delete process.env.BYGGLOVSKOLL_ENABLED;
    const { bygglovskollAktiv } = await import("../src/lib/bygglovskoll/flag");
    expect(bygglovskollAktiv()).toBe(false);
  });
});

describe("flaggan på", () => {
  beforeEach(() => {
    process.env.BYGGLOVSKOLL_ENABLED = "true";
  });

  it("/bygglovskoll renderar", async () => {
    const { default: Page } = await import("../src/app/bygglovskoll/page");
    expect(() => Page()).not.toThrow();
  });

  it("sitemapen innehåller posten", async () => {
    const { default: sitemap } = await import("../src/app/sitemap");
    expect(sitemap().map((e) => e.url)).toContain("https://bygglov24.se/bygglovskoll");
  });

  it("sitemapen saknar /konsult, som redirectar", async () => {
    const { default: sitemap } = await import("../src/app/sitemap");
    expect(sitemap().map((e) => e.url)).not.toContain("https://bygglov24.se/konsult");
  });

  it("/konsult redirectar i stället för att rendera", async () => {
    const { default: Page } = await import("../src/app/konsult/page");
    // redirect() kastar ett NEXT_REDIRECT-fel.
    expect(() => Page()).toThrowError(/NEXT_REDIRECT|redirect/i);
  });

  it("/konsult är en permanent 301, inte en temporär redirect", async () => {
    // Sidan är borta för gott, inte pausad. En temporär status (307/308 via
    // permanent-flaggan) säger fel sak till Google och till webbläsarcachen.
    const post = await konsultRedirect();
    expect(post).toBeDefined();
    expect(post).toMatchObject({ destination: "/hjalp-med-bygglov", statusCode: 301 });
    // statusCode och permanent utesluter varandra i Next — sätts båda blir det
    // 308 och 301:an tyst borta.
    expect(post).not.toHaveProperty("permanent");
  });

  it("MDX-CTA:erna saneras", async () => {
    const { saneraKonsultCta } = await import("../src/lib/cta");
    const mdx = "En lokal bygglovskonsult. [Begär en kostnadsfri konsultbedömning](/konsult) – svar inom 24 timmar.";
    const ut = saneraKonsultCta(mdx);
    expect(ut).not.toContain("/konsult");
    expect(ut).toContain("](/bygglovskoll)");
  });
});
