/**
 * Vilken origin Stripe ska skicka kunden tillbaka till.
 *
 * Buggen som gav upphov till modulen: returadresserna byggdes från en fast
 * domän. En betalning som startades på en preview-deploy landade därför på
 * produktion, där BYGGLOVSKOLL_ENABLED är av — kunden hade betalat och fick
 * en 404. Returen måste följa den värd som faktiskt gjorde anropet.
 *
 * Men bara den värden får inte reflekteras rakt av. `x-forwarded-host` och
 * `Origin` sätts av anroparen och kan innehålla vad som helst; skrevs de in i
 * success_url vore Checkout-sessionen en öppen vidarebefordran som dessutom
 * bär vårt session-id. Därför en allowlist, och allt utanför den faller
 * tillbaka på den kanoniska domänen.
 */

export const KANONISK_ORIGIN = "https://bygglov24.se";

/** Produktionsdomänerna. Exakt matchning, inga subdomäner på köpet. */
const KANONISKA_VARDAR = new Set(["bygglov24.se", "www.bygglov24.se"]);

/**
 * Projektets egna preview-värdar hos Vercel:
 * `bygglov24-<deploy eller gren>-rickards-projects-741176ef.vercel.app`.
 * Både prefixet och suffixet krävs, så varken `evil-bygglov24-…` eller
 * `bygglov24-…-rickards-projects-741176ef.vercel.app.evil.com` matchar.
 */
const PREVIEW_VARD = /^bygglov24-[a-z0-9-]+-rickards-projects-741176ef\.vercel\.app$/;

/** Lokal utveckling. Tillåts bara utanför Vercel, se harledOrigin. */
const LOKAL_VARD = /^(localhost|127\.0\.0\.1)(:\d{1,5})?$/;

function korPaVercel(): boolean {
  return Boolean(process.env.VERCEL);
}

export function tillatenVard(vard: string): boolean {
  const v = vard.trim().toLowerCase();
  if (v.length === 0 || v.length > 255) return false;
  // En värd med userinfo, sökväg eller mellanslag är inte en värd.
  if (/[^a-z0-9.:-]/.test(v)) return false;
  if (KANONISKA_VARDAR.has(v)) return true;
  if (PREVIEW_VARD.test(v)) return true;
  return !korPaVercel() && LOKAL_VARD.test(v);
}

/** Bara det som når oss: en uppslagsfunktion, inte hela request-objektet. */
export type Headerlasare = { get(namn: string): string | null };

/** Första värdet i en lista som `a, b` — proxykedjor skriver flera. */
function forsta(varde: string | null): string | null {
  if (!varde) return null;
  const forsta = varde.split(",")[0]?.trim();
  return forsta && forsta.length > 0 ? forsta : null;
}

function vardUrOrigin(varde: string | null): string | null {
  if (!varde) return null;
  try {
    return new URL(varde).host;
  } catch {
    return null;
  }
}

/**
 * Härleder origin ur anropets headers. Okänd värd ger den kanoniska domänen —
 * hellre fel domän i returen än en öppen vidarebefordran.
 */
export function harledOrigin(headers: Headerlasare): string {
  const vard =
    forsta(headers.get("x-forwarded-host")) ??
    vardUrOrigin(headers.get("origin")) ??
    forsta(headers.get("host"));

  if (!vard || !tillatenVard(vard)) return KANONISK_ORIGIN;

  // https tvingas för allt utom lokal utveckling: en produktions- eller
  // preview-domän ska aldrig kunna nedgraderas via en header.
  const protokoll = LOKAL_VARD.test(vard.toLowerCase())
    ? (forsta(headers.get("x-forwarded-proto")) ?? "http")
    : "https";

  return `${protokoll}://${vard.toLowerCase()}`;
}
