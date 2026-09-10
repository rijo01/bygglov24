# Bygglovskoll v1 — implementationsnoter

Kompletterar `spec.md`. Beskriver bara det som avviker från specen eller som
specen lämnar öppet.

## v1.1 — B avvisar inte längre, och tillägget «Fråga oss»

Produktändring. Regelbanken, rules-JSON och `triage.ts` är **oförändrade** — det
är köpvägen som ändrats, inte bedömningen. Triagefördelningen över spec avsnitt
3 och randfallen är exakt densamma; `tests/triage.test.ts` är orörd bortsett
från det nya `fraga`-fältet i basintaket.

**Principen:** 99 kr köper vägledning och underlag, aldrig ett ja eller nej. Det
är den enda gränsen. Komplexitet är innehåll i produkten, inte skäl att vägra
sälja.

Följderna, spårade i `tests/b-underlag.test.ts`:

- **Utfall B leder till samma köpsida som A.** Väggen «Ditt ärende kräver en
  utredning» och den fria frågelistan utan köp är borta — frågorna är numera en
  del av produkten. Köpsidan listar omständigheterna före köp och säger vad de
  betyder. Checkout-rutten säljer A och B; **bara C säljs inte**, eftersom det
  inte är ett eget bygg- eller ändringsprojekt.
- **PDF-variant per utfall.** A är oförändrad. I B byggs **avsnitt 5** ur
  triagens orsaker: en punkt per utlöst flagga med (i) vad kunden angav, (ii)
  varför det spelar roll — triagens egen orsakstext, ordagrant, så att den inte
  finns i två versioner — och (iii) exakt vad hon ska kontrollera plus frågan
  hon ska ställa nämnden. **Avsnitt 7** erbjuder utredningen med en motivering
  per flagga. Avsnitt 4 skriver måtten mot trösklarna som förut.
- **Ingen mening i B-varianten får antyda att projektet är lovfritt.** Två
  meningar var formulerade som om lovfrågan redan var avgjord och är därför
  utfallsberoende: meningen om teknisk anmälan i avsnitt 3 och meningen om
  anmälningsfrihet i avsnitt 6. Testet läser B-underlaget mening för mening.
- **`reasons` följer med i Stripe-metadatan** (orsakskoder, inte texter) så att
  B-underlaget kan byggas och granskas från sessionen ensam. Texterna genereras
  om ur samma deterministiska triage vid leverans.

**Tillägget «Fråga oss»** (+400 kr, totalt 499 kr, `STRIPE_PRICE_BYGGLOVSKOLL_SVAR`):
intaget har ett fritextfält «Din fråga (valfritt)» på högst 800 tecken och en
kryssruta som väljer det andra priset i Checkout. Kryssad ruta utan fråga är ett
valideringsfel (`felIKopval`), inte ett tyst avstängt tillägg — annars betalar
kunden 400 kr för ett tomt uppdrag.

Frågan går **aldrig till Stripe**. Den bärs av den signerade cookien, precis som
fritexten, och skickas vidare till info@bygglov24.se via samma Web3Forms-väg som
`LeadForm`, med källan `fraga-oss`. Priset på den betalda sessionen — inte
klienten, inte cookien — avgör om tillägget ingår.

Att brevet gått noteras i sessionens metadata (`fragaSkickad`), så att en
omladdning inte mejlar om samma fråga. Öppnar kunden kvittot på en annan enhet
finns frågan inte i cookien; då går brevet ändå, märkt `utan-fraga`, och skickas
om med frågan om den dyker upp senare. Vi har tagit betalt för ett svar och
måste få veta det även när frågan inte kan återskapas.

## Avvikelser mellan spec.md och regelbanken

Grinden är att regelbanken vinner. Tre avvikelser hittades.

| Spec (avsnitt 0b) | Regelbanken | Vad som gäller i koden |
|---|---|---|
| «Lov giltighet 2 + 5 år … (PBL 9:43)» | Rad 13: **var 43 §, nu 115 §** | Giltighetstid används inte i v1. Ingen kod berörs, men specens paragrafhänvisning är fel. |
| Fasadändring: bara 9 kap. 15 § och 37 § | Rad 6 bär även **17 a §** (solenergianläggning ≤ 11 kW undantagen) och **18 §** (utökad lovplikt bryter undantaget), Lag 2026:406 | Regelspåret för fasadändring nämner utökad lovplikt enligt rad 6/10. Solundantaget är **inte** utskrivet — se v2 nedan. |
| Plank/mur: A tillåts vid «höjd ≤ 1,5 m och avstånd ≥ 4,5» | Rad 8: lov krävs över **1,8 m inom 3,6 m från byggnad**, men redan över **1,2 m längre bort** | **Specen följs inte här.** A ges bara under **1,2 m**. Mellan 1,2 och 1,8 m blir utfallet B, eftersom intaket inte frågar efter avståndet till närmaste byggnad. Avsnitt 3 och 4 skriver ut båda trösklarna. |

