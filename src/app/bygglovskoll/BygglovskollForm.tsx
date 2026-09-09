"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import LeadForm from "@/components/LeadForm";
import { triage } from "@/lib/bygglovskoll/triage";
import * as copy from "@/lib/bygglovskoll/copy";
import { GRANS, STRANDSKYDD } from "@/lib/bygglovskoll/rules";
import type { Intake, JaNejVetEj, TriageResultat } from "@/lib/bygglovskoll/types";

/**
 * Formulärets utkast. Vatten, kulturmiljö och installationer saknar förvalt
 * värde — de måste besvaras aktivt. Ett förvalt "vet ej" hade sett ut som ett
 * svar användaren gett, och de tre frågorna avgör om ärendet över huvud taget
 * kan säljas som Bygglovskoll.
 */
type Utkast = Omit<Intake, "naraVatten" | "kulturSamfallighet" | "installation"> & {
  naraVatten: JaNejVetEj | null;
  kulturSamfallighet: JaNejVetEj | null;
  installation: JaNejVetEj | null;
};

const TOM: Utkast = {
  atgard: "tillbyggnad",
  placering: null,
  yta: null,
  hojd: null,
  langd: null,
  avstandTomtgrans: null,
  fastighetstyp: "villa",
  kommun: "",
  fastighetsbeteckning: "",
  detaljplan: "vetej",
  naraVatten: null,
  kulturSamfallighet: null,
  befintligaKomplement: "vetej",
  befintligKomplementYta: null,
  installation: null,
  fritext: "",
  epost: "",
};

const ATGARDER = [
  ["tillbyggnad", "Tillbyggnad / uterum"],
  ["fristaende", "Fristående byggnad (växthus, förråd, garage)"],
  ["altan", "Altan / tak över uteplats / pergola"],
  ["plank", "Plank / mur / staket"],
  ["fasadandring", "Fasadändring (fönster, dörr, kulör, balkong)"],
  ["pool", "Pool"],
  ["annat", "Annat"],
] as const;

const PLACERINGAR = [
  ["fast", "Fäst i / sammanbyggt med huset"],
  ["fristaende", "Fristående"],
  ["oklart", "Delvis / oklart"],
] as const;

const TYPER = [
  ["villa", "Villa / radhus / parhus"],
  ["flerbostad", "Flerbostadshus / BRF"],
  ["fritidshus", "Fritidshus"],
  ["annat", "Annat"],
] as const;

const JNV: Array<[JaNejVetEj, string]> = [
  ["ja", "Ja"],
  ["nej", "Nej"],
  ["vetej", "Vet ej"],
];

