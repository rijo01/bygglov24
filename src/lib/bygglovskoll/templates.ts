import {
  KOMPLEMENT,
  TILLBYGGNAD,
  MUR_PLANK,
  GRANS,
  KULTURMILJO,
  STRANDSKYDD,
  ANMALAN,
  ANMALAN_PLANUNDANTAG,
  SKARMTAK,
  HANDLAGGNINGSTID,
  RULES_VERSION,
  PDF_TEMPLATE_VERSION,
  STAMPEL,
  tal,
} from "./rules";
import { forbehall } from "./copy";
import type { Intake, Klassning, TriageResultat } from "./types";

/**
 * Deterministisk textgenerering för de åtta avsnitten i spec 1.7.
 * Ingen språkmodell. Varje siffra kommer ur rules-JSON; ingen tröskel är
 * hårdkodad här.
 */

export interface Avsnitt {
  nummer: number;
  rubrik: string;
  /** Brödstycken. Tomma strängar filtreras bort av renderaren. */
  stycken: string[];
  /** Punktlista, om avsnittet har en. */
  punkter?: string[];
}

export interface Orientering {
  avsnitt: Avsnitt[];
  sidhuvud: string;
  sidfot: string;
  klassning: Klassning;
  regelspar: string;
  rulesVersion: string;
}

const ATGARD_LABEL: Record<Intake["atgard"], string> = {
  tillbyggnad: "Tillbyggnad / uterum",
  fristaende: "Fristående byggnad",
  altan: "Altan / tak över uteplats / pergola",
  plank: "Plank / mur / staket",
  fasadandring: "Fasadändring",
  pool: "Pool",
  annat: "Annat",
};

const PLACERING_LABEL: Record<string, string> = {
  fast: "Fäst i / sammanbyggt med huset",
  fristaende: "Fristående",
  oklart: "Delvis / oklart",
};

const TYP_LABEL: Record<Intake["fastighetstyp"], string> = {
  villa: "Villa / radhus / parhus (en- eller tvåbostadshus)",
  flerbostad: "Flerbostadshus / BRF",
  fritidshus: "Fritidshus",
  annat: "Annat",
};

const KLASS_LABEL: Record<Klassning, string> = {
  tillbyggnad: "tillbyggnad",
  komplementbyggnad: "komplementbyggnad",
  plank_mur: "plank eller mur",
  fasadandring: "fasadändring",
  anlaggning: "anläggning",
  tvetydig: "tvetydig",
  ingen: "ingen",
};

function jn(v: string): string {
  return v === "ja" ? "Ja" : v === "nej" ? "Nej" : "Vet ej";
}

