import type { Metadata } from "next";
import Link from "next/link";
import LeadForm from "@/components/LeadForm";
import HeroVal from "@/components/HeroVal";
import { bygglovskollAktiv } from "@/lib/bygglovskoll/flag";
import { getAllKommuner, normalizeKommunSlug } from "@/lib/content";
import { getAtgarderGrid } from "@/lib/atgarder";
import { pelarguider } from "@/lib/lankar";
import { Icon } from "@/lib/icons";

const TOTALA_KOMMUNER = 290;

export const metadata: Metadata = {
  title: "Bygglov24.se – Allt om bygglov i Sverige",
  description:
    "Guide till bygglov i Sverige. Lär dig vad som kräver bygglov, hur du ansöker och hitta godkänd bygglovskonsult i din kommun.",
  alternates: { canonical: "https://bygglov24.se" },
};

const storstader = [
  "Stockholm", "Göteborg", "Malmö", "Uppsala", "Linköping",
  "Örebro", "Västerås", "Helsingborg", "Norrköping", "Jönköping",
];

/**
 * Steg 4 skilde sig åt: med Bygglovskoll på finns ingen gratis matchning att
 * hänvisa till, så steget beskriver de två vägar som faktiskt finns.
 */
function howSteps(bygglovskoll: boolean) {
  return [
    { n: "1", title: "Identifiera din åtgärd", text: "Välj vad du vill bygga – tillbyggnad, garage, altan eller annat. Vi guidar dig till rätt kategori." },
    { n: "2", title: "Kontrollera regler i din kommun", text: "Regler kan variera. Hitta exakt information för din kommun bland våra kommunguider." },
    { n: "3", title: "Ansök eller anmäl", text: "Lär dig hur du fyller i ansökan korrekt, vilka handlingar som krävs och hur lång handläggningstiden är." },
    bygglovskoll
      ? { n: "4", title: "Gör en Bygglovskoll eller begär offert", text: "Tveksam? Gör en Bygglovskoll för 99 kr, eller begär offert på handlingar, ritningar eller ansökan." }
      : { n: "4", title: "Få hjälp av en konsult", text: "Tveksam? Matcha med en lokal bygglovskonsult som hjälper dig hela vägen – kostnadsfri offert." },
  ];
}

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Bygglov24.se",
  url: "https://bygglov24.se",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://bygglov24.se/sok?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