Den tredje är den viktigaste, och den är åtgärdad. Specens A-regel släppte
igenom ett plank på 1,5 m som står mer än 3,6 m från huset — och det är
lovpliktigt enligt 9 kap. 19 §, eftersom gränsen där är 1,2 m. Intaket frågar
bara efter avstånd till *tomtgräns*, inte till byggnaden.

Triagen delar därför plankhöjden i tre:

| Höjd | Utfall | Varför |
|---|---|---|
| ≤ 1,2 m | **A** | Under den lägre tröskeln i 19 §. Varken avståndsregeln i 19 § eller mur/plank-tröskeln i 34 § träffar, oavsett var på tomten planket står — byggnadsavståndet behövs inte för att svara. |
| 1,2 – 1,8 m | **B**, orsak `PLANK_HOJD_KRAVER_BYGGNADSAVSTAND` | Mellan trösklarna. Vilken som gäller avgörs av avståndet till närmaste byggnad, som vi inte frågar efter. |
| > 1,8 m | **B** via B13 | Över den högre tröskeln, som förut. |

Följden är att **spec avsnitt 3 fall 9** (plank 1,4 m vid uteplats) numera ger
B där specen anger A. Det är en avsiktlig avvikelse och står som kommentar i
`tests/triage.test.ts`.

Vill man kunna sälja fler plankfall behöver intaket en fråga om avstånd till
närmaste byggnad. Då blir spannet 1,2–1,8 m avgörbart. Lämnat till v2.

## Trösklar kontra triagepolicy

Alla **legala** trösklar kommer ur `rules/RB-2026-09-08.json` och är bundna till
regelbanken av `tests/rules-consistency.test.ts`.

Specens **närhetsmarginaler** (25 mot 30, 3,7 mot 4,0, 45 mot 50, 4,2 mot 4,5,
1,6 mot 1,8) är däremot triagepolicy ur spec 2.2 — de finns inte i lagen. De
ligger därför i `NARHET` i `triage.ts`, uttryckt som *avdrag från* den legala
tröskeln, så att en ändring i regelbanken flyttar dem automatiskt. De skrivs
aldrig ut i underlaget som om de vore regler.

Två av dem har inget legalt ankare alls och står som egna tal: `altanYta` (15,
ärvd från den upphävda skärmtaksregeln — spec kallar den uttryckligen en
konservativ närhetsflagga, inte lagtext) och `plankMaxForA` (1,5, ur
klassningsmatrisen).

## Intake-state utan databas: metadata är källan, cookien är cache

**Checkout-sessionens metadata är källan.** Hela intaket utom fritexten ligger
där, ett fält per nyckel (16 fält), plus `intakeHash`, `rulesVersion`,
`regelspar` och `classification`. Stripe tillåter 50 nycklar à 500 tecken, så
marginalen är god. Serialiseringen ligger i `state.ts`
(`intakeTillMetadata` / `metadataTillIntake`) och testas tur och retur.

Följden är att **underlaget kan levereras av enbart `session_id`**. Byter kunden
webbläsare, enhet eller nätverk mellan betalning och retur spelar ingen roll.

**Cookien är bara en cache.** Den signerade HttpOnly-cookien (HMAC-SHA256 med en
nyckel härledd ur `STRIPE_SECRET_KEY`, 6 timmar) bär de fält som medvetet hålls
utanför Stripe: **fritexten** och, sedan v1.1, **frågan** i tillägget. Finns cookien och hashar dess
intake till samma värde som `metadata.intakeHash` används den, och fritexten
kommer med i avsnitt 1. Saknas den levereras underlaget ändå, och avsnitt 1
skriver «Din beskrivning: —». Cookien får aldrig vara ett villkor för leverans.

Fritexten hålls utanför Stripe eftersom den är det enda fältet med fri
användartext, kan vara 500 tecken, och inte behövs för att bygga underlaget.
Frågan hålls utanför av samma skäl och ett till: den ska gå till oss i mejlet,
inte ligga hos betalleverantören.

**Felsvar.** 410 ges bara när session_id saknas, sessionen inte kan hämtas,
eller inte är betald — och då med specens återbetalningstext, inte en uppmaning
att höra av sig. Ett pris som varken är Bygglovskoll eller Bygglovskoll med
tillägg ger 409.

