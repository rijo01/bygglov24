import fs from "fs";
import path from "path";
import matter from "gray-matter";

const contentDir = path.join(process.cwd(), "content");

/** Normalize a Swedish municipality name to its ASCII route slug (å/ä→a, ö→o). */
export function normalizeKommunSlug(namn: string): string {
  return namn
    .toLowerCase()
    .replace(/å/g, "a")
    .replace(/ä/g, "a")
    .replace(/ö/g, "o")
    .replace(/é/g, "e")
    .replace(/\s+/g, "-");
}

/**
 * Svensk genitiv av ett kommunnamn: "Uppsala" → "Uppsalas", men namn som redan
 * slutar på s/x/z får ingen extra genitiv-s ("Alingsås", "Kalix", "Västerås").
 */
export function kommunGenitiv(namn: string): string {
  return /[sxz]$/i.test(namn) ? namn : `${namn}s`;
}

/**
 * Indexeringsgrind. Sidor är noindex tills de uttryckligen frisläppts med
 * `indexera: true` i frontmatter — whitelist, inte blacklist, så att nya eller
 * mallgenererade MDX-filer aldrig kan hamna i indexet av misstag. Alltid
 * `follow`, så att länkkraft och crawl fortsätter passera genom sidorna.
 *
 * Samma predikat styr sitemap.ts, så sitemapen per definition bara innehåller
 * indexerbara URL:er.
 */
export function arIndexerbar(fm: { indexera?: boolean }): boolean {
  return fm.indexera === true;
}

export function robotsFor(fm: { indexera?: boolean }) {
  return arIndexerbar(fm)
    ? { index: true, follow: true }
    : { index: false, follow: true };
}

export interface AtgardFrontmatter {
  title: string;
  /** Se robotsFor(): sidan indexeras bara när denna är true. */
  indexera?: boolean;
  slug: string;
  description: string;
  kravpaBuildlov: boolean;
  maxStorlek?: string;
  handlaggning?: string;
  kostnad?: string;
  keywords: string[];
  publishedAt: string;
  updatedAt?: string;
  faq?: { question: string; answer: string }[];
}

export interface KommunFrontmatter {
  title: string;
  /** Se robotsFor(): sidan indexeras bara när denna är true. */
  indexera?: boolean;
  slug: string;
  kommunNamn: string;
  lan: string;
  description: string;
  telefonByggnadskontor?: string;
  webbplatsByggnadskontor?: string;
  publishedAt: string;
  updatedAt?: string;
  faq?: { question: string; answer: string }[];
}

export interface GuideFrontmatter {
  title: string;
  /** Se robotsFor(): sidan indexeras bara när denna är true. */
  indexera?: boolean;
  slug: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  keywords?: string[];
  faq?: { question: string; answer: string }[];
}

// ── Guider ───────────────────────────────────────────────────────────────────

export function getAllGuider(): (GuideFrontmatter & { slug: string })[] {
  const dir = path.join(contentDir, "guider");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(dir, file), "utf-8");
      const { data } = matter(raw);
      return { ...(data as GuideFrontmatter), slug: file.replace(".mdx", "") };
    })
    .sort((a, b) => a.title.localeCompare(b.title, "sv"));
}

// ── Åtgärder ──────────────────────────────────────────────────────────────────

export function getAllAtgarder(): (AtgardFrontmatter & { slug: string })[] {
  const dir = path.join(contentDir, "atgarder");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(dir, file), "utf-8");
      const { data } = matter(raw);
      return { ...(data as AtgardFrontmatter), slug: file.replace(".mdx", "") };
    })
    .sort((a, b) => a.title.localeCompare(b.title, "sv"));
}

export function getAtgard(slug: string): { frontmatter: AtgardFrontmatter; content: string } | null {
  const filePath = path.join(contentDir, "atgarder", `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return { frontmatter: data as AtgardFrontmatter, content };
}

// ── Kommuner ──────────────────────────────────────────────────────────────────

export function getAllKommuner(): (KommunFrontmatter & { slug: string })[] {
  const dir = path.join(contentDir, "kommuner");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(dir, file), "utf-8");
      const { data } = matter(raw);
      return { ...(data as KommunFrontmatter), slug: file.replace(".mdx", "") };
    })
    .sort((a, b) => a.kommunNamn.localeCompare(b.kommunNamn, "sv"));
}

export function getKommun(slug: string): { frontmatter: KommunFrontmatter; content: string } | null {
  const filePath = path.join(contentDir, "kommuner", `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return { frontmatter: data as KommunFrontmatter, content };
}
