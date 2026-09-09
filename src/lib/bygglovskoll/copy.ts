/**
 * All fast produktcopy, ordagrant ur spec.md (COPY-2026-09-08).
 * Ändras något här ska spec.md ändras först.
 *
 * Obs: FORBEHALL och ANGERRATT_KRYSS är verbatim-krav — de får inte
 * omformuleras, och de kontrolleras av tests/forbidden-phrases.test.ts.
 */

export const FORBEHALL_MALL =
  "Denna bygglovskoll är vägledning och underlag baserat på de uppgifter du lämnat och gällande " +
  "regler per {datum}. Den ersätter inte kommunens beslut — det bindande beskedet ges av din " +
  "kommuns byggnadsnämnd. Detta är inte juridisk rådgivning.";

export function forbehall(datum: string): string {
  return FORBEHALL_MALL.replace("{datum}", datum);
}

export const KRYSS_VAGLEDNING =
  "Jag har läst att Bygglovskoll är vägledning och underlag, inte ett besked från kommunen.";

export const KRYSS_ANGERRATT =
  "Jag begär att leveransen påbörjas direkt och godkänner att ångerrätten upphör när " +
  "Bygglovskollen visas och PDF:en görs tillgänglig.";

export const ANGERRATT_INFO =
  "Digitalt innehåll som levereras direkt. För att ångerrätten ska upphöra när leveransen " +
  "påbörjas måste du aktivt godkänna detta före köp. Utan det godkännandet gäller 14 dagars " +
  "ångerrätt enligt distansavtalslagen — även om underlaget redan lästs.";

export const ATERBETALNING =
  "Återbetalning vid tekniskt fel som gör att underlaget inte kan levereras. Ingen återbetalning " +
  "för att underlaget inte innehåller ett ja eller ett nej — det är inte vad produkten är.";

export const HERO_INGRESS =
  "Ett personligt skriftligt underlag för ditt projekt. Du får klassning, de regler som sannolikt " +
  "gäller och en checklista mot kommunen.";

export const HERO_FORBEHALL =
  "Det bindande beskedet ges av din kommuns byggnadsnämnd. Det här är vägledning — inte ett ja eller nej.";

export const VAD_DU_FAR = [
  "Sammanfattning av just ditt projekt",
  "Sannolik klassning (tillbyggnad, komplementbyggnad, fasadändring, plank/mur eller annan) och varför",
  "Regler som gäller för den klassningen efter PBL-reformen 1 december 2025",
  "Hur dina mått ligger mot de nationella trösklarna",
  "Det vi inte kan se — och exakt vad du ska kontrollera",
  "Frågor att ställa till kommunen",
  "Nästa steg, inklusive när en fastighetsspecifik utredning är motiverad",
];

/**
 * "Vad det inte är" innehåller med avsikt negationer som annars står på
 * förbjudna-fraser-listan. Blocket är undantaget i lint-testet.
 */
export const VAD_DET_INTE_AR = [
  "ett besked om du behöver bygglov",
  "en garanti eller ett ja/nej",
  "en ansökan eller anmälan",
  "juridisk rådgivning",
  "en genomgång av din detaljplan, byggrätt eller strandskyddsstatus",
];

export const FOR_VEM =
  "Bygglovskoll passar när du har ett avgränsat projekt på ett en- eller tvåbostadshus och vill ha " +
  "ett strukturerat underlag innan du kontaktar kommunen.";

export const FOR_VEM_INTE =
  "Den passar inte när ärendet är komplext (strandskydd, kulturmiljö, BRF, installation av " +
  "vatten/avlopp/eldstad, oklart avstånd till tomtgräns, mått nära en tröskel). Då visar vi det " +
  "innan du betalar och hänvisar till Bygglovsutredning, 2 950 kr.";