Triagen körs **om på servern** både vid checkout och vid verifiering. Klienten
kan aldrig påstå vilket utfall ett fall har.

**Returadresserna följer anropets värd.** `success_url` och `cancel_url` byggdes
först från en fast domän. En betalning som startats på en preview-deploy landade
därför på produktion, där `BYGGLOVSKOLL_ENABLED` är av — kunden betalade och
fick 404. `lib/bygglovskoll/origin.ts` härleder i stället origin ur
`x-forwarded-host` (annars `Origin`, annars `Host`).

Värden reflekteras aldrig rakt av: headern sätts av anroparen, och skrevs den in
i `success_url` vore Checkout-sessionen en öppen vidarebefordran som dessutom bär
vårt session-id. Allowlisten är `bygglov24.se`, `www.bygglov24.se` och projektets
egna preview-värdar (`bygglov24-…-rickards-projects-741176ef.vercel.app`, både
prefix och suffix krävs). Localhost tillåts bara när `VERCEL` inte är satt. Allt
annat faller tillbaka på `https://bygglov24.se`, och https tvingas för allt utom
lokal utveckling så att protokollet inte kan nedgraderas via en header.

## Obesvarat får aldrig bli «vet ej»

Triagen är konservativ men tyst: ett tre-lägesfält som varken är `ja`, `nej`
eller `vetej` faller ur alla grenar och landar i B-fallbacken. Kunden ser då en
utredningshänvisning utan att veta att en fråga aldrig kom fram — och eftersom
B2, B3 och B5 tidigare delade en text som täckte både ja och vet ej gick det
inte att läsa sig till vilket svar som utlöste flaggan.

Tre spärrar, alla på plats:

1. **Formuläret** har inget förval på de tre frågorna och listar i klartext vad
   som saknas i steget, i stället för att bara stänga av knappen.
2. **`felIIntake()`** (`lib/bygglovskoll/validering.ts`) är kontraktet mellan
   formulär och triage. Checkout-rutten kör den före `triage()` och svarar 400
   med `kod: "OFULLSTANDIGT_INTAKE"` och frågan som saknas. Samma funktion
   validerar intaket som byggs tillbaka ur Stripe-metadatan vid leverans —
   `metadataTillIntake()` hittar inte längre på `vetej` för ett fält den inte
   kan läsa, utan returnerar null.
3. **`tests/intake-integration.test.ts`** kör rutthanteraren med exakt den
   payload formuläret skickar. Triagetesterna anropar `triage()` direkt och
   säger därför ingenting om vad som når den efter state, JSON och rutt.

Orsakskoderna följer med i checkout-svaret och i Stripe-metadatan, så att det
går att se vilka flaggor som utlöstes utan att gissa ur texten. Sedan v1.1
stoppar de inte köpet — bara C ger 409.

## Loggning

`log.ts` skriver en strukturerad rad till stdout per genomfört köp:
tidsstämpel, intake-hash, utfall, klassning, regelversion, Stripe session-id.
Ingen fritext, ingen e-post, ingen fastighetsbeteckning.

Vercel KV erbjuds inte längre, och v1 provisionerar medvetet ingen extern
databas. Raden fångas av Vercels runtime-loggar. Behövs sökbar historik med
verklig TTL får ett lager läggas till från Vercel Marketplace — då sätts
90-dagarsregeln där. Retentionen är dokumenterad i integritetspolicyn.

## Medvetet kvar till v2

- **Språkmodell för formulering.** v1 är helt deterministisk. En modell får i så
  fall bara variera språk, aldrig siffror eller regelval.
- **Solenergiundantaget** (9 kap. 17 a §, ≤ 11 kW) i fasadändringsspåret.
  Regelbanken bär det sedan Lag 2026:406; specen känner inte till det.
- **Avstånd till närmaste byggnad** i intaket, så att rätt plank-tröskel kan
  pekas ut. Se avvikelsetabellen.
- **E-postleverans av PDF.** Spec 1.6 har copyn; v1 levererar på skärm och som
  nedladdning. Knappen «Skicka till min e-post» är inte byggd.
- **B-påminnelse dag 14** (spec 1.6).
- **Databas.** Följer av intake-state-valet ovan.
- **CTA-omläggning.** Befintliga «kostnadsfri»/«gratis»-CTA:er och `LeadForm`
  är orörda enligt uppdrag.
- **Leverans av det personliga svaret.** v1.1 mejlar underlaget till oss; själva
  svaret skrivs och skickas för hand inom två arbetsdagar. Ingen kö, ingen
  uppföljning i systemet.
- **Strandskyddsklustret** (spec avsnitt 4) — egen leverans, inte kod.
