import { clsx } from "clsx";

/**
 * RegelKort – återanvändbart, skannbart kort för bygglovsregler.
 *
 * Data-driven: en rubrik + valfri ingress, 1–3 kolumner (t.ex. "Inom detaljplan"
 * / "Utanför detaljplan"), varje kolumn med rader etikett→värde, samt ett valfritt
 * villkors-callout under kolumnerna. Generell för alla åtgärder (komplementbyggnad,
 * tillbyggnad, friggebod m.fl.) – inga värden är hårdkodade.
 *
 * Design matchar "Snabbinformation"-korten på kommunsidorna (samma .card-look:
 * border, radius, brand-50-bakgrund, font-display-rubrik, uppercase-etiketter).
 */
export interface RegelRad {
  etikett: string;
  varde: string;
}

export interface RegelKolumn {
  rubrik: string;
  rader: RegelRad[];
}

export interface RegelKortProps {
  rubrik: string;
  ingress?: string;
  kolumner: RegelKolumn[];
  /** Valfritt villkors-callout (t.ex. placering) som visas under kolumnerna. */
  villkor?: string;
}

const KOLUMN_GRID: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
};

export default function RegelKort({ rubrik, ingress, kolumner, villkor }: RegelKortProps) {
  const antal = Math.min(Math.max(kolumner.length, 1), 3);

  return (
    <div className="not-prose card bg-brand-50 border-brand-100 p-6 my-8">
      <h3 className="font-display text-lg font-semibold text-slate-900 mb-1">{rubrik}</h3>
      {ingress && <p className="text-sm text-slate-600 mb-4">{ingress}</p>}

      <div className={clsx("grid gap-4", ingress ? "" : "mt-4", KOLUMN_GRID[antal])}>
        {kolumner.map((kol) => (
          <div
            key={kol.rubrik}
            className="rounded-xl bg-white border border-[#dce8f5] p-4"
          >
            <div className="text-sm font-semibold text-brand-800 mb-3">{kol.rubrik}</div>
            <dl className="space-y-2.5">
              {kol.rader.map((rad) => (
                <div key={rad.etikett} className="flex items-baseline justify-between gap-3">
                  <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    {rad.etikett}
                  </dt>
                  <dd className="font-semibold text-slate-900 text-sm tabular-nums text-right">
                    {rad.varde}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>

      {villkor && (
        <div className="flex gap-2.5 mt-4 pt-4 border-t border-brand-100 text-sm text-slate-600 leading-relaxed">
          <span className="text-brand-600 shrink-0" aria-hidden>
            ⓘ
          </span>
          <p>{villkor}</p>
        </div>
      )}
    </div>
  );
}
