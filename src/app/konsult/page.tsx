import type { Metadata } from "next";
import LeadForm from "@/components/LeadForm";

export const metadata: Metadata = {
  title: "Hitta bygglovskonsult – Kostnadsfri matchning",
  description:
    "Matchas med en lokal bygglovskonsult i din kommun. Kostnadsfri offert. Svar inom 24 timmar. Godkända konsulter som känner ditt kommunala regelverk.",
  alternates: { canonical: "https://bygglov24.se/konsult" },
};

const fordelar = [
  { icon: "🎯", title: "Lokal expertis", text: "Konsulterna känner din kommuns byggnadsnämnd och detaljplaner." },
  { icon: "⚡", title: "Snabbare process", text: "Rätt handlingar från start = kortare handläggningstid." },
  { icon: "✅", title: "Högre godkännandegrad", text: "Professionella ansökningar avslås sällan." },
  { icon: "💰", title: "Kostnadskontroll", text: "Fast pris eller timarvode – du väljer. Offert utan förpliktelser." },
];

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Bygglovskonsult – kostnadsfri matchning",
  description: "Vi matchar dig med en lokal bygglovskonsult för din kommun. Kostnadsfri offert.",
  provider: { "@type": "Organization", name: "Bygglov24.se" },
  areaServed: { "@type": "Country", name: "Sverige" },
  serviceType: "Bygglovskonsultation",
};

export default function KonsultPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />

      <div className="bg-gradient-to-b from-brand-50 to-white py-16">
        <div className="container-content text-center mb-14">
          <span className="badge bg-brand-100 text-brand-700 mb-4">Kostnadsfritt</span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-slate-900 mb-5 leading-tight">
            Få hjälp av en lokal<br />bygglovskonsult
          </h1>
          <p className="text-lg text-slate-600 max-w-xl mx-auto">
            Vi matchar dig med en erfaren konsult som känner reglerna i just din kommun. Kostnadsfri bedömning – svar inom 24 timmar.
          </p>
        </div>

        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="font-display text-2xl font-bold text-slate-900 mb-6">Varför anlita en konsult?</h2>
              <div className="grid sm:grid-cols-2 gap-5 mb-10">
                {fordelar.map((f) => (
                  <div key={f.title} className="card p-5">
                    <div className="text-3xl mb-3">{f.icon}</div>
                    <h3 className="font-display font-semibold text-slate-900 mb-1">{f.title}</h3>
                    <p className="text-sm text-slate-600">{f.text}</p>
                  </div>
                ))}
              </div>

              <div className="card p-6 bg-slate-900 text-white">
                <h3 className="font-display text-xl font-semibold mb-4">Typiska uppdrag</h3>
                <div className="space-y-3 text-sm">
                  {[
                    ["Tillbyggnad villa", "8 000–20 000 kr"],
                    ["Attefallsanmälan", "3 000–8 000 kr"],
                    ["Nybyggnation enbostadshus", "30 000–60 000 kr"],
                    ["Komplementbyggnad", "4 000–10 000 kr"],
                    ["Rivningslov", "2 000–5 000 kr"],
                  ].map(([uppdrag, pris]) => (
                    <div key={uppdrag} className="flex justify-between items-center py-2 border-b border-white/10 last:border-0">
                      <span className="text-slate-300">{uppdrag}</span>
                      <span className="font-semibold text-brand-300">{pris}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-slate-400 mt-3">Priserna är vägledande och varierar med projektets komplexitet.</p>
              </div>
            </div>

            <div>
              <LeadForm source="konsult-page" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
