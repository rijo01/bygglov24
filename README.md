# bygglov24.se

Sveriges mest kompletta guide till bygglov – 290 kommuner, alla åtgärdstyper, lead-gen till bygglovskonsulter.

## Stack
- **Next.js 15** + TypeScript + App Router
- **Tailwind CSS** – custom design system
- **gray-matter** – MDX frontmatter parsing
- **next-mdx-remote** – MDX rendering
- **Resend** – transaktionell e-post (leads)
- **Vercel** – hosting + auto-deploy

## Struktur
```
src/
  app/
    page.tsx              # Startsida
    atgard/
      page.tsx            # Lista alla åtgärder
      [slug]/page.tsx     # Dynamisk åtgärdssida
    kommun/
      page.tsx            # Lista alla kommuner
      [slug]/page.tsx     # Dynamisk kommunsida
    konsult/page.tsx      # Lead gen-sida
    api/lead/route.ts     # Resend API
  components/
    Header.tsx
    Footer.tsx
    LeadForm.tsx
  lib/
    content.ts            # gray-matter utilities

content/
  atgarder/              # MDX per åtgärdstyp
  kommuner/              # MDX per kommun (290 st)
```

## Setup

```bash
npm install
cp .env.local.example .env.local
# Fyll i RESEND_API_KEY och LEAD_EMAIL

npm run dev
```

## Miljövariabler

```
RESEND_API_KEY=re_...
LEAD_EMAIL=leads@bygglov24.se
NEXT_PUBLIC_SITE_URL=https://bygglov24.se
```

## Vercel Deploy

1. Push till GitHub (rijo01/bygglov24)
2. Importera i Vercel
3. Sätt miljövariabler
4. Sätt A-record: `76.76.21.21`
5. Sätt CNAME www: `cname.vercel-dns.com`

## MaxiAI Content Pipeline

Se `MAXIAI_PROMPT.md` för komplett systemprompt.

**Schema:** 5 MDX-filer/dag kl 08:00 vardagar
**Prioritet:** kommuner (hög sökvolym) + åtgärdstyper (hög intent)

### MDX Frontmatter

**Åtgärd:**
```yaml
title, slug, description, kravpaBuildlov, maxStorlek, handlaggning, kostnad, keywords[], publishedAt, updatedAt, faq[]
```

**Kommun:**
```yaml
title, slug, kommunNamn, lan, description, telefonByggnadskontor, webbplatsByggnadskontor, handlaggningstid, avgiftEnkel, publishedAt, updatedAt, faq[]
```

## Monetisering

**Primär:** Leads till bygglovskonsulter via `/konsult` och inline-formulär
- Lead-värde: 500–2 000 kr/lead
- Formulär: namn, e-post, telefon, meddelande
- Leverans: Resend → `LEAD_EMAIL`

**Sekundär (fas 2):** Display-ads via AdSense när trafiken tar fart

## SEO-arkitektur

- **Silo 1:** `/atgard/*` – åtgärdstyper (informationssökning)
- **Silo 2:** `/kommun/*` – kommunguider (lokal sökning)
- **Silo 3:** `/guide/*` – proceduriella guider
- Intern länkning: varje sida länkar till 3+ relaterade sidor
- JSON-LD: WebSite, Organization, Article, FAQPage, LocalBusiness
- Sitemap: automatisk via `/sitemap.xml`
