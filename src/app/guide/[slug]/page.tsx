import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import LeadForm from "@/components/LeadForm";
import UtredningCta from "@/components/UtredningCta";
import { getAtgarderGrid } from "@/lib/atgarder";
import { mdxComponents } from "@/components/mdx-components";

interface GuideFrontmatter {
  title: string;
  slug: string;
  description: string;
  keywords?: string[];
  publishedAt?: string;
  updatedAt?: string;
  faq?: { question: string; answer: string }[];
}

const guidesDir = path.join(process.cwd(), "content", "guider");
const atgarderDir = path.join(process.cwd(), "content", "atgarder");

type GuideSource = "guider" | "atgarder";

function getGuide(
  slug: string
): { frontmatter: GuideFrontmatter; content: string; source: GuideSource } | null {
  const dirs: { path: string; source: GuideSource }[] = [
    { path: guidesDir, source: "guider" },
    { path: atgarderDir, source: "atgarder" },
  ];
  for (const { path: dir, source } of dirs) {
    const filePath = path.join(dir, `${slug}.mdx`);
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(raw);
      return { frontmatter: data as GuideFrontmatter, content, source };
    }
  }
  return null;
}

function canonicalFor(slug: string, source: GuideSource): string {
  return source === "atgarder"
    ? `https://bygglov24.se/atgard/${slug}`
    : `https://bygglov24.se/guide/${slug}`;
}

function getAllGuides(): GuideFrontmatter[] {
  const seen = new Set<string>();
  const result: GuideFrontmatter[] = [];
  for (const dir of [guidesDir, atgarderDir]) {
    if (!fs.existsSync(dir)) continue;
    for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"))) {
      const slug = file.replace(".mdx", "");
      if (seen.has(slug)) continue;
      seen.add(slug);
      const raw = fs.readFileSync(path.join(dir, file), "utf-8");
      const { data } = matter(raw);
      result.push({ ...(data as GuideFrontmatter), slug });
    }
  }
  return result;
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const guides = getAllGuides();
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = getGuide(slug);
  if (!data) return {};
  const { frontmatter: fm, source } = data;
  return {
    title: fm.title,
    description: fm.description,
    keywords: fm.keywords?.join(", "),
    alternates: { canonical: canonicalFor(slug, source) },
    openGraph: {
      title: fm.title,
      description: fm.description,
      type: "article",
      publishedTime: fm.publishedAt,
      modifiedTime: fm.updatedAt,
    },
  };
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const data = getGuide(slug);
  if (!data) notFound();

  const { frontmatter: fm, content, source } = data;
  const canonical = canonicalFor(slug, source);

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

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: fm.title,
    description: fm.description,
    datePublished: fm.publishedAt,
    dateModified: fm.updatedAt || fm.publishedAt,
    mainEntityOfPage: canonical,
    publisher: { "@type": "Organization", name: "Bygglov24.se", url: "https://bygglov24.se" },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Hem", item: "https://bygglov24.se" },
      { "@type": "ListItem", position: 2, name: "Guider", item: "https://bygglov24.se/guide" },
      { "@type": "ListItem", position: 3, name: fm.title, item: canonical },
    ],
  };

  return (
    <>
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="py-10">
        <div className="container-wide">
          <div className="grid lg:grid-cols-[1fr_360px] gap-12 items-start">
            <article>
              <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
                <Link href="/" className="hover:text-brand-600 transition-colors">Hem</Link>
                <span>/</span>
                <Link href="/guide" className="hover:text-brand-600 transition-colors">Guider</Link>
                <span>/</span>
                <span className="text-slate-900">{fm.title}</span>
              </nav>

              <div className="mb-8">
                <h1 className="font-display text-4xl font-bold text-slate-900 mb-4 leading-tight">{fm.title}</h1>
                <p className="text-lg text-slate-600 leading-relaxed">{fm.description}</p>
                {fm.updatedAt && (
                  <p className="text-xs text-slate-600 mt-3">
                    Uppdaterad {new Date(fm.updatedAt).toLocaleDateString("sv-SE", { year: "numeric", month: "long", day: "numeric" })}
                  </p>
                )}
              </div>

              <div className="prose-bygglov">
                <MDXRemote source={content} components={mdxComponents} options={{ blockJS: false, mdxOptions: { remarkPlugins: [remarkGfm] } }} />
              </div>

              {fm.faq && fm.faq.length > 0 && (
                <div className="mt-12">
                  <h2 className="font-display text-2xl font-bold text-slate-900 mb-6">Vanliga frågor</h2>
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

            <aside className="lg:sticky lg:top-24 space-y-5">
              <LeadForm source={`guide-${slug}`} compact />
              {/* Drivs av getAtgarderGrid() så att alla åtgärdssidor länkas in, inte bara fyra. */}
              <div className="card p-5">
                <h3 className="font-display font-semibold text-slate-900 mb-3">Åtgärdstyper</h3>
                <div className="space-y-2">
                  {getAtgarderGrid().map((a) => (
                    <Link key={a.slug} href={`/atgard/${a.slug}`} className="block text-sm text-brand-700 hover:text-brand-900 hover:underline">
                      {a.label} →
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
