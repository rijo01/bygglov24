import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Om Bygglov24 – Sveriges kompletta guide till bygglov",
  description:
    "Bygglov24 är Sveriges mest kompletta guide till bygglov med information för alla 290 kommuner. Kostnadsfri matchning med lokala bygglovskonsulter.",
  alternates: { canonical: "https://bygglov24.se/om-oss" },
};

const stats = [
  { value: "290", label: "Kommuner" },
  { value: "30+", label: "Guider" },
  { value: "24h", label: "Svarstid" },
];

export default function OmOssPage() {
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
            Sveriges mest kompletta guide till bygglov – för alla 290 kommuner.
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
            Vi samlar och uppdaterar information om bygglov från Sveriges alla 290 kommuner och kompletterar med guider, regelförklaringar och praktiska checklistor – allt skrivet på begriplig svenska.
          </p>

          <h2>Vad vi gör</h2>
          <p>
            På Bygglov24 hittar du:
          </p>
          <ul>
            <li><strong>Kommunspecifika sidor</strong> – avgifter, handläggningstider och kontaktuppgifter för byggnadsnämnden i varje kommun</li>
            <li><strong>Åtgärdstyper</strong> – allt om Attefall, friggebod, tillbyggnad, carport, plank, pool och mer</li>
            <li><strong>Guider</strong> – från ansökan och kontrollansvarig till strandskydd och nya regler för 2026</li>
            <li><strong>Kostnadsfri matchning</strong> – vi kopplar dig till en lokal bygglovskonsult som känner reglerna i just din kommun</li>
          </ul>

          <h2>Tjänsten är kostnadsfri</h2>
          <p>
            All information på sajten är gratis att läsa. Även vår matchning med bygglovskonsulter är kostnadsfri – konsulten betalar oss en mindre matchningsavgift om ni inleder samarbete, vilket innebär att du som besökare aldrig behöver lägga ut något.
          </p>

          <h2>Innehållet</h2>
          <p>
            Innehållet på Bygglov24 baseras på plan- och bygglagen (PBL), plan- och byggförordningen (PBF), Boverkets vägledningar, kommunala taxor och praxis från mark- och miljödomstolarna. Vi uppdaterar guiderna löpande när lagstiftning eller praxis ändras.
          </p>
          <p>
            <strong>Observera:</strong> Informationen är vägledande och ersätter inte juridisk rådgivning eller kommunens egna beslut. Vid tveksamheter – kontakta din kommun eller en bygglovskonsult.
          </p>

          <h2>Kontakt</h2>
          <p>
            Har du frågor, synpunkter eller vill samarbeta? Mejla oss på <a href="mailto:info@bygglov24.se">info@bygglov24.se</a> – vi svarar normalt inom en arbetsdag.
          </p>
        </article>

        <div className="card p-8 mt-12 bg-brand-50 border-brand-100 text-center">
          <h2 className="font-display text-2xl font-bold text-slate-900 mb-3">
            Redo att komma igång?
          </h2>
          <p className="text-slate-600 mb-6 max-w-lg mx-auto">
            Matchas med en lokal bygglovskonsult – kostnadsfritt och utan förpliktelser.
          </p>
          <Link href="/konsult" className="btn-primary">
            Få kostnadsfri konsultation →
          </Link>
        </div>
      </div>
    </div>
  );
}
