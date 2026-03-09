import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAtgard, getAllAtgarder } from "@/lib/content";
import LeadForm from "@/components/LeadForm";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const atgarder = getAllAtgarder();
  return atgarder.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = getAtgard(slug);
  if (!data) return {};
  const { frontmatter: fm } = data;
  return {
    title: fm.title,
    description: fm.description,
    keywords: fm.keywords?.join(", "),
    alternates: { canonical: `https://bygglov24.se/atgard/${slug}` },
    openGraph: {
      title: fm.title,
      description: fm.description,
      type: "article",
      publishedTime: fm.publishedAt,
      modifiedTime: fm.updatedAt,
    },
  };
}

export default async function AtgardPage({ params }: Props) {
  const { slug } = await params;
  const data = getAtgard(slug);
  if (!data) notFound();

  const { frontmatter: fm, content } = data;

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

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: fm.title,
    description: fm.description,
    datePublished: fm.publishedAt,
    dateModified: fm.updatedAt || fm.publishedAt,
    publisher: { "@type": "Organization", name: "Bygglov24.se", url: "https://bygglov24.se" },
  };

  return (
    <>
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      <div className="py-10">
        <div className="container-wide">
          <div className="grid lg:grid-cols-[1fr_360px] gap-12 items-start">
            {/* Main content */}
            <article>
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
                <Link href="/" className="hover:text-brand-600 transition-colors">Hem</Link>
                <span>/</span>
                <Link href="/atgard" className="hover:text-brand-600 transition-colors">Åtgärdstyper</Link>
                <span>/</span>
                <span className="text-slate-900">{fm.title}</span>
              </nav>

              {/* Header */}
              <div className="mb-8">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className={`badge ${!fm.kravpaBuildlov ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                    {!fm.kravpaBuildlov ? "✓ Bygglov krävs ej" : "⚠ Kräver bygglov"}
                  </span>
                  {fm.maxStorlek && (
                    <span className="badge bg-brand-100 text-brand-700">Max {fm.maxStorlek}</span>
                  )}
                  {fm.handlaggning && (
                    <span className="badge bg-slate-100 text-slate-600">⏱ {fm.handlaggning}</span>
                  )}
                </div>
                <h1 className="font-display text-4xl font-bold text-slate-900 mb-4 leading-tight">{fm.title}</h1>
                <p className="text-lg text-slate-600 leading-relaxed">{fm.description}</p>
                {fm.updatedAt && (
                  <p className="text-xs text-slate-400 mt-3">
                    Uppdaterad {new Date(fm.updatedAt).toLocaleDateString("sv-SE", { year: "numeric", month: "long", day: "numeric" })}
                  </p>
                )}
              </div>

              {/* Quick facts */}
              {(fm.kostnad || fm.handlaggning || fm.maxStorlek) && (
                <div className="card p-6 mb-8 bg-brand-50 border-brand-100">
                  <h2 className="font-display font-semibold text-slate-900 mb-4 text-lg">Snabbfakta</h2>
                  <div className="grid sm:grid-cols-3 gap-4">
                    {fm.kostnad && (
                      <div>
                        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Kostnad</div>
                        <div className="font-semibold text-slate-900">{fm.kostnad}</div>
                      </div>
                    )}
                    {fm.handlaggning && (
                      <div>
                        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Handläggningstid</div>
                        <div className="font-semibold text-slate-900">{fm.handlaggning}</div>
                      </div>
                    )}
                    {fm.maxStorlek && (
                      <div>
                        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Max storlek</div>
                        <div className="font-semibold text-slate-900">{fm.maxStorlek}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* MDX body */}
              <div className="prose-bygglov">
                <MDXRemote source={content} />
              </div>

              {/* FAQ */}
              {fm.faq && fm.faq.length > 0 && (
                <div className="mt-12">
                  <h2 className="font-display text-2xl font-bold text-slate-900 mb-6">Vanliga frågor</h2>
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
              <LeadForm source={`atgard-${slug}`} atgard={fm.title} compact />

              <div className="card p-5">
                <h3 className="font-display font-semibold text-slate-900 mb-3">Hitta din kommuns regler</h3>
                <p className="text-sm text-slate-600 mb-4">Reglerna kan variera mellan kommuner. Sök upp din kommun för exakt information.</p>
                <Link href="/kommun" className="btn-secondary w-full justify-center text-sm py-2">
                  Sök kommuner →
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
