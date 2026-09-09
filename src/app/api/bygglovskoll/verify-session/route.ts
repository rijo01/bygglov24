import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import Stripe from "stripe";
import { triage } from "@/lib/bygglovskoll/triage";
import { byggOrientering } from "@/lib/bygglovskoll/templates";
import { intakeHash, verifiera, metadataTillIntake, COOKIE_NAMN } from "@/lib/bygglovskoll/state";
import { loggaKop } from "@/lib/bygglovskoll/log";
import { RULES_VERSION } from "@/lib/bygglovskoll/rules";
import { ATERBETALNING } from "@/lib/bygglovskoll/copy";
import type { Intake } from "@/lib/bygglovskoll/types";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

/**
 * Låser upp underlaget när Stripe bekräftar att sessionen är betald och avser
 * rätt pris. Intaket byggs från sessionens metadata — den är källan, så
 * leveransen fungerar i vilken webbläsare eller enhet som helst.
 *
 * Den signerade cookien används bara som cache: den bär fritexten, som inte
 * skickas till Stripe. Saknas cookien levereras underlaget ändå, med fritexten
 * tom. Den får aldrig vara ett villkor för leverans.
 *
 * Ingen PDF lagras; orienteringen byggs om vid varje anrop.
 */
export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session_id");
  if (!sessionId) {
    return NextResponse.json({ error: ATERBETALNING }, { status: 410 });
  }

  try {
    let session: Stripe.Checkout.Session;
    try {
      session = await stripe.checkout.sessions.retrieve(sessionId, { expand: ["line_items"] });
    } catch {
      return NextResponse.json({ error: ATERBETALNING }, { status: 410 });
    }

    if (session.payment_status !== "paid") {
      return NextResponse.json({ error: ATERBETALNING }, { status: 410 });
    }

    const forvantatPris = process.env.STRIPE_PRICE_BYGGLOVSKOLL;
    const betaltPris = session.line_items?.data?.[0]?.price?.id;
    if (!forvantatPris || betaltPris !== forvantatPris) {
      return NextResponse.json({ error: "Betalningen avser inte Bygglovskoll." }, { status: 409 });
    }

    // Källan: metadatan på den betalda sessionen.
    const franMetadata = metadataTillIntake(session.metadata as Record<string, string> | null);
    if (!franMetadata) {
      return NextResponse.json({ error: ATERBETALNING }, { status: 410 });
    }

    // Cachen: cookien bär fritexten. Används bara om den hör till samma köp.
    let intake: Intake = franMetadata;
    const jar = await cookies();
    const franCookie = verifiera(jar.get(COOKIE_NAMN)?.value);
    if (franCookie && intakeHash(franCookie) === session.metadata?.intakeHash) {
      intake = franCookie;
    }

    // Triagen körs om — utfallet får aldrig komma från klienten eller cookien.
    const resultat = triage(intake);
    if (resultat.outcome !== "A" || !resultat.regelspar) {
      return NextResponse.json({ error: "Ärendet kvalificerar inte för Bygglovskoll." }, { status: 409 });
    }

    const orientering = byggOrientering(intake, resultat);

    loggaKop({
      ts: new Date().toISOString(),
      intakeHash: session.metadata?.intakeHash ?? intakeHash(intake),
      outcome: resultat.outcome,
      classification: resultat.classification,
      rulesVersion: RULES_VERSION,
      stripeSessionId: session.id,
    });

    return NextResponse.json({ orientering, klassning: resultat.classification, rulesVersion: RULES_VERSION });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Okänt fel";
    console.error("bygglovskoll/verify-session:", message);
    return NextResponse.json({ error: "Kunde inte verifiera betalningen." }, { status: 500 });
  }
}
