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
    ];
  },
};

export default nextConfig;
