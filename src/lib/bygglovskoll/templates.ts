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
import { forbehall, genitiv, FRAGA_FORBEHALL } from "./copy";
import type { Intake, Klassning, Orsak, TriageResultat, Utfall } from "./types";

/**
 * Deterministisk textgenerering för de åtta avsnitten i spec 1.7.
 * Ingen språkmodell. Varje siffra kommer ur rules-JSON; ingen tröskel är
 * hårdkodad här.
 *
 * v1.1: två varianter, en per utfall. A är oförändrad. B skriver samma åtta
 * avsnitt, men avsnitt 5 byggs ur triagens orsaker — en punkt per utlöst flagga,
 * med vad kunden angav, varför det spelar roll, vad hon ska kontrollera och
 * vilken fråga hon ska ställa nämnden — och avsnitt 7 erbjuder utredningen med
 * motivering ur samma flaggor. Ingen mening i B-varianten får antyda att
 * projektet är lovfritt.
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
  /** Utfallet underlaget skrevs för. C levereras aldrig som underlag. */
  utfall: Utfall;
  /** Låst mall-id. null vid B, där klassningen inte låser ett standardspår. */
  regelspar: string | null;
  rulesVersion: string;
  /** Tillägget «Fråga oss» köpt. Styr förbehållet i avsnitt 8. */
  personligtSvar: boolean;
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
  anlaggning:
    "Utifrån att åtgärden avser en pool räknas projektet sannolikt som en anläggning. Bassängen i " +
    "sig prövas för sig, och mur, plank, altan och markändring runt den prövas var för sig. " +
    "Klassningen är en orientering. Kommunen gör den bindande bedömningen.",
  tvetydig:
    "Klassningen är inte entydig utifrån dina uppgifter. Vilket regelspår som gäller — tillbyggnad, " +
    "komplementbyggnad eller något annat — avgör vilka trösklar som ska tillämpas, och den " +
    "bedömningen ska inte gissas. Avsnitt 5 visar vad som behöver fastställas först. Kommunen gör " +
    "den bindande bedömningen.",
  ingen:
    "Åtgärden ryms inte i de kategorier formuläret erbjuder, och någon sannolik klassning kan " +
    "därför inte anges. Avsnitt 5 visar vad som behöver fastställas först. Kommunen gör den " +
    "bindande bedömningen.",
};

function avsnitt2(k: Klassning): Avsnitt {
  return {
    nummer: 2,
    rubrik: "Klassning",
    stycken: [KLASSNINGSTEXT[k] ?? ""],
  };
}

