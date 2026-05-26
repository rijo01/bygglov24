import type { Metadata } from "next";
import Link from "next/link";
import Calculator from "./Calculator";

export const metadata: Metadata = {
  title: "Bygglovskalkylator – Vad kostar ditt bygglov 2026?",
  description:
    "Snabb och kostnadsfri uppskattning av kommunavgift och konsultarvode för bygglov, attefallsanmälan, tillbyggnad, garage och rivningslov. Riksgenomsnitt 2026 – välj din åtgärdstyp.",
  keywords: [
    "bygglovskalkylator",
    "vad kostar bygglov",
    "kommunavgift bygglov",
    "konsultarvode bygglov",
    "attefallsanmälan kostnad",
    "tillbyggnad pris",
    "bygglov pris 2026",
  ],
  alternates: { canonical: "https://bygglov24.se/kalkylator" },
  openGraph: {
    title: "Bygglovskalkylator – Vad kostar ditt bygglov 2026?",
    description:
      "Räkna ut uppskattad kommunavgift och konsultarvode för ditt bygglov. Riksgenomsnitt för 7 vanligaste åtgärdstyperna.",
    type: "website",
  },
};

const faq = [
  {
    question: "Vad kostar ett bygglov i Sverige 2026?",
    answer:
      "Kostnaden består av kommunavgift (taxa) och eventuellt konsultarvode. För en attefallsanmälan ligger riksgenomsnittet på 2 500–8 000 kr i kommunavgift. En tillbyggnad på 15–30 m² kostar typiskt 5 000–25 000 kr i kommunavgift, medan en nybyggnation av enbostadshus kan kosta 20 000–90 000 kr.",
  },
  {
    question: "Varför varierar kommunavgiften så mycket?",
    answer:
      "Kommunerna sätter sina egna taxor baserat på prisbasbeloppet och åtgärdens omfattning. Storstadskommuner har generellt högre taxor än mindre kommuner. Tilläggsavgifter kan tillkomma för planavvikande lov, strandskyddsdispens eller särskild handläggning.",
  },
  {
    question: "Vad ingår i konsultarvodet?",
    answer:
      "Ett typiskt paketpris hos en lokal bygglovskonsult inkluderar ritningar (situations-, plan-, fasad- och sektionsritning), kontrollplan, ansökningsblankett, kommunikation med byggnadsnämnden och uppföljning. Kontrollansvarig debiteras vanligen separat.",
  },
  {
    question: "Måste jag anlita en bygglovskonsult?",
    answer:
      "Nej, du kan göra ansökan själv. Men för tillbyggnader, nybyggnationer eller åtgärder som kräver kontrollansvarig är konsulthjälp ofta en god investering. Avslag på bygglov leder ofta till längre väntetid och högre totalkostnad än om en konsult anlitats från start.",
  },
  {
    question: "Är priserna i kalkylatorn bindande?",
    answer:
      "Nej, kalkylatorn ger en uppskattning baserad på riksgenomsnitt 2026. Den faktiska kommunavgiften framgår av din kommuns aktuella taxa, och konsultarvodet sätts av den enskilda konsulten. Begär alltid en bindande offert innan du beställer arbete.",
  },
  {
    question: "Vad är skillnaden mellan attefallsanmälan och tillbyggnad?",
    answer:
      "Sedan PBL-reformen 1 december 2025 är begreppet attefallsanmälan strikt sett borttaget. Bygglovsbefriad komplementbyggnad och komplementbostadshus ersätter de gamla begreppen. Lovfri tillbyggnad upp till 30 m² inom detaljplan är fortsatt möjlig och ingår i en gemensam pott per tomt.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: { "@type": "Answer", text: f.answer },
  })),
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Hem", item: "https://www.bygglov24.se" },
    { "@type": "ListItem", position: 2, name: "Bygglovskalkylator", item: "https://www.bygglov24.se/kalkylator" },
  ],
};

export default function KalkylatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="bg-gradient-to-b from-brand-50 to-white py-14">
        <div className="container-wide">
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
            <Link href="/" className="hover:text-brand-600 transition-colors">Hem</Link>
            <span>/</span>
            <span className="text-slate-900">Bygglovskalkylator</span>
          </nav>

          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="badge bg-brand-100 text-brand-700 mb-4">Kostnadsfritt verktyg</span>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-slate-900 mb-5 leading-tight">
              Vad kostar ditt bygglov 2026?
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed">
              Räkna ut uppskattad kommunavgift och konsultarvode för din åtgärd.
              Riksgenomsnitt för de sju vanligaste åtgärdstyperna.
            </p>
          </div>

          <Calculator />

          <div className="mt-16 max-w-3xl mx-auto">
            <h2 className="font-display text-2xl font-bold text-slate-900 mb-6">Vanliga frågor</h2>
            <div className="space-y-4">
              {faq.map((f, i) => (
                <details key={i} className="card p-5 group">
                  <summary className="font-semibold text-slate-900 cursor-pointer list-none flex items-center justify-between gap-3">
                    {f.question}
                    <svg className="w-4 h-4 text-slate-400 group-open:rotate-180 transition-transform shrink-0" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path d="M3 6L8 11L13 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </summary>
                  <p className="text-slate-600 mt-3 text-sm leading-relaxed">{f.answer}</p>
                </details>
              ))}
            </div>
          </div>

          <div className="mt-16 max-w-3xl mx-auto card p-6 lg:p-8 text-center bg-brand-50 border-brand-100">
            <h2 className="font-display text-xl font-bold text-slate-900 mb-3">
              Vill du ha en bindande offert?
            </h2>
            <p className="text-slate-600 mb-6 max-w-xl mx-auto">
              Vi matchar dig med en lokal bygglovskonsult som ger en konkret offert
              baserat på just din kommun, din tomt och ditt projekt. Kostnadsfritt –
              svar inom 24 timmar.
            </p>
            <Link href="/konsult" className="btn-primary">
              Begär konsultmatchning
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M1 7H13M8 2L13 7L8 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
