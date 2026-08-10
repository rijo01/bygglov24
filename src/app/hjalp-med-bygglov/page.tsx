import type { Metadata } from "next";
import Link from "next/link";
import LeadForm from "@/components/LeadForm";
import { Icon } from "@/lib/icons";

export const metadata: Metadata = {
  // absolute: layoutens "%s | Bygglov24.se"-mall ska inte läggas på här.
  title: { absolute: "Hjälp med bygglov – utredning, handlingar och ansökan | Bygglov24" },
  description:
    "Vi hjälper privatpersoner och företag att reda ut om bygglov krävs, ta fram underlag och driva ansökan mot kommunen. Bygglovsutredning till fast pris.",
  alternates: { canonical: "https://bygglov24.se/hjalp-med-bygglov" },
  openGraph: {
    title: "Hjälp med bygglov – utredning, handlingar och ansökan",
    description:
      "Vi hjälper privatpersoner och företag att reda ut om bygglov krävs, ta fram underlag och driva ansökan mot kommunen.",
    type: "website",
  },
};

const utredningIngar = [
  "Klassning av projektet – krävs bygglov, anmälan eller ingetdera?",
  "Kontroll mot detaljplan och byggrätt för din fastighet",
  "Strandskydds- och kulturmiljökoll",
  "Skriftlig rekommendation",
];

export default function HjalpMedBygglovPage() {
  return (
    <div className="py-12">
      <div className="container-wide">
        <div className="grid lg:grid-cols-[1fr_400px] gap-12 items-start">
          <article>
            <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
              <Link href="/" className="hover:text-brand-600 transition-colors">Hem</Link>
              <span>/</span>
              <span className="text-slate-900">Hjälp med bygglov</span>
            </nav>

            <h1 className="font-display text-4xl font-bold text-slate-900 mb-5 leading-tight">
              Hjälp med bygglov
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed mb-10">
              Vi hjälper privatpersoner och företag att reda ut om bygglov krävs, ta fram underlag
              och driva ansökan mot kommunen.
            </p>

            {/* Tjänst 1 */}
            <div className="card p-7 mb-6">
              <div className="flex flex-wrap items-baseline justify-between gap-3 mb-4">
                <h2 className="font-display text-2xl font-bold text-slate-900">
                  Bygglovsutredning
                </h2>
                <span className="badge bg-brand-100 text-brand-700">Fast pris 2 950 kr</span>
              </div>
              <ul className="space-y-3 mb-5">
                {utredningIngar.map((punkt) => (
                  <li key={punkt} className="flex items-start gap-3 text-slate-700">
                    <Icon name="circle-check" className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
                    <span>{punkt}</span>
                  </li>
                ))}
              </ul>
              <div className="flex items-center gap-2 text-sm text-slate-600 pt-4 border-t border-slate-100">
                <Icon name="clock" className="w-4 h-4 text-brand-600 shrink-0" />
                Leverans inom fem arbetsdagar.
              </div>
            </div>

            {/* Tjänst 2 */}
            <div className="card p-7 mb-8">
              <div className="flex flex-wrap items-baseline justify-between gap-3 mb-4">
                <h2 className="font-display text-2xl font-bold text-slate-900">
                  Bygglovshandlingar och ansökan
                </h2>
                <span className="badge bg-slate-100 text-slate-700">Offert efter utredning</span>
              </div>
              <p className="text-slate-700 leading-relaxed">
                Vi tar fram handlingarna och driver ansökan mot kommunen. Omfattningen beror på
                projektet, därför lämnar vi offert först när utredningen är gjord.
              </p>
            </div>

            {/* Disclaimer – obligatorisk och synlig */}
            <div className="card p-5 bg-amber-50 border-amber-200">
              <div className="flex items-start gap-3">
                <Icon name="triangle-alert" className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-sm text-slate-800 leading-relaxed">
                  Utredningen är vägledning och underlag — det bindande beskedet ges alltid av
                  kommunens byggnadsnämnd.
                </p>
              </div>
            </div>
          </article>

          <aside className="lg:sticky lg:top-24">
            <LeadForm
              source="tjanstesida"
              freeOffer={false}
              heading="Beskriv ditt projekt"
              intro="Berätta vad du planerar och var fastigheten ligger, så återkommer vi med vad som behövs och vad det kostar."
            />
          </aside>
        </div>
      </div>
    </div>
  );
}
