import {
  KOMPLEMENT,
  MUR_PLANK,
  GRANS,
  TILLBYGGNAD,
  RULES_VERSION,
} from "./rules";
import { plankKraverByggnadsavstand } from "./copy";
import type { Intake, Klassning, Orsak, TriageResultat } from "./types";

/**
 * Deterministisk triage enligt spec avsnitt 2. Ren funktion — samma intake ger
 * alltid samma utfall. Körordning (spec 2.5):
 *
 *   C-signal utan eget projekt? -> C
 *   någon B1-B16?               -> B
 *   A-villkor 3-8 sanna?        -> A
 *   annars                      -> B
 *
 * Konservativ: tvetydighet ger alltid B. Legala trösklar kommer ur regelbanken
 * (rules/RB-2026-09-08.json). Närhetsmarginalerna nedan är däremot triagepolicy
 * ur spec avsnitt 2.2 — de är inte lagregler och får inte skrivas ut som sådana.
 */

/** Spec-policy, inte lagtext: hur nära en tröskel som räknas som "nära". */
const NARHET = {
  /** B9/B10/B11: 25 mot 30, 45 mot 50. */
  areaMarginal: 5.0,
  /** B10/B11: 3,7 mot 4,0 och 4,2 mot 4,5. */
  hojdMarginal: 0.3,
  /** B13: 1,6 mot 1,8. */
  plankHojdMarginal: 0.2,
  /** B12: konservativ flagga som ärvts från den upphävda skärmtaksregeln. */
  altanYta: 15.0,
} as const;

const C_NYCKELORD = [
  "grannens bygge",
  "grannen har byggt",
  "grannens attefall",
  "grannen bygger",
  "avstyckning",
  "avstycka",
  "diarienummer",
  "mitt ärende hos kommunen",
  "har jag redan lov",
  "har jag redan bygglov",
  "gäller mitt bygglov fortfarande",
  "behöver grannen",
];

const B_ORDLISTA = [
  "strandskydd",
  "dispens",
  "sanktionsavgift",
  "i efterhand",
  "svartbygge",
  "olovligt",
  "överklagande",
  "granne-tvist",
  "grann tvist",
  "samfällighet",
  "gemensamhetsanläggning",
  "fornlämning",
  "biotopskydd",
  "rivningslov",
  "marklov",
  "komplementbostad",
  "självständig bostad",
  "uthyrning",
  "två kök",
];

/** Ord som gör en fasadändring tvetydig mot tillbyggnad (spec 2.3). */
const VOLYMORD = ["inglasning", "glasa in", "glasar in", "inglasad", "bygger ut", "uterum", "ökar volym"];

/**
 * Ord som gör ett tak/altan tvetydigt. Följer regelbanken rad 5: väggar,
 * delvis inglasning eller skjutbart tak ger tvetydig klassning.
 */
const TAK_TVETYDIGT = ["skjutbart", "skjutbar", "väggar", "vägg på", "inglas", "glasat", "delvis"];

function norm(s: string): string {
  return (s || "").toLowerCase();
}

function traffar(text: string, lista: string[]): string[] {
  const t = norm(text);
  return lista.filter((ord) => t.includes(ord));
}

/** Har kunden ett eget, måttsatt projekt? Avgör om en C-signal blir C eller B. */
function harEgetMattsattProjekt(i: Intake): boolean {
  return typeof i.yta === "number" || typeof i.hojd === "number";
}

