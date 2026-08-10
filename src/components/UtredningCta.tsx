import Link from "next/link";
import { Icon } from "@/lib/icons";

/**
 * Diskret CTA som placeras efter huvudinnehållet på guide- och kommunsidor.
 * Medvetet ingen popup, ingen overlay och inget som lägger sig över texten –
 * den ska läsas som nästa steg, inte som en annons.
 */
export default function UtredningCta() {
  return (
    <aside className="mt-12 card p-6 bg-brand-50 border-brand-100">
      <div className="flex items-start gap-4">
        <Icon name="file-text" className="w-6 h-6 text-brand-600 shrink-0 mt-0.5" />
        <div>
          <h2 className="font-display text-lg font-semibold text-slate-900 mb-1.5">
            Osäker på om ditt projekt kräver bygglov?
          </h2>
          <p className="text-slate-700 text-sm leading-relaxed mb-3">
            Vi gör en skriftlig utredning mot din fastighet — fast pris 2 950 kr.
          </p>
          <Link
            href="/hjalp-med-bygglov"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-900"
          >
            Läs mer om bygglovsutredningen
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
