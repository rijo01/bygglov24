import type { TriageResultat } from "./types";

/**
 * Minimal köplogg, en rad per genomfört köp. Medvetet ingen fritext, ingen
 * e-post och ingen fastighetsbeteckning — bara det som behövs för att kunna
 * följa upp regelversion mot utfall.
 *
 * Skrivs som en strukturerad rad till stdout och fångas av Vercels runtime-
 * loggar. Retention: 90 dagar. Vercel KV erbjuds inte längre, och v1 provisionerar
 * medvetet ingen extern databas; behövs sökbar historik får ett lager från
 * Vercel Marketplace läggas till, och då sätts TTL till 90 dagar där i stället.
 */
export interface Kopslogg {
  ts: string;
  intakeHash: string;
  outcome: TriageResultat["outcome"];
  classification: TriageResultat["classification"];
  rulesVersion: string;
  stripeSessionId: string;
}

export const RETENTION_DAGAR = 90;

export function loggaKop(rad: Kopslogg): void {
  console.log(JSON.stringify({ typ: "bygglovskoll.kop", retentionDagar: RETENTION_DAGAR, ...rad }));
}
