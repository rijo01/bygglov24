import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";

export const metadata: Metadata = {
  metadataBase: new URL("https://bygglov24.se"),
  title: {
    template: "%s | Bygglov24.se",
    default: "Bygglov24.se – Din guide till bygglov i Sverige",
  },
  description:
    "Allt du behöver veta om bygglov. Ansök rätt, förstå reglerna och hitta godkänd bygglovskonsult nära dig. Guides för alla 290 kommuner i Sverige.",
  openGraph: {
    siteName: "Bygglov24.se",
    locale: "sv_SE",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: "https://bygglov24.se",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/favicon.svg",
  },
};

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Bygglov24.se",
  url: "https://bygglov24.se",
  logo: "https://bygglov24.se/logo.svg",
  description:
    "Sveriges mest kompletta guide till bygglov – ansökningsprocess, regler och konsulter för alla 290 kommuner.",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    availableLanguage: "Swedish",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sv">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#fafcff]">
        <GoogleAnalytics />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