// ── Avsnitt 3 ───────────────────────────────────────────────────────────────
function avsnitt3(i: Intake, k: Klassning, utfall: Utfall): Avsnitt {
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
  } else {
    // Klassningen är inte låst. Då skrivs de två spår som ligger närmast ut som
    // orientering, tydligt märkta som beroende av klassningen — aldrig som en
    // tröskel som redan gäller för projektet.
    punkter.push(
      `Om åtgärden klassas som tillbyggnad gäller högst ${tal(TILLBYGGNAD.maxArea)} m² ` +
        `${TILLBYGGNAD.areatyp} per byggnad (${TILLBYGGNAD.lagrum}), kumulativt med tidigare lovfria tillbyggnader.`,
      `Om åtgärden i stället klassas som komplementbyggnad gäller inom detaljplan högst ` +
        `${tal(KOMPLEMENT.inomDetaljplan.maxAreaPerByggnad)} m² ${KOMPLEMENT.areatyp} per byggnad och ` +
        `taknockshöjd ${tal(KOMPLEMENT.inomDetaljplan.maxTaknockshojd)} m, utanför detaljplan ` +
        `${tal(KOMPLEMENT.utanforDetaljplan.maxAreaPerByggnad)} m² och ${tal(KOMPLEMENT.utanforDetaljplan.maxTaknockshojd)} m ` +
        `(${KOMPLEMENT.lagrum}).`,
      "Vilket av spåren som gäller avgörs av klassningen, och den frågan ligger först i ordningen. " +
        "Trösklarna ovan är orientering, inte en bedömning av ditt projekt.",
    );
  }

  // Vid B är lovfrågan öppen. Då får meningen om anmälan inte formuleras som om
  // byggnaden vore lovfri — anmälan prövas ändå för sig, och det är det som ska
  // stå. Vid A är förutsättningen redan given och formuleringen står kvar.
  punkter.push(
    (utfall === "A"
      ? `Teknisk anmälan kan krävas separat även när byggnaden är lovfri (${ANMALAN.lagrum}). `
      : `Teknisk anmälan prövas separat från lovfrågan och kan krävas oavsett hur nämnden bedömer ` +
        `lovplikten (${ANMALAN.lagrum}). `) +
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
  } else {
    const matt = [
      i.yta !== null ? `${tal(i.yta)} m²` : null,
      i.hojd !== null ? `${tal(i.hojd)} m höjd` : null,
    ].filter(Boolean);
    stycken.push(
      (matt.length > 0 ? `Du har angett ${matt.join(" och ")}. ` : "") +
        "Vilken tröskel måtten ska ställas mot följer av klassningen, och klassningen är inte låst " +
        "utifrån dina uppgifter. Trösklarna i avsnitt 3 gäller per klassning — jämför dina mått mot " +
        "båda spåren och avgör inget innan nämnden har tagit ställning till klassningen.",
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

// ── Avsnitt 5 — utfall A: identiskt för alla, ordagrant ─────────────────────
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

// ── Avsnitt 5 — utfall B: en punkt per utlöst flagga ────────────────────────

/**
 * Per orsakskod: vad kunden angav, exakt vad hon ska kontrollera, vilken fråga
 * hon ska ställa nämnden, och vad en utredning skulle göra åt just den flaggan.
 *
 * *Varför* flaggan spelar roll kommer inte härifrån utan ur triagens egen
 * orsakstext — den är källan, och får inte finnas i två versioner som kan glida
 * ifrån varandra. `duAngav` är tom för B2, B3 och B5, där orsakstexten redan
 * återger kundens ja eller vet ej.
 *
 * `{kommun}` ersätts när punkten byggs.
 */
interface Flaggtext {
  rubrik: string;
  duAngav: (i: Intake) => string;
  kontrollera: string;
  fraga: string;
  utredning: string;
}

const FLAGGTEXT: Record<string, Flaggtext> = {
  B1: {
    rubrik: "Fastighetstypen",
    duAngav: (i) => `Du angav fastighetstypen ${TYP_LABEL[i.fastighetstyp].toLowerCase()}.`,
    kontrollera:
      "Vilken byggnadstyp fastigheten faktiskt är i nämndens register, och om en förening eller " +
      "samfällighet dessutom måste godkänna åtgärden.",
    fraga:
      "Räknas min byggnad som en- eller tvåbostadshus i er bedömning, och vilken lovplikt gäller " +
      "för åtgärden om den inte gör det?",
    utredning: "vilket regelverk byggnadstypen leder till och vad det betyder för åtgärden",
  },
  B2: {
    rubrik: "Strandskydd",
    duAngav: () => "",
    kontrollera:
      `länsstyrelsens strandskyddskarta och avståndet från åtgärdens plats till närmaste strandlinje. ` +
      `Strandskydd är normalt ${STRANDSKYDD.normaltMeter} m och kan vara utökat till ` +
      `${STRANDSKYDD.utokatMeter} m (${STRANDSKYDD.lagrum}).`,
    fraga: "Gäller strandskydd på min fastighet, och krävs dispens för den här åtgärden?",
    utredning: "strandskyddsstatus för fastigheten och vad en dispensprövning skulle innebära",
  },
  B3: {
    rubrik: "Kulturmiljö, samfällighet eller BRF",
    duAngav: () => "",
    kontrollera:
      `detaljplanens och områdesbestämmelsernas skyddsbestämmelser, kommunens kulturmiljöunderlag ` +
      `och eventuella q- eller k-bestämmelser för fastigheten (${KULTURMILJO.lagrum}). Ligger ` +
      `fastigheten inom samfällighet eller BRF: vem som beslutar där.`,
    fraga:
      "Är min byggnad eller mitt område utpekat som särskilt värdefullt, och gäller utökad lovplikt " +
      "för åtgärden?",
    utredning: "om utökad lovplikt genom kulturvärde eller planbestämmelse träffar fastigheten",
  },
  B4: {
    rubrik: "Avstånd till tomtgräns",
    duAngav: (i) =>
      i.avstandTomtgrans === null
        ? "Du angav att du inte vet avståndet till närmaste tomtgräns."
        : `Du angav ${tal(i.avstandTomtgrans)} m till närmaste tomtgräns.`,
    kontrollera:
      `måttet på plats och mot fastighetskartan, och om berörd granne är beredd att lämna ett ` +
      `skriftligt medgivande. Närmare gräns än ${tal(GRANS.avstandTomtgrans)} m krävs medgivande ` +
      `eller lov (${GRANS.lagrum}).`,
    fraga: "Räcker grannens skriftliga medgivande för placeringen, eller ska lov sökas?",
    utredning: "vad avståndet till gräns betyder för placeringen och vilket medgivande som behövs",
  },
  B5: {
    rubrik: "Installation av VA, ventilation eller eldstad",
    duAngav: () => "",
    kontrollera:
      `vilka installationer som faktiskt ingår: vatten, avlopp, ventilation eller eldstad. Teknisk ` +
      `anmälan prövas separat (${ANMALAN.lagrum}), och handläggningstiden är ` +
      `${ANMALAN.handlaggningstidVeckor} veckor.`,
    fraga: "Krävs teknisk anmälan för installationerna, och vilka handlingar vill ni ha in?",
    utredning: "vilka anmälningspliktiga installationer projektet innehåller",
  },
  B6: {
    rubrik: "Hur konstruktionen är fäst",
    duAngav: (i) =>
      `Du angav placeringen «${PLACERING_LABEL[i.placering ?? "oklart"].toLowerCase()}».`,
    kontrollera:
      "hur konstruktionen bärs upp och om den är sammanbyggd med huset — enklast med en enkel " +
      "sektionsritning eller ett foto som visar infästningen.",
    fraga: "Klassar ni åtgärden som tillbyggnad eller som fristående komplementbyggnad?",
    utredning: "vilken klassning konstruktionen faktiskt leder till",
  },
  B7: {
    rubrik: "Pool och det som byggs runt den",
    duAngav: (i) =>
      `Du angav en pool${i.yta !== null ? ` om ${tal(i.yta)} m²` : ""}.`,
    kontrollera:
      `vad mer än bassängen som ingår: mur, plank, altandäck, tak eller markändring. Marklov kan ` +
      `krävas för schaktning och fyllning, och mur eller plank prövas mot ${MUR_PLANK.lagrum}.`,
    fraga: "Krävs marklov för schaktningen, och krävs lov för mur, plank eller altan runt poolen?",
    utredning: "vilka delar av poolprojektet som prövas var för sig",
  },
  B8: {
    rubrik: "Åtgärden utanför kategorierna",
    duAngav: (i) =>
      "Du angav «Annat» som åtgärd" + (i.fritext.trim() ? " och beskrev den i egna ord." : "."),
    kontrollera:
      "vad åtgärden närmast motsvarar — tillbyggnad, komplementbyggnad, anläggning eller ändring — " +
      "eftersom trösklarna följer klassningen.",
    fraga: "Hur klassar ni åtgärden, och vilken lovplikt följer av den klassningen?",
    utredning: "vilken klassning åtgärden hör till och vilket regelverk som då gäller",
  },
  B9: {
    rubrik: "Tillbyggnadspotten",
    duAngav: (i) =>
      i.yta !== null
        ? `Du angav ${tal(i.yta)} m² ${TILLBYGGNAD.areatyp}.`
        : "Du angav en tillbyggnad utan yta.",
    kontrollera:
      `tidigare lov och anmälningar på byggnaden och hur mycket av potten som redan är förbrukad. ` +
      `Tröskeln är ${tal(TILLBYGGNAD.maxArea)} m² ${TILLBYGGNAD.areatyp} per byggnad ` +
      `(${TILLBYGGNAD.lagrum}), och äldre tillbyggnader och skärmtak räknas in.`,
    fraga: "Hur många kvadratmeter av tillbyggnadspotten återstår på byggnaden?",
    utredning: "hur mycket av tillbyggnadspotten som återstår enligt nämndens handlingar",
  },
  B10: {
    rubrik: "Måtten mot komplementbyggnadströskeln",
    duAngav: (i) =>
      `Du angav ${i.yta !== null ? `${tal(i.yta)} m² ${KOMPLEMENT.areatyp}` : "ingen yta"} och ` +
      `${i.hojd !== null ? `${tal(i.hojd)} m taknock` : "ingen höjd"}.`,
    kontrollera:
      `de färdiga måtten mot ${tal(KOMPLEMENT.inomDetaljplan.maxAreaPerByggnad)} m² ` +
      `${KOMPLEMENT.areatyp} per byggnad och ${tal(KOMPLEMENT.inomDetaljplan.maxTaknockshojd)} m ` +
      `taknock (${KOMPLEMENT.lagrum}), och hur nämnden mäter höjden på din tomt.`,
    fraga:
      "Hur mäter ni taknockshöjd och byggnadsarea i mitt fall, och hur nära tröskeln ligger mina mått?",
    utredning: "hur måtten förhåller sig till tröskeln när de mäts som nämnden mäter",
  },
  B11: {
    rubrik: "Måtten mot komplementbyggnadströskeln utanför detaljplan",
    duAngav: (i) =>
      `Du angav ${i.yta !== null ? `${tal(i.yta)} m² ${KOMPLEMENT.areatyp}` : "ingen yta"} och ` +
      `${i.hojd !== null ? `${tal(i.hojd)} m taknock` : "ingen höjd"}, utanför detaljplan.`,
    kontrollera:
      `att fastigheten verkligen ligger utanför detaljplan, och måtten mot ` +
      `${tal(KOMPLEMENT.utanforDetaljplan.maxAreaPerByggnad)} m² ${KOMPLEMENT.areatyp} per byggnad ` +
      `och ${tal(KOMPLEMENT.utanforDetaljplan.maxTaknockshojd)} m taknock (${KOMPLEMENT.lagrum}).`,
    fraga:
      "Ligger min fastighet utanför detaljplan och utanför sammanhållen bebyggelse, och vilka mått gäller då?",
    utredning: "planstatus för fastigheten och vilket av de två taken som gäller",
  },
  B12: {
    rubrik: "Taket eller altanen",
    duAngav: (i) =>
      `Du angav ${ATGARD_LABEL.altan.toLowerCase()}` +
      `${i.yta !== null ? ` om ${tal(i.yta)} m²` : ""} med placeringen ` +
      `«${PLACERING_LABEL[i.placering ?? "oklart"].toLowerCase()}».`,
    kontrollera:
      `hur konstruktionen är byggd: väggar, inglasning, skjutbart tak eller enbart stolpar. ` +
      `Skärmtak har ingen egen regel sedan 1 december 2025 — ${SKARMTAK.villkor[1]}`,
    fraga:
      "Klassar ni konstruktionen som tillbyggnad, som byggnad eller som något som inte kräver lov, och vad är avgörande?",
    utredning: "vilken klassning konstruktionen leder till och vilken pott den belastar",
  },
  B13: {
    rubrik: "Plankets eller murens höjd",
    duAngav: (i) =>
      `Du angav ${i.hojd !== null ? `${tal(i.hojd)} m höjd` : "ingen höjd"}` +
      `${i.langd !== null ? ` och ${tal(i.langd)} m längd` : ""}.`,
    kontrollera:
      `höjden mätt från lägsta marknivå på utsidan, och avståndet till närmaste byggnad. Inom ` +
      `detaljplan går gränsen vid ${tal(MUR_PLANK.hojdInomNaraByggnad)} m inom ` +
      `${tal(MUR_PLANK.avstandNaraByggnad)} m från en byggnad och vid ` +
      `${tal(MUR_PLANK.hojdLangreBort)} m längre bort (${MUR_PLANK.lagrum}).`,
    fraga: "Vilken av de två höjdgränserna i 19 § gäller för min placering?",
    utredning: "vilken tröskel placeringen träffar och vad höjden betyder för lovplikten",
  },
  PLANK_HOJD_KRAVER_BYGGNADSAVSTAND: {
    rubrik: "Avståndet till närmaste byggnad",
    duAngav: (i) =>
      `Du angav ${i.hojd !== null ? `${tal(i.hojd)} m höjd` : "ingen höjd"}, men vi frågar inte ` +
      `efter avståndet till närmaste byggnad.`,
    kontrollera:
      `avståndet från planket till närmaste byggnad, mätt på plats. Är det inom ` +
      `${tal(MUR_PLANK.avstandNaraByggnad)} m gäller ${tal(MUR_PLANK.hojdInomNaraByggnad)} m, ` +
      `längre bort ${tal(MUR_PLANK.hojdLangreBort)} m (${MUR_PLANK.lagrum}).`,
    fraga: "Vilken av de två höjdgränserna i 19 § gäller där mitt plank ska stå?",
    utredning: "vilken av trösklarna i 19 § placeringen faller under",
  },
  B14: {
    rubrik: "Potten för komplementbyggnader på tomten",
    duAngav: (i) =>
      i.befintligKomplementYta === null
        ? "Du angav att det finns komplementbyggnader på tomten men att ytan är okänd."
        : `Du angav ${tal(i.befintligKomplementYta)} m² befintliga komplementbyggnader` +
          `${i.yta !== null ? ` och ${tal(i.yta)} m² ny byggnad` : ""}.`,
    kontrollera:
      `de befintliga byggnadernas verkliga byggnadsarea, inklusive äldre friggebodar och ` +
      `attefallshus, mot potten per tomt: ${tal(KOMPLEMENT.inomDetaljplan.pottPerTomt)} m² inom ` +
      `detaljplan och ${tal(KOMPLEMENT.utanforDetaljplan.pottPerTomt)} m² utanför.`,
    fraga: "Hur stor lovfri pott för komplementbyggnader återstår på fastigheten?",
    utredning: "hur mycket av tomtens pott som är förbrukad enligt nämndens handlingar",
  },
  B15: {
    rubrik: "Det du beskrev i egna ord",
    duAngav: (i) => `Du skrev: «${i.fritext.trim().slice(0, 200)}».`,
    kontrollera:
      "den omständighet du beskrev separat — den prövas i regel i ett eget spår, ibland enligt " +
      "annan lagstiftning än plan- och bygglagen, och ibland av en annan myndighet än nämnden.",
    fraga: "Vilken prövning gäller för det jag beskrivit, och är det nämnden eller någon annan som prövar den?",
    utredning: "vilken prövning omständigheten hör till och i vilken ordning den ska tas",
  },
  B16: {
    rubrik: "Klassningen",
    duAngav: (i) =>
      `Du angav ${ATGARD_LABEL[i.atgard].toLowerCase()}` +
      `${i.placering ? ` med placeringen «${PLACERING_LABEL[i.placering].toLowerCase()}»` : ""}.`,
    kontrollera:
      "hur åtgärden ska klassas, eftersom klassningen bestämmer vilka trösklar som gäller. Ta med " +
      "ritning eller foto som visar konstruktionen.",
    fraga: "Hur klassar ni åtgärden, och vilka trösklar gäller för den klassningen?",
    utredning: "vilken klassning åtgärden hör till och vilket regelverk som följer av den",
  },
};

/** Sista utposten: en okänd kod ska aldrig ge en punkt utan (iii). */
const FLAGGTEXT_OKAND: Flaggtext = {
  rubrik: "Omständighet i dina uppgifter",
  duAngav: () => "",
  kontrollera: "omständigheten mot detaljplan, fastighetens förutsättningar och tidigare beslut.",
  fraga: "Hur påverkar den här omständigheten lovplikten för min åtgärd?",
  utredning: "vad omständigheten betyder för åtgärden",
};

function flaggtextFor(kod: string): Flaggtext {
  return FLAGGTEXT[kod] ?? FLAGGTEXT_OKAND;
}

/**
 * En orsak blir en punkt med tre delar: vad kunden angav, varför det spelar roll
 * (triagens orsakstext) och exakt vad hon ska kontrollera plus frågan till
 * nämnden. Ingen del får utelämnas — det är hela poängen med att B numera säljs.
 */
function orsakTillPunkt(orsak: Orsak, i: Intake): string {
  const f = flaggtextFor(orsak.kod);
  const duAngav = f.duAngav(i).trim();
  const kontrollera = f.kontrollera.replace(/\{kommun\}/g, i.kommun);
  return [
    `${f.rubrik}.`,
    duAngav,
    orsak.text,
    `Kontrollera: ${kontrollera}`,
    `Fråga till ${genitiv(i.kommun)} byggnadsnämnd: «${f.fraga}»`,
  ]
    .filter((del) => del.length > 0)
    .join(" ");
}

function avsnitt5B(i: Intake, reasons: Orsak[]): Avsnitt {
  return {
    nummer: 5,
    rubrik: "Det som avgör ditt fall och som vi inte kan se",
    stycken: [
      "Var och en av punkterna nedan kommer ur något du angett. Punkten säger vad du angav, varför " +
        "det påverkar bedömningen, vad du ska kontrollera och vilken fråga du ska ställa. " +
        "Ingen av dem är avgjord här — de är det som ska kontrolleras innan du går vidare.",
    ],
    punkter: reasons.map((r) => orsakTillPunkt(r, i)),
  };
}

// ── Avsnitt 6 ───────────────────────────────────────────────────────────────
function avsnitt6(i: Intake, utfall: Utfall): Avsnitt {
  const stycken: string[] = [];
  // Meningen om anmälningsfrihet förutsätter att åtgärden kan vara lovfri. Vid
  // utfall B är just den frågan öppen, och då får underlaget inte antyda något
  // sådant — därför bara vid A.
  if (utfall === "A" && i.installation === "nej") {
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

/** Utfall B: samma flaggor motiverar utredningen, en rad per flagga. */
function avsnitt7B(i: Intake, reasons: Orsak[]): Avsnitt {
  // Samma kod kan utlösas två gånger (yta och höjd). Motiveringen skrivs en gång.
  const sedda = new Set<string>();
  const punkter: string[] = [];
  for (const r of reasons) {
    if (sedda.has(r.kod)) continue;
    sedda.add(r.kod);
    const f = flaggtextFor(r.kod);
    punkter.push(`${f.rubrik}: utredningen tar fram ${f.utredning}.`);
  }
  return {
    nummer: 7,
    rubrik: "Nästa steg",
    stycken: [
      `Punkterna i avsnitt 5 är ${reasons.length === 1 ? "den omständighet" : "de omständigheter"} ` +
        "som avgör ditt fall. Du kan kontrollera dem själv med frågorna i avsnitt 5 och 6 — det är " +
        "vad det här underlaget är till för.",
      "Vill du att någon annan gör kontrollen är Bygglovsutredning (2 950 kr) nästa steg: en " +
        "fastighetsspecifik genomgång av detaljplan, byggrätt och strandskydd med en skriftlig " +
        "rekommendation. För ditt ärende skulle den ta fram följande.",
    ],
    punkter: [
      ...punkter,
      `Ställ frågorna i avsnitt 5 och 6 till byggnadsnämnden i ${i.kommun} om du kontrollerar själv.`,
      "Fatta beslut om lov eller anmälan först efter kommunens besked.",
    ],
  };
}

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
function avsnitt8(datum: string, personligtSvar: boolean): Avsnitt {
  return {
    nummer: 8,
    rubrik: "Förbehåll",
    stycken: personligtSvar ? [forbehall(datum), FRAGA_FORBEHALL] : [forbehall(datum)],
  };
}

export interface OrienteringVal {
  /** Tillägget «Fråga oss» köpt. Lägger förbehållet för svaret i avsnitt 8. */
  personligtSvar?: boolean;
}

/**
 * Bygger hela orienteringen för utfall A eller B.
 *
 * A kräver ett låst regelspår, som förut. B har inget — där är klassningen eller
 * någon annan omständighet just det som ska kontrolleras, och avsnitt 5 och 7
 * byggs ur triagens orsaker i stället. C levereras aldrig som underlag.
 */
export function byggOrientering(
  i: Intake,
  t: TriageResultat,
  nu = new Date(),
  val: OrienteringVal = {},
): Orientering {
  if (t.outcome === "A" && !t.regelspar) {
    throw new Error("Utfall A måste ha ett låst regelspår.");
  }
  if (t.outcome !== "A" && t.outcome !== "B") {
    throw new Error("Orientering får bara byggas för utfall A eller B.");
  }
  if (t.outcome === "B" && t.reasons.length === 0) {
    throw new Error("Utfall B måste ha minst en orsak att bygga avsnitt 5 av.");
  }
  const datum = svDatum(nu);
  const personligtSvar = val.personligtSvar === true;
  const arB = t.outcome === "B";
  return {
    klassning: t.classification,
    utfall: t.outcome,
    regelspar: t.regelspar,
    rulesVersion: RULES_VERSION,
    personligtSvar,
    sidhuvud: "Bygglovskoll · bygglov24.se · inte ett kommunalt beslut",
    sidfot:
      `Regelbank ${RULES_VERSION} · mall ${PDF_TEMPLATE_VERSION} · upprättad ${datum} · ${i.kommun} · ${STAMPEL}`,
    avsnitt: [
      avsnitt1(i),
      avsnitt2(t.classification),
      avsnitt3(i, t.classification, t.outcome),
      avsnitt4(i, t.classification),
      arB ? avsnitt5B(i, t.reasons) : avsnitt5(i),
      avsnitt6(i, t.outcome),
      arB ? avsnitt7B(i, t.reasons) : avsnitt7(i),
      avsnitt8(datum, personligtSvar),
    ],
  };
}

export { KLASS_LABEL, ATGARD_LABEL, svDatum };
