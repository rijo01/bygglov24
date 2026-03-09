import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getKommun, getAllKommuner } from "@/lib/content";
import LeadForm from "@/components/LeadForm";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const kommuner = getAllKommuner();
  return kommuner.map((k) => ({ slug: k.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = getKommun(slug);
  if (!data) {
    // Generic fallback metadata for kommuner without MDX
    const namn = slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " ");
    return {
      title: `Bygglov i ${namn} – Regler, avgifter och ansökan`,
      description: `Allt om bygglov i ${namn} kommun. Handläggningstider, avgifter, kontaktuppgifter och hur du ansöker rätt.`,
      alternates: { canonical: `https://bygglov24.se/kommun/${slug}` },
    };
  }
  const { frontmatter: fm } = data;
  return {
    title: fm.title,
    description: fm.description,
    alternates: { canonical: `https://bygglov24.se/kommun/${slug}` },
    openGraph: {
      title: fm.title,
      description: fm.description,
      type: "article",
    },
  };
}

export default async function KommunPage({ params }: Props) {
  const { slug } = await params;
  const data = getKommun(slug);

  const namn = slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " ");

  if (!data) {
    // Render placeholder page for komunner without MDX yet
    return <KommunPlaceholder slug={slug} namn={namn} />;
  }

  const { frontmatter: fm, content } = data;

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "GovernmentOffice",
    name: `${fm.kommunNamn} Byggnadsnämnd`,
    address: {
      "@type": "PostalAddress",
      addressLocality: fm.kommunNamn,
      addressRegion: fm.lan,
      addressCountry: "SE",
    },
    ...(fm.telefonByggnadskontor && { telephone: fm.telefonByggnadskontor }),
    ...(fm.webbplatsByggnadskontor && { url: fm.webbplatsByggnadskontor }),
  };

  const faqSchema = fm.faq?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: fm.faq.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      }
    : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}

      <div className="py-10">
        <div className="container-wide">
          <div className="grid lg:grid-cols-[1fr_360px] gap-12 items-start">
            <article>
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
                <Link href="/" className="hover:text-brand-600 transition-colors">Hem</Link>
                <span>/</span>
                <Link href="/kommun" className="hover:text-brand-600 transition-colors">Kommuner</Link>
                <span>/</span>
                <span className="text-slate-900">{fm.kommunNamn}</span>
              </nav>

              {/* Header */}
              <div className="mb-8">
                <span className="badge bg-brand-100 text-brand-700 mb-4">{fm.lan}</span>
                <h1 className="font-display text-4xl font-bold text-slate-900 mb-4 leading-tight">
                  Bygglov i {fm.kommunNamn}
                </h1>
                <p className="text-lg text-slate-600 leading-relaxed">{fm.description}</p>
              </div>

              {/* Quick facts */}
              <div className="card p-6 mb-8 bg-brand-50 border-brand-100">
                <h2 className="font-display font-semibold text-slate-900 mb-4">Snabbinformation</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {fm.handlaggningstid && (
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">⏱</div>
                      <div>
                        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-0.5">Handläggningstid</div>
                        <div className="font-semibold text-slate-900 text-sm">{fm.handlaggningstid}</div>
                      </div>
                    </div>
                  )}
                  {fm.avgiftEnkel && (
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">💰</div>
                      <div>
                        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-0.5">Avgift (enkel åtgärd)</div>
                        <div className="font-semibold text-slate-900 text-sm">{fm.avgiftEnkel}</div>
                      </div>
                    </div>
                  )}
                  {fm.telefonByggnadskontor && (
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">📞</div>
                      <div>
                        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-0.5">Byggnadsnämnden</div>
                        <a href={`tel:${fm.telefonByggnadskontor}`} className="font-semibold text-brand-600 text-sm hover:text-brand-800">
                          {fm.telefonByggnadskontor}
                        </a>
                      </div>
                    </div>
                  )}
                  {fm.webbplatsByggnadskontor && (
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">🌐</div>
                      <div>
                        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-0.5">Officiell webbplats</div>
                        <a href={fm.webbplatsByggnadskontor} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-600 text-sm hover:text-brand-800 break-all">
                          {fm.webbplatsByggnadskontor.replace(/^https?:\/\//, "").split("/")[0]}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* MDX body */}
              <div className="prose-bygglov">
                <MDXRemote source={content} />
              </div>

              {/* FAQ */}
              {fm.faq && fm.faq.length > 0 && (
                <div className="mt-12">
                  <h2 className="font-display text-2xl font-bold text-slate-900 mb-6">
                    Vanliga frågor om bygglov i {fm.kommunNamn}
                  </h2>
                  <div className="space-y-4">
                    {fm.faq.map((f, i) => (
                      <details key={i} className="card p-5 group">
                        <summary className="font-semibold text-slate-900 cursor-pointer list-none flex items-center justify-between gap-3">
                          {f.question}
                          <svg className="w-4 h-4 text-slate-400 group-open:rotate-180 transition-transform shrink-0" viewBox="0 0 16 16" fill="none">
                            <path d="M3 6L8 11L13 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </summary>
                        <p className="text-slate-600 mt-3 text-sm leading-relaxed">{f.answer}</p>
                      </details>
                    ))}
                  </div>
                </div>
              )}
            </article>

            {/* Sidebar */}
            <aside className="lg:sticky lg:top-24 space-y-5">
              <LeadForm source={`kommun-${slug}`} kommun={fm.kommunNamn} compact />

              <div className="card p-5">
                <h3 className="font-display font-semibold text-slate-900 mb-3">Relaterade åtgärder</h3>
                <div className="space-y-2">
                  {[
                    { href: "/atgard/attefallsatgard", label: "Attefallsåtgärder" },
                    { href: "/atgard/tillbyggnad", label: "Tillbyggnad" },
                    { href: "/atgard/carport-garage", label: "Carport & Garage" },
                    { href: "/atgard/altan-uteplats", label: "Altan & Uteplats" },
                  ].map((item) => (
                    <Link key={item.href} href={item.href} className="flex items-center gap-2 text-sm text-slate-700 hover:text-brand-700 py-1 transition-colors">
                      <span className="text-brand-500">→</span> {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}

function KommunPlaceholder({ slug, namn }: { slug: string; namn: string }) {
  return (
    <div className="py-10">
      <div className="container-wide">
        <div className="grid lg:grid-cols-[1fr_360px] gap-12 items-start">
          <div>
            <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
              <Link href="/" className="hover:text-brand-600">Hem</Link>
              <span>/</span>
              <Link href="/kommun" className="hover:text-brand-600">Kommuner</Link>
              <span>/</span>
              <span className="text-slate-900">{namn}</span>
            </nav>

            <h1 className="font-display text-4xl font-bold text-slate-900 mb-4">
              Bygglov i {namn}
            </h1>
            <p className="text-lg text-slate-600 mb-8">
              Vi sammanställer just nu fullständig bygglovsinformation för {namn} kommun – avgifter, handläggningstider och kontaktuppgifter.
            </p>

            <div className="card p-6 bg-brand-50 border-brand-100">
              <h2 className="font-display font-semibold text-slate-900 mb-3">Allmänna regler som gäller i hela Sverige</h2>
              <ul className="space-y-2 text-sm text-slate-700">
                <li className="flex gap-2"><span className="text-brand-600 font-bold">→</span> Attefallsåtgärder: upp till 15 kvm utan bygglov, men med anmälan</li>
                <li className="flex gap-2"><span className="text-brand-600 font-bold">→</span> Friggebod: upp till 15 kvm utan vare sig bygglov eller anmälan</li>
                <li className="flex gap-2"><span className="text-brand-600 font-bold">→</span> Altan: inom 3,6 m från huset och max 1,8 m höjd är bygglovsbefriat</li>
                <li className="flex gap-2"><span className="text-brand-600 font-bold">→</span> Handläggningstid är max 10 veckor enligt lag</li>
              </ul>
              <div className="mt-4">
                <Link href="/guide/ansokan" className="btn-secondary text-sm py-2">
                  Läs fullständig ansökningsguide →
                </Link>
              </div>
            </div>
          </div>

          <aside className="lg:sticky lg:top-24">
            <LeadForm source={`kommun-${slug}`} kommun={namn} compact />
          </aside>
        </div>
      </div>
    </div>
  );
}
