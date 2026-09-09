import rulesJson from "../../../rules/RB-2026-09-08.json";

/**
 * Enda vägen in till regelbanken. Ingen annan modul får innehålla en tröskel
 * som siffra — de hämtas härifrån, och JSON:en är i sin tur bunden till
 * docs/regelbank/RB-2026-09-08.md av tests/rules-consistency.test.ts.
 */
export const RULES = rulesJson;
export const RULES_VERSION: string = rulesJson.version;
export const COPY_VERSION: string = rulesJson.copyVersion;
export const PDF_TEMPLATE_VERSION: string = rulesJson.pdfTemplateVersion;
export const STAMPEL: string = rulesJson.metadata.stampel;

export const KOMPLEMENT = rulesJson.regler.komplementbyggnad;
export const TILLBYGGNAD = rulesJson.regler.tillbyggnad;
export const SKARMTAK = rulesJson.regler.skarmtak;
export const FRISTAENDE_TAK = rulesJson.regler.fristaendeTakPaStolpar;
export const MUR_PLANK = rulesJson.regler.murPlankAltan;
export const GRANS = rulesJson.regler.utokadLovpliktGransJarnvag;
export const KULTURMILJO = rulesJson.regler.utokadLovpliktKulturmiljo;
export const MARKLOV = rulesJson.regler.marklov;
export const ANMALAN = rulesJson.regler.anmalanPBF;
export const STRANDSKYDD = rulesJson.regler.strandskydd;
export const ANMALAN_PLANUNDANTAG = rulesJson.regler.anmalanVidPlanundantag;
export const HANDLAGGNINGSTID = rulesJson.handlaggningstidLov;

/** Svenskt decimalformat. 30 -> "30,0", 45 -> "45,0". */
export function tal(n: number, decimaler = 1): string {
  return n.toFixed(decimaler).replace(".", ",");
}
