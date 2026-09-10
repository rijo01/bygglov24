import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import Stripe from "stripe";
import { triage } from "@/lib/bygglovskoll/triage";
import { byggOrientering } from "@/lib/bygglovskoll/templates";
import { intakeHash, verifiera, metadataTillIntake, COOKIE_NAMN } from "@/lib/bygglovskoll/state";
import { loggaKop } from "@/lib/bygglovskoll/log";
import { RULES_VERSION } from "@/lib/bygglovskoll/rules";
import { ATERBETALNING } from "@/lib/bygglovskoll/copy";
import { bygglovskollAktiv } from "@/lib/bygglovskoll/flag";
import { skickaFragaOss, fragaStatusFor, type FragaStatus } from "@/lib/bygglovskoll/fraga-oss";
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
 *
 * v1.1: både A och B levereras. Priset på sessionen avgör om tillägget «Fråga
 * oss» ingår — och därmed om frågan mejlas till oss och om klar-sidan ska säga
 * att svaret är på väg. Att brevet redan är skickat noteras i sessionens
 * metadata, så att en omladdning inte mejlar om samma fråga.
 */
export async function GET(req: NextRequest) {
  // Avstängd tjänst ska inte gå att nå ens via ett direkt API-anrop.
  if (!bygglovskollAktiv()) return new NextResponse(null, { status: 404 });

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

    const prisBas = process.env.STRIPE_PRICE_BYGGLOVSKOLL;
    const prisMedSvar = process.env.STRIPE_PRICE_BYGGLOVSKOLL_SVAR;
    const betaltPris = session.line_items?.data?.[0]?.price?.id;
    // Priset är facit på vad kunden faktiskt köpte — inte cookien, inte klienten.
    const personligtSvar = Boolean(prisMedSvar) && betaltPris === prisMedSvar;
    const arBygglovskoll = (Boolean(prisBas) && betaltPris === prisBas) || personligtSvar;
    if (!arBygglovskoll) {
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
    if (resultat.outcome === "C" || (resultat.outcome === "A" && !resultat.regelspar)) {
      return NextResponse.json({ error: "Ärendet kvalificerar inte för Bygglovskoll." }, { status: 409 });
    }

    const orientering = byggOrientering(intake, resultat, new Date(), { personligtSvar });

    // Tillägget: frågan finns bara i cookien, aldrig i metadatan. Har brevet
    // redan gått utan frågan skickas det om när frågan väl följer med.
    if (personligtSvar) {
      const status = fragaStatusFor(intake);
      const redanSkickat = session.metadata?.fragaSkickad as FragaStatus | undefined;
      if (redanSkickat !== "med-fraga" && !(redanSkickat === "utan-fraga" && status === "utan-fraga")) {
        const skickat = await skickaFragaOss(intake, resultat, session.id);
        if (skickat) {
          try {
            await stripe.checkout.sessions.update(session.id, {
              metadata: { ...(session.metadata ?? {}), fragaSkickad: status },
            });
          } catch (err) {
            // Brevet är framme; att stämpeln inte gick fram får inte stoppa
            // leveransen. Värsta utfallet är ett dubblettbrev till oss själva.
            console.error("bygglovskoll/verify-session: kunde inte stämpla fragaSkickad", err);
          }
        } else {
          console.error("bygglovskoll/verify-session: fråga-oss-brevet gick inte fram", session.id);
        }
      }
    }

    loggaKop({
      ts: new Date().toISOString(),
      intakeHash: session.metadata?.intakeHash ?? intakeHash(intake),
      outcome: resultat.outcome,
      classification: resultat.classification,
      rulesVersion: RULES_VERSION,
      stripeSessionId: session.id,
    });

    return NextResponse.json({
      orientering,
      klassning: resultat.classification,
      utfall: resultat.outcome,
      rulesVersion: RULES_VERSION,
      // Klar-sidan visar leveranstexten bara när tillägget faktiskt är betalt.
      personligtSvar: personligtSvar ? { epost: intake.epost } : null,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Okänt fel";
    console.error("bygglovskoll/verify-session:", message);
    return NextResponse.json({ error: "Kunde inte verifiera betalningen." }, { status: 500 });
  }
}
