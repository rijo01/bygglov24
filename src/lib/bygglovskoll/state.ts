import crypto from "node:crypto";
import { arKomplettIntake } from "./validering";
import type { Intake } from "./types";

/**
 * Intake-state mellan formulär och Stripe-retur. Ingen databas i v1:
 * hela intaket ligger i en signerad, HttpOnly-cookie, och en hash av samma
 * intake ligger i Stripe-sessionens metadata. Vid retur måste båda stämma —
 * cookien kan inte manipuleras utan att signaturen brister, och den kan inte
 * återanvändas för en annan betalning eftersom hashen är bunden till sessionen.
 */

const COOKIE_NAMN = "bk_intake";

function nyckel(): Buffer {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) throw new Error("STRIPE_SECRET_KEY saknas — kan inte signera intake-state.");
  // Härledd nyckel så att cookie-signaturen inte är själva API-nyckeln.
  return crypto.createHmac("sha256", secret).update("bygglovskoll:intake:v1").digest();
}

function b64url(b: Buffer): string {
  return b.toString("base64url");
}

/** Stabil hash över intaket. Samma intake ger alltid samma hash. */
export function intakeHash(i: Intake): string {
  const kanonisk = JSON.stringify(
    Object.keys(i)
      .sort()
      .map((k) => [k, (i as unknown as Record<string, unknown>)[k]]),
  );
  return crypto.createHash("sha256").update(kanonisk).digest("hex").slice(0, 32);
}

export function signera(i: Intake): string {
  const payload = b64url(Buffer.from(JSON.stringify(i), "utf8"));
  const sig = b64url(crypto.createHmac("sha256", nyckel()).update(payload).digest());
  return `${payload}.${sig}`;
}

export function verifiera(varde: string | undefined): Intake | null {
  if (!varde) return null;
  const [payload, sig] = varde.split(".");
  if (!payload || !sig) return null;
  const vantad = b64url(crypto.createHmac("sha256", nyckel()).update(payload).digest());
  // Konstanttidsjämförelse; längdskillnad kastar i timingSafeEqual.
  const a = Buffer.from(sig);
  const b = Buffer.from(vantad);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    return JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as Intake;
  } catch {
    return null;
  }
}

/**
 * Intaket som Stripe-metadata, ett fält per nyckel. Metadatan är källan till
 * leveransen — cookien är bara en cache som bär fritexten. Stripe tillåter 50
 * nycklar à 500 tecken; intaket använder 17 plus fyra egna fält.
 *
 * Fritexten utelämnas medvetet: den kan vara 500 tecken, den är det enda fältet
 * med fri användartext, och den behövs inte för att bygga underlaget.
 */
export function intakeTillMetadata(i: Intake): Record<string, string> {
  const v = (x: string | number | null): string => (x === null ? "" : String(x));
  return {
    atgard: i.atgard,
    placering: v(i.placering),
    yta: v(i.yta),
    hojd: v(i.hojd),
    langd: v(i.langd),
    avstandTomtgrans: v(i.avstandTomtgrans),
    fastighetstyp: i.fastighetstyp,
    kommun: i.kommun.slice(0, 200),
    fastighetsbeteckning: i.fastighetsbeteckning.slice(0, 200),
    detaljplan: i.detaljplan,
    naraVatten: i.naraVatten,
    kulturSamfallighet: i.kulturSamfallighet,
    befintligaKomplement: i.befintligaKomplement,
    befintligKomplementYta: v(i.befintligKomplementYta),
    installation: i.installation,
    epost: i.epost.slice(0, 200),
  };
}

/**
 * Bygger tillbaka intaket ur metadatan. Fritexten finns inte där och blir tom
 * — underlaget skriver då "—" i avsnitt 1, vilket är korrekt och inte en gissning.
 *
 * Tre-lägesfälten läses ordagrant. Ett värde som inte är "ja", "nej" eller
 * "vetej" gjorde tidigare tyst om sig till "vetej"; då hade metadatan sagt en
 * sak och underlaget en annan. Nu går hela intaket genom samma validering som
 * på vägen in, och ett fält vi inte kan läsa ger null i stället för ett påhittat
 * svar. Metadatan skrivs alltid av intakeTillMetadata, så ett giltigt köp
 * påverkas inte.
 */
export function metadataTillIntake(m: Record<string, string> | null | undefined): Intake | null {
  if (!m) return null;
  const num = (s: string | undefined): number | null =>
    s === undefined || s === "" || Number.isNaN(Number(s)) ? null : Number(s);
  const kandidat = {
    atgard: m.atgard,
    placering: m.placering || null,
    yta: num(m.yta),
    hojd: num(m.hojd),
    langd: num(m.langd),
    avstandTomtgrans: num(m.avstandTomtgrans),
    fastighetstyp: m.fastighetstyp,
    kommun: m.kommun ?? "",
    fastighetsbeteckning: m.fastighetsbeteckning ?? "",
    detaljplan: m.detaljplan,
    naraVatten: m.naraVatten,
    kulturSamfallighet: m.kulturSamfallighet,
    befintligaKomplement: m.befintligaKomplement,
    befintligKomplementYta: num(m.befintligKomplementYta),
    installation: m.installation,
    fritext: "",
    epost: m.epost ?? "",
  };
  return arKomplettIntake(kandidat) ? kandidat : null;
}

export { COOKIE_NAMN };
