# Regelbank — backlog

**Batchas med nästa regelbankskontroll 2026-12-08. Blockerar inte produkt.**

Allt här är medvetet **inte** gjort i passet 2026-09-09 (commit-serie `48b47c7` → `77bd741`). Ingen post är ett känt sakfel — de är oprecisioner, saknad täckning eller framtida lagändringar. Rader hänvisar till `RB-2026-09-08.md`. Radnummer i `content/` gäller per 2026-09-09 och kan glida; sök på citerad text hellre än på rad.

**Prioritet:** P1 = kan leda läsaren fel i ett verkligt fall · P2 = ofullständig men inte vilseledande · P3 = redaktionellt / framtida

---

## A. Lågriskträffar: "anmälan slopad" utan koppling till PBF 6 kap. 3 § (rad 26)

Samtliga är **korrekt avgränsade** till lovfria åtgärder och alltså inte fel. De nämner bara inte att anmälningsplikten lever kvar när lovbefrielsen kommer från detaljplan eller områdesbestämmelser. Passagen finns nu en gång, i `nya-regler-2026.mdx` — dessa 20 ytor kan hänvisa dit om de tas upp.

| # | Fil:rad | Prio |
|---|---|---|
| 1 | `content/guider/nya-regler-2026.mdx:29` (FAQ-svar) | P2 |
| 2 | `content/guider/nya-regler-2026.mdx:106` (brödtext under rubriken) | P2 |
| 3 | `content/guider/ansokan.mdx:37` | P2 |
| 4 | `content/guider/bygga-utan-bygglov.mdx:54` | P2 |
| 5 | `content/guider/kontrollplan-bygglov-2026.mdx:26` | P2 |
| 6 | `content/guider/handlaggningstid.mdx:26` | P3 |
| 7 | `content/guider/garage-bygglov-2026.mdx:20` | P3 |
| 8 | `content/guider/garage-bygglov-2026.mdx:26` | P2 |
| 9 | `content/guider/uteplats-skarmtak-regler-2026.mdx:28` | P2 |
| 10 | `content/guider/uteplats-skarmtak-regler-2026.mdx:128` | P2 |
| 11 | `content/guider/villapool-bygglov-2026.mdx:141` | P3 |
| 12 | `content/guider/bygglov-attefall-skillnad.mdx:31` | P3 |
| 13 | `content/guider/bygglov-attefall-skillnad.mdx:142` | P3 |
| 14 | `content/atgarder/attefallsatgard.mdx:22` | P2 |
| 15 | `content/atgarder/attefallsatgard.mdx:35` | P3 |
| 16 | `content/atgarder/tillbyggnad.mdx:22` | P2 |
| 17 | `content/atgarder/carport-garage.mdx:89` | P3 |
| 18 | `content/atgarder/friggebod.mdx:67` | P2 |
| 19 | `content/atgarder/friggebod.mdx:99` | P3 |
| 20 | `content/guider/bygglov-i-efterhand.mdx:157` (18 m²-exemplet — förutsätter nationell lovfrihet utan att säga det) | P2 |

| 21 | **Kommunfilerna (30 st): stycket "Den särskilda anmälningsplikten för lovfria komplementbyggnader … är slopad"** | **Ingen åtgärd** |

Post 21 loggas för spårbarhet, inte för åtgärd. Stycket är redan avgränsat till lovfria byggnader och flaggar dessutom tekniska installationer. **Ändra det inte** — beslut 2026-09-09.

---

## B. Kontrollansvarig: rad 17 är uppdaterad, innehållet är det inte

Rad 17 kompletterades 2026-09-08 med Lag 2026:712 och förordning 2026:709, men `content/guider/kontrollansvarig.mdx` är skriven mot läget före 1 juli 2026.

