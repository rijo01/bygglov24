"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

interface AtgardCost {
  slug: string;
  label: string;
  description: string;
  kommun: { low: number; typical: number; high: number };
  konsult: { low: number; high: number };
}

const atgarder: AtgardCost[] = [
  {
    slug: "attefall",
    label: "Attefallsanmälan",
    description: "Bygglovsbefriad komplementbyggnad / -bostadshus",
    kommun: { low: 2500, typical: 5000, high: 8000 },
    konsult: { low: 3000, high: 6000 },
  },
  {
    slug: "tillbyggnad-15-30",
    label: "Tillbyggnad 15–30 m²",
    description: "Mindre tillbyggnad av enbostadshus",
    kommun: { low: 5000, typical: 12000, high: 25000 },
    konsult: { low: 8000, high: 15000 },
  },
  {
    slug: "tillbyggnad-30-60",
    label: "Tillbyggnad 30–60 m²",
    description: "Större tillbyggnad – kräver oftast kontrollansvarig",
    kommun: { low: 8000, typical: 18000, high: 35000 },
    konsult: { low: 12000, high: 25000 },
  },
  {
    slug: "nybyggnation",
    label: "Nybyggnation enbostadshus",
    description: "Helt nytt enbostadshus inom detaljplan",
    kommun: { low: 20000, typical: 45000, high: 90000 },
    konsult: { low: 25000, high: 60000 },
  },
  {
    slug: "carport-garage",
    label: "Carport eller garage",
    description: "Komplementbyggnad för fordon",
    kommun: { low: 4000, typical: 10000, high: 20000 },
    konsult: { low: 6000, high: 12000 },
  },
  {
    slug: "rivningslov",
    label: "Rivningslov",
    description: "Rivning av byggnad inom detaljplan",
    kommun: { low: 2000, typical: 5000, high: 10000 },
    konsult: { low: 3000, high: 8000 },
  },
  {
    slug: "marklov",
    label: "Marklov",
    description: "Schaktning, fyllning eller större markarbete",
    kommun: { low: 1500, typical: 4000, high: 8000 },
    konsult: { low: 3000, high: 8000 },
  },
];

function formatSek(n: number): string {
  return n.toLocaleString("sv-SE") + " kr";
}

export default function Calculator() {
  const [slug, setSlug] = useState<string>(atgarder[0].slug);

  const selected = useMemo(
    () => atgarder.find((a) => a.slug === slug) ?? atgarder[0],
    [slug]
  );

  const totalLow = selected.kommun.low + selected.konsult.low;
  const totalTypical = selected.kommun.typical + (selected.konsult.low + selected.konsult.high) / 2;
  const totalHigh = selected.kommun.high + selected.konsult.high;

  return (
    <div className="grid lg:grid-cols-[1fr_1fr] gap-8 items-start">
      {/* Inputs */}
      <div className="card p-6 lg:p-8">
        <h2 className="font-display text-xl font-semibold text-slate-900 mb-1">
          Välj åtgärd
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          Välj den åtgärd som bäst beskriver ditt projekt. Vi visar ett uppskattat
          intervall.
        </p>

        <label htmlFor="atgard-select" className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
          Åtgärdstyp
        </label>
        <div className="relative">
          <select
            id="atgard-select"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full appearance-none border border-[#dce8f5] bg-white rounded-xl px-4 py-3 pr-10 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
          >
            {atgarder.map((a) => (
              <option key={a.slug} value={a.slug}>
                {a.label}
              </option>
            ))}
          </select>
          <svg
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
            width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"
          >
            <path d="M3 6L8 11L13 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <p className="text-sm text-slate-600 mt-4 leading-relaxed">
          {selected.description}
        </p>

        <div className="mt-8 pt-6 border-t border-slate-100 space-y-4">
          <Row
            label="Kommunavgift (lägsta)"
            value={formatSek(selected.kommun.low)}
            sub="t.ex. liten kommun, enkelt ärende"
          />
          <Row
            label="Kommunavgift (typiskt)"
            value={formatSek(selected.kommun.typical)}
            sub="riksgenomsnitt"
            highlight
          />
          <Row
            label="Kommunavgift (högsta)"
            value={formatSek(selected.kommun.high)}
            sub="t.ex. storstad, komplext ärende"
          />
          <div className="pt-3 border-t border-slate-100">
            <Row
              label="Konsultarvode"
              value={`${formatSek(selected.konsult.low)} – ${formatSek(selected.konsult.high)}`}
              sub="lokal bygglovskonsult, paketpris"
            />
          </div>
        </div>
      </div>

      {/* Result */}
      <div className="card p-6 lg:p-8 bg-gradient-to-br from-brand-50 to-white border-brand-100 sticky top-24">
        <span className="badge bg-brand-100 text-brand-700 mb-3">Uppskattad totalkostnad</span>
        <h2 className="font-display text-xl font-semibold text-slate-900 mb-6">
          {selected.label}
        </h2>

        <div className="space-y-5">
          <Result label="Lägsta totalkostnad" value={formatSek(totalLow)} tone="low" />
          <Result label="Typisk totalkostnad" value={formatSek(Math.round(totalTypical))} tone="typical" />
          <Result label="Högsta totalkostnad" value={formatSek(totalHigh)} tone="high" />
        </div>

        <Link href="/konsult" className="btn-primary w-full justify-center mt-8">
          Få exakt offert
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M1 7H13M8 2L13 7L8 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>

        <p className="text-xs text-slate-500 mt-5 leading-relaxed">
          <strong className="text-slate-700">Disclaimer:</strong> Beloppen är
          riksgenomsnitt baserade på kommunala taxor och paketpriser hos lokala
          konsulter 2026. Den faktiska kommunavgiften varierar betydligt mellan
          kommunerna och beror på åtgärdens omfattning, planenlighet och behov av
          remisser. Begär alltid en bindande offert för exakt pris.
        </p>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  sub,
  highlight = false,
}: {
  label: string;
  value: string;
  sub?: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <div className={`text-sm font-medium ${highlight ? "text-slate-900" : "text-slate-700"}`}>
          {label}
        </div>
        {sub && <div className="text-xs text-slate-500 mt-0.5">{sub}</div>}
      </div>
      <div className={`text-sm font-semibold tabular-nums shrink-0 ${highlight ? "text-brand-700" : "text-slate-900"}`}>
        {value}
      </div>
    </div>
  );
}

function Result({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "low" | "typical" | "high";
}) {
  const styles: Record<typeof tone, string> = {
    low: "text-slate-600",
    typical: "text-brand-700 text-3xl font-bold font-display",
    high: "text-slate-600",
  };
  const labelStyles: Record<typeof tone, string> = {
    low: "text-xs uppercase tracking-wide font-semibold text-slate-500",
    typical: "text-xs uppercase tracking-wide font-semibold text-brand-700",
    high: "text-xs uppercase tracking-wide font-semibold text-slate-500",
  };
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className={labelStyles[tone]}>{label}</span>
      <span className={`tabular-nums ${styles[tone]}`}>{value}</span>
    </div>
  );
}
