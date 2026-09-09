import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import Stripe from "stripe";
import { triage } from "@/lib/bygglovskoll/triage";
import { byggOrientering } from "@/lib/bygglovskoll/templates";
import { intakeHash, verifiera, COOKIE_NAMN } from "@/lib/bygglovskoll/state";
import { loggaKop } from "@/lib/bygglovskoll/log";
import { RULES_VERSION } from "@/lib/bygglovskoll/rules";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

/**
 * Låser upp underlaget först när Stripe bekräftar att sessionen är betald och
 * avser rätt pris. Intaket kommer ur den signerade cookien och måste hasha till
 * samma värde som sessionens metadata — annars är det inte samma köp.
 * Ingen PDF lagras; orienteringen byggs om och renderas i klienten.
 */
export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session_id");
  if (!sessionId) return NextResponse.json({ error: "session_id saknas." }, { status: 400 });

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, { expand: ["line_items"] });

    if (session.payment_status !== "paid") {
      return NextResponse.json({ error: "Betalningen är inte genomförd." }, { status: 402 });
    }

    const forvantatPris = process.env.STRIPE_PRICE_BYGGLOVSKOLL;
    const betaltPris = session.line_items?.data?.[0]?.price?.id;
    if (!forvantatPris || betaltPris !== forvantatPris) {
      return NextResponse.json({ error: "Betalningen avser inte Bygglovskoll." }, { status: 409 });
    }

    const jar = await cookies();
    const intake = verifiera(jar.get(COOKIE_NAMN)?.value);
    if (!intake) {
      return NextResponse.json(
        { error: "Underlaget kunde inte hämtas i den här webbläsaren. Kontakta oss så skickar vi det." },
        { status: 410 },
      );
    }

    if (intakeHash(intake) !== session.metadata?.intakeHash) {
      return NextResponse.json({ error: "Uppgifterna matchar inte betalningen." }, { status: 409 });
    }

    // Triagen körs om — utfallet får aldrig komma från klienten eller cookien.
    const resultat = triage(intake);
    if (resultat.outcome !== "A" || !resultat.regelspar) {
      return NextResponse.json({ error: "Ärendet kvalificerar inte för Bygglovskoll." }, { status: 409 });
    }

    const orientering = byggOrientering(intake, resultat);

    loggaKop({
      ts: new Date().toISOString(),
      intakeHash: intakeHash(intake),
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
