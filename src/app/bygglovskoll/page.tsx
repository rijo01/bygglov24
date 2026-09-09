import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { bygglovskollAktiv } from "@/lib/bygglovskoll/flag";
import { getAllKommuner } from "@/lib/content";
import * as copy from "@/lib/bygglovskoll/copy";
import BygglovskollForm from "./BygglovskollForm";

export const metadata: Metadata = {
  title: "Bygglovskoll 99 kr — vägledning utifrån dina uppgifter | bygglov24.se",
  description:
    "Personligt skriftligt underlag om klassning, tillämpliga regler och vad du ska kontrollera med kommunen. Inte ett besked. 99 kr.",
  alternates: { canonical: "https://bygglov24.se/bygglovskoll" },
};

export default function BygglovskollPage() {
  if (!bygglovskollAktiv()) notFound();

  const kommuner = [...new Set(getAllKommuner().map((k) => k.kommunNamn))].sort((a, b) => a.localeCompare(b, "sv"));
  const idag = new Date().toISOString().slice(0, 10);

  return (
    <div className="container-wide py-10 sm:py-14">
      <div className="max-w-3xl">
        <span className="badge bg-brand-100 text-brand-700">99 kr</span>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-slate-900 mt-3 mb-3">
          Bygglovskoll
        </h1>
        <p className="text-lg text-slate-700 leading-relaxed mb-3">{copy.HERO_INGRESS}</p>
        <p className="text-slate-600 leading-relaxed">{copy.HERO_FORBEHALL}</p>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_360px] gap-10 mt-10 items-start">
        <BygglovskollForm kommuner={kommuner} />

        <aside className="space-y-6">
          <div className="card p-6">
            <h2 className="font-display text-lg font-semibold text-slate-900 mb-3">Vad du får</h2>
            <ol className="space-y-2 text-sm text-slate-700 list-decimal list-inside leading-relaxed">
              {copy.VAD_DU_FAR.map((p) => <li key={p}>{p}</li>)}
            </ol>
            <p className="text-sm text-slate-600 mt-4">
              Levereras som PDF och visas på skärm direkt efter betalning. 2–4 sidor.
            </p>
          </div>

          <div className="card p-6">
            <h2 className="font-display text-lg font-semibold text-slate-900 mb-3">Vad det inte är</h2>
            <p className="text-sm text-slate-700 mb-2">Bygglovskoll är inte:</p>
            <ul className="space-y-1.5 text-sm text-slate-700 leading-relaxed">
              {copy.VAD_DET_INTE_AR.map((p) => (
                <li key={p} className="flex gap-2"><span aria-hidden="true">–</span><span>{p}</span></li>
              ))}
            </ul>
            <p className="text-sm text-slate-600 mt-3">
              Det bindande beskedet ges alltid av byggnadsnämnden mot fastighetens förutsättningar.
            </p>
          </div>

          <div className="card p-6">
            <h2 className="font-display text-lg font-semibold text-slate-900 mb-3">För vem</h2>
            <p className="text-sm text-slate-700 leading-relaxed mb-3">{copy.FOR_VEM}</p>
            <p className="text-sm text-slate-700 leading-relaxed">{copy.FOR_VEM_INTE}</p>
            <Link href="/hjalp-med-bygglov" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-900 mt-3">
              Läs om Bygglovsutredningen <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="card p-6">
            <h2 className="font-display text-lg font-semibold text-slate-900 mb-2">Pris och leverans</h2>
            <p className="text-sm text-slate-700 leading-relaxed mb-3">
              99 kr inklusive moms. Betalning via Stripe. Underlaget låses upp när betalningen är verifierad.
            </p>
            <h3 className="font-semibold text-slate-900 text-sm mb-1">Ångerrätt</h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">{copy.ANGERRATT_INFO}</p>
            <h3 className="font-semibold text-slate-900 text-sm mb-1">Återbetalning</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{copy.ATERBETALNING}</p>
          </div>

          <div className="card p-6 bg-slate-50">
            <h2 className="font-display text-lg font-semibold text-slate-900 mb-2">Förbehåll</h2>
            <p className="text-sm text-slate-700 leading-relaxed">{copy.forbehall(idag)}</p>
          </div>
        </aside>
      </div>

      <section className="max-w-3xl mt-14">
        <h2 className="font-display text-2xl font-semibold text-slate-900 mb-5">Vanliga frågor</h2>
        <div className="space-y-5">
          {copy.FAQ_LANDNING.map((q) => (
            <div key={q.f}>
              <h3 className="font-semibold text-slate-900 mb-1">{q.f}</h3>
              <p className="text-slate-700 text-sm leading-relaxed">{q.s}</p>
            </div>
          ))}
        </div>
        <p className="text-sm text-slate-600 mt-8">
          Vill du i stället ha offert på handlingar eller ombud?{" "}
          <Link href="/konsult" className="underline font-medium">Begär offert</Link>.
        </p>
      </section>
    </div>
  );
}
