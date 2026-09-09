# Bygglovskoll v1 — implementationsnoter

Kompletterar `spec.md`. Beskriver bara det som avviker från specen eller som
specen lämnar öppet.

## Avvikelser mellan spec.md och regelbanken

Grinden är att regelbanken vinner. Tre avvikelser hittades.

| Spec (avsnitt 0b) | Regelbanken | Vad som gäller i koden |
|---|---|---|
| «Lov giltighet 2 + 5 år … (PBL 9:43)» | Rad 13: **var 43 §, nu 115 §** | Giltighetstid används inte i v1. Ingen kod berörs, men specens paragrafhänvisning är fel. |
| Fasadändring: bara 9 kap. 15 § och 37 § | Rad 6 bär även **17 a §** (solenergianläggning ≤ 11 kW undantagen) och **18 §** (utökad lovplikt bryter undantaget), Lag 2026:406 | Regelspåret för fasadändring nämner utökad lovplikt enligt rad 6/10. Solundantaget är **inte** utskrivet — se v2 nedan. |
| Plank/mur: A tillåts vid «höjd ≤ 1,5 m och avstånd ≥ 4,5» | Rad 8: lov krävs över **1,8 m inom 3,6 m från byggnad**, men redan över **1,2 m längre bort** | Triagen följer specens A/B-policy (den är konservativ i rätt riktning). Men avsnitt 3 och 4 skriver ut **båda** trösklarna och säger uttryckligen att vilken som gäller beror på placeringen i förhållande till byggnaden. |

Den tredje är den viktigaste. Specens A-regel kan släppa igenom ett plank på
1,5 m som står mer än 3,6 m från huset — och det är lovpliktigt enligt 9 kap.
19 §. Intaket frågar bara efter avstånd till *tomtgräns*, inte till byggnaden.
Produkten ger aldrig ett besked, och texten pekar ut båda trösklarna, så
underlaget är inte felaktigt. Men vill man kunna säga något skarpare om plank
behöver intaket en fråga om avstånd till närmaste byggnad. Lämnat till v2.

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

## Intake-state utan databas

Intaket förs mellan formulär och Stripe-retur i en **signerad HttpOnly-cookie**
(HMAC-SHA256 med en nyckel härledd ur `STRIPE_SECRET_KEY`, giltig 6 timmar).
En hash av samma intake ligger i Checkout-sessionens metadata. Vid retur måste
tre saker stämma innan underlaget låses upp: sessionen är `paid`, den avser rätt
`price`, och cookiens intake hashar till samma värde som metadatan.

Konsekvens att känna till: byter kunden webbläsare eller enhet mellan betalning
och retur finns cookien inte, och underlaget kan inte visas. Rutten svarar då
410 med en uppmaning att höra av sig. Det är en medveten kostnad för att slippa
databas i v1.

Triagen körs **om på servern** både vid checkout och vid verifiering. Klienten
kan aldrig påstå att ett fall är A.

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
- **Strandskyddsklustret** (spec avsnitt 4) — egen leverans, inte kod.
