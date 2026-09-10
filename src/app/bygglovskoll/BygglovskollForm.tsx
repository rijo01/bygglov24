"use client";
import { useMemo, useState } from "react";
import { triage } from "@/lib/bygglovskoll/triage";
import * as copy from "@/lib/bygglovskoll/copy";
import { FRAGA_MAXLANGD, felIKopval } from "@/lib/bygglovskoll/validering";
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
  fraga: "",
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
  const [villHaSvar, setVillHaSvar] = useState(false);

  const uppd = (delta: Partial<Utkast>) => setI((prev) => ({ ...prev, ...delta }));

  const behoverMatt = i.atgard !== "fasadandring";
  const idag = new Date().toISOString().slice(0, 10);

  /**
   * Vad som saknas i det aktuella steget, i klartext. En avstängd knapp utan
   * förklaring läser sig som ett fel i sidan; de tre tvingande frågorna måste
   * dessutom synas som frågor kunden själv ska svara på, inte som något vi
   * tolkar åt hen.
   */
  const saknas = useMemo(() => {
    const fel: string[] = [];
    if (steg === 1 && i.atgard === "tillbyggnad" && i.placering === null) {
      fel.push("Ange om åtgärden är fäst i huset eller fristående.");
    }
    if (steg === 2 && behoverMatt && i.yta === null && i.hojd === null) {
      fel.push("Ange yta eller höjd.");
    }
    if (steg === 3) {
      if (i.kommun.trim().length === 0) fel.push("Ange kommun.");
      if (i.naraVatten === null) fel.push("Svara på frågan om närhet till hav, sjö eller vattendrag.");
      if (i.kulturSamfallighet === null) fel.push("Svara på frågan om kulturmiljö, samfällighet eller BRF.");
    }
    if (steg === 4) {
      if (i.installation === null) fel.push("Svara på frågan om vatten, avlopp, ventilation eller eldstad.");
      if (!/.+@.+\..+/.test(i.epost)) fel.push("Ange en giltig e-postadress.");
      if (i.fritext.length > 500) fel.push("Beskrivningen får vara högst 500 tecken.");
      // Kryssad ruta utan fråga: kunden skulle betala 400 kr för ett tomt
      // uppdrag. Samma kontroll körs om i rutten.
      const kopvalfel = felIKopval(i, { personligtSvar: villHaSvar });
      if (kopvalfel) fel.push(kopvalfel);
    }
    return fel;
  }, [steg, i, behoverMatt, villHaSvar]);

  const kanGaVidare = saknas.length === 0;

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
    const komplett = somIntake(i);
    if (!komplett) {
      setFel("Något av svaren saknas. Gå tillbaka och komplettera formuläret.");
      return;
    }
    setLaddar(true);
    setFel(null);
    try {
      const res = await fetch("/api/bygglovskoll/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          intake: komplett,
          samtycken: { vagledning: kryssVagledning, angerratt: kryssAngerratt },
          kopval: { personligtSvar: villHaSvar },
        }),
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

  if (resultat?.outcome === "A" || resultat?.outcome === "B") {
    const arB = resultat.outcome === "B";
    const pris = villHaSvar ? copy.PRIS_MED_SVAR_KR : copy.PRIS_BAS_KR;
    return (
      <div className="card p-8">
        <h2 className="font-display text-2xl font-semibold text-slate-900 mb-4">
          Bygglovskoll för ditt projekt — {pris} kr
        </h2>

        {arB ? (
          <p className="text-slate-700 mb-6 leading-relaxed">{copy.B_KOP_BROD}</p>
        ) : (
          <p className="text-slate-700 mb-6 leading-relaxed">
            Du har angett {ATGARDER.find(([v]) => v === i.atgard)?.[1].toLowerCase()}
            {i.yta !== null ? ` om ${i.yta} m²` : ""}
            {i.hojd !== null ? ` och ${i.hojd} m` : ""} i {i.kommun}, på ett en- eller tvåbostadshus.
            Utifrån det kan vi ta fram ett personligt underlag.
          </p>
        )}

        {arB && (
          <div className="rounded-xl border border-slate-200 p-5 mb-6">
            <h3 className="font-semibold text-slate-900 text-sm mb-2.5">{copy.B_OMSTANDIGHETER_RUBRIK}</h3>
            <ul className="space-y-2.5">
              {resultat.reasons.map((r, idx) => (
                <li key={`${r.kod}-${idx}`} className="flex gap-2.5 text-sm text-slate-700 leading-relaxed">
                  <span className="text-brand-600 mt-0.5" aria-hidden="true">•</span>
                  <span>{r.text}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <div className="rounded-xl border border-slate-200 p-4">
            <h3 className="font-semibold text-slate-900 text-sm mb-1.5">Vad du betalar för</h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              Ett skriftligt underlag med klassning, tillämpliga regler, hur dina mått ligger mot
              trösklarna, {arB ? "varje omständighet ovan med vad den betyder och hur du kontrollerar den" : "det vi inte kan se"} och
              en checklista mot {i.kommun}.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 p-4">
            <h3 className="font-semibold text-slate-900 text-sm mb-1.5">Vad du inte betalar för</h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              Ett besked. Ett ja eller nej. En granskning av detaljplanen.
            </p>
          </div>
        </div>

        {villHaSvar && (
          <div className="rounded-xl bg-brand-50 border border-brand-100 p-5 mb-6">
            <h3 className="font-semibold text-slate-900 text-sm mb-1.5">
              Tillägg: personligt svar (+{copy.PRIS_TILLAGG_KR} kr)
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed mb-2">{copy.FRAGA_VAD_DU_FAR}</p>
            <p className="text-sm text-slate-700 leading-relaxed mb-2">
              Vi skickar det till {i.epost}.
            </p>
            <p className="text-sm text-slate-700 leading-relaxed">{copy.FRAGA_FORBEHALL}</p>
          </div>
        )}

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
          {laddar ? "Öppnar betalningen…" : `Betala ${pris} kr`}
        </button>
        <div aria-live="polite">
          {fel && <p role="alert" className="text-red-600 text-sm mt-3 text-center">{fel}</p>}
        </div>
        <p className="text-xs text-slate-600 mt-4 leading-relaxed">{copy.ANGERRATT_INFO}</p>
        <button
          type="button"
          onClick={() => { setResultat(null); setSteg(4); }}
          className="mt-4 text-sm font-semibold text-brand-700 hover:text-brand-900 underline"
        >
          Ändra mina uppgifter
        </button>
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
          <Falt etikett={copy.FRAGA_ETIKETT} hjalp={copy.FRAGA_HJALP}>
            <textarea
              rows={3}
              maxLength={FRAGA_MAXLANGD}
              className={`${inputKlass} resize-none`}
              value={i.fraga}
              onChange={(e) => uppd({ fraga: e.target.value })}
            />
            <p className="text-xs text-slate-500 mt-1">{i.fraga.length} / {FRAGA_MAXLANGD} tecken</p>
            <label className="flex gap-3 text-sm text-slate-700 cursor-pointer mt-3">
              <input
                type="checkbox"
                checked={villHaSvar}
                onChange={(e) => setVillHaSvar(e.target.checked)}
                className="mt-1 w-4 h-4 shrink-0"
              />
              <span>{copy.FRAGA_KRYSS}</span>
            </label>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">{copy.FRAGA_FORBEHALL}</p>
          </Falt>
        </>
      )}

      <div aria-live="polite">
        {saknas.length > 0 && (
          <ul className="mt-6 space-y-1 text-sm text-slate-600">
            {saknas.map((f) => (
              <li key={f} className="flex gap-2">
                <span aria-hidden="true">•</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

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
        kulturmiljö och installationer avgör inte om vi säljer — de blir omständigheter som listas i
        ditt underlag med vad du ska kontrollera. Du ser dem innan du betalar.
      </p>
    </div>
  );
}
