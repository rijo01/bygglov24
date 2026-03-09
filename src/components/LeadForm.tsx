"use client";
import { useState } from "react";

interface LeadFormProps {
  source?: string;
  atgard?: string;
  kommun?: string;
  compact?: boolean;
}

export default function LeadForm({ source = "generic", atgard, kommun, compact = false }: LeadFormProps) {
  const [step, setStep] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.phone) return;
    setStep("loading");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, source, atgard, kommun }),
      });
      if (res.ok) {
        setStep("success");
      } else {
        setStep("error");
      }
    } catch {
      setStep("error");
    }
  };

  if (step === "success") {
    return (
      <div className="card p-8 text-center">
        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M5 13l4 4L19 7" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h3 className="font-display text-xl font-semibold text-slate-900 mb-2">Tack! Vi återkommer snart.</h3>
        <p className="text-slate-600 text-sm">En bygglovskonsult kontaktar dig inom 1 arbetsdag med en kostnadsfri bedömning.</p>
      </div>
    );
  }

  return (
    <div className={`card ${compact ? "p-6" : "p-8"}`}>
      {!compact && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="badge bg-brand-100 text-brand-700">Kostnadsfritt</span>
            <span className="badge bg-green-100 text-green-700">Svar inom 24h</span>
          </div>
          <h3 className="font-display text-2xl font-semibold text-slate-900 mt-3 mb-1">
            Få hjälp av en bygglovskonsult
          </h3>
          <p className="text-slate-600 text-sm">
            Beskriv ditt projekt – få en gratis bedömning av vad som krävs och vad det kostar.
          </p>
        </div>
      )}

      {compact && (
        <h3 className="font-display text-lg font-semibold text-slate-900 mb-4">
          Få kostnadsfri konsultation
        </h3>
      )}

      <div className="space-y-3">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Namn *</label>
          <input
            type="text"
            placeholder="Anna Svensson"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none transition-all"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">E-post *</label>
            <input
              type="email"
              placeholder="anna@exempel.se"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Telefon *</label>
            <input
              type="tel"
              placeholder="070-123 45 67"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Beskriv ditt projekt</label>
          <textarea
            rows={3}
            placeholder={`T.ex. "Vill bygga till 25 kvm på min villa i ${kommun || "Stockholm"}"...`}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none transition-all resize-none"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={step === "loading" || !form.name || !form.email || !form.phone}
          className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        >
          {step === "loading" ? (
            <>
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              Skickar...
            </>
          ) : (
            <>
              Skicka förfrågan gratis
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M1 8H15M9 2L15 8L9 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </>
          )}
        </button>

        {step === "error" && (
          <p className="text-red-600 text-sm text-center">Något gick fel – prova igen eller ring oss.</p>
        )}

        <p className="text-xs text-slate-400 text-center">
          Genom att skicka godkänner du vår <a href="/integritetspolicy" className="underline hover:text-slate-600">integritetspolicy</a>. Inga förpliktelser.
        </p>
      </div>

      {/* Trust signals */}
      <div className="mt-5 pt-5 border-t border-slate-100 grid grid-cols-3 gap-3 text-center">
        {[
          { icon: "🔒", text: "Säker hantering" },
          { icon: "⚡", text: "Svar inom 24h" },
          { icon: "✅", text: "Helt kostnadsfritt" },
        ].map((t) => (
          <div key={t.text}>
            <div className="text-lg mb-0.5">{t.icon}</div>
            <div className="text-xs text-slate-500">{t.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
