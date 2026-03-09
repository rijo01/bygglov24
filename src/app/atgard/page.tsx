import type { Metadata } from "next";
import Link from "next/link";
import { getAllAtgarder } from "@/lib/content";

export const metadata: Metadata = {
  title: "Åtgärdstyper – Vad kräver bygglov?",
  description:
    "Komplett guide till alla åtgärdstyper och bygglovsregler i Sverige. Välj din åtgärd och se exakt vad som gäller – från Attefallsåtgärder till pool och plank.",
  alternates: { canonical: "https://bygglov24.se/atgard" },
};

// Fallback static cards if no MDX files exist yet
const staticAtgarder = [
  { slug: "attefallsatgard", title: "Attefallsåtgärder", description: "Bygg upp till 15 kvm utan bygglov – men med anmälan.", icon: "🏠", kravpaBuildlov: false },
  { slug: "tillbyggnad", title: "Tillbyggnad", description: "Utöka din bostad – vad kräver bygglov och vad är undantag?", icon: "📐", kravpaBuildlov: true },
  { slug: "carport-garage", title: "Carport & Garage", description: "Regler för carport, garage och komplementbyggnader.", icon: "🚗", kravpaBuildlov: true },
  { slug: "altan-uteplats", title: "Altan & Uteplats", description: "Bygg altan utan bygglov inom 3,6 meter från huset.", icon: "🌿", kravpaBuildlov: false },
  { slug: "friggebod", title: "Friggebod", description: "15 kvm friggebodar kräver varken bygglov eller anmälan.", icon: "🛖", kravpaBuildlov: false },
  { slug: "plank-mur", title: "Plank & Mur", description: "Höjd, placering och undantag för plank och murar.", icon: "🧱", kravpaBuildlov: true },
  { slug: "inglasning", title: "Inglasning av altan", description: "Inglasning räknas ofta som bygglovspliktigt ingrepp.", icon: "🪟", kravpaBuildlov: true },
  { slug: "pool", title: "Pool & Markarbeten", description: "Marklov, poolregler och placering nära tomtgränsen.", icon: "💧", kravpaBuildlov: false },
  { slug: "solpaneler", title: "Solpaneler", description: "Solpaneler på taket är ofta bygglovsbefriat sedan 2018.", icon: "☀️", kravpaBuildlov: false },
  { slug: "skylt", title: "Skyltar & Reklam", description: "Skyltlov krävs i de flesta kommuner för skyltar.", icon: "📛", kravpaBuildlov: true },
  { slug: "eldstad-skorsten", title: "Eldstad & Skorsten", description: "Installation av eldstad kräver alltid anmälan.", icon: "🔥", kravpaBuildlov: false },
  { slug: "nybyggnation", title: "Nybyggnation", description: "Bygga nytt hus – komplett guide till processen.", icon: "🏗️", kravpaBuildlov: true },
];

export default function AtgardIndexPage() {
  const mdxAtgarder = getAllAtgarder();
  const atgarder = mdxAtgarder.length > 0 ? mdxAtgarder : staticAtgarder;

  return (
    <div className="py-12">
      <div className="container-content mb-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <Link href="/" className="hover:text-brand-600 transition-colors">Hem</Link>
          <span>/</span>
          <span className="text-slate-900">Åtgärdstyper</span>
        </nav>

        <h1 className="font-display text-4xl font-bold text-slate-900 mb-4">
          Vad kräver bygglov?
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl">
          Välj din åtgärdstyp för att se exakta regler, krav och undantag. Vi förklarar allt från attefallsåtgärder till nybyggnation.
        </p>

        {/* Filter badges */}
        <div className="flex flex-wrap gap-2 mt-6">
          <span className="badge bg-slate-100 text-slate-600">Alla åtgärder</span>
          <span className="badge bg-green-100 text-green-700">Ej bygglovspliktigt</span>
          <span className="badge bg-amber-100 text-amber-700">Kräver bygglov</span>
        </div>
      </div>

      <div className="container-wide">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {atgarder.map((a) => (
            <Link
              key={a.slug}
              href={`/atgard/${a.slug}`}
              className="card p-6 hover:shadow-md hover:border-brand-200 transition-all group"
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <span className="text-4xl">{"icon" in a ? a.icon : "🏠"}</span>
                <span className={`badge shrink-0 ${
                  !a.kravpaBuildlov
                    ? "bg-green-100 text-green-700"
                    : "bg-amber-100 text-amber-700"
                }`}>
                  {!a.kravpaBuildlov ? "✓ Ej bygglov" : "Bygglov krävs"}
                </span>
              </div>
              <h2 className="font-display text-lg font-semibold text-slate-900 group-hover:text-brand-700 transition-colors mb-2">
                {a.title}
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">{a.description}</p>
              <div className="flex items-center gap-1 text-brand-600 text-sm font-medium mt-4">
                Läs mer
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 7H13M8 2L13 7L8 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
