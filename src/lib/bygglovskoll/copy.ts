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
  "Det som avgör ditt fall — och exakt vad du ska kontrollera",
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
  "Har ärendet komplicerande omständigheter — strandskydd, kulturmiljö, BRF, installation av " +
  "vatten/avlopp/eldstad, oklart avstånd till tomtgräns eller mått nära en tröskel — blir de i " +
  "stället innehåll i underlaget: vilka de är, varför de spelar roll och vad du ska kontrollera. " +
  "Vi visar dem innan du betalar. Behöver du en fastighetsspecifik genomgång är Bygglovsutredning, " +
  "2 950 kr, nästa steg.";

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
    f: "Vad händer om mitt ärende har komplicerande omständigheter?",
    s: "Då är de en del av underlaget. Din Bygglovskoll listar varje omständighet, varför den spelar roll och exakt vad du ska kontrollera med kommunen. Behövs en fastighetsspecifik genomgång erbjuds Bygglovsutredning (2 950 kr) som nästa steg.",
  },
  {
    f: "Kan jag få ett personligt svar på en egen fråga?",
    s: "Ja, som tillägg för 400 kr. Du skriver din fråga i formuläret och får ett skriftligt svar från Bygglov24 inom två arbetsdagar. Det är vägledning utifrån dina uppgifter — inte kommunens beslut.",
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

/**
 * v1.1: utfall B avvisar inte längre. B leder till samma köpsida som A — 99 kr
 * köper vägledning och underlag, aldrig ett ja eller nej, och komplexitet är
 * innehåll i produkten i stället för skäl att vägra sälja. Väggen «Ditt ärende
 * kräver en utredning» och den fria frågelistan utan köp är därför borta;
 * frågorna är numera en del av produkten.
 */
export const B_KOP_BROD =
  "Ditt ärende har omständigheter som måste kontrolleras mot kommunen — din Bygglovskoll listar " +
  "exakt vilka, varför de spelar roll och hur du kontrollerar dem.";

/** Rubrik på listan över omständigheter, både på köpsidan och i underlaget. */
export const B_OMSTANDIGHETER_RUBRIK = "Det här har vi hittat i dina uppgifter";

/**
 * B2, B3 och B5 utlöses av två skilda svar — «ja» och «vet ej» — och en enda
 * gemensam text ("… eller så är det oklart") gjorde det omöjligt att se vilket
 * av dem som låg bakom flaggan, både för kunden och för oss. Varje flagga har
 * därför två varianter: en som återger ett ja, en som återger ett vet ej.
 * Orsakskoden är densamma i båda fallen; bara texten skiljer.
 */
export const B2_JA =
  "Du angav att tomten ligger nära hav, sjö eller vattendrag. Strandskydd prövas separat och kan " +
  "kräva dispens oavsett bygglovsfrågan.";

export const B2_VETEJ =
  "Du angav att du inte vet om tomten ligger nära hav, sjö eller vattendrag. Strandskydd prövas " +
  "separat och kan kräva dispens oavsett bygglovsfrågan.";

export const B3_JA =
  "Du angav att byggnaden eller området är kulturhistoriskt utpekat, eller att fastigheten ligger " +
  "inom samfällighet eller BRF. Det kan utlösa utökad lovplikt för åtgärder som annars inte kräver lov.";

export const B3_VETEJ =
  "Du angav att du inte vet om byggnaden eller området är kulturhistoriskt utpekat, eller om " +
  "fastigheten ligger inom samfällighet eller BRF. Det kan utlösa utökad lovplikt för åtgärder som " +
  "annars inte kräver lov.";

export const B5_JA =
  "Du angav att vatten, avlopp, ventilation eller eldstad installeras. Teknisk anmälan kan krävas " +
  "även när byggnaden i sig är lovfri.";

export const B5_VETEJ =
  "Du angav att du inte vet om vatten, avlopp, ventilation eller eldstad installeras. Teknisk " +
  "anmälan kan krävas även när byggnaden i sig är lovfri.";

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

// ── Tillägget «Fråga oss» (v1.1) ────────────────────────────────────────────

/** Priser i kronor inkl. moms. Stripe är källan; de här är copyns siffror. */
export const PRIS_BAS_KR = 99;
export const PRIS_TILLAGG_KR = 400;
export const PRIS_MED_SVAR_KR = PRIS_BAS_KR + PRIS_TILLAGG_KR;

export const FRAGA_ETIKETT = "Din fråga (valfritt)";

export const FRAGA_HJALP =
  "Har du en egen fråga om projektet kan du skriva den här. Den används bara om du väljer " +
  "tillägget nedan, och den går aldrig till Stripe — bara till oss.";

export const FRAGA_KRYSS =
  "Jag vill också ha ett personligt skriftligt svar på min fråga inom två arbetsdagar (+400 kr)";

/**
 * Verbatim-förbehåll för tillägget. Visas på köpsidan och i underlaget.
 *
 * Obs: frasen innehåller ordet «svaret» i betydelsen «det skriftliga svar vi
 * skickar», inte i betydelsen «rätt svar på lovfrågan» som förbjudna-fraser-
 * listan är skriven mot. Den är därför undantagen i lint-testet, på samma sätt
 * som negationerna i VAD_DET_INTE_AR.
 */
export const FRAGA_FORBEHALL =
  "Det personliga svaret är vägledning från Bygglov24 utifrån dina uppgifter — inte kommunens " +
  "beslut och inte juridisk rådgivning.";

export function fragaLeverans(epost: string): string {
  return `Din Bygglovskoll är klar nedan. Ditt personliga svar skickas till ${epost} inom två arbetsdagar.`;
}

export const C_RUBRIK = "Det här ligger utanför Bygglovskoll";

export const C_BROD =
  "Vi tar inte betalt för — och skriver inte underlag om — grannars byggen, status på ett redan " +
  "öppet ärende, avstyckning eller frågan om ett äldre lov fortfarande gäller.";

export function cHanvisning(kommun: string): string {
  return `Hänvisning: kontakta ${genitiv(kommun)} byggnadsnämnd. Fastighetsbildning hanteras av Lantmäteriet.`;
}