/** Klassningsmatrisen, spec 2.3. Returnerar även om A är möjlig alls. */
export function klassificera(i: Intake): { klassning: Klassning; tvetydig: boolean } {
  const fritext = norm(i.fritext);

  switch (i.atgard) {
    case "tillbyggnad":
      if (i.placering === "fast") return { klassning: "tillbyggnad", tvetydig: false };
      if (i.placering === "fristaende") return { klassning: "komplementbyggnad", tvetydig: false };
      return { klassning: "tvetydig", tvetydig: true };

    case "fristaende":
      if (i.placering === "fast") return { klassning: "tillbyggnad", tvetydig: false };
      if (i.placering === "fristaende") return { klassning: "komplementbyggnad", tvetydig: false };
      return { klassning: "tvetydig", tvetydig: true };

    case "altan": {
      if (i.placering !== "fast") return { klassning: "tvetydig", tvetydig: true };
      // Väggar, skjutbart tak eller inglasning -> fristående tak / byggnad, oklart.
      if (traffar(fritext, TAK_TVETYDIGT).length > 0) return { klassning: "tvetydig", tvetydig: true };
      return { klassning: "tillbyggnad", tvetydig: false };
    }

    case "plank":
      return { klassning: "plank_mur", tvetydig: false };

    case "fasadandring": {
      if (traffar(fritext, VOLYMORD).length > 0) return { klassning: "tvetydig", tvetydig: true };
      return { klassning: "fasadandring", tvetydig: false };
    }

    case "pool":
      return { klassning: "anlaggning", tvetydig: false };

    case "annat":
    default:
      return { klassning: "ingen", tvetydig: true };
  }
}

/** Relevant komplementbyggnadstak. "Vet ej" på plan behandlas som inom plan. */
function komplementTak(i: Intake) {
  return i.detaljplan === "nej" ? KOMPLEMENT.utanforDetaljplan : KOMPLEMENT.inomDetaljplan;
}

function regelsparFor(klassning: Klassning): string | null {
  switch (klassning) {
    case "tillbyggnad":
      return "mall-tillbyggnad-1.0";
    case "komplementbyggnad":
      return "mall-komplementbyggnad-1.0";
    case "plank_mur":
      return "mall-plank-mur-1.0";
    case "fasadandring":
      return "mall-fasadandring-1.0";
    default:
      return null;
  }
}

