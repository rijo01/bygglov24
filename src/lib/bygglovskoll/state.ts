import crypto from "node:crypto";
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

export { COOKIE_NAMN };
