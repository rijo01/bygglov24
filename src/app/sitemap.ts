import { MetadataRoute } from "next";
import { arIndexerbar, getAllAtgarder, getAllGuider, getAllKommuner } from "@/lib/content";

const BASE = "https://bygglov24.se";

/**
 * Sitemapen innehåller ENDAST indexerbara URL:er. Filtret är samma predikat
 * (arIndexerbar) som robotsFor() i sidmallarna använder, så sitemap och
 * robots-meta kan aldrig glida isär och Google får aldrig en sitemap som
 * pekar på noindex-sidor.
 *
 * Kommun- och åtgärdssidor utan `indexera: true` ligger alltså utanför — de
 * kommer tillbaka i takt med att FAS 2–4 skriver om dem med verifierade
 * uppgifter och flaggan sätts.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const atgarder = getAllAtgarder().filter(arIndexerbar);
  const guider = getAllGuider().filter(arIndexerbar);
  const kommuner = getAllKommuner().filter(arIndexerbar);

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/atgard`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/guide`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/kommun`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/hjalp-med-bygglov`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/konsult`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.85 },
    { url: `${BASE}/kalkylator`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
  ];

  const atgardPages: MetadataRoute.Sitemap = atgarder.map((a) => ({
    url: `${BASE}/atgard/${a.slug}`,
    lastModified: a.updatedAt ? new Date(a.updatedAt) : new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const guidePages: MetadataRoute.Sitemap = guider.map((g) => ({
    url: `${BASE}/guide/${g.slug}`,
    lastModified: g.updatedAt ? new Date(g.updatedAt) : new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const kommunPages: MetadataRoute.Sitemap = kommuner.map((k) => ({
    url: `${BASE}/kommun/${k.slug}`,
    lastModified: k.updatedAt ? new Date(k.updatedAt) : new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticPages, ...atgardPages, ...guidePages, ...kommunPages];
}
