import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { triage } from "@/lib/bygglovskoll/triage";
import { intakeHash, signera, intakeTillMetadata, COOKIE_NAMN } from "@/lib/bygglovskoll/state";
import { RULES_VERSION } from "@/lib/bygglovskoll/rules";
import { bygglovskollAktiv } from "@/lib/bygglovskoll/flag";
import { felIIntake } from "@/lib/bygglovskoll/validering";
import type { Intake } from "@/lib/bygglovskoll/types";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

/**
 * Skapar Checkout-sessionen. Triagen körs om på servern — klienten får aldrig
 * avgöra att ett fall är A. Matchar inte intaket ett A-utfall med låst
 * regelspår säljs ingenting.
 */
export async function POST(req: NextRequest) {
  // Avstängd tjänst ska inte gå att nå ens via ett direkt API-anrop.
  if (!bygglovskollAktiv()) return new NextResponse(null, { status: 404 });

  try {
    const { intake, samtycken } = (await req.json()) as {
      intake: Intake;
      samtycken?: { vagledning?: boolean; angerratt?: boolean };
    };

    if (!samtycken?.vagledning || !samtycken?.angerratt) {
      return NextResponse.json({ error: "Båda kryssrutorna måste vara ikryssade före köp." }, { status: 400 });
    }

    // Ett obesvarat fält får aldrig tolkas som "vet ej" och tyst bli B — då ser
    // varken kunden eller vi att frågan aldrig kom fram. Det är ett fel.
    const fel = felIIntake(intake);
    if (fel) return NextResponse.json({ error: fel, kod: "OFULLSTANDIGT_INTAKE" }, { status: 400 });

    const resultat = triage(intake);
    if (resultat.outcome !== "A" || !resultat.regelspar) {
      // Konservativt: servern säljer aldrig ett fall som inte är A. Koderna
      // följer med så att det går att se vilken flagga som stoppade köpet.
      return NextResponse.json(
        {
          error: "Ärendet kvalificerar inte för Bygglovskoll.",
          outcome: resultat.outcome,
          reasons: resultat.reasons.map((r) => r.kod),
        },
        { status: 409 },
      );
    }

    const priceId = process.env.STRIPE_PRICE_BYGGLOVSKOLL;
    if (!priceId) return NextResponse.json({ error: "Pris saknas i konfigurationen." }, { status: 500 });

    const bas = process.env.NEXT_PUBLIC_SITE_URL || "https://bygglov24.se";
    const hash = intakeHash(intake);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      locale: "sv",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${bas}/bygglovskoll/klar?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${bas}/bygglovskoll?avbruten=1`,
      customer_email: intake.epost || undefined,
      // Metadatan bär hela intaket utom fritexten och är källan vid leverans.
      // Underlaget kan därmed byggas av enbart session_id, oberoende av
      // webbläsare och enhet.
      metadata: {
        ...intakeTillMetadata(intake),
        intakeHash: hash,
        rulesVersion: RULES_VERSION,
        regelspar: resultat.regelspar,
        classification: resultat.classification,
      },
    });

    if (!session.url) return NextResponse.json({ error: "Kunde inte starta betalningen." }, { status: 502 });

    const res = NextResponse.json({ url: session.url });
    // Cookien är en cache som bär fritexten (som inte får plats i metadatan).
    // Leveransen fungerar utan den — se verify-session.
    res.cookies.set(COOKIE_NAMN, signera(intake), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 6,
    });
    return res;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Okänt fel";
    console.error("bygglovskoll/checkout:", message);
    return NextResponse.json({ error: "Kunde inte starta betalningen." }, { status: 500 });
  }
}
