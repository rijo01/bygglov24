import Link from "next/link";

/**
 * Tvåvägsingång i heron. Ersätter leadformuläret när Bygglovskoll är påslagen:
 * en fråga om projektet leder till Bygglovskoll, ett behov av handlingar leder
 * till offertformuläret på /hjalp-med-bygglov.
 *
 * Inga löften om kostnadsfrihet eller svarstider — vi har ingen tjänst som
 * motsvarar dem.
 */
export default function HeroVal() {
  return (
    <div className="space-y-4">
      <div className="card p-7 bg-white">
        <span className="badge bg-brand-100 text-brand-700">99 kr</span>
        <h2 className="font-display text-xl font-semibold text-slate-900 mt-3 mb-2">
          Har du en fråga om ditt projekt?
        </h2>
        <p className="text-slate-700 text-sm leading-relaxed mb-5">
          Gör en Bygglovskoll — skriftlig orientering för 99 kr. Du får sannolik klassning, de regler
          som gäller för den och en checklista mot kommunen. Det bindande beskedet ges av
          byggnadsnämnden.
        </p>
        <Link href="/bygglovskoll" className="btn-primary w-full justify-center">
          Starta Bygglovskoll
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M1 8H15M9 2L15 8L9 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>

      <div className="card p-7 bg-white">
        <h2 className="font-display text-xl font-semibold text-slate-900 mb-2">
          Behöver du handlingar, ritningar eller hjälp med ansökan?
        </h2>
        <p className="text-slate-700 text-sm leading-relaxed mb-5">
          Beskriv uppdraget så återkommer vi med omfattning och pris innan något arbete påbörjas.
        </p>
        <Link
          href="/hjalp-med-bygglov#offert"
          className="min-h-11 w-full inline-flex items-center justify-center gap-2 px-5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 hover:bg-slate-50 transition-colors"
        >
          Begär offert
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  );
}