| # | Post | Prio |
|---|---|---|
| 22 | **PBF 7 kap. 5 §** räknar upp **elva** undantag från KA-kravet (bl.a. åtgärd som bara kräver anmälan, komplementbyggnad, ytterligare bostad i enbostadshus, mur/plank/altan, liten marklovsåtgärd). Guiden återger bara "små ändringar av en-/tvåbostadshus". Nämn även att nämnden ändå får besluta att KA krävs. | P1 |
| 23 | **Lag 2026:712** (i kraft 2026-07-01): KA krävs numera även för kontroll som omfattas av **avfallshanteringsplan**; samordningsansvar vid flera KA (10 kap. 9 §); uppdelningen **egenkontroll / sakkunnigkontroll** med möjlig obligatorisk sakkunnigkontroll (10 kap. 8 §); ny roll **byggbedömare** (PBF 7 kap. 2 §); utökad lista över ej överklagbara beslut (13 kap. 2 § p. 5). Inget av detta finns i `kontrollansvarig.mdx`. | P1 |

Not: `kontrollansvarig.mdx:59` ("berör bärande konstruktion") står kvar med avsikt — se grep-undantagen i regelbanken. Rör den inte vid detta pass heller.

---

## C. Bevakning — författningar som ännu inte trätt i kraft

Inget att skriva förrän de gäller. Kontrolleras 2026-12-08.

| # | SFS | I kraft | Vad | Berör | Prio |
|---|---|---|---|---|---|
| 24 | **Förordning 2025:980** | 2027-12-01 | upphäver **PBF 6 kap. 3 §** | **Rad 26 + passagen i `nya-regler-2026.mdx`** och de fyra fotnoterna ska då tas bort eller skrivas om till historik. Enda övergångsbestämmelsen rör färdigställandeskydd och räddar inte 6:3. | P2 |
| 25 | **Lag 2026:746** | 2027-01-01 | ändr. PBL 9 kap. 56, 57, 59 §§ (förutsättningar för lov inom detaljplan) m.fl. | Ingen rad i dag — kontrollera mot rad 1 och 15 när lydelsen gäller | P3 |
| 26 | **Förordning 2026:1265** | 2027-01-01 | ändr. **PBF 9 kap. 19 §** (ta byggnad i bruk efter tillbyggnad före slutbesked) m.fl. | Rad 20 citerar inte 19 § i dag. Överväg om sanktionsraden bör täcka den | P3 |

---

## D. Ny täckning: solenergi och värmepump (Lag 2026:406)

| # | Post | Prio |
|---|---|---|
| 27 | Rad 6 och rad 12 bär nu **PBL 9 kap. 17 a §** (fasadändring för solenergianläggning **högst 11 kW** är undantagen från lovplikt enligt 15 § 3, men utökad lovplikt enligt 34–37 eller 54 § bryter undantaget) och **9 kap. 99–99 a §§** (solenergi: förlängning högst **två** veckor; värmepump **under 50 MW**: **fyra** veckor, ingen förlängning). Ingen guide i `content/` täcker något av detta. Överväg egen sida, eller avsnitt i `nya-regler-2026.mdx` och `handlaggningstid.mdx`. | P1 |

---

---

## E. Källstädning efter lanseringen av Bygglovskoll

| # | Post | Prio |
|---|---|---|
| 28 | **`content/guider/byggsanktionsavgift.mdx:110`** och **`content/guider/overklaga-bygglov.mdx:171`** har kvar `](/konsult)`-länkar, den första med texten «Begär en kostnadsfri konsultbedömning – svar inom 24 timmar». De **når inte besökaren**: `saneraKonsultCta()` i `lib/cta.ts` skriver om raderna vid rendering när flaggan är på, och `tests/cta.test.ts` bevakar att ingen `/konsult`-länk blir kvar i utdatan. Det som står kvar är alltså källtext, inte publicerad copy. Städa den ändå vid nästa innehållspass, så att MDX-filerna säger samma sak som sajten och saneringen inte blir ett permanent lager. Alla `/konsult`-länkar i **koden** är borta sedan «fix: sista /konsult-lankarna -> offert». | P3 |

---

**28 poster.** Inget här blockerar release.
