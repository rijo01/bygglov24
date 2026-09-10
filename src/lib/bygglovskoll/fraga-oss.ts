import { skickaWeb3Forms } from "../web3forms";
import { tal } from "./rules";
import type { Intake, TriageResultat } from "./types";

/**
 * Tillägget «Fråga oss»: när en betald session avser det dyrare priset skickas
 * intaget, frågan, utfallet och kundens e-post till info@bygglov24.se via samma
 * Web3Forms-väg som lead-formuläret, med källan «fraga-oss».
 *
 * Frågan finns bara i den signerade cookien — den skickas aldrig till Stripe.
 * Öppnar kunden kvittot på en annan enhet finns frågan därför inte att återge,
 * och då går brevet ändå (vi har tagit betalt för ett svar och måste få veta
 * det) men märkt med att frågan saknas. `fragaStatus` skiljer de två fallen åt
 * så att anroparen kan skicka om brevet när frågan väl dyker upp.
 */

export const FRAGA_OSS_KALLA = "fraga-oss";

export type FragaStatus = "med-fraga" | "utan-fraga";

function jn(v: string): string {
  return v === "ja" ? "Ja" : v === "nej" ? "Nej" : "Vet ej";
}

export function fragaStatusFor(intake: Intake): FragaStatus {
  return intake.fraga.trim().length > 0 ? "med-fraga" : "utan-fraga";
}

export function byggBrevtext(
  intake: Intake,
  resultat: TriageResultat,
  stripeSessionId: string,
): string {
  const rader = [
    `Källa:              ${FRAGA_OSS_KALLA}`,
    `Stripe-session:     ${stripeSessionId}`,
    `Kundens e-post:     ${intake.epost}`,
    `Utfall:             ${resultat.outcome}`,
    `Klassning:          ${resultat.classification}`,
    `Utlösta flaggor:    ${resultat.reasons.map((r) => r.kod).join(", ") || "inga"}`,
    `Regelbank:          ${resultat.rulesVersion}`,
    "",
    "KUNDENS FRÅGA",
    intake.fraga.trim() ||
      "(Frågan kunde inte återskapas ur den här sessionen — kunden öppnade kvittot i en annan " +
        "webbläsare eller enhet. Kontakta kunden på e-postadressen ovan.)",
    "",
    "INTAG",
    `Åtgärd:             ${intake.atgard}`,
    `Placering:          ${intake.placering ?? "ej angiven"}`,
    `Yta:                ${intake.yta !== null ? `${tal(intake.yta)} m²` : "ej angiven"}`,
    `Höjd:               ${intake.hojd !== null ? `${tal(intake.hojd)} m` : "ej angiven"}`,
    `Längd:              ${intake.langd !== null ? `${tal(intake.langd)} m` : "ej angiven"}`,
    `Avstånd tomtgräns:  ${intake.avstandTomtgrans !== null ? `${tal(intake.avstandTomtgrans)} m` : "Vet ej"}`,
    `Fastighetstyp:      ${intake.fastighetstyp}`,
    `Kommun:             ${intake.kommun}`,
    `Fastighetsbeteckn.: ${intake.fastighetsbeteckning || "inte angiven"}`,
    `Detaljplan:         ${jn(intake.detaljplan)}`,
    `Nära vatten:        ${jn(intake.naraVatten)}`,
    `Kultur/samfällighet:${jn(intake.kulturSamfallighet)}`,
    `Befintliga komplem.:${jn(intake.befintligaKomplement)}${
      intake.befintligKomplementYta !== null ? ` (ca ${tal(intake.befintligKomplementYta)} m²)` : ""
    }`,
    `Installation:       ${jn(intake.installation)}`,
    "",
    "KUNDENS BESKRIVNING",
    intake.fritext.trim() || "—",
    "",
    "Svar ska skickas till kunden inom två arbetsdagar. Svaret är vägledning från Bygglov24 " +
      "utifrån kundens uppgifter — inte kommunens beslut och inte juridisk rådgivning.",
  ];
  return rader.join("\n");
}

/** Skickar brevet. Returnerar false när det inte gick fram. */
export async function skickaFragaOss(
  intake: Intake,
  resultat: TriageResultat,
  stripeSessionId: string,
): Promise<boolean> {
  return skickaWeb3Forms({
    subject: `Fråga oss – personligt svar (${intake.kommun}, utfall ${resultat.outcome})`,
    from_name: "Bygglovskoll – Fråga oss",
    email: intake.epost,
    message: byggBrevtext(intake, resultat, stripeSessionId),
  });
}
