import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Kontakta oss – Bygglov24",
  description:
    "Kontakta Bygglov24 – Sveriges mest kompletta guide till bygglov. Mejla info@bygglov24.se så svarar vi inom 24 timmar.",
  alternates: { canonical: "https://bygglov24.se/kontakt" },
};

export default function KontaktPage() {
  return (
    <div className="bg-gradient-to-b from-brand-50 to-white py-16">
      <div className="container-content">
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <Link href="/" className="hover:text-brand-600 transition-colors">Hem</Link>
          <span>/</span>
          <span className="text-slate-900">Kontakt</span>
        </nav>

        <div className="text-center mb-12">
          <span className="badge bg-brand-100 text-brand-700 mb-4">Svar inom 24h</span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-slate-900 mb-5 leading-tight">
            Kontakta oss
          </h1>
          <p className="text-lg text-slate-600 max-w-xl mx-auto">
            Har du en fråga om bygglov, vill samarbeta eller har feedback? Hör av dig — vi svarar normalt inom en arbetsdag.
          </p>
        </div>

        <div className="card p-8 sm:p-10 text-center">
          <div className="w-14 h-14 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M3 8L12 13L21 8M5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19Z" stroke="#0058a0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2 className="font-display text-2xl font-bold text-slate-900 mb-2">Mejla oss</h2>
          <p className="text-slate-600 mb-6 text-sm">
            Skicka ett mejl med din fråga så återkommer vi så snart vi kan — normalt inom 24 timmar på vardagar.
          </p>
          <a
            href="mailto:info@bygglov24.se"
            className="btn-primary inline-flex"
          >
            info@bygglov24.se
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M1 8H15M9 2L15 8L9 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </a>
        </div>

        <div className="card p-6 mt-6 bg-slate-50 border-slate-200">
          <h3 className="font-display font-semibold text-slate-900 mb-2">Söker du bygglovshjälp?</h3>
          <p className="text-sm text-slate-600 mb-4">
            För konkret hjälp med bygglovsansökan – använd vår kostnadsfria matchning med lokala bygglovskonsulter.
          </p>
          <Link href="/konsult" className="btn-secondary text-sm">
            Få kostnadsfri konsultation →
          </Link>
        </div>
      </div>
    </div>
  );
}