function svDatum(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** Areatypen skrivs alltid ut och blandas aldrig (spec 0b). */
function areatypFor(klassning: Klassning): string | null {
  if (klassning === "komplementbyggnad") return KOMPLEMENT.areatyp;
  if (klassning === "tillbyggnad") return TILLBYGGNAD.areatyp;
  return null;
}

// ── Avsnitt 1 ───────────────────────────────────────────────────────────────
function avsnitt1(i: Intake): Avsnitt {
  const rader = [
    `Åtgärd: ${ATGARD_LABEL[i.atgard]}`,
    `Placering: ${i.placering ? PLACERING_LABEL[i.placering] : "ej tillämpligt"}`,
    `Yta: ${i.yta !== null ? `${tal(i.yta)} m²` : "ej angiven"}`,
    `Högsta höjd: ${i.hojd !== null ? `${tal(i.hojd)} m` : "ej angiven"}`,
  ];
  if (i.atgard === "plank" && i.langd !== null) rader.push(`Längd: ${tal(i.langd)} m`);
  rader.push(
    `Avstånd till tomtgräns: ${i.avstandTomtgrans !== null ? `${tal(i.avstandTomtgrans)} m` : "Vet ej"}`,
    `Fastighetstyp: ${TYP_LABEL[i.fastighetstyp]}`,
    `Kommun: ${i.kommun}`,
    `Fastighetsbeteckning: ${i.fastighetsbeteckning || "inte angiven"}`,
    `Detaljplan: ${jn(i.detaljplan)}`,
    `Nära vatten (ca ${STRANDSKYDD.utokatMeter} m): ${jn(i.naraVatten)}`,
    `Kulturmiljö / samfällighet / BRF: ${jn(i.kulturSamfallighet)}`,
    `Befintliga komplementbyggnader: ${
      i.befintligaKomplement === "nej"
        ? "Nej"
        : i.befintligKomplementYta !== null
          ? `ca ${tal(i.befintligKomplementYta)} m²`
          : "Vet ej"
    }`,
    `Installation VA/ventilation/eldstad: ${jn(i.installation)}`,
    `Din beskrivning: ${i.fritext.trim() || "—"}`,
  );
  return {
    nummer: 1,
    rubrik: "Ditt projekt",
    stycken: ["Du har angett följande. Uppgifterna är dina, inte kontrollerade mot register."],
    punkter: rader,
  };
}

// ── Avsnitt 2 ───────────────────────────────────────────────────────────────
const KLASSNINGSTEXT: Partial<Record<Klassning, string>> = {
  komplementbyggnad:
    "Utifrån att byggnaden är fristående och sluten räknas projektet sannolikt som komplementbyggnad. " +
    "En komplementbyggnad är en fristående byggnad som kompletterar en annan byggnad och inte är " +
    "inredd som självständig bostad. Klassningen är en orientering. Kommunen gör den bindande bedömningen.",
  tillbyggnad:
    "Utifrån att åtgärden är fäst i / sammanbyggd med huset och ökar volymen räknas projektet " +
    "sannolikt som tillbyggnad. Ett uterum mot fasaden är ett typiskt exempel. Om konstruktionen i " +
    "stället är fristående ändras regelspåret.",
  fasadandring:
    "Utifrån att du angett fönster, dörr, kulör eller balkong utan ny byggnadsvolym räknas projektet " +
    "sannolikt som fasadändring (annan ändring än tillbyggnad). Om balkongen ökar volymen kan den i " +
    "stället bedömas som tillbyggnad — kontrollera det med kommunen.",
  plank_mur:
    "Utifrån att åtgärden avser ett plank eller en mur räknas projektet sannolikt som plank eller mur. " +
    "Gränsen mot staket avgörs av hur genomsiktlig konstruktionen är och prövas i rättspraxis. " +
    "Klassningen är en orientering. Kommunen gör den bindande bedömningen.",
};

function avsnitt2(k: Klassning): Avsnitt {
  return {
    nummer: 2,
    rubrik: "Klassning",
    stycken: [KLASSNINGSTEXT[k] ?? ""],
  };
}

// ── Avsnitt 3 ───────────────────────────────────────────────────────────────
function avsnitt3(i: Intake, k: Klassning): Avsnitt {
  const ingress =
    "Nedan är de nationella huvudreglerna efter PBL-reformen 1 december 2025 (SFS 2025:974). " +
    `Lokala planbestämmelser och utökad lovplikt kan fortfarande kräva lov. Kontrollera med ${i.kommun}.`;
  const punkter: string[] = [];

  if (k === "komplementbyggnad") {
    const inom = KOMPLEMENT.inomDetaljplan;
    const utom = KOMPLEMENT.utanforDetaljplan;
    punkter.push(
      `Inom detaljplan: högst ${tal(inom.maxAreaPerByggnad)} m² ${KOMPLEMENT.areatyp} per byggnad, ` +
        `taknockshöjd högst ${tal(inom.maxTaknockshojd)} m, sammanlagt högst ${tal(inom.pottPerTomt)} m² per tomt (${KOMPLEMENT.lagrum}).`,
      `Utanför detaljplan: högst ${tal(utom.maxAreaPerByggnad)} m² ${KOMPLEMENT.areatyp} per byggnad, ` +
        `taknockshöjd högst ${tal(utom.maxTaknockshojd)} m, sammanlagt högst ${tal(utom.pottPerTomt)} m² per tomt.`,
      ...KOMPLEMENT.villkor,
    );
  } else if (k === "tillbyggnad") {
    punkter.push(
      `Högst ${tal(TILLBYGGNAD.maxArea)} m² ${TILLBYGGNAD.areatyp} per byggnad, samma tröskel inom och ` +
        `utanför detaljplan (${TILLBYGGNAD.lagrum}).`,
      ...TILLBYGGNAD.villkor,
      `Skärmtak har ingen egen regel sedan 1 december 2025. ${SKARMTAK.villkor[1]}`,
    );
  } else if (k === "plank_mur") {
    punkter.push(
      `Inom detaljplan krävs lov om höjden överstiger ${tal(MUR_PLANK.hojdInomNaraByggnad)} m inom ` +
        `${tal(MUR_PLANK.avstandNaraByggnad)} m från en byggnad, eller överstiger ${tal(MUR_PLANK.hojdLangreBort)} m ` +
        `längre bort från byggnaden (${MUR_PLANK.lagrum}). Vilken av de två trösklarna som gäller beror på ` +
        "var planket står i förhållande till byggnaden — det har vi inte frågat om.",
      ...MUR_PLANK.villkor.slice(1),
      `Närmare tomtgräns än ${tal(GRANS.avstandTomtgrans)} m krävs lov för mur eller plank högre än ` +
        `${tal(GRANS.hojdMurPlank)} m (${GRANS.lagrum}).`,
    );
  } else if (k === "fasadandring") {
    punkter.push(
      "Lovplikten för fasadändring omfattar inte en- eller tvåbostadshus, komplementbyggnad eller " +
        "komplementbostadshus, och gäller bara fasad eller tak mot allmän plats (PBL 9 kap. 15 § p. 3).",
      `Utökad lovplikt kan ändå gälla vid särskilt värdefull byggnad eller område (${KULTURMILJO.lagrum}) ` +
        "och genom plan- eller områdesbestämmelser.",
    );
  }

  punkter.push(
    `Teknisk anmälan kan krävas separat även när byggnaden är lovfri (${ANMALAN.lagrum}). ` +
      `Handläggningstiden för en anmälan är ${ANMALAN.handlaggningstidVeckor} veckor och får förlängas ` +
      `en gång med högst ${ANMALAN.forlangningVeckor} veckor.`,
  );

  return { nummer: 3, rubrik: "Regler som gäller för den klassningen", stycken: [ingress], punkter };
}

// ── Avsnitt 4 ───────────────────────────────────────────────────────────────
function laget(varde: number, troskel: number): string {
  if (varde > troskel) return "över";
  if (varde >= troskel - 5 || varde >= troskel * 0.9) return "i närheten av";
  return "under";
}

function avsnitt4(i: Intake, k: Klassning): Avsnitt {
  const stycken: string[] = [];
  const areatyp = areatypFor(k);

  if (k === "komplementbyggnad" && i.yta !== null && i.hojd !== null) {
    const tak = i.detaljplan === "nej" ? KOMPLEMENT.utanforDetaljplan : KOMPLEMENT.inomDetaljplan;
    const var_ = i.detaljplan === "nej" ? "utanför detaljplan" : "inom detaljplan";
    stycken.push(
      `Du har angett ${tal(i.yta)} m² ${areatyp} och ${tal(i.hojd)} m nock. För komplementbyggnad ` +
        `${var_} är de nationella trösklarna ${tal(tak.maxAreaPerByggnad)} m² ${KOMPLEMENT.areatyp} per byggnad och ` +
        `${tal(tak.maxTaknockshojd)} m nock. Dina angivna mått ligger ${laget(i.yta, tak.maxAreaPerByggnad)} ` +
        `respektive ${laget(i.hojd, tak.maxTaknockshojd)} de värdena.`,
    );
  } else if (k === "tillbyggnad" && i.yta !== null) {
    stycken.push(
      `Du har angett ${tal(i.yta)} m² ${areatyp}. För tillbyggnad är den nationella tröskeln ` +
        `${tal(TILLBYGGNAD.maxArea)} m² ${TILLBYGGNAD.areatyp} per byggnad, samma inom och utanför detaljplan. ` +
        `Dina angivna mått ligger ${laget(i.yta, TILLBYGGNAD.maxArea)} det värdet. Tillbyggnaden får inte ` +
        "överstiga byggnadens taknock.",
    );
  } else if (k === "plank_mur" && i.hojd !== null) {
    stycken.push(
      `Du har angett ${tal(i.hojd)} m höjd. Inom detaljplan går gränsen vid ` +
        `${tal(MUR_PLANK.hojdInomNaraByggnad)} m inom ${tal(MUR_PLANK.avstandNaraByggnad)} m från en byggnad, ` +
        `och vid ${tal(MUR_PLANK.hojdLangreBort)} m längre bort. Vilken tröskel som är den relevanta beror på ` +
        "placeringen i förhållande till byggnaden. Kontrollera båda mot din placering.",
    );
  } else if (k === "fasadandring") {
    stycken.push(
      "Fasadändring har ingen area- eller höjdtröskel. Det som avgör är byggnadstypen, om fasaden " +
        "vetter mot allmän plats, och om utökad lovplikt gäller för byggnaden eller området.",
    );
  }

  stycken.push(
    "Det betyder inte att åtgärden är lovfri eller lovpliktig. Kvarvarande pott, detaljplan, " +
      "strandskydd och avstånd till gräns kan ändra utfallet.",
  );

  if (i.detaljplan === "vetej") {
    stycken.push(
      "Du har inte angett om tomten ligger inom detaljplan. Inom och utanför detaljplan är trösklarna " +
        "olika. Använd båda raderna som orientering och kontrollera planstatus hos kommunen eller via " +
        "Lantmäteriets karttjänster.",
    );
  }

  return { nummer: 4, rubrik: "Så här ligger ditt projekt mot trösklarna", stycken };
}

// ── Avsnitt 5 — identiskt för alla, ordagrant ───────────────────────────────
function avsnitt5(i: Intake): Avsnitt {
  const beteckning = i.fastighetsbeteckning || "din fastighet";
  const avstand = i.avstandTomtgrans !== null ? `${tal(i.avstandTomtgrans)} m` : "att du inte vet";
  return {
    nummer: 5,
    rubrik: "Det som avgör ditt fall och som vi inte kan se",
    stycken: [],
    punkter: [
      "Kvarvarande pott / byggrätt. Befintliga lovfria komplementbyggnader och äldre friggebodar/attefall " +
        "räknas in i potten. Tidigare lovfria tillbyggnader (även äldre skärmtak) räknas in i " +
        `tillbyggnadspotten. Be kommunen eller kontrollera tidigare lov/anmälningar mot ${beteckning}.`,

      "Detaljplanens särskilda bestämmelser. Utökad lovplikt i äldre plan, prickmark, högsta byggnadsarea " +
        "och skyddsbestämmelser kan göra en annars orienterande tröskel overksam. Ta fram detaljplanen för " +
        `${i.kommun} och fråga nämnden vad som gäller just din ruta. Har din detaljplan egna bestämmelser ` +
        "som tar bort lovplikt för en åtgärd som annars kräver lov, kan anmälan ändå krävas " +
        `(${ANMALAN_PLANUNDANTAG.lagrum.split(" (")[0]}, t.o.m. november 2027) — kontrollera med kommunen.`,

      `Strandskydd. Strandskydd är normalt ${STRANDSKYDD.normaltMeter} meter från strandlinjen och kan vara ` +
        `utökat upp till ${STRANDSKYDD.utokatMeter} meter. Dispens kan krävas även när bygglov inte krävs. ` +
        `Kontrollera strandskyddskarta hos länsstyrelsen och frågan hos ${i.kommun}.`,

      "Kulturmiljö. Särskilt värdefull byggnad eller område kan utlösa utökad lovplikt för åtgärder som " +
        "annars inte kräver lov. Kontrollera plan, kommunens kulturmiljöunderlag och ev. q/k-bestämmelser.",

      `Avstånd till tomtgräns. Placering närmare än ${tal(GRANS.avstandTomtgrans)} meter kräver i regel ` +
        `grannens skriftliga medgivande, annars lov. Du har angett ${avstand}. Bekräfta måttet på plats ` +
        "och mot karta innan du går vidare.",
    ],
  };
}

// ── Avsnitt 6 ───────────────────────────────────────────────────────────────
function avsnitt6(i: Intake): Avsnitt {
  const stycken: string[] = [];
  if (i.installation === "nej") {
    stycken.push(
      "Själva byggnadsåtgärden kan i vissa fall vara anmälningsfri när den är lovfri. Tekniska " +
        `installationer är en separat fråga. Bekräfta hos ${i.kommun}.`,
    );
  }
  stycken.push(
    `Om nämnden bedömer att lov eller anmälan behövs: fråga vilken e-tjänst och vilka handlingar som ` +
      `gäller i ${i.kommun}. Avgift enligt kommunens taxa.`,
    HANDLAGGNINGSTID.formulering + ` Fråga ${i.kommun}.`,
  );
  return {
    nummer: 6,
    rubrik: "Din checklista mot kommunen",
    stycken,
    punkter: [
      `Ta med fastighetsbeteckning: ${i.fastighetsbeteckning || "hämta hos Lantmäteriet / kommunen"}.`,
      "Fråga 1: Vilken klassning gör nämnden av åtgärden?",
      "Fråga 2: Träffas åtgärden av utökad lovplikt, kulturmiljö eller planbestämmelse?",
      "Fråga 3: Hur stor lovfri pott återstår på fastigheten?",
      "Fråga 4: Gäller strandskydd — och krävs dispens?",
      "Fråga 5: Räcker grannmedgivande för placeringen, eller ska lov sökas?",
      "Fråga 6: Krävs teknisk anmälan för VA, ventilation eller eldstad även om byggnaden skulle vara lovfri?",
    ],
  };
}

// ── Avsnitt 7 ───────────────────────────────────────────────────────────────
function avsnitt7(i: Intake): Avsnitt {
  return {
    nummer: 7,
    rubrik: "Nästa steg",
    stycken: [
      "Om detaljplan, strandskydd eller pott visar sig oklara när du börjar kontrollera är " +
        "Bygglovsutredning (2 950 kr) nästa steg. Utredningen tar fram fastighetsspecifikt underlag " +
        "som den här kollen inte omfattar.",
    ],
    punkter: [
      "Kontrollera punkterna i avsnitt 5.",
      `Ställ frågorna i avsnitt 6 till byggnadsnämnden i ${i.kommun}.`,
      "Fatta beslut om lov/anmälan först efter kommunens besked.",
      "Om du vill ha handlingar eller ombud: begär offert separat.",
    ],
  };
}

// ── Avsnitt 8 — verbatim, alltid sist ───────────────────────────────────────
function avsnitt8(datum: string): Avsnitt {
  return { nummer: 8, rubrik: "Förbehåll", stycken: [forbehall(datum)] };
}

/** Bygger hela orienteringen. Endast för utfall A. */
export function byggOrientering(i: Intake, t: TriageResultat, nu = new Date()): Orientering {
  if (t.outcome !== "A" || !t.regelspar) {
    throw new Error("Orientering får bara byggas för utfall A med låst regelspår.");
  }
  const datum = svDatum(nu);
  return {
    klassning: t.classification,
    regelspar: t.regelspar,
    rulesVersion: RULES_VERSION,
    sidhuvud: "Bygglovskoll · bygglov24.se · inte ett kommunalt beslut",
    sidfot:
      `Regelbank ${RULES_VERSION} · mall ${PDF_TEMPLATE_VERSION} · upprättad ${datum} · ${i.kommun} · ${STAMPEL}`,
    avsnitt: [
      avsnitt1(i),
      avsnitt2(t.classification),
      avsnitt3(i, t.classification),
      avsnitt4(i, t.classification),
      avsnitt5(i),
      avsnitt6(i),
      avsnitt7(i),
      avsnitt8(datum),
    ],
  };
}

export { KLASS_LABEL, ATGARD_LABEL, svDatum };
