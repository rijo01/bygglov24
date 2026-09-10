"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { laddaNerPdf } from "@/lib/bygglovskoll/pdf";
import { fragaLeverans } from "@/lib/bygglovskoll/copy";
import type { Orientering } from "@/lib/bygglovskoll/templates";

export default function KlarKlient() {
  const params = useSearchParams();
  const sessionId = params.get("session_id");
  const [orientering, setOrientering] = useState<Orientering | null>(null);
  /** Sätts bara när tillägget «Fråga oss» faktiskt är betalt på sessionen. */
  const [svarTill, setSvarTill] = useState<string | null>(null);
  const [fel, setFel] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setFel("Ingen betalning att verifiera.");
      return;
    }
    fetch(`/api/bygglovskoll/verify-session?session_id=${encodeURIComponent(sessionId)}`)
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.error || "Kunde inte verifiera betalningen.");
        setOrientering(data.orientering as Orientering);
        setSvarTill((data.personligtSvar?.epost as string | undefined) ?? null);
      })
      .catch((e) => setFel(e instanceof Error ? e.message : "Kunde inte verifiera betalningen."));
  }, [sessionId]);

  if (fel) {
    return (
      <div className="card p-8 max-w-2xl">
        <h1 className="font-display text-2xl font-semibold text-slate-900 mb-3">Underlaget kunde inte visas</h1>
        <p className="text-slate-700 mb-5 leading-relaxed">{fel}</p>
        <Link href="/kontakt" className="btn-primary">Kontakta oss</Link>
      </div>
    );
  }

  if (!orientering) return <p className="text-slate-600">Verifierar betalningen…</p>;

  return (
    <div className="max-w-3xl">
      <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">{orientering.sidhuvud}</p>
      <h1 className="font-display text-3xl font-semibold text-slate-900 mb-6">Din Bygglovskoll</h1>

      {svarTill && (
        <p className="rounded-xl bg-brand-50 border border-brand-100 p-5 text-slate-800 leading-relaxed mb-8">
          {fragaLeverans(svarTill)}
        </p>
      )}

      <div className="flex flex-wrap gap-3 mb-8">
        <button type="button" onClick={() => laddaNerPdf(orientering)} className="btn-primary">
          Ladda ner PDF
        </button>
        <Link href="/hjalp-med-bygglov" className="min-h-11 inline-flex items-center px-5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50">
          Läs om Bygglovsutredningen
        </Link>
      </div>

      <article className="space-y-8">
        {orientering.avsnitt.map((a) => (
          <section key={a.nummer}>
            <h2 className="font-display text-xl font-semibold text-slate-900 mb-3">
              {a.nummer}. {a.rubrik}
            </h2>
            {a.stycken.filter(Boolean).map((s, idx) => (
              <p key={idx} className="text-slate-700 leading-relaxed mb-3">{s}</p>
            ))}
            {a.punkter && (
              <ul className="space-y-2">
                {a.punkter.map((p, idx) => (
                  <li key={idx} className="flex gap-2.5 text-slate-700 text-sm leading-relaxed">
                    <span className="text-brand-600 mt-0.5" aria-hidden="true">•</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </article>

      <p className="text-xs text-slate-500 mt-10 pt-5 border-t border-slate-200 leading-relaxed">
        {orientering.sidfot}
      </p>
    </div>
  );
}
