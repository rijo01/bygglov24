import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SearchForm from "@/components/SearchForm";
import JobCard from "@/components/JobCard";
import AdSlot from "@/components/AdSlot";
import { searchJobs } from "@/lib/af-api";
import { CITIES, CATEGORIES } from "@/lib/config";

export const metadata: Metadata = {
  title: "Lokala Jobb – Hitta jobb nära dig i Sverige",
  description:
    "Dagligt uppdaterade lediga jobb från Arbetsförmedlingen. Sök bland tusentals platsannonser i Stockholm, Göteborg, Malmö och fler svenska städer.",
};

export const revalidate = 1800;

const CITY_EMOJIS: Record<string, string> = {
  stockholm: "🏙️",
  goteborg: "⚓",
  malmo: "🌉",
  uppsala: "🎓",
  vasteras: "⚙️",
  orebro: "🏰",
  linkoping: "✈️",
  helsingborg: "🚢",
};

export default async function HomePage() {
  const [sthlmRes, gbgRes, malmoRes] = await Promise.allSettled([
    searchJobs({ municipality: "0180", limit: 6, sort: "pubdate-desc" }),
    searchJobs({ municipality: "1480", limit: 4, sort: "pubdate-desc" }),
    searchJobs({ municipality: "1280", limit: 4, sort: "pubdate-desc" }),
  ]);

  const sthlmJobs = sthlmRes.status === "fulfilled" ? sthlmRes.value.hits : [];
  const gbgJobs = gbgRes.status === "fulfilled" ? gbgRes.value.hits : [];
  const malmoJobs = malmoRes.status === "fulfilled" ? malmoRes.value.hits : [];
  const totalSthlm = sthlmRes.status === "fulfilled" ? sthlmRes.value.total.value : 0;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Lokala Jobb",
    url: "https://lokalajobb.se",
    description: "Hitta lediga jobb nära dig i Sverige",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://lokalajobb.se/sok?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />

      {/* TICKER */}
      <div className="bg-ink overflow-hidden">
        <div className="flex ticker-track py-2.5" style={{ width: "max-content" }}>
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex gap-10 px-5 text-xs font-medium tracking-widest uppercase whitespace-nowrap" style={{ color: "#666" }}>
              {CITIES.map((city) => (
                <span key={city.slug}>
                  {city.name} — <span className="text-accent">{city.slug === "stockholm" ? "2 847" : city.slug === "goteborg" ? "1 432" : city.slug === "malmo" ? "891" : "400+"} jobb</span>
                  <span className="mx-5 opacity-30">•</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <main>
        {/* HERO */}
        <section className="bg-paper pt-16 pb-14 border-b border-border">
          <div className="max-w-6xl mx-auto px-4 sm:px-8">
            <div className="animate-fade-up">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-8"
                style={{ background: "rgba(232,64,28,0.08)", border: "1px solid rgba(232,64,28,0.2)", color: "#E8401C" }}>
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse inline-block" />
                Uppdateras dagligen från Arbetsförmedlingen
              </div>
            </div>

            <h1 className="animate-fade-up animate-delay-1 opacity-0-init font-display text-ink leading-none mb-6"
              style={{ fontSize: "clamp(52px, 7vw, 90px)", letterSpacing: "-3px", fontWeight: 800, animationFillMode: "forwards" }}>
              Hitta jobbet<br />
              <span className="text-accent">nära dig</span>
            </h1>

            <p className="animate-fade-up animate-delay-2 opacity-0-init text-lg leading-relaxed mb-10 max-w-md"
              style={{ color: "#666", fontWeight: 300, animationFillMode: "forwards" }}>
              Tusentals lediga tjänster i hela Sverige, varje dag — filtrerade per stad och bransch.
            </p>

            <div className="animate-fade-up animate-delay-2 opacity-0-init max-w-2xl" style={{ animationFillMode: "forwards" }}>
              <SearchForm />
            </div>

            {/* Stats */}
            <div className="animate-fade-up animate-delay-3 opacity-0-init flex gap-10 mt-10" style={{ animationFillMode: "forwards" }}>
              <div>
                <div className="font-display text-3xl text-ink font-bold" style={{ letterSpacing: "-1px" }}>
                  {totalSthlm > 0 ? `${totalSthlm.toLocaleString("sv-SE")}+` : "2 800+"}
                </div>
                <div className="text-xs text-muted font-medium mt-0.5 uppercase tracking-wider">Jobb i Stockholm</div>
              </div>
              <div>
                <div className="font-display text-3xl text-ink font-bold" style={{ letterSpacing: "-1px" }}>8</div>
                <div className="text-xs text-muted font-medium mt-0.5 uppercase tracking-wider">Städer</div>
              </div>
              <div>
                <div className="font-display text-3xl text-ink font-bold" style={{ letterSpacing: "-1px" }}>Daily</div>
                <div className="text-xs text-muted font-medium mt-0.5 uppercase tracking-wider">Uppdateras</div>
              </div>
            </div>
          </div>
        </section>

        {/* CATEGORIES */}
        <section className="py-8 border-b border-border bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-4">Branscher</p>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/kategori/${cat.slug}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-paper text-sm font-medium text-ink transition-all hover:border-accent hover:text-accent hover:bg-white"
                >
                  <span>{cat.icon}</span>
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* MAIN: Jobs + sidebar */}
        <section className="py-14">
          <div className="max-w-6xl mx-auto px-4 sm:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

              {/* LEFT: Stockholm jobs (full list) */}
              <div className="lg:col-span-2">
                <div className="flex items-end justify-between mb-6">
                  <h2 className="font-display text-3xl text-ink" style={{ letterSpacing: "-1px", fontWeight: 700 }}>
                    Stockholm
                  </h2>
                  <Link href="/stockholm" className="text-sm font-medium text-accent hover:underline">
                    Visa alla →
                  </Link>
                </div>

                {/* Job rows */}
                <div className="rounded-2xl overflow-hidden border border-border" style={{ background: "rgba(0,0,0,0.04)" }}>
                  <div className="flex flex-col gap-px">
                    {sthlmJobs.slice(0, 6).map((job, i) => (
                      <Link key={job.id} href={`/jobb/${job.id}`} className="job-card block bg-white px-5 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                            style={{ background: `hsl(${(i * 53 + 200) % 360}, 25%, 92%)` }}>
                            {["💻","🏥","⚡","📊","🚛","🔧"][i % 6]}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-ink text-sm truncate">{job.headline}</div>
                            <div className="text-xs text-muted mt-0.5">
                              {job.employer?.name} · Stockholm
                            </div>
                          </div>
                          <div className="text-xs text-muted flex-shrink-0">
                            {job.publication_date ? new Date(job.publication_date).toLocaleDateString("sv-SE", { day: "numeric", month: "short" }) : ""}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Göteborg below on desktop */}
                <div className="mt-10">
                  <div className="flex items-end justify-between mb-6">
                    <h2 className="font-display text-3xl text-ink" style={{ letterSpacing: "-1px", fontWeight: 700 }}>
                      Göteborg
                    </h2>
                    <Link href="/goteborg" className="text-sm font-medium text-accent hover:underline">
                      Visa alla →
                    </Link>
                  </div>
                  <div className="rounded-2xl overflow-hidden border border-border" style={{ background: "rgba(0,0,0,0.04)" }}>
                    <div className="flex flex-col gap-px">
                      {gbgJobs.slice(0, 4).map((job, i) => (
                        <Link key={job.id} href={`/jobb/${job.id}`} className="job-card block bg-white px-5 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                              style={{ background: `hsl(${(i * 71 + 140) % 360}, 25%, 92%)` }}>
                              {["⚓","🏗️","🛍️","📚"][i % 4]}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-ink text-sm truncate">{job.headline}</div>
                              <div className="text-xs text-muted mt-0.5">
                                {job.employer?.name} · Göteborg
                              </div>
                            </div>
                            <div className="text-xs text-muted flex-shrink-0">
                              {job.publication_date ? new Date(job.publication_date).toLocaleDateString("sv-SE", { day: "numeric", month: "short" }) : ""}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT SIDEBAR */}
              <div className="space-y-8">
                {/* City grid */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-4">Alla städer</p>
                  <div className="grid grid-cols-2 gap-2">
                    {CITIES.map((city, i) => (
                      <Link key={city.slug} href={`/${city.slug}`}
                        className="hover-lift flex flex-col gap-1.5 p-4 rounded-2xl border border-border cursor-pointer"
                        style={{ background: i === 0 ? "#1A1A1A" : "#FFFFFF" }}>
                        <span className="text-xl">{CITY_EMOJIS[city.slug] ?? "🏘️"}</span>
                        <span className="text-sm font-semibold" style={{ color: i === 0 ? "#F5F2EC" : "#1A1A1A" }}>
                          {city.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Malmö jobs */}
                <div>
                  <div className="flex items-end justify-between mb-4">
                    <h2 className="font-display text-2xl text-ink" style={{ letterSpacing: "-0.5px", fontWeight: 700 }}>Malmö</h2>
                    <Link href="/malmo" className="text-sm font-medium text-accent hover:underline">Visa alla →</Link>
                  </div>
                  <div className="rounded-2xl overflow-hidden border border-border" style={{ background: "rgba(0,0,0,0.04)" }}>
                    <div className="flex flex-col gap-px">
                      {malmoJobs.slice(0, 3).map((job, i) => (
                        <Link key={job.id} href={`/jobb/${job.id}`} className="job-card block bg-white px-4 py-3">
                          <div className="font-semibold text-ink text-sm truncate">{job.headline}</div>
                          <div className="text-xs text-muted mt-0.5">{job.employer?.name}</div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                {/* CTA card */}
                <div className="rounded-2xl p-6 text-white relative overflow-hidden" style={{ background: "#E8401C" }}>
                  <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-10 bg-white" />
                  <div className="text-2xl mb-2">🎯</div>
                  <div className="font-display text-xl font-bold mb-2" style={{ lineHeight: 1.2 }}>
                    Annonsera lokalt
                  </div>
                  <p className="text-sm mb-4" style={{ color: "rgba(255,255,255,0.75)", lineHeight: 1.5 }}>
                    Nå rätt kandidater i rätt stad.
                  </p>
                  <Link href="/for-arbetsgivare"
                    className="inline-block bg-white text-accent font-bold text-sm px-4 py-2 rounded-lg"
                    style={{ color: "#E8401C" }}>
                    Kom igång →
                  </Link>
                </div>

                <AdSlot slot="banner" />
              </div>
            </div>
          </div>
        </section>

        {/* SEO footer text */}
        <section className="py-14 border-t border-border bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-8 text-center">
            <h2 className="font-display text-4xl text-ink mb-4" style={{ letterSpacing: "-1.5px", fontWeight: 700 }}>
              Sveriges lokala jobbsajt
            </h2>
            <p className="leading-relaxed text-muted max-w-xl mx-auto">
              Lokala Jobb samlar dagligt uppdaterade platsannonser från Arbetsförmedlingens Platsbanken och presenterar dem strukturerade per stad och bransch.
            </p>
            <div className="grid grid-cols-3 gap-8 mt-10">
              {[
                { val: "8", label: "Städer" },
                { val: "8", label: "Branscher" },
                { val: "24h", label: "Uppdatering" },
              ].map(s => (
                <div key={s.label}>
                  <div className="font-display text-5xl text-accent font-bold" style={{ letterSpacing: "-2px" }}>{s.val}</div>
                  <div className="text-xs text-muted font-medium uppercase tracking-wider mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