function Radio<T extends string>({
  namn, varden, valt, satt,
}: { namn: string; varden: readonly (readonly [T, string])[]; valt: T | null; satt: (v: T) => void }) {
  return (
    <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={namn}>
      {varden.map(([v, label]) => (
        <button
          key={v}
          type="button"
          role="radio"
          aria-checked={valt === v}
          onClick={() => satt(v)}
          className={`min-h-11 px-4 py-2.5 rounded-xl border text-sm text-left transition-colors ${
            valt === v
              ? "border-brand-500 bg-brand-50 text-brand-900 font-semibold"
              : "border-slate-200 bg-white text-slate-700 hover:border-brand-300"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function Falt({ etikett, hjalp, children }: { etikett: string; hjalp?: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <div className="block text-sm font-semibold text-slate-800 mb-1.5">{etikett}</div>
      {hjalp && <p className="text-xs text-slate-600 mb-2">{hjalp}</p>}
      {children}
    </div>
  );
}

const inputKlass =
  "w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm " +
  "focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none transition-all";

export default function BygglovskollForm({ kommuner }: { kommuner: string[] }) {
  const [steg, setSteg] = useState(1);
  const [i, setI] = useState<Utkast>(TOM);
  const [resultat, setResultat] = useState<TriageResultat | null>(null);
  const [kryssVagledning, setKryssVagledning] = useState(false);
  const [kryssAngerratt, setKryssAngerratt] = useState(false);
  const [laddar, setLaddar] = useState(false);
  const [fel, setFel] = useState<string | null>(null);
  const [visaGratischunk, setVisaGratischunk] = useState(false);

  const uppd = (delta: Partial<Utkast>) => setI((prev) => ({ ...prev, ...delta }));

  const behoverMatt = i.atgard !== "fasadandring";
  const idag = new Date().toISOString().slice(0, 10);

  const kanGaVidare = useMemo(() => {
    if (steg === 1) return i.atgard !== "tillbyggnad" || i.placering !== null;
    if (steg === 2) return !behoverMatt || (i.yta !== null || i.hojd !== null);
    if (steg === 3) return i.kommun.trim().length > 0 && i.naraVatten !== null && i.kulturSamfallighet !== null;
    if (steg === 4)
      return (
        i.installation !== null && /.+@.+\..+/.test(i.epost) && i.fritext.length <= 500
      );
    return false;
  }, [steg, i, behoverMatt]);

  /** Utkastet är komplett först när de tre tvingande frågorna är besvarade. */
  const somIntake = (u: Utkast): Intake | null =>
    u.naraVatten === null || u.kulturSamfallighet === null || u.installation === null
      ? null
      : { ...u, naraVatten: u.naraVatten, kulturSamfallighet: u.kulturSamfallighet, installation: u.installation };

  const kor = () => {
    const komplett = somIntake(i);
    if (!komplett) return;
    setResultat(triage(komplett));
    setSteg(5);
  };

  const betala = async () => {
    setLaddar(true);
    setFel(null);
    try {
      const res = await fetch("/api/bygglovskoll/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intake: somIntake(i), samtycken: { vagledning: kryssVagledning, angerratt: kryssAngerratt } }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Kunde inte starta betalningen.");
      window.location.href = data.url;
    } catch (e) {
      setFel(e instanceof Error ? e.message : "Kunde inte starta betalningen.");
      setLaddar(false);
    }
  };

  // ── Resultatvyer ──────────────────────────────────────────────────────────
  if (resultat?.outcome === "C") {
    return (
      <div className="card p-8">
        <h2 className="font-display text-2xl font-semibold text-slate-900 mb-3">{copy.C_RUBRIK}</h2>
        <p className="text-slate-700 mb-4 leading-relaxed">{copy.C_BROD}</p>
        <p className="text-slate-700 mb-6 leading-relaxed">{copy.cHanvisning(i.kommun || "din kommuns")}</p>
        <button type="button" onClick={() => { setResultat(null); setI(TOM); setSteg(1); }} className="btn-primary">
          Starta Bygglovskoll på nytt
        </button>
      </div>
    );
  }

  if (resultat?.outcome === "B") {
    return (
      <div className="space-y-6">
        <div className="card p-8">
          <h2 className="font-display text-2xl font-semibold text-slate-900 mb-3">{copy.B_RUBRIK}</h2>
          <p className="text-slate-700 mb-4 leading-relaxed">{copy.B_BROD}</p>
          <ul className="space-y-2.5 mb-6">
            {resultat.reasons.map((r, idx) => (
              <li key={`${r.kod}-${idx}`} className="flex gap-2.5 text-sm text-slate-700 leading-relaxed">
                <span className="text-brand-600 mt-0.5" aria-hidden="true">•</span>
                <span>{r.text}</span>
              </li>
            ))}
          </ul>
          <div className="rounded-xl bg-brand-50 border border-brand-100 p-5">
            <h3 className="font-semibold text-slate-900 mb-2">Vad utredningen är</h3>
            <p className="text-sm text-slate-700 leading-relaxed mb-4">{copy.B_UTREDNING}</p>
            <Link href="/hjalp-med-bygglov" className="btn-primary text-sm">Begär Bygglovsutredning</Link>
          </div>
          <button
            type="button"
            onClick={() => setVisaGratischunk(true)}
            className="mt-4 text-sm font-semibold text-brand-700 hover:text-brand-900 underline"
          >
            Jag vill bara ha frågorna att ställa till kommunen
          </button>
          {visaGratischunk && (
            <p className="mt-4 text-sm text-slate-700 leading-relaxed border-l-2 border-brand-200 pl-4">
              {copy.bGratischunk(i.kommun || "din kommun")}
            </p>
          )}
        </div>
        <LeadForm
          source="bygglovskoll-B"
          bygglovskoll
          kommun={i.kommun}
          freeOffer={false}
          heading="Vill du att vi hör av oss om utredningen?"
          intro="Frivilligt. Vi återkommer med omfattning och pris innan något arbete påbörjas."
          submitLabel="Skicka förfrågan"
          successText="Vi hör av oss med nästa steg och bekräftar omfattningen innan något arbete påbörjas."
        />
      </div>
    );
  }

  if (resultat?.outcome === "A") {
    return (
      <div className="card p-8">
        <h2 className="font-display text-2xl font-semibold text-slate-900 mb-4">
          Bygglovskoll för ditt projekt — 99 kr
        </h2>
        <p className="text-slate-700 mb-6 leading-relaxed">
          Du har angett {ATGARDER.find(([v]) => v === i.atgard)?.[1].toLowerCase()}
          {i.yta !== null ? ` om ${i.yta} m²` : ""}
          {i.hojd !== null ? ` och ${i.hojd} m` : ""} i {i.kommun}, på ett en- eller tvåbostadshus.
          Utifrån det kan vi ta fram ett personligt underlag.
        </p>

        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <div className="rounded-xl border border-slate-200 p-4">
            <h3 className="font-semibold text-slate-900 text-sm mb-1.5">Vad du betalar för</h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              Ett skriftligt underlag med klassning, tillämpliga regler, hur dina mått ligger mot
              trösklarna, det vi inte kan se och en checklista mot {i.kommun}.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 p-4">
            <h3 className="font-semibold text-slate-900 text-sm mb-1.5">Vad du inte betalar för</h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              Ett besked. Ett ja eller nej. En granskning av detaljplanen.
            </p>
          </div>
        </div>

        <p className="text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6 leading-relaxed">
          {copy.forbehall(idag)}
        </p>

        <div className="space-y-3 mb-6">
          <label className="flex gap-3 text-sm text-slate-700 cursor-pointer">
            <input type="checkbox" required checked={kryssVagledning} onChange={(e) => setKryssVagledning(e.target.checked)} className="mt-1 w-4 h-4 shrink-0" />
            <span>{copy.KRYSS_VAGLEDNING}</span>
          </label>
          <label className="flex gap-3 text-sm text-slate-700 cursor-pointer">
            <input type="checkbox" required checked={kryssAngerratt} onChange={(e) => setKryssAngerratt(e.target.checked)} className="mt-1 w-4 h-4 shrink-0" />
            <span>{copy.KRYSS_ANGERRATT}</span>
          </label>
        </div>

        <button
          type="button"
          onClick={betala}
          disabled={!kryssVagledning || !kryssAngerratt || laddar}
          className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {laddar ? "Öppnar betalningen…" : "Betala 99 kr"}
        </button>
        <div aria-live="polite">
          {fel && <p role="alert" className="text-red-600 text-sm mt-3 text-center">{fel}</p>}
        </div>
        <p className="text-xs text-slate-600 mt-4 leading-relaxed">{copy.ANGERRATT_INFO}</p>
      </div>
    );
  }

  // ── Formuläret ────────────────────────────────────────────────────────────
  return (
    <div className="card p-6 sm:p-8">
      <div className="flex items-center gap-2 mb-6" aria-label={`Steg ${steg} av 4`}>
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className={`h-1.5 flex-1 rounded-full ${s <= steg ? "bg-brand-500" : "bg-slate-200"}`} />
        ))}
      </div>

      {steg === 1 && (
        <>
          <Falt etikett="Vad vill du bygga eller ändra?" hjalp="Välj det som ligger närmast. Osäker klassning hanteras i nästa steg.">
            <Radio namn="Åtgärd" varden={ATGARDER} valt={i.atgard} satt={(v) => uppd({ atgard: v })} />
          </Falt>
          {i.atgard !== "fasadandring" && i.atgard !== "plank" && i.atgard !== "pool" && (
            <Falt
              etikett="Fäst i huset eller fristående?"
              hjalp="Ett uterum som sitter i fasaden är normalt en tillbyggnad. Ett fristående slutet växthus är normalt en komplementbyggnad. Delvis eller oklart leder ofta till utredning i stället för Bygglovskoll."
            >
              <Radio namn="Placering" varden={PLACERINGAR} valt={i.placering} satt={(v) => uppd({ placering: v })} />
            </Falt>
          )}
        </>
      )}

      {steg === 2 && (
        <>
          <Falt etikett="Yta (m²)">
            <input type="number" step="0.1" inputMode="decimal" className={inputKlass} value={i.yta ?? ""} onChange={(e) => uppd({ yta: e.target.value === "" ? null : Number(e.target.value) })} />
          </Falt>
          <Falt etikett="Högsta höjd (m)" hjalp="Taknock för byggnad. För plank och mur: höjd från lägsta marknivå på utsidan.">
            <input type="number" step="0.1" inputMode="decimal" className={inputKlass} value={i.hojd ?? ""} onChange={(e) => uppd({ hojd: e.target.value === "" ? null : Number(e.target.value) })} />
          </Falt>
          {i.atgard === "plank" && (
            <Falt etikett="Längd (m)">
              <input type="number" step="0.1" inputMode="decimal" className={inputKlass} value={i.langd ?? ""} onChange={(e) => uppd({ langd: e.target.value === "" ? null : Number(e.target.value) })} />
            </Falt>
          )}
          <Falt etikett="Avstånd till närmaste tomtgräns (m)">
            <input type="number" step="0.1" inputMode="decimal" className={`${inputKlass} mb-2`} value={i.avstandTomtgrans ?? ""} onChange={(e) => uppd({ avstandTomtgrans: e.target.value === "" ? null : Number(e.target.value) })} />
            <button type="button" onClick={() => uppd({ avstandTomtgrans: null })} className={`min-h-11 px-4 py-2 rounded-xl border text-sm ${i.avstandTomtgrans === null ? "border-brand-500 bg-brand-50 font-semibold" : "border-slate-200"}`}>
              Vet ej
            </button>
          </Falt>
        </>
      )}

      {steg === 3 && (
        <>
          <Falt etikett="Fastighetstyp">
            <Radio namn="Fastighetstyp" varden={TYPER} valt={i.fastighetstyp} satt={(v) => uppd({ fastighetstyp: v })} />
          </Falt>
          <Falt etikett="Kommun">
            <input list="bk-kommuner" className={inputKlass} value={i.kommun} onChange={(e) => uppd({ kommun: e.target.value })} placeholder="Sök kommun" />
            <datalist id="bk-kommuner">
              {kommuner.map((k) => <option key={k} value={k} />)}
            </datalist>
          </Falt>
          <Falt etikett="Fastighetsbeteckning (frivillig)" hjalp="Används bara i underlaget så att du kan visa det för kommunen. Lagras inte som sökbar kundpost.">
            <input type="text" className={inputKlass} value={i.fastighetsbeteckning} onChange={(e) => uppd({ fastighetsbeteckning: e.target.value })} />
          </Falt>
          <Falt etikett="Ligger tomten inom detaljplanerat område?">
            <Radio namn="Detaljplan" varden={JNV} valt={i.detaljplan} satt={(v) => uppd({ detaljplan: v })} />
          </Falt>
          <Falt
            etikett={`Ligger tomten nära hav, sjö eller vattendrag (inom ca ${STRANDSKYDD.utokatMeter} m)?`}
            hjalp={`Strandskydd är normalt ${STRANDSKYDD.normaltMeter} m och kan vara utökat till ${STRANDSKYDD.utokatMeter} m. Vet ej behandlas försiktigt.`}
          >
            <Radio namn="Nära vatten" varden={JNV} valt={i.naraVatten} satt={(v) => uppd({ naraVatten: v })} />
          </Falt>
          <Falt etikett="Är byggnaden eller området kulturhistoriskt utpekat, eller ligger fastigheten inom samfällighet/BRF?">
            <Radio namn="Kulturmiljö" varden={JNV} valt={i.kulturSamfallighet} satt={(v) => uppd({ kulturSamfallighet: v })} />
          </Falt>
        </>
      )}

      {steg === 4 && (
        <>
          <Falt etikett="Finns redan komplementbyggnader (garage, förråd, friggebod, attefall) på tomten?">
            <Radio namn="Befintliga komplement" varden={JNV} valt={i.befintligaKomplement} satt={(v) => uppd({ befintligaKomplement: v, befintligKomplementYta: v === "ja" ? i.befintligKomplementYta : null })} />
          </Falt>
          {i.befintligaKomplement === "ja" && (
            <Falt etikett="Ungefärlig total yta (m²)">
              <input type="number" step="0.1" inputMode="decimal" className={`${inputKlass} mb-2`} value={i.befintligKomplementYta ?? ""} onChange={(e) => uppd({ befintligKomplementYta: e.target.value === "" ? null : Number(e.target.value) })} />
              <button type="button" onClick={() => uppd({ befintligKomplementYta: null })} className={`min-h-11 px-4 py-2 rounded-xl border text-sm ${i.befintligKomplementYta === null ? "border-brand-500 bg-brand-50 font-semibold" : "border-slate-200"}`}>
                Vet ej
              </button>
            </Falt>
          )}
          <Falt etikett="Installeras vatten, avlopp, ventilation eller eldstad?">
            <Radio namn="Installation" varden={JNV} valt={i.installation} satt={(v) => uppd({ installation: v })} />
          </Falt>
          <Falt etikett="Beskriv kort det som inte ryms i valen">
            <textarea rows={3} maxLength={500} className={`${inputKlass} resize-none`} value={i.fritext} onChange={(e) => uppd({ fritext: e.target.value })} />
            <p className="text-xs text-slate-500 mt-1">{i.fritext.length} / 500 tecken</p>
          </Falt>
          <Falt etikett="E-post">
            <input type="email" className={inputKlass} value={i.epost} onChange={(e) => uppd({ epost: e.target.value })} placeholder="anna@exempel.se" />
          </Falt>
        </>
      )}

      <div className="flex gap-3 mt-8">
        {steg > 1 && (
          <button type="button" onClick={() => setSteg(steg - 1)} className="min-h-11 px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            Tillbaka
          </button>
        )}
        <button
          type="button"
          onClick={() => (steg === 4 ? kor() : setSteg(steg + 1))}
          disabled={!kanGaVidare}
          className="btn-primary flex-1 justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {steg === 4 ? "Visa vilket underlag som passar" : "Nästa"}
        </button>
      </div>

      <p className="text-xs text-slate-600 mt-5 leading-relaxed">
        Avstånd under {GRANS.avstandTomtgrans.toString().replace(".", ",")} m till tomtgräns, strandskydd,
        kulturmiljö och installationer gör att vi hänvisar till utredning i stället för att sälja en
        Bygglovskoll. Det visas innan du betalar.
      </p>
    </div>
  );
}