export function triage(i: Intake): TriageResultat {
  const reasons: Orsak[] = [];
  const flags: string[] = [];
  const { klassning, tvetydig } = klassificera(i);
  const bas = { classification: klassning, rulesVersion: RULES_VERSION };

  // ── Steg 1: utfall C, körs först ──────────────────────────────────────────
  const cTraffar = traffar(i.fritext, C_NYCKELORD);
  if (cTraffar.length > 0 && !harEgetMattsattProjekt(i)) {
    return {
      ...bas,
      classification: "ingen",
      outcome: "C",
      regelspar: null,
      flags: ["C"],
      reasons: [
        {
          kod: "C1",
          text:
            "Frågan gäller något annat än ett eget bygg- eller ändringsprojekt på din fastighet. " +
            "Vi skriver inte underlag om grannars byggen, status på ett öppet ärende, avstyckning " +
            "eller om ett äldre lov fortfarande gäller.",
        },
      ],
    };
  }

  // ── Steg 2: B1-B16 ────────────────────────────────────────────────────────
  const push = (kod: string, text: string) => {
    reasons.push({ kod, text });
    flags.push(kod);
  };

  if (i.fastighetstyp === "flerbostad" || i.fastighetstyp === "annat") {
    push(
      "B1",
      "Fastigheten är flerbostadshus, bostadsrätt eller en annan typ än en- eller tvåbostadshus. " +
        "De lovfria reglerna för en- och tvåbostadshus gäller då inte.",
    );
  }
  if (i.naraVatten === "ja" || i.naraVatten === "vetej") {
    push(
      "B2",
      "Du har angett att tomten ligger nära vatten, eller att du inte vet. Strandskydd prövas " +
        "separat och kan kräva dispens oavsett bygglovsfrågan.",
    );
  }
  if (i.kulturSamfallighet === "ja" || i.kulturSamfallighet === "vetej") {
    push(
      "B3",
      "Fastigheten är kulturmiljö, samfällighet eller bostadsrätt — eller så är det oklart. " +
        "Det kan utlösa utökad lovplikt för åtgärder som annars inte kräver lov.",
    );
  }
  if (i.avstandTomtgrans === null || i.avstandTomtgrans < GRANS.avstandTomtgrans) {
    push(
      "B4",
      `Avståndet till tomtgräns är under ${GRANS.avstandTomtgrans.toString().replace(".", ",")} m eller okänt. Det påverkar lovplikten.`,
    );
  }
  if (i.installation === "ja" || i.installation === "vetej") {
    push(
      "B5",
      "Du har angett installation av vatten, avlopp, ventilation eller eldstad — eller så är det " +
        "oklart. Teknisk anmälan kan krävas även när byggnaden i sig är lovfri.",
    );
  }
  if (i.placering === "oklart") {
    push(
      "B6",
      "Du har angett att konstruktionen är delvis fäst eller oklar. Klassningen avgör vilket " +
        "regelspår som gäller och kan inte fastställas här.",
    );
  }
  if (i.atgard === "pool") {
    push(
      "B7",
      "Pool är en anläggning. Poolen i sig har sällan egen lovplikt, men mur, altan och schaktning " +
        "runt den kan ha det. Det kräver en fastighetsspecifik genomgång.",
    );
  }
  if (i.atgard === "annat") {
    push("B8", "Åtgärden ryms inte i de valbara kategorierna och kan därför inte köras mot ett standardspår.");
  }

  const yta = i.yta;
  const hojd = i.hojd;

  // B9 — tillbyggnad/uterum mot 30 m²-potten.
  if (i.atgard === "tillbyggnad" && yta !== null) {
    if (yta >= TILLBYGGNAD.maxArea - NARHET.areaMarginal) {
      push(
        "B9",
        "Måtten ligger nära eller över tröskeln för lovfri tillbyggnad. Hur mycket av potten som " +
          "återstår på byggnaden avgör utfallet och syns inte i ett formulär.",
      );
    }
  }

  // B10 — fristående byggnad mot komplementbyggnadstaket inom detaljplan.
  if (i.atgard === "fristaende" && i.detaljplan !== "nej") {
    const tak = KOMPLEMENT.inomDetaljplan;
    if (yta !== null && yta >= tak.maxAreaPerByggnad - NARHET.areaMarginal) {
      push("B10", "Byggnadens yta ligger nära eller över tröskeln för lovfri komplementbyggnad.");
    }
    if (hojd !== null && hojd >= tak.maxTaknockshojd - NARHET.hojdMarginal) {
      push("B10", "Taknockshöjden ligger nära eller över tröskeln för lovfri komplementbyggnad.");
    }
  }

  // B11 — fristående utanför detaljplan, mot det högre taket.
  if (i.atgard === "fristaende" && i.detaljplan === "nej") {
    const tak = KOMPLEMENT.utanforDetaljplan;
    if (yta !== null && yta >= tak.maxAreaPerByggnad - NARHET.areaMarginal) {
      push("B11", "Byggnadens yta ligger nära eller över tröskeln för lovfri komplementbyggnad utanför detaljplan.");
    }
    if (hojd !== null && hojd >= tak.maxTaknockshojd - NARHET.hojdMarginal) {
      push("B11", "Taknockshöjden ligger nära eller över tröskeln för lovfri komplementbyggnad utanför detaljplan.");
    }
  }

  // B12 — altan/tak/pergola: konservativ närhetsflagga.
  if (i.atgard === "altan") {
    if (yta !== null && yta > NARHET.altanYta) {
      push(
        "B12",
        "Taket eller altanen är så stor att den behöver vägas mot tillbyggnadspotten och mot hur " +
          "konstruktionen faktiskt är byggd.",
      );
    }
    if (i.placering !== "fast") {
      push("B12", "Ett fristående eller delvis fristående tak klassas efter konstruktion och kan vara en byggnad.");
    }
  }

  // B13 — plank/mur, nära eller över den högre tröskeln.
  if (i.atgard === "plank" && hojd !== null) {
    if (hojd >= MUR_PLANK.hojdInomNaraByggnad - NARHET.plankHojdMarginal) {
      push("B13", "Höjden ligger nära eller över tröskeln där plank och mur kräver bygglov.");
    }
    // Mellan den lägre och den högre tröskeln avgörs lovplikten av avståndet
    // till närmaste byggnad — en uppgift intaket inte samlar in. Då gissar vi
    // inte, utan hänvisar till utredning.
    if (hojd > MUR_PLANK.hojdLangreBort && hojd <= MUR_PLANK.hojdInomNaraByggnad) {
      push(
        "PLANK_HOJD_KRAVER_BYGGNADSAVSTAND",
        plankKraverByggnadsavstand(
          MUR_PLANK.hojdInomNaraByggnad,
          MUR_PLANK.avstandNaraByggnad,
          MUR_PLANK.hojdLangreBort,
        ),
      );
    }
  }

  // B14 — pott för komplementbyggnader på tomten.
  if (i.atgard === "fristaende" && i.befintligaKomplement === "ja") {
    if (i.befintligKomplementYta === null) {
      push(
        "B14",
        "Det finns redan komplementbyggnader på tomten men ytan är okänd. Då går det inte att säga " +
          "hur mycket av den lovfria potten som återstår.",
      );
    } else if (yta !== null) {
      const tak = komplementTak(i);
      if (yta + i.befintligKomplementYta > tak.pottPerTomt) {
        push(
          "B14",
          "Den nya byggnaden och de befintliga komplementbyggnaderna överstiger tillsammans den " +
            "lovfria potten för tomten.",
        );
      }
    }
  }

  // B15 — fritext mot ordlista.
  if (traffar(i.fritext, B_ORDLISTA).length > 0) {
    push(
      "B15",
      "Din beskrivning tar upp något som kräver fastighetsspecifik prövning — exempelvis " +
        "strandskydd, dispens, en åtgärd i efterhand eller en samfällighetsfråga.",
    );
  }

  // B16 — genuint tvetydig klassning.
  if (tvetydig) {
    push(
      "B16",
      "Klassningen är inte entydig utifrån dina uppgifter. Vilket regelspår som gäller avgör " +
        "utfallet, och den bedömningen ska inte gissas.",
    );
  }

  if (reasons.length > 0) {
    return { ...bas, outcome: "B", reasons, flags, regelspar: null };
  }

  // ── Steg 3: A-villkor 3-8 ─────────────────────────────────────────────────
  const villkorA =
    (i.fastighetstyp === "villa" || i.fastighetstyp === "fritidshus") &&
    !tvetydig &&
    i.avstandTomtgrans !== null &&
    i.avstandTomtgrans >= GRANS.avstandTomtgrans &&
    i.naraVatten === "nej" &&
    i.kulturSamfallighet === "nej" &&
    i.installation === "nej";

  // Klassningsmatrisens egna A-villkor utöver B-raderna.
  // Plank: A bara under den lägre tröskeln i 19 §. Där träffar varken
  // avståndsregeln i 19 § eller mur/plank-tröskeln i 34 §, oavsett var på
  // tomten planket står — då behövs inget byggnadsavstånd för att svara.
  const matrisTillaterA =
    klassning === "plank_mur"
      ? hojd !== null && hojd <= MUR_PLANK.hojdLangreBort
      : klassning === "tillbyggnad" || klassning === "komplementbyggnad" || klassning === "fasadandring";

  if (villkorA && matrisTillaterA) {
    return {
      ...bas,
      outcome: "A",
      reasons: [],
      flags: [],
      regelspar: regelsparFor(klassning),
    };
  }

  // ── Steg 4: allt annat blir B ─────────────────────────────────────────────
  return {
    ...bas,
    outcome: "B",
    regelspar: null,
    flags: [...flags, "B-fallback"],
    reasons: [
      {
        kod: "B16",
        text:
          "Uppgifterna matchar inte något av de standardspår Bygglovskoll kan skriva underlag för. " +
          "Vi gissar inte — i stället passar en fastighetsspecifik utredning.",
      },
    ],
  };
}