export default function HomePage() {
  const atgarder = getAtgarderGrid();
  const kommunCount = getAllKommuner().length;
  const guider = pelarguider();

  const bygglovskoll = bygglovskollAktiv();
  const steg = howSteps(bygglovskoll);

  // Med Bygglovskoll på finns ingen gratis konsultmatchning och inget löfte om
  // svarstid — de två posterna tas bort i stället för att stå kvar osanna.
  const stats = bygglovskoll
    ? [
        { value: `${kommunCount}`, label: "Kommunguider" },
        { value: `${atgarder.length}`, label: "Åtgärdstyper" },
      ]
    : [
        { value: `${kommunCount}`, label: "Kommunguider" },
        { value: `${atgarder.length}`, label: "Åtgärdstyper" },
        { value: "Gratis", label: "Konsultmatchning" },
        { value: "24h", label: "Svarstid" },
      ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800 text-white">
        {/* Geometric background */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

        <div className="container-wide relative py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-up">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                Täcker {kommunCount} av {TOTALA_KOMMUNER} kommuner i Sverige
              </div>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] mb-6">
                Allt om <br />
                <span className="text-brand-300">bygglov</span> – <br />
                samlat på ett ställe
              </h1>
              <p className="text-lg text-brand-100 leading-relaxed mb-8 max-w-lg">
                {bygglovskoll
                  ? "Förstå vad som kräver bygglov, hur du ansöker och vad det kostar. Hitta din kommuns specifika regler."
                  : "Förstå vad som kräver bygglov, hur du ansöker och vad det kostar. Hitta din kommuns specifika regler och matcha med en lokal konsult."}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/atgard" className="btn-primary bg-white text-brand-900 hover:bg-brand-50 shadow-lg">
                  Välj åtgärdstyp
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M1 8H15M9 2L15 8L9 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </Link>
                <Link href="/kommun" className="btn-secondary border-white/30 text-white hover:bg-white/10">
                  Hitta din kommun
                </Link>
              </div>

              {/* Stats */}
              <div className={`grid gap-4 mt-12 pt-8 border-t border-white/10 ${bygglovskoll ? "grid-cols-2 max-w-xs" : "grid-cols-4"}`}>
                {stats.map((s) => (
                  <div key={s.label}>
                    <div className="font-display text-2xl font-bold text-white">{s.value}</div>
                    <div className="text-xs text-brand-300 mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero-ingång: tvåvägsval med flaggan på, annars leadformuläret. */}
            <div className="animate-fade-in-up animate-delay-200">
              {bygglovskoll ? <HeroVal /> : <LeadForm source="hero" bygglovskoll={false} />}
            </div>
          </div>
        </div>
      </section>

      {/* ── Åtgärder ──────────────────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="container-wide">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl font-bold text-slate-900 mb-3">
              Vad vill du bygga?
            </h2>
            <p className="text-slate-600 max-w-xl mx-auto">
              Välj din åtgärdstyp för att se exakt vad som gäller – krav, undantag och ansökningsprocess.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {atgarder.map((a) => (
              <Link
                key={a.slug}
                href={`/atgard/${a.slug}`}
                className="card p-5 hover:shadow-md hover:border-brand-200 transition-all group"
              >
                <Icon name={a.icon} className="w-8 h-8 text-brand-600 mb-3" />
                <h3 className="font-display font-semibold text-slate-900 text-sm group-hover:text-brand-700 transition-colors">
                  {a.label}
                </h3>
                <p className="text-xs text-slate-500 mt-1">{a.shortDesc}</p>
              </Link>
            ))}
          </div>

          <div className="text-center mt-6">
            <Link href="/atgard" className="btn-secondary">
              Se alla åtgärdstyper →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Guider ────────────────────────────────────────────────────────
          Startsidans starkaste utgående länkar går hit: de omskrivna,
          indexerbara guiderna. Listan kommer från pelarguider() så att den
          aldrig kan peka på en sida som tagits ur indexet. */}
      <section className="py-16 bg-slate-50 border-y border-slate-100">
        <div className="container-wide">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl font-bold text-slate-900 mb-3">
              Guider som förklarar reglerna
            </h2>
            <p className="text-slate-600 max-w-xl mx-auto">
              Plan- och bygglagen på begriplig svenska – med paragrafhänvisningar, så att du kan kontrollera uppgifterna själv.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {guider.map((g) => (
              <Link
                key={g.href}
                href={g.href}
                className="card p-5 bg-white hover:shadow-md hover:border-brand-200 transition-all group"
              >
                <h3 className="font-display font-semibold text-slate-900 text-sm group-hover:text-brand-700 transition-colors">
                  {g.label}
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{g.desc}</p>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8 flex flex-wrap gap-3 justify-center">
            <Link href="/guide" className="btn-secondary">
              Se alla guider →
            </Link>
            <Link href="/kalkylator" className="btn-secondary">
              Bygglovskalkylator →
            </Link>
            <Link href="/hjalp-med-bygglov" className="btn-secondary">
              Hjälp med bygglov →
            </Link>
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────────── */}
      <section className="py-16 bg-brand-50">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-slate-900 mb-3">
              Så här ansöker du om bygglov
            </h2>
            <p className="text-slate-600">Fyra steg från idé till godkänt bygglov</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {steg.map((step, i) => (
              <div key={i} className="relative">
                {i < steg.length - 1 && (
                  <div className="hidden md:block absolute top-6 left-[calc(50%+20px)] w-[calc(100%-40px)] h-px bg-brand-200" />
                )}
                <div className="card p-6 text-center relative bg-white">
                  <div className="step-number mx-auto mb-4">{step.n}</div>
                  <h3 className="font-display font-semibold text-slate-900 mb-2 text-sm">{step.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Kommuner ─────────────────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="container-wide">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl font-bold text-slate-900 mb-3">
              Hitta din kommuns bygglovsregler
            </h2>
            <p className="text-slate-600 max-w-xl mx-auto">
              Regler, avgifter, handläggningstider och kontaktuppgifter – {kommunCount} av {TOTALA_KOMMUNER} kommuner.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {storstader.map((k) => (
              <Link
                key={k}
                href={`/kommun/${normalizeKommunSlug(k)}`}
                className="px-4 py-2 bg-brand-50 hover:bg-brand-100 text-brand-800 text-sm font-medium rounded-lg border border-brand-100 transition-colors"
              >
                {k}
              </Link>
            ))}
          </div>

          <div className="text-center">
            <Link href="/kommun" className="btn-primary">
              Visa alla kommuner
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M1 8H15M9 2L15 8L9 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Trust / CTA ──────────────────────────────────────────────────── */}
      {/* Med flaggan på leder rutan till de två tjänster som finns, och lovar
          ingen svarstid på 99-kronorsprodukten. Med flaggan av står dagens
          text kvar ordagrant. */}
      <section className="py-16 bg-gradient-to-r from-brand-900 to-brand-700 text-white">
        <div className="container-content text-center">
          <h2 className="font-display text-3xl font-bold mb-4">
            Osäker på vad som gäller?
          </h2>
          {bygglovskoll ? (
            <>
              <p className="text-brand-200 text-lg mb-8 max-w-2xl mx-auto">
                Gör en Bygglovskoll för 99 kr — ett skriftligt underlag utifrån dina uppgifter, med
                sannolik klassning, reglerna som gäller för den och vad du ska kontrollera. Det
                bindande beskedet ges av byggnadsnämnden.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/bygglovskoll" className="btn-primary bg-white text-brand-900 hover:bg-brand-50 text-base px-8 py-4">
                  Gör en Bygglovskoll för 99 kr →
                </Link>
                <Link href="/hjalp-med-bygglov#offert" className="btn-secondary border-white/40 text-white hover:bg-white/10 text-base px-8 py-4">
                  Begär offert
                </Link>
              </div>
            </>
          ) : (
            <>
              <p className="text-brand-200 text-lg mb-8 max-w-2xl mx-auto">
                Låt en lokal bygglovskonsult bedöma ditt projekt. Kostnadsfri förfrågan – svar inom 24 timmar.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/konsult" className="btn-primary bg-white text-brand-900 hover:bg-brand-50 text-base px-8 py-4">
                  Få kostnadsfri konsultation →
                </Link>
                <Link href="/guide/ansokan" className="btn-secondary border-white/40 text-white hover:bg-white/10 text-base px-8 py-4">
                  Läs ansökningsguiden
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
