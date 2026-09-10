import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { triage } from "@/lib/bygglovskoll/triage";
import { intakeHash, signera, intakeTillMetadata, COOKIE_NAMN } from "@/lib/bygglovskoll/state";
import { RULES_VERSION } from "@/lib/bygglovskoll/rules";
import { bygglovskollAktiv } from "@/lib/bygglovskoll/flag";
import { felIIntake, felIKopval } from "@/lib/bygglovskoll/validering";
import type { Intake, Kopval } from "@/lib/bygglovskoll/types";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

/**
 * Skapar Checkout-sessionen. Triagen körs om på servern — klienten får aldrig
 * avgöra utfallet.
 *
 * v1.1: både A och B säljs. 99 kr köper vägledning och underlag, aldrig ett ja
 * eller nej, och ett B-ärende har bara fler omständigheter att skriva om. Bara
 * utfall C säljs inte — där finns inget eget projekt att skriva underlag för.
 *
 * Tillägget «Fråga oss» (+400 kr) väljer ett annat pris i Checkout. Kundens
 * fråga följer aldrig med till Stripe; den ligger i den signerade cookien och
 * går vidare till oss i mejlet vid leverans.
 */
export async function POST(req: NextRequest) {
  // Avstängd tjänst ska inte gå att nå ens via ett direkt API-anrop.
  if (!bygglovskollAktiv()) return new NextResponse(null, { status: 404 });

  try {
    const { intake, samtycken, kopval } = (await req.json()) as {
      intake: Intake;
      samtycken?: { vagledning?: boolean; angerratt?: boolean };
      kopval?: Kopval;
    };

    if (!samtycken?.vagledning || !samtycken?.angerratt) {
      return NextResponse.json({ error: "Båda kryssrutorna måste vara ikryssade före köp." }, { status: 400 });
    }

    // Ett obesvarat fält får aldrig tolkas som "vet ej" och tyst bli B — då ser
    // varken kunden eller vi att frågan aldrig kom fram. Det är ett fel.
    const fel = felIIntake(intake);
    if (fel) return NextResponse.json({ error: fel, kod: "OFULLSTANDIGT_INTAKE" }, { status: 400 });

    const kopvalfel = felIKopval(intake, kopval);
    if (kopvalfel) {
      return NextResponse.json({ error: kopvalfel, kod: "FRAGA_SAKNAS" }, { status: 400 });
    }

    const resultat = triage(intake);
    if (resultat.outcome === "C") {
      // C är inte ett eget bygg- eller ändringsprojekt. Där finns ingenting att
      // skriva underlag om, och då säljs ingenting — hänvisningen är gratis.
      return NextResponse.json(
        {
          error: "Frågan ligger utanför Bygglovskoll.",
          outcome: resultat.outcome,
          reasons: resultat.reasons.map((r) => r.kod),
        },
        { status: 409 },
      );
    }
    if (resultat.outcome === "A" && !resultat.regelspar) {
      return NextResponse.json({ error: "Regelspåret kunde inte låsas." }, { status: 409 });
    }

    const personligtSvar = kopval?.personligtSvar === true;
    const priceId = personligtSvar
      ? process.env.STRIPE_PRICE_BYGGLOVSKOLL_SVAR
      : process.env.STRIPE_PRICE_BYGGLOVSKOLL;
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
        outcome: resultat.outcome,
        // Orsakskoderna följer med så att B-underlaget kan byggas och granskas
        // från sessionen ensam. Texterna genereras om ur samma deterministiska
        // triage vid leverans — koderna är facit på vad som utlöstes vid köpet.
        reasons: resultat.reasons.map((r) => r.kod).join(",").slice(0, 500),
        regelspar: resultat.regelspar ?? "",
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
