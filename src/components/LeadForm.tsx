"use client";
import { useId, useState } from "react";
import { Icon } from "@/lib/icons";

interface LeadFormProps {
  source?: string;
  atgard?: string;
  kommun?: string;
  compact?: boolean;
  /** Rubrik ovanför formuläret. Default: konsultmatchningens rubrik. */
  heading?: string;
  /** Brödtext under rubriken (visas endast när compact=false). */
  intro?: string;
  /**
   * Styr om formuläret utlovar en kostnadsfri bedömning (badges, trust-rad,
   * knapptext och bekräftelsetext). Sätts till false på tjänstesidan, där
   * tjänsten har ett pris – annars skulle sidan säga både "2 950 kr" och
   * "helt kostnadsfritt" om samma sak.
   */
  freeOffer?: boolean;
  submitLabel?: string;
  successText?: string;
}

export default function LeadForm({
  source = "generic",
  atgard,
  kommun,
  compact = false,
  heading,
  intro,
  freeOffer = true,
  submitLabel,
  successText,
}: LeadFormProps) {
  const uid = useId();
  const [step, setStep] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    botcheck: "", // honeypot – ska aldrig fyllas i av en människa
  });

  const handleSubmit = async () => {
    // Honeypot: om det dolda fältet är ifyllt är det en bot – skicka inte.
    if (form.botcheck) return;
    if (!form.name || !form.email || !form.phone) return;
    setStep("loading");

    const formattedMessage = [
      `Namn:      ${form.name}`,
      `E-post:    ${form.email}`,
      `Telefon:   ${form.phone}`,
      atgard ? `Åtgärd:    ${atgard}` : null,
      kommun ? `Kommun:    ${kommun}` : null,
      `Källa:     ${source || "okänd"}`,
      "",
      form.message ? `Meddelande:\n${form.message}` : "Inget meddelande",
    ]
      .filter(Boolean)
      .join("\n");

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: "c666ec4f-ba04-4e5b-9403-31d6accf8dd8",
          subject: "Ny lead – bygglov24.se",
          from_name: form.name,
          email: form.email,
          message: formattedMessage,
          botcheck: form.botcheck, // web3forms honeypot-konvention
        }),
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
        <p className="text-slate-600 text-sm">
          {successText ??
            (freeOffer
              ? "En bygglovskonsult kontaktar dig inom 1 arbetsdag med en kostnadsfri bedömning."
              : "Vi hör av oss med nästa steg och bekräftar omfattningen innan något arbete påbörjas.")}
        </p>
      </div>
    );
  }

  return (
    <div className={`card ${compact ? "p-6" : "p-8"}`}>
      {!compact && (
        <div className="mb-6">
          {freeOffer && (
            <div className="flex items-center gap-2 mb-1">
              <span className="badge bg-brand-100 text-brand-700">Kostnadsfritt</span>
              <span className="badge bg-green-100 text-green-700">Svar inom 24h</span>
            </div>
          )}
          <h3 className="font-display text-2xl font-semibold text-slate-900 mt-3 mb-1">
            {heading ?? "Få hjälp av en bygglovskonsult"}
          </h3>
          <p className="text-slate-600 text-sm">
            {intro ?? "Beskriv ditt projekt – få en gratis bedömning av vad som krävs och vad det kostar."}
          </p>
        </div>
      )}

      {compact && (
        <h3 className="font-display text-lg font-semibold text-slate-900 mb-4">
          {heading ?? "Få kostnadsfri konsultation"}
        </h3>
      )}

      <div className="space-y-3">
        {/* Honeypot – dolt för människor, fångar bottar. Lämna tomt. */}
        <div className="absolute -left-[9999px] top-0 h-0 w-0 overflow-hidden" aria-hidden="true">
          <label htmlFor={`${uid}-company`}>Lämna detta fält tomt</label>
          <input
            id={`${uid}-company`}
            type="text"
            name="botcheck"
            tabIndex={-1}
            autoComplete="off"
            value={form.botcheck}
            onChange={(e) => setForm({ ...form, botcheck: e.target.value })}
          />
        </div>

        <div>
          <label htmlFor={`${uid}-name`} className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Namn *</label>
          <input
            id={`${uid}-name`}
            type="text"
            placeholder="Anna Svensson"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none transition-all"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor={`${uid}-email`} className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">E-post *</label>
            <input
              id={`${uid}-email`}
              type="email"
              placeholder="anna@exempel.se"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none transition-all"
            />
          </div>
          <div>
            <label htmlFor={`${uid}-phone`} className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Telefon *</label>
            <input
              id={`${uid}-phone`}
              type="tel"
              placeholder="070-123 45 67"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none transition-all"
            />
          </div>
        </div>

        <div>
          <label htmlFor={`${uid}-message`} className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Beskriv ditt projekt</label>
          <textarea
            id={`${uid}-message`}
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
              {submitLabel ?? (freeOffer ? "Skicka förfrågan gratis" : "Skicka förfrågan")}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M1 8H15M9 2L15 8L9 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </>
          )}
        </button>

        <div aria-live="polite">
          {step === "error" && (
            <p role="alert" className="text-red-600 text-sm text-center">Något gick fel – prova igen eller ring oss.</p>
          )}
        </div>

        <p className="text-xs text-slate-600 text-center">
          Genom att skicka godkänner du vår <a href="/integritetspolicy" className="underline hover:text-slate-600">integritetspolicy</a>. Inga förpliktelser.
        </p>
      </div>

      {/* Trust signals – utelämnas när tjänsten har ett pris. */}
      {freeOffer && (
        <div className="mt-5 pt-5 border-t border-slate-100 grid grid-cols-3 gap-3 text-center">
          {([
            { icon: "shield-check", text: "Säker hantering" },
            { icon: "clock", text: "Svar inom 24h" },
            { icon: "circle-check", text: "Helt kostnadsfritt" },
          ] as const).map((t) => (
            <div key={t.text}>
              <Icon name={t.icon} className="w-5 h-5 mx-auto mb-1 text-brand-600" />
              <div className="text-xs text-slate-500">{t.text}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
