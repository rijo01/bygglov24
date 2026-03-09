import { MetadataRoute } from "next";
import { getAllAtgarder, getAllKommuner } from "@/lib/content";

const BASE = "https://bygglov24.se";

export default function sitemap(): MetadataRoute.Sitemap {
  const atgarder = getAllAtgarder();
  const kommuner = getAllKommuner();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/atgard`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/kommun`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/guide/ansokan`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/guide/bygglovsbefriat`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/guide/kostnad`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/konsult`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.85 },
  ];

  const atgardPages: MetadataRoute.Sitemap = atgarder.map((a) => ({
    url: `${BASE}/atgard/${a.slug}`,
    lastModified: a.updatedAt ? new Date(a.updatedAt) : new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const kommunPages: MetadataRoute.Sitemap = kommuner.map((k) => ({
    url: `${BASE}/kommun/${k.slug}`,
    lastModified: k.updatedAt ? new Date(k.updatedAt) : new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticPages, ...atgardPages, ...kommunPages];
}
