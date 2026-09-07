import { arIndexerbar, getAllGuider } from "@/lib/content";

/**
 * Pelarguider – de innehållssidor som faktiskt är omskrivna och indexerbara.
 * Listan är den enda källan för "starka sidor" i intern länkning och används
 * från startsidan, guidesidorna och kommunsidornas sidopanel, så att länkkraft
 * styrs mot dessa i stället för att spridas jämnt över 289 mallsidor.
 *
 * Varje slug MÅSTE ha `indexera: true` i sin frontmatter – annars pekar vi
 * internt mot en noindex-sida. Se guard i pelarguider().
 */
const PELARE: { slug: string; label: string; desc: string }[] = [
  { slug: "nya-regler-2026", label: "Nya bygglovsregler 2026", desc: "Vad PBL-reformen ändrade från 1 december 2025" },
  { slug: "bygga-utan-bygglov", label: "Bygga utan bygglov", desc: "Vad du får bygga lovfritt – och vad du inte får" },
  { slug: "ansokan", label: "Ansöka om bygglov", desc: "Handlingar, steg och vanliga misstag" },
  { slug: "kostnad", label: "Vad kostar bygglov?", desc: "Avgifter, taxa och vad som styr priset" },
  { slug: "handlaggningstid", label: "Handläggningstid", desc: "10-veckorsfristen och när den får förlängas" },
  { slug: "detaljplan", label: "Förstå detaljplanen", desc: "Byggrätt, prickmark och planbestämmelser" },
  { slug: "bygglov-attefall-skillnad", label: "Attefall eller bygglov?", desc: "Skillnaden mellan anmälan och lov" },
  { slug: "kontrollansvarig", label: "Kontrollansvarig", desc: "När en KA krävs och vad hen gör" },
  { slug: "byggsanktionsavgift", label: "Byggsanktionsavgift", desc: "Beräkning enligt 9 kap. plan- och byggförordningen" },
  { slug: "bygglov-i-efterhand", label: "Bygglov i efterhand", desc: "Så hanterar du ett svartbygge" },
  { slug: "overklaga-bygglov", label: "Överklaga ett beslut", desc: "Instansordning och tidsfrister" },
  { slug: "strandskydd", label: "Strandskyddsdispens", desc: "De sex skälen och hur du ansöker" },
];

export interface PelarLank {
  href: string;
  label: string;
  desc: string;
}

/**
 * Returnerar pelarguiderna, filtrerade mot indexerbarhet så att en guide som
 * senare tas ur indexet automatiskt försvinner ur den interna länkningen i
 * stället för att bli en tyst länk till en noindex-sida.
 */
export function pelarguider(): PelarLank[] {
  const indexerbara = new Set(getAllGuider().filter(arIndexerbar).map((g) => g.slug));
  return PELARE.filter((p) => indexerbara.has(p.slug)).map((p) => ({
    href: `/guide/${p.slug}`,
    label: p.label,
    desc: p.desc,
  }));
}

/** Alla indexerbara guider utom den angivna – för "Fler guider" i sidfoten på guidesidor. */
export function ovrigaGuider(utomSlug: string): { href: string; title: string }[] {
  return getAllGuider()
    .filter(arIndexerbar)
    .filter((g) => g.slug !== utomSlug)
    .map((g) => ({ href: `/guide/${g.slug}`, title: g.title }));
}
