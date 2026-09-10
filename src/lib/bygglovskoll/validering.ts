import type { Intake, JaNejVetEj, Kopval } from "./types";

/**
 * Kontraktet mellan formuläret och triagen.
 *
 * Triagen är konservativ men tyst: ett fält som varken är "ja", "nej" eller
 * "vetej" faller bara ur alla grenar och landar i B-fallbacken. Kunden ser då
 * en utredningshänvisning utan att veta att en fråga aldrig kom fram. Därför
 * valideras intaket innan triagen körs — ett obesvarat fält är ett fel med ett
 * eget meddelande, aldrig ett underförstått "vet ej".
 *
 * Samma kontroll används på båda vägarna in: klientens POST till checkout och
 * intaket som byggs tillbaka ur Stripe-metadatan vid leverans.
 */

/** Max längd på kundens egen fråga i tillägget «Fråga oss». */
export const FRAGA_MAXLANGD = 800;

const ATGARDER: ReadonlyArray<Intake["atgard"]> = [
  "tillbyggnad",
  "fristaende",
  "altan",
  "plank",
  "fasadandring",
  "pool",
  "annat",
];

const PLACERINGAR: ReadonlyArray<NonNullable<Intake["placering"]>> = ["fast", "fristaende", "oklart"];

const FASTIGHETSTYPER: ReadonlyArray<Intake["fastighetstyp"]> = [
  "villa",
  "flerbostad",
  "fritidshus",
  "annat",
];

const JNV: ReadonlyArray<JaNejVetEj> = ["ja", "nej", "vetej"];

/** De tre frågor som avgör om ärendet över huvud taget kan säljas som Bygglovskoll. */
const TVINGANDE: ReadonlyArray<[keyof Intake, string]> = [
  ["naraVatten", "Frågan om tomten ligger nära hav, sjö eller vattendrag måste besvaras."],
  [
    "kulturSamfallighet",
    "Frågan om kulturhistoriskt utpekad byggnad eller samfällighet/BRF måste besvaras.",
  ],
  [
    "installation",
    "Frågan om installation av vatten, avlopp, ventilation eller eldstad måste besvaras.",
  ],
];

/** Övriga tre-lägesfält. Har förval i formuläret men måste ändå vara giltiga. */
const OVRIGA_JNV: ReadonlyArray<[keyof Intake, string]> = [
  ["detaljplan", "Frågan om detaljplanerat område måste besvaras."],
  ["befintligaKomplement", "Frågan om befintliga komplementbyggnader måste besvaras."],
];

function arJnv(v: unknown): v is JaNejVetEj {
  return typeof v === "string" && (JNV as readonly string[]).includes(v);
}

/** null eller ett ändligt tal. NaN räknas som saknat värde, inte som noll. */
function arTalEllerNull(v: unknown): boolean {
  return v === null || (typeof v === "number" && Number.isFinite(v));
}

/**
 * Returnerar det första felet i klartext, eller null när intaket är komplett.
 * Meddelandet är avsett att visas för kunden som det är.
 */
export function felIIntake(v: unknown): string | null {
  if (typeof v !== "object" || v === null) return "Uppgifterna saknas.";
  const i = v as Record<string, unknown>;

  if (!(ATGARDER as readonly unknown[]).includes(i.atgard)) return "Välj vad du vill bygga eller ändra.";
  if (i.placering !== null && !(PLACERINGAR as readonly unknown[]).includes(i.placering)) {
    return "Ange om åtgärden är fäst i huset eller fristående.";
  }
  if (!(FASTIGHETSTYPER as readonly unknown[]).includes(i.fastighetstyp)) return "Välj fastighetstyp.";

  for (const falt of ["yta", "hojd", "langd", "avstandTomtgrans", "befintligKomplementYta"] as const) {
    if (!arTalEllerNull(i[falt])) return "Måtten måste anges som tal.";
  }

  if (typeof i.kommun !== "string" || i.kommun.trim().length === 0) return "Ange kommun.";
  if (typeof i.fastighetsbeteckning !== "string") return "Fastighetsbeteckningen måste vara text.";
  if (typeof i.fritext !== "string" || i.fritext.length > 500) {
    return "Beskrivningen får vara högst 500 tecken.";
  }
  if (typeof i.fraga !== "string" || i.fraga.length > FRAGA_MAXLANGD) {
    return `Frågan får vara högst ${FRAGA_MAXLANGD} tecken.`;
  }
  if (typeof i.epost !== "string" || !/.+@.+\..+/.test(i.epost)) return "Ange en giltig e-postadress.";

  for (const [falt, meddelande] of [...TVINGANDE, ...OVRIGA_JNV]) {
    if (!arJnv(i[falt])) return meddelande;
  }

  return null;
}

/** Snäv typvakt runt felIIntake, så att anroparen får ett Intake att arbeta med. */
export function arKomplettIntake(v: unknown): v is Intake {
  return felIIntake(v) === null;
}

/**
 * Tillägget «Fråga oss» säljer ett svar på en fråga. Är rutan ikryssad men
 * frågan tom finns ingenting att svara på, och kunden skulle betala 400 kr för
 * ett tomt uppdrag. Det är ett valideringsfel, inte ett tyst avstängt tillägg —
 * samma kontroll i formuläret och i rutten.
 */
export function felIKopval(intake: { fraga?: unknown }, kopval: Kopval | undefined): string | null {
  if (!kopval?.personligtSvar) return null;
  const fraga = typeof intake.fraga === "string" ? intake.fraga.trim() : "";
  if (fraga.length === 0) {
    return "Skriv din fråga i fältet ovan — det personliga svaret behöver en fråga att svara på.";
  }
  return null;
}
