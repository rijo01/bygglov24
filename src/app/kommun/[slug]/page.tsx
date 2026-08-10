import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { getKommun, getAllKommuner, kommunGenitiv } from "@/lib/content";
import { getAtgarderGrid } from "@/lib/atgarder";
import LeadForm from "@/components/LeadForm";
import UtredningCta from "@/components/UtredningCta";
import { mdxComponents } from "@/components/mdx-components";
import { Icon } from "@/lib/icons";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const kommuner = getAllKommuner();
  return kommuner.map((k) => ({ slug: k.slug }));
}

/**
 * Title och description byggs i mallen – inte från frontmatter – så att alla
 * kommunsidor följer samma sökintent-mönster ("bygglov <kommun>", "bygglov
 * <kommun> kostnad", "tillbyggnad <kommun>") utan att 289 MDX-filer behöver
 * hållas i synk. Inga superlativ och inga belopp: avgiften sätts av kommunens
 * taxa och får inte utlovas här.
 */
function seoTitle(kommunNamn: string): string {
  return `Bygglov i ${kommunNamn} 2026 – regler, ansökan och kostnad`;
}

function seoDescription(kommunNamn: string): string {
  return (
    `Bygglov i ${kommunNamn} – vad som kräver lov enligt reglerna från 1 december 2025. ` +
    `Tillbyggnad, altan och attefallsåtgärder, ansökan steg för steg och vad det kostar.`
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = getKommun(slug);
  if (!data) return {};
  const { frontmatter: fm } = data;
  const title = seoTitle(fm.kommunNamn);
  const description = seoDescription(fm.kommunNamn);
  return {
    title,
    description,
    alternates: { canonical: `https://bygglov24.se/kommun/${slug}` },
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: fm.publishedAt,
      modifiedTime: fm.updatedAt,
    },
  };
}

export default async function KommunPage({ params }: Props) {
  const { slug } = await params;
  const data = getKommun(slug);
  if (!data) notFound();

  const { frontmatter: fm, content } = data;
  const atgarder = getAtgarderGrid();

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Hem", item: "https://bygglov24.se" },
      { "@type": "ListItem", position: 2, name: "Kommuner", item: "https://bygglov24.se/kommun" },
      { "@type": "ListItem", position: 3, name: fm.kommunNamn, item: `https://bygglov24.se/kommun/${slug}` },
    ],
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "GovernmentOffice",
    name: `${fm.kommunNamn} kommun – Byggnadsnämnden`,
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
        mainEntity: fm.faq.map((f: { question: string; answer: string }) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      }
    : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
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
                {fm.updatedAt && (
                  <p className="text-xs text-slate-600 mt-3">
                    Uppdaterad {new Date(fm.updatedAt).toLocaleDateString("sv-SE", { year: "numeric", month: "long", day: "numeric" })}
                  </p>
                )}
              </div>

              {/* Quick facts */}
              <div className="card p-6 mb-8 bg-brand-50 border-brand-100">
                <h2 className="font-display font-semibold text-slate-900 mb-4">Snabbinformation</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {/*
                    Handläggningstid och avgift är medvetet INTE kommunspecifika värden.
                    Tiden är den lagstadgade fristen i PBL 9 kap. 27 §; avgiften sätts av
                    varje kommuns egen taxa och får inte anges som ett belopp här.
                  */}
                  <div className="flex items-start gap-3">
                    <Icon name="clock" className="w-6 h-6 text-brand-600 shrink-0" />
                    <div>
                      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-0.5">Handläggningstid</div>
                      <div className="font-semibold text-slate-900 text-sm">Normalt inom 10 veckor</div>
                      <div className="text-xs text-slate-600 mt-0.5">från komplett ansökan (PBL 9 kap. 27 §)</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Icon name="coins" className="w-6 h-6 text-brand-600 shrink-0" />
                    <div>
                      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-0.5">Avgift</div>
                      <div className="font-semibold text-slate-900 text-sm">Enligt {kommunGenitiv(fm.kommunNamn)} bygglovstaxa</div>
                      <Link href="/kalkylator" className="text-xs text-brand-600 hover:text-brand-800 underline mt-0.5 inline-block">
                        Uppskatta kostnaden
                      </Link>
                    </div>
                  </div>
                  {fm.telefonByggnadskontor && (
                    <div className="flex items-start gap-3">
                      <Icon name="phone" className="w-6 h-6 text-brand-600 shrink-0" />
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
                      <Icon name="globe" className="w-6 h-6 text-brand-600 shrink-0" />
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
                <MDXRemote source={content} components={mdxComponents} options={{ blockJS: false, mdxOptions: { remarkPlugins: [remarkGfm] } }} />
              </div>

              {/* FAQ */}
              {fm.faq && fm.faq.length > 0 && (
                <div className="mt-12">
                  <h2 className="font-display text-2xl font-bold text-slate-900 mb-6">
                    Vanliga frågor om bygglov i {fm.kommunNamn}
                  </h2>
                  <div className="space-y-4">
                    {fm.faq.map((f: { question: string; answer: string }, i: number) => (
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

              <UtredningCta />
            </article>

            {/* Sidebar */}
            <aside className="lg:sticky lg:top-24 space-y-5">
              <LeadForm source={`kommun-${slug}`} kommun={fm.kommunNamn} compact />

              {/*
                Åtgärdslistan drivs av getAtgarderGrid() i stället för en handplockad
                lista, så att varje ny /atgard/-sida länkas in från alla kommunsidor
                automatiskt i stället för att bli osynlig.
              */}
              <div className="card p-5">
                <h3 className="font-display font-semibold text-slate-900 mb-3">
                  Åtgärder – vad gäller i {fm.kommunNamn}?
                </h3>
                <div className="space-y-2">
                  {atgarder.map((a) => (
                    <Link key={a.slug} href={`/atgard/${a.slug}`} className="flex items-center gap-2 text-sm text-slate-700 hover:text-brand-700 py-1 transition-colors">
                      <span className="text-brand-500">→</span> {a.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="card p-5">
                <h3 className="font-display font-semibold text-slate-900 mb-3">Guider</h3>
                <div className="space-y-2">
                  {[
                    { href: "/guide/ansokan", label: "Ansöka om bygglov" },
                    { href: "/guide/nya-regler-2026", label: "Nya regler 2026" },
                    { href: "/guide/kostnad", label: "Vad kostar bygglov?" },
                    { href: "/guide/detaljplan", label: "Förstå detaljplanen" },
                    { href: "/guide/byggsanktionsavgift", label: "Byggsanktionsavgift" },
                    { href: "/guide/bygglov-i-efterhand", label: "Bygglov i efterhand" },
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