export const FAQ_LANDNING: Array<{ f: string; s: string }> = [
  {
    f: "Får jag veta om jag behöver bygglov?",
    s: "Nej. Du får ett underlag: sannolik klassning, tillämpliga regler och vad du ska kontrollera. Det bindande beskedet ges av byggnadsnämnden.",
  },
  {
    f: "Varför kan ni inte bara säga ja eller nej?",
    s: "Utfallet beror på detaljplan, kvarvarande byggrätt, redan förbrukad lovfri pott, strandskydd, kulturmiljö och avstånd till gräns. Det syns inte i ett formulär.",
  },
  {
    f: "Vad händer om mitt ärende är för komplext?",
    s: "Då säljs inte Bygglovskoll. Du får en kort förklaring och erbjudande om Bygglovsutredning (2 950 kr).",
  },
  {
    f: "Behöver ni fastighetsbeteckning?",
    s: "Nej för att genomföra kollen. Den är frivillig men gör underlaget tydligare när du tar det till kommunen.",
  },
];

export const INTAKE_INGRESS =
  "Svara så precist du kan. Uppgifterna används för att välja rätt regelspår och skriva ett " +
  "personligt underlag. Det bindande beskedet ges av kommunen.";

/**
 * Svensk genitiv, samma regel som kommunGenitiv() i lib/content.ts. Medvetet
 * duplicerad här: content.ts läser filsystemet och ska inte dras in i
 * klientbundlen bara för en enradsfunktion.
 */
export function genitiv(namn: string): string {
  return /[sxz]$/i.test(namn) ? namn : `${namn}s`;
}

/**
 * Plank och mur har två trösklar i PBL 9 kap. 19 §, och vilken som gäller
 * avgörs av avståndet till närmaste byggnad — en uppgift intaket inte frågar
 * efter. Mellan de två trösklarna går utfallet därför inte att avgöra.
 * Siffrorna kommer ur regelbanken, aldrig härifrån.
 */
export function plankKraverByggnadsavstand(
  hojdNaraByggnad: number,
  avstandNaraByggnad: number,
  hojdLangreBort: number,
): string {
  const n = (v: number) => v.toFixed(1).replace(".", ",");
  return (
    `Lovplikten för plank och mur beror på avståndet till närmaste byggnad. Inom ` +
    `${n(avstandNaraByggnad)} m från en byggnad går gränsen vid ${n(hojdNaraByggnad)} m, längre bort ` +
    `redan vid ${n(hojdLangreBort)} m (PBL 9 kap. 19 §). Din angivna höjd ligger mellan de två ` +
    `trösklarna, och vi frågar inte efter avståndet till byggnaden. Utan den uppgiften går det inte ` +
    `att avgöra vilken tröskel som gäller för ditt plank.`
  );
}

export const B_RUBRIK = "Ditt ärende kräver en utredning";

export const B_BROD =
  "Bygglovskoll är avsedd för avgränsade projekt där de nationella trösklarna räcker som " +
  "orientering. I ditt fall finns minst en omständighet som vi inte kan hantera i ett " +
  "standardunderlag:";

export const B_UTREDNING =
  "Bygglovsutredning, 2 950 kr: fastighetsspecifik genomgång av detaljplan, byggrätt, strandskydd " +
  "och en skriftlig rekommendation. Det är fortfarande vägledning — inte kommunens beslut.";

export function bGratischunk(kommun: string): string {
  return (
    `Ta med fastighetsbeteckning till ${genitiv(kommun)} byggnadsnämnd. Be dem ta ställning till ` +
    "(1) åtgärdens klassning, (2) om detaljplanen eller utökad lovplikt träffar, (3) strandskydd " +
    "och ev. dispens, (4) avstånd till tomtgräns och ev. grannmedgivande. Det bindande beskedet " +
    "ges av nämnden."
  );
}

export const C_RUBRIK = "Det här ligger utanför Bygglovskoll";

export const C_BROD =
  "Vi tar inte betalt för — och skriver inte underlag om — grannars byggen, status på ett redan " +
  "öppet ärende, avstyckning eller frågan om ett äldre lov fortfarande gäller.";

export function cHanvisning(kommun: string): string {
  return `Hänvisning: kontakta ${genitiv(kommun)} byggnadsnämnd. Fastighetsbildning hanteras av Lantmäteriet.`;
}
