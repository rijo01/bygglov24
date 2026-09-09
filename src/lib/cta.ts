import { bygglovskollAktiv } from "@/lib/bygglovskoll/flag";

/**
 * CTA-sanering i MDX vid rendering.
 *
 * 308 rader i content/ länkar till /konsult och lovar kostnadsfri bedömning
 * med svar inom 24 timmar. När Bygglovskoll är påslagen redirectar /konsult,
 * och löftena motsvarar ingen tjänst vi har. Texten byts därför vid rendering
 * i stället för i 290 filer — filerna är oförändrade, och med flaggan av ser
 * sajten ut exakt som förut.
 *
 * Varje rad som innehåller en /konsult-länk är en CTA (kontrollerat mot hela
 * korpusen), så hela raden byts. Det ger korrekt svenska i stället för att
 * klistra in en ny länktext i en mening som var byggd för den gamla.
 */

const CTA_PARAGRAF =
  "Osäker på om ditt projekt kräver lov? [Gör en Bygglovskoll för 99 kr](/bygglovskoll) — en skriftlig " +
  "orientering utifrån dina uppgifter. Det bindande beskedet ges av byggnadsnämnden.";

const CTA_LISTRAD = "[Gör en Bygglovskoll för 99 kr](/bygglovskoll) — skriftlig orientering utifrån dina uppgifter.";

const KALKYLATOR_MENING =
  " Eller använd vår [bygglovskalkylator](/kalkylator) för att uppskatta vad ditt projekt kommer att kosta.";

/** "- ", "* ", "5. " och liknande listmarkörer ska överleva bytet. */
const LISTMARKOR = /^(\s*(?:[-*+]|\d+\.)\s+)/;

function ersattRad(rad: string): string {
  const behallKalkylator = rad.includes("](/kalkylator)") ? KALKYLATOR_MENING : "";
  const m = rad.match(LISTMARKOR);
  if (m) return `${m[1]}${CTA_LISTRAD}${behallKalkylator}`;
  return `${CTA_PARAGRAF}${behallKalkylator}`;
}

/**
 * Byter konsult-CTA:er mot Bygglovskoll-CTA:n. Returnerar källan oförändrad
 * när flaggan är av.
 */
export function saneraKonsultCta(mdx: string, aktiv = bygglovskollAktiv()): string {
  if (!aktiv || !mdx.includes("](/konsult)")) return mdx;
  return mdx
    .split("\n")
    .map((rad) => (rad.includes("](/konsult)") ? ersattRad(rad) : rad))
    .join("\n");
}

export { CTA_PARAGRAF, CTA_LISTRAD };
