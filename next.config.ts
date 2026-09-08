import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],
  images: {
    formats: ["image/webp"],
  },
  async redirects() {
    return [
      // Kanonisk värd: www -> apex (non-www). Kodnivå-skydd utöver Vercels primary domain
      // så att SEO-signalerna konsolideras till https://bygglov24.se.
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.bygglov24.se" }],
        destination: "https://bygglov24.se/:path*",
        permanent: true,
      },
      // Fånga gammal länkkraft från tidigare ägare: /bygglov-<kommun> -> /kommun/<kommun>.
      // Inga befintliga routes börjar på /bygglov-, så mönstret krockar inte.
      {
        source: "/bygglov-:slug",
        destination: "/kommun/:slug",
        permanent: true,
      },
      // Konsoliderad dubblettguide: gammal lång slug -> kanonisk kort slug.
      // Fångar Googles index och ev. externa länkar till den raderade filen.
      {
        source: "/guide/nya-bygglovsregler-2025-2026",
        destination: "/guide/nya-regler-2026",
        permanent: true,
      },

      // ── Kannibaliseringssaneringen ──────────────────────────────────────
      // Tre par konkurrerade om samma sökintent. Den starkare sidan (mest
      // innehåll och inlänkar) behölls, unikt innehåll flyttades in, och den
      // svagare 301:as hit. statusCode 301 i stället för permanent: true
      // (=308) enligt uttrycklig begäran; båda är permanenta och likvärdiga
      // för Google, 308 bevarar dessutom HTTP-metoden.
      //   kostnad-bygglov (0 inlänkar) -> kostnad (292 inlänkar)
      {
        source: "/guide/kostnad-bygglov",
        destination: "/guide/kostnad",
        statusCode: 301,
      },
      //   strandskyddsdispens-2026 (2 inlänkar) -> strandskydd (267 inlänkar)
      {
        source: "/guide/strandskyddsdispens-2026",
        destination: "/guide/strandskydd",
        statusCode: 301,
      },
      //   pool-spa-bygglov-2026 (749 ord) -> villapool-bygglov-2026 (1816 ord)
      {
        source: "/guide/pool-spa-bygglov-2026",
        destination: "/guide/villapool-bygglov-2026",
        statusCode: 301,
      },

      // ── URL-hygien ──────────────────────────────────────────────────────
      // Slugen innehöll ett "ä", vilket ger procent-kodade URL:er i sitemap,
      // canonical och externa länkar. Filen är omdöpt till ASCII; ä-formen
      // 308:as hit. Källan måste skrivas avkodad – Next matchar mot den
      // avkodade sökvägen.
      {
        source: "/guide/uteplats-skärmtak-regler-2026",
        destination: "/guide/uteplats-skarmtak-regler-2026",
        permanent: true,
      },
      {
        source: "/guide/uteplats-sk%C3%A4rmtak-regler-2026",
        destination: "/guide/uteplats-skarmtak-regler-2026",
        permanent: true,
      },

      // /atgard/skarmtak har aldrig funnits som sida (404). Skärmtak är sedan
      // 1 dec 2025 inte en egen åtgärd utan prövas som tillbyggnad enligt
      // 9 kap. 10 § PBL, så URL:en pekas till åtgärdssidan för tillbyggnad.
      // Inga interna länkar pekar hit; redirecten fångar externa länkar och
      // gissade URL:er tills en granskad skärmtakssida eventuellt finns.
      {
        source: "/atgard/skarmtak",
        destination: "/atgard/tillbyggnad",
        permanent: false,
      },
      {
        source: "/atgard/skärmtak",
        destination: "/atgard/tillbyggnad",
        permanent: false,
      },

      // Åtgärdssidorna svarade på BÅDE /atgard/<slug> och /guide/<slug>, där
      // /guide-varianten pekade tillbaka med canonical. En canonical är ett
      // förslag; en 308 är ett besked. Dubbletten är därför borttagen ur
      // guide-routen och redirectas i stället.
      {
        source: "/guide/:slug(attefallsatgard|tillbyggnad|carport-garage|altan-uteplats|friggebod|plank-mur|solpaneler)",
        destination: "/atgard/:slug",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
