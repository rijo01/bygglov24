import type { Metadata } from "next";
import Link from "next/link";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

export const metadata: Metadata = {
  title: "Guider om bygglov – Allt du behöver veta",
  description:
    "Kompletta guider om bygglov i Sverige. Ansökan, kostnader, nya regler 2026, strandskydd, kontrollansvarig, detaljplan och mer.",
  alternates: { canonical: "https://bygglov24.se/guide" },
};

interface Guide {
  slug: string;
  title: string;
  description: string;
  publishedAt?: string;
  updatedAt?: string;
}

function getAllGuides(): Guide[] {
  const dir = path.join(process.cwd(), "content", "guider");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(dir, file), "utf-8");
      const { data } = matter(raw);
      return {
        slug: file.replace(".mdx", ""),
        title: data.title || file.replace(".mdx", ""),
        description: data.description || "",
        publishedAt: data.publishedAt,
        updatedAt: data.updatedAt,
      };
    })
    .sort((a, b) => {
      const da = a.updatedAt || a.publishedAt || "";
      const db = b.updatedAt || b.publishedAt || "";
      return db.localeCompare(da);
    });
}

const guideIcons: Record<string, string> = {
  ansokan: "📝",
  kostnad: "💰",
  "nya-regler-2026": "⚖️",
  kontrollansvarig: "👷",
  detaljplan: "🗺️",
  strandskydd: "🏖️",
  "bygga-utan-bygglov": "🏗️",
  "overklaga-bygglov": "⚠️",
  byggsanktionsavgift: "💸",
};

export default function GuideIndexPage() {
  const guides = getAllGuides();

  return (
    <div className="py-12">
      <div className="container-content mb-10">
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <Link href="/" className="hover:text-brand-600 transition-colors">Hem</Link>
          <span>/</span>
          <span className="text-slate-900">Guider</span>
        </nav>
        <h1 className="font-display text-4xl font-bold text-slate-900 mb-4">
          Guider om bygglov
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl">
          Allt du behöver veta om bygglov – från ansökan till slutbesked. Våra guider täcker regler, kostnader, processer och vanliga fallgropar.
        </p>
      </div>

      <div className="container-wide">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {guides.map((guide) => (
            <Link
              key={guide.slug}
              href={`/guide/${guide.slug}`}
              className="card p-6 hover:shadow-md hover:border-brand-200 transition-all group"
            >
              <div className="text-3xl mb-3">{guideIcons[guide.slug] || "📖"}</div>
              <h2 className="font-display font-semibold text-slate-900 text-base group-hover:text-brand-700 transition-colors mb-2">
                {guide.title}
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
                {guide.description}
              </p>
              {guide.updatedAt && (
                <p className="text-xs text-slate-400 mt-3">
                  Uppdaterad{" "}
                  {new Date(guide.updatedAt).toLocaleDateString("sv-SE", {
                    year: "numeric",
                    month: "short",
                  })}
                </p>
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="container-content mt-12">
        <div className="card p-8 bg-brand-50 border-brand-100 text-center">
          <h2 className="font-display text-2xl font-bold text-slate-900 mb-3">
            Osäker på vad som gäller?
          </h2>
          <p className="text-slate-600 mb-6 max-w-lg mx-auto">
            En lokal bygglovskonsult kan svara på dina specifika frågor och hjälpa dig hela vägen.
          </p>
          <Link href="/konsult" className="btn-primary">
            Få kostnadsfri konsultation →
          </Link>
        </div>
      </div>
    </div>
  );
}
