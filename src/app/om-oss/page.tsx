import type { Metadata } from "next";
import { bygglovskollAktiv } from "@/lib/bygglovskoll/flag";
import Link from "next/link";
import { getAllKommuner, getAllGuider } from "@/lib/content";

const TOTALA_KOMMUNER = 290;
const PUBLICERADE_KOMMUNER = getAllKommuner().length;
const PUBLICERADE_GUIDER = getAllGuider().length;

export const metadata: Metadata = {
  title: "Om Bygglov24 – Sveriges kompletta guide till bygglov",
  description: bygglovskollAktiv()
    ? `Bygglov24 är Sveriges mest kompletta guide till bygglov med information för ${PUBLICERADE_KOMMUNER} av ${TOTALA_KOMMUNER} kommuner. Vi levererar Bygglovskoll och Bygglovsutredning.`
    : `Bygglov24 är Sveriges mest kompletta guide till bygglov med information för ${PUBLICERADE_KOMMUNER} av ${TOTALA_KOMMUNER} kommuner. Kostnadsfri matchning med lokala bygglovskonsulter.`,
  alternates: { canonical: "https://bygglov24.se/om-oss" },
};

const stats = [
  { value: `${PUBLICERADE_KOMMUNER}`, label: "Kommuner" },
  { value: `${PUBLICERADE_GUIDER}`, label: "Guider" },
  { value: "24h", label: "Svarstid" },
];

export default function OmOssPage() {
  const bygglovskoll = bygglovskollAktiv();

  return (
    <div className="bg-gradient-to-b from-brand-50 to-white py-16">
      <div className="container-content">
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <Link href="/" className="hover:text-brand-600 transition-colors">Hem</Link>
          <span>/</span>
          <span className="text-slate-900">Om oss</span>
        </nav>

        <div className="text-center mb-12">
          <span className="badge bg-brand-100 text-brand-700 mb-4">Sedan 2025</span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-slate-900 mb-5 leading-tight">
            Om Bygglov24
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Sveriges mest kompletta guide till bygglov – för {PUBLICERADE_KOMMUNER} av {TOTALA_KOMMUNER} kommuner.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mb-12">
          {stats.map((s) => (
            <div key={s.label} className="card p-6 text-center">
              <div className="font-display text-3xl font-bold text-brand-700 mb-1">{s.value}</div>
              <div className="text-sm text-slate-500 uppercase tracking-wide">{s.label}</div>
            </div>
          ))}
        </div>

        <article className="prose-bygglov">
          <h2>Vår mission</h2>
          <p>
            Att söka bygglov i Sverige kan vara förvirrande. Reglerna skiljer sig mellan kommuner, detaljplaner är svårtolkade och processen kräver rätt handlingar i rätt ordning. <strong>Bygglov24</strong> finns för att göra resan enklare för dig som planerar ett byggprojekt.
          </p>
          <p>
            Vi samlar och uppdaterar information om bygglov från {PUBLICERADE_KOMMUNER} av Sveriges {TOTALA_KOMMUNER} kommuner och kompletterar med guider, regelförklaringar och praktiska checklistor – allt skrivet på begriplig svenska.
          </p>

          <h2>Vad vi gör</h2>
          <p>
            På Bygglov24 hittar du:
          </p>
          <ul>
            <li><strong>Kommunspecifika sidor</strong> – avgifter, handläggningstider och kontaktuppgifter för byggnadsnämnden i varje kommun</li>
            <li><strong>Åtgärdstyper</strong> – allt om Attefall, friggebod, tillbyggnad, carport, plank, pool och mer</li>
            <li><strong>Guider</strong> – från ansökan och kontrollansvarig till strandskydd och nya regler för 2026</li>
            {!bygglovskoll && (
              <li><strong>Kostnadsfri matchning</strong> – vi kopplar dig till en lokal bygglovskonsult som känner reglerna i just din kommun</li>
            )}
          </ul>

          {bygglovskoll ? (
            <>
              <h2>Våra tjänster</h2>
              <p>
                All information på sajten är fri att läsa. Utöver den levererar vi tre saker själva:
              </p>
              <ul>
                <li>
                  <strong>Bygglovskoll, 99 kr</strong> – ett personligt skriftligt underlag utifrån de
                  uppgifter du lämnar: sannolik klassning, de regler som gäller för den, hur dina mått
                  ligger mot de nationella trösklarna och en checklista mot din kommun. Det är
                  vägledning och underlag, inte ett besked.
                </li>
                <li>
                  <strong>Bygglovsutredning, 2 950 kr</strong> – en fastighetsspecifik genomgång av
                  detaljplan, byggrätt och strandskydd med en skriftlig rekommendation. Också
                  vägledning, inte kommunens beslut.
                </li>
                <li>
                  <strong>Handlingar, ritningar och ansökan</strong> – mot offert. Vi återkommer med
                  omfattning och pris innan något arbete påbörjas.
                </li>
              </ul>
              <p>
                Det bindande beskedet ges alltid av byggnadsnämnden i din kommun. Vi fattar inga
                beslut och företräder inte kommunen.
              </p>
            </>
          ) : (
            <>
              <h2>Tjänsten är kostnadsfri</h2>
              <p>
                All information på sajten är gratis att läsa. Även vår matchning med bygglovskonsulter är kostnadsfri – konsulten betalar oss en mindre matchningsavgift om ni inleder samarbete, vilket innebär att du som besökare aldrig behöver lägga ut något.
              </p>
            </>
          )}

          <h2>Innehållet</h2>
          <p>
            Innehållet på Bygglov24 baseras på plan- och bygglagen (PBL), plan- och byggförordningen (PBF), Boverkets vägledningar, kommunala taxor och praxis från mark- och miljödomstolarna. Vi uppdaterar guiderna löpande när lagstiftning eller praxis ändras.
          </p>
          <p>
            <strong>Observera:</strong> Informationen är vägledande och ersätter inte juridisk rådgivning eller kommunens egna beslut. Vid tveksamheter – kontakta din kommun eller en bygglovskonsult.
          </p>

          <h2>Kontakt</h2>
          <p>
            Har du frågor, synpunkter eller vill samarbeta? Mejla oss på <a href="mailto:info@bygglov24.se">info@bygglov24.se</a>.
          </p>
        </article>

        <div className="card p-8 mt-12 bg-brand-50 border-brand-100 text-center">
          <h2 className="font-display text-2xl font-bold text-slate-900 mb-3">
            Redo att komma igång?
          </h2>
          <p className="text-slate-600 mb-6 max-w-lg mx-auto">
            {bygglovskoll
              ? "Börja med en Bygglovskoll för 99 kr — skriftlig orientering utifrån dina uppgifter."
              : "Matchas med en lokal bygglovskonsult – kostnadsfritt och utan förpliktelser."}
          </p>
          <Link href={bygglovskoll ? "/bygglovskoll" : "/konsult"} className="btn-primary">
            {bygglovskoll ? "Starta Bygglovskoll" : "Få kostnadsfri konsultation"} →
          </Link>
        </div>
      </div>
    </div>
  );
}
