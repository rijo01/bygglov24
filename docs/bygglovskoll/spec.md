# Bygglovskoll — produktleverans

**Mottagare:** bygglov24.se\
**Regelbanksversion:** RB-2026-09-08\
**Mallversion copy:** COPY-2026-09-08\
**Status:** Underlag för implementation. Avsnitt 3 och 12 i briefen är icke förhandlingsbara.

------------------------------------------------------------------------

## 0. Icke förhandlingsbart (kort)

Produkten säljs, beskrivs och upplevs som **vägledning och underlag** — aldrig som besked.

**Förbjudna formuleringar** (UI, marknadsföring, PDF, e-post): *svaret, rätt svar, få besked, vi avgör, du behöver inte bygglov, du kan bygga, garanterat, juridiskt bindande.*

**Obligatoriska formuleringar:** *vägledning, underlag, sannolikt, beror på, kontrollera med din kommun, det bindande beskedet ges av byggnadsnämnden.*

Ingen språkmodell får avgöra tröskelvärden, belopp eller regelval. Alla sådana värden hämtas ur regelbanken.

------------------------------------------------------------------------

## 0b. Regelbanksverifiering (september 2026)

Kontrollerat mot Boverket (PBL-kunskapsbanken), SFS 2025:974 och prop. 2024/25:169. Datumstämpla vid varje ändring.

| Regel i briefen | Verifierat läge 2026-09 | Kommentar för generatorn |
|:---|----|----|
| Skärmtak 15 m² | **Föråldrat som egen regel.** Den särskilda 15 m²-regeln för skärmtak upphörde 1 dec 2025. Ett tak sammanbyggt med huset som ökar volymen prövas som **tillbyggnad** (OPA/BTA) enligt PBL 9 kap. 10 §. | Klassificera först. Använd 30 m²-potten för tillbyggnad. Behåll briefens exempel «skärmtak \> 15 m²» som **konservativ närhetsflagga** i triagen (utfall B), inte som lagtext i PDF. |
| Tillbyggnad 30 m² | Bekräftat. PBL 9 kap. 10 §: högst 30,0 m² BTA, OPA eller kombination; får inte överstiga byggnadens taknock; kumulativ pott per byggnad inkl. äldre lovfria tillbyggnader. | Ange alltid att äldre skärmtak/attefallstillbyggnader kan räkna mot potten. |
| Komplementbyggnad 30/45 resp. 50/65 | Bekräftat. Inom dp: max 30,0 m² BYA/byggnad, 45,0 m² sammanlagt, nock ≤ 4,0 m. Utanför dp: 50,0 / 65,0 / nock ≤ 4,5 m. Befintliga lovfria komplement (även äldre friggebod/attefall) räknas in. Anmälan för själva byggnaden slopad. | «Vet ej» på detaljplan → använd de striktare inom-dp-värdena i texten och flagga B om yta \> 25 m² eller höjd \> 3,7 m. |
| Fasadändring en-/tvåbostadshus | Bekräftat. Ordinarie lovplikt i 9 kap. 15 § omfattar inte en-/tvåbostadshus, komplementbyggnad eller komplementbostadshus. Utökad lovplikt kan gälla vid kulturvärde (37 §), äldre planbestämmelser och totalförsvar. | Aldrig «du får måla om». Alltid kontrollera kulturmiljö och plan. |
| Plank/mur 1,2 / 1,8 m | Bekräftat i sak, ny lagteknik. PBL 9 kap. 19 § (inom dp): lov om höjd \> 1,8 m inom 3,6 m från byggnad, eller \> 1,2 m längre bort. 34 §: lov nära gräns (\< 4,5 m) eller järnväg för mur/plank \> 1,2 m. | Briefens 1,8 m-undantag för insynsskydd vid uteplats är fortfarande den praktiska tröskeln nära huset. |
| VA / ventilation / eldstad | Bekräftat. Teknisk anmälan kan krävas även när byggnaden är lovfri (PBF). | Alltid utfall B om installation = ja. |
| \< 4,5 m till tomtgräns | Bekräftat. PBL 9 kap. 34–35 §§. Grannens skriftliga medgivande kan undanröja just den lovplikten om övriga villkor uppfylls. | «Vet ej» eller \< 4,5 m → B. |
| Strandskydd | Bekräftat. Normalt 100 m, kan vara utökat till 300 m. Separat prövning i miljöbalken. | «Ja» eller «vet ej» → B. Aldrig «strandskydd gäller inte». |
| Lov giltighet 2 + 5 år | Bekräftat i briefen (PBL 9:43). Använd bara som orientering. |  |
| Kontrollansvarig | Små ändringar av en-/tvåbostadshus kräver normalt inte certifierad KA (PBL 10:10). Skriv «normalt inte» + kontrollera med kommunen. |  |
| Byggsanktionsavgift | Mekanism enligt PBF 9 kap. PBB 2026 = **59 200 kr** (regeringen). Ange **aldrig** ett konkret avgiftsbelopp för kundens fall. |  |
| Handläggning 10 veckor | PBL: kommunen ska normalt besluta inom 10 veckor från komplett ansökan. Ingen kommunspecifik tid. |  |
| Avgifter | Enbart hänvisning till kommunens taxa. Inga belopp. |  |

**Area-mått i PDF:** skriv ut om det är BYA, BTA eller OPA. Blanda inte.

------------------------------------------------------------------------

# 1. Produktcopy

## 1.1 Landningssida `/bygglovskoll`

### Meta

- Title: Bygglovskoll 99 kr — vägledning utifrån dina uppgifter \| bygglov24.se
- Description: Personligt skriftligt underlag om klassning, tillämpliga regler och vad du ska kontrollera med kommunen. Inte ett besked. 99 kr.

### Hero

**Bygglovskoll — 99 kr**

Ett personligt skriftligt underlag för ditt projekt.\
Du får klassning, de regler som sannolikt gäller och en checklista mot kommunen.

Det bindande beskedet ges av din kommuns byggnadsnämnd. Det här är vägledning — inte ett ja eller nej.

\[Starta Bygglovskoll\] \[Vad underlaget innehåller\]

### Vad du får

1.  Sammanfattning av just ditt projekt
2.  Sannolik klassning (tillbyggnad, komplementbyggnad, fasadändring, plank/mur eller annan) och varför
3.  Regler som gäller för den klassningen efter PBL-reformen 1 december 2025
4.  Hur dina mått ligger mot de nationella trösklarna
5.  Det vi inte kan se — och exakt vad du ska kontrollera
6.  Frågor att ställa till kommunen
7.  Nästa steg, inklusive när en fastighetsspecifik utredning är motiverad

Levereras som PDF och visas på skärm direkt efter betalning. 2–4 sidor.

### Vad det inte är

Bygglovskoll är **inte**: - ett besked om du behöver bygglov - en garanti eller ett ja/nej - en ansökan eller anmälan - juridisk rådgivning - en genomgång av din detaljplan, byggrätt eller strandskyddsstatus

Det bindande beskedet ges alltid av byggnadsnämnden mot fastighetens förutsättningar.

### För vem

Bygglovskoll passar när du har ett avgränsat projekt på ett en- eller tvåbostadshus och vill ha ett strukturerat underlag innan du kontaktar kommunen.

Den passar **inte** när ärendet är komplext (strandskydd, kulturmiljö, BRF, installation av vatten/avlopp/eldstad, oklart avstånd till tomtgräns, mått nära en tröskel). Då visar vi det innan du betalar och hänvisar till Bygglovsutredning, 2 950 kr.

### Pris och leverans

99 kr inklusive moms. Betalning via Stripe. Underlaget låses upp när betalningen är verifierad.

### Ångerrätt (obligatorisk ruta, måste kryssas i före köp)

Digitalt innehåll som levereras direkt. För att ångerrätten ska upphöra när leveransen påbörjas måste du aktivt godkänna detta före köp. Utan det godkännandet gäller 14 dagars ångerrätt enligt distansavtalslagen — även om underlaget redan lästs.

Kryssruta (obligatorisk):\
«Jag begär att leveransen påbörjas direkt och godkänner att ångerrätten upphör när Bygglovskollen visas och PDF:en görs tillgänglig.»

### Återbetalning

Återbetalning vid tekniskt fel som gör att underlaget inte kan levereras. Ingen återbetalning för att underlaget inte innehåller ett ja eller ett nej — det är inte vad produkten är.

### Förbehåll (verbatim, synligt före köp)

«Denna bygglovskoll är vägledning och underlag baserat på de uppgifter du lämnat och gällande regler per \[datum\]. Den ersätter inte kommunens beslut — det bindande beskedet ges av din kommuns byggnadsnämnd. Detta är inte juridisk rådgivning.»

### Vanliga frågor (landning)

**Får jag veta om jag behöver bygglov?**\
Nej. Du får ett underlag: sannolik klassning, tillämpliga regler och vad du ska kontrollera. Det bindande beskedet ges av byggnadsnämnden.

**Varför kan ni inte bara säga ja eller nej?**\
Utfallet beror på detaljplan, kvarvarande byggrätt, redan förbrukad lovfri pott, strandskydd, kulturmiljö och avstånd till gräns. Det syns inte i ett formulär.

**Vad händer om mitt ärende är för komplext?**\
Då säljs inte Bygglovskoll. Du får en kort förklaring och erbjudande om Bygglovsutredning (2 950 kr).

**Behöver ni fastighetsbeteckning?**\
Nej för att genomföra kollen. Den är frivillig men gör underlaget tydligare när du tar det till kommunen.

Inga omdömen, kundantal eller betyg.

------------------------------------------------------------------------

## 1.2 Intake — steg, etiketter, hjälptexter

Ingress överst:\
«Svara så precist du kan. Uppgifterna används för att välja rätt regelspår och skriva ett personligt underlag. Det bindande beskedet ges av kommunen.»

Separat länk, synlig men inte primär: **Begär offert på handlingar eller ombud** (inte Bygglovskoll).

### Steg 1 — Projekt

**Vad vill du bygga eller ändra?**\
- Tillbyggnad / uterum\
- Fristående byggnad (växthus, förråd, garage, attefallshus)\
- Altan / tak över uteplats / pergola\
- Plank / mur / staket\
- Fasadändring (fönster, dörr, kulör, balkong)\
- Pool\
- Annat

Hjälp: «Välj det som ligger närmast. Osäker klassning hanteras i nästa steg.»

**Fäst i huset eller fristående?**\
- Fäst i / sammanbyggt med huset\
- Fristående\
- Delvis / oklart

Hjälp: «Ett uterum som sitter i fasaden är normalt en tillbyggnad. Ett fristående slutet växthus är normalt en komplementbyggnad. “Delvis / oklart” leder ofta till utredning i stället för Bygglovskoll.»

### Steg 2 — Mått

- Yta (m²) — tal, en decimal
- Högsta höjd (m) — tal, en decimal. Hjälp: «Taknock för byggnad. För plank/mur: höjd från lägsta marknivå på utsidan.»
- Längd (m) — visas bara vid plank/mur
- Avstånd till närmaste tomtgräns (m) + alternativ **Vet ej**

### Steg 3 — Fastighet

**Fastighetstyp**\
- Villa / radhus / parhus (en- eller tvåbostadshus)\
- Flerbostadshus / BRF\
- Fritidshus\
- Annat

**Kommun** (obligatoriskt, sökbar lista)\
**Fastighetsbeteckning** (frivillig)\
Hjälp: «Används bara i underlaget så att du kan visa det för kommunen. Lagras inte som sökbar kundpost.»

**Ligger tomten inom detaljplanerat område?** Ja / Nej / Vet ej\
**Ligger tomten nära hav, sjö eller vattendrag (inom ca 300 m)?** Ja / Nej / Vet ej\
Hjälp: «Strandskydd är normalt 100 m och kan vara utökat till 300 m. “Vet ej” behandlas försiktigt.»\
**Är byggnaden eller området kulturhistoriskt utpekat, eller ligger fastigheten inom samfällighet/BRF?** Ja / Nej / Vet ej

### Steg 4 — Befintligt och installationer

**Finns redan komplementbyggnader (garage, förråd, friggebod, attefall) på tomten?** Ja / Nej / Vet ej\
Om ja: ungefärlig total yta (m²) + Vet ej

**Installeras vatten, avlopp, ventilation eller eldstad?** Ja / Nej / Vet ej

**Beskriv kort det som inte ryms i valen** (max 500 tecken)\
**E-post** (obligatorisk)

Primärknapp: **Visa vilket underlag som passar**\
Sekundär: Spara och fortsätt senare — inte nödvändigt i v1.

### Validering

- Kommun och e-post krävs.
- Yta och höjd krävs utom vid ren fasadändring utan volym (då höjd/yta valfria).
- Fritext \> 500 tecken blockeras.
- Inga personuppgifter utöver e-post efterfrågas.

------------------------------------------------------------------------

## 1.3 Köpsteg — utfall A

### Rubrik

Bygglovskoll för ditt projekt — 99 kr

### Kort sammanfattning (exempelstruktur, ifylls av mall)

«Du har angett en fristående byggnad om \[yta\] m² och \[höjd\] m i \[kommun\], på ett en- eller tvåbostadshus. Utifrån det kan vi ta fram ett personligt underlag.»

### Vad du betalar för

Ett skriftligt underlag med klassning, tillämpliga regler, hur dina mått ligger mot trösklarna, det vi inte kan se och en checklista mot \[kommun\].

### Vad du inte betalar för

Ett besked. Ett ja eller nej. En granskning av detaljplanen.

### Förbehåll (verbatim, alltid synligt)

«Denna bygglovskoll är vägledning och underlag baserat på de uppgifter du lämnat och gällande regler per \[datum\]. Den ersätter inte kommunens beslut — det bindande beskedet ges av din kommuns byggnadsnämnd. Detta är inte juridisk rådgivning.»

### Kryssrutor före Stripe Checkout (båda obligatoriska)

1.  Jag har läst att Bygglovskoll är vägledning och underlag, inte ett besked från kommunen.
2.  Jag begär att leveransen påbörjas direkt och godkänner att ångerrätten upphör när Bygglovskollen visas och PDF:en görs tillgänglig.

Knapp: **Betala 99 kr**

Efter verifierad session: visa underlaget på skärm + knappar **Ladda ner PDF** och **Skicka till min e-post**.

------------------------------------------------------------------------

## 1.4 Skärm — utfall B (ingen 99-kronorsförsäljning)

### Rubrik

Ditt ärende kräver en utredning

### Bröd

Bygglovskoll är avsedd för avgränsade projekt där de nationella trösklarna räcker som orientering. I ditt fall finns minst en omständighet som vi inte kan hantera i ett standardunderlag:

- \[flagga 1, klartext\]
- \[flagga 2, klartext\]

Exempel på klartext: - «Du har angett att tomten ligger nära vatten, eller att du inte vet. Strandskydd prövas separat och kan kräva dispens oavsett bygglovsfrågan.» - «Avståndet till tomtgräns är under 4,5 m eller okänt. Det påverkar lovplikten.» - «Måtten ligger nära eller över en relevant tröskel.» - «Du har angett installation av vatten, avlopp, ventilation eller eldstad.» - «Fastigheten är flerbostadshus/BRF eller kulturmiljö/samfällighet är ja eller oklart.»

### Vad utredningen är

Bygglovsutredning, 2 950 kr: fastighetsspecifik genomgång av detaljplan, byggrätt, strandskydd och en skriftlig rekommendation. Det är fortfarande vägledning — inte kommunens beslut.

\[Begär Bygglovsutredning\]\
Sekundärt: «Jag vill bara ha frågorna att ställa till kommunen» → visa den korta gratischunken nedan, ingen PDF som låtsas vara koll.

### Kort gratischunk (B, max ~120 ord)

«Ta med fastighetsbeteckning till \[kommun\]s byggnadsnämnd. Be dem ta ställning till (1) åtgärdens klassning, (2) om detaljplanen eller utökad lovplikt träffar, (3) strandskydd och ev. dispens, (4) avstånd till tomtgräns och ev. grannmedgivande. Det bindande beskedet ges av nämnden.»

------------------------------------------------------------------------

## 1.5 Skärm — utfall C

### Rubrik

Det här ligger utanför Bygglovskoll

Vi tar inte betalt för — och skriver inte underlag om — grannars byggen, status på ett redan öppet ärende, avstyckning eller frågan om ett äldre lov fortfarande gäller.

**Hänvisning:** kontakta \[kommun\]s byggnadsnämnd. Fastighetsbildning hanteras av Lantmäteriet.\
Om du i stället vill bygga eller ändra på den egna fastigheten: \[Starta Bygglovskoll på nytt\].

------------------------------------------------------------------------

## 1.6 E-postcopy

### A — leverans

Ämne: Din Bygglovskoll\
Bröd: «Här är ditt underlag som PDF. Det är vägledning utifrån de uppgifter du lämnade \[datum\]. Det ersätter inte kommunens beslut — det bindande beskedet ges av \[kommun\]s byggnadsnämnd.»\
Bilaga: PDF. Ingen säljrad i ämnesraden.

### B — efter triage, ingen köp

Ämne: Därför passar utredning bättre än Bygglovskoll\
«Vi sålde inte Bygglovskoll eftersom \[flagga i klartext\]. Om du vill ha en fastighetsspecifik genomgång finns Bygglovsutredning (2 950 kr). Annars: ställ frågorna i meddelandet till kommunen.»

### B — påminnelse dag 14

Ämne: Kvar att kolla med kommunen\
Kort, saklig. Ingen brådska-retorik. Länk till utredning + länk till kommunens e-tjänst om den är känd, annars bara «byggnadsnämnden i \[kommun\]».

### C

Ingen säljmejl. Ev. auto-kvitto på att förfrågan mottagits + hänvisning.

------------------------------------------------------------------------

## 1.7 PDF-mall (ordning enligt brief avsnitt 4)

Sidhuvud: Bygglovskoll · bygglov24.se · inte ett kommunalt beslut\
Sidfot: Regelbank RB-2026-09-08 · mall PDF-1.0 · upprättad \[YYYY-MM-DD TT:MM\] · \[kommun\]

### Sida 1 — sektion 1–3

**1. Ditt projekt**\
Mall:\
«Du har angett följande. Uppgifterna är dina, inte kontrollerade mot register.

- Åtgärd: {typ_label}
- Placering: {fast_frist}
- Yta: {yta} m²
- Högsta höjd: {hojd} m
- {längd om plank}
- Avstånd till tomtgräns: {avstand \| Vet ej}
- Fastighetstyp: {typ}
- Kommun: {kommun}
- Fastighetsbeteckning: {beteckning \| inte angiven}
- Detaljplan: {ja/nej/vet ej}
- Nära vatten (ca 300 m): {ja/nej/vet ej}
- Kulturmiljö / samfällighet / BRF: {ja/nej/vet ej}
- Befintliga komplementbyggnader: {nej \| ca X m² \| vet ej}
- Installation VA/ventilation/eldstad: {ja/nej/vet ej}
- Din beskrivning: {fritext \| —}»

**2. Klassning**\
Mallprincip: en sannolik klass + en mening «varför» från regelbanken, aldrig från modellens eget tyckande.

Exempelblock (komplementbyggnad):\
«Utifrån att byggnaden är fristående och sluten räknas projektet **sannolikt som komplementbyggnad**. En komplementbyggnad är en fristående byggnad som kompletterar en annan byggnad och inte är inredd som självständig bostad. Klassningen är en orientering. Kommunen gör den bindande bedömningen.»

Exempelblock (tillbyggnad):\
«Utifrån att åtgärden är fäst i / sammanbyggd med huset och ökar volymen räknas projektet **sannolikt som tillbyggnad**. Ett uterum mot fasaden är ett typiskt exempel. Om konstruktionen i stället är fristående ändras regelspåret.»

Exempelblock (fasadändring):\
«Utifrån att du angett fönster, dörr, kulör eller balkong utan ny byggnadsvolym räknas projektet **sannolikt som fasadändring** (annan ändring än tillbyggnad). Om balkongen ökar volymen kan den i stället bedömas som tillbyggnad — kontrollera det med kommunen.»

Osäker klassning får **inte** produceras som utfall A.

**3. Regler som gäller för den klassningen**\
Hämta enbart listade villkor ur regelbanken för vald klass. Ingress:\
«Nedan är de nationella huvudreglerna efter PBL-reformen 1 december 2025 (SFS 2025:974). Lokala planbestämmelser och utökad lovplikt kan fortfarande kräva lov. Kontrollera med {kommun}.»

### Sida 2 — sektion 4–6

**4. Så här ligger ditt projekt mot trösklarna**\
Jämför endast kundens angivna tal med regelbankens tal. Formulera:

«Du har angett {yta} m² och {hojd} m nock. För {klassning} inom detaljplan är de nationella trösklarna {X} m² per byggnad och {Y} m nock. Dina angivna mått ligger {under / i närheten av / över} de värdena.

Det betyder inte att åtgärden är lovfri eller lovpliktig. Kvarvarande pott, detaljplan, strandskydd och avstånd till gräns kan ändra utfallet.»

Om detaljplan = vet ej:\
«Du har inte angett om tomten ligger inom detaljplan. Inom och utanför detaljplan är trösklarna olika. Använd båda raderna som orientering och kontrollera planstatus hos kommunen eller via Lantmäteriets karttjänster.»

**5. Det som avgör ditt fall och som vi inte kan se**\
Alltid alla fem punkter, varje gång, som kontrollpunkter — aldrig som fastställda fakta.

1.  **Kvarvarande pott / byggrätt**\
    «Befintliga lovfria komplementbyggnader och äldre friggebodar/attefall räknas in i potten. Tidigare lovfria tillbyggnader (även äldre skärmtak) räknas in i tillbyggnadspotten. Be kommunen eller kontrollera tidigare lov/anmälningar mot fastighetsbeteckningen {beteckning \| din fastighet}.»

2.  **Detaljplanens särskilda bestämmelser**\
    «Utökad lovplikt i äldre plan, prickmark, högsta byggnadsarea och skyddsbestämmelser kan göra en annars orienterande tröskel overksam. Ta fram detaljplanen för {kommun} och fråga nämnden vad som gäller just din ruta.»

3.  **Strandskydd**\
    «Strandskydd är normalt 100 meter från strandlinjen och kan vara utökat upp till 300 meter. Dispens kan krävas även när bygglov inte krävs. Kontrollera strandskyddskarta hos länsstyrelsen och frågan hos {kommun}.»

4.  **Kulturmiljö**\
    «Särskilt värdefull byggnad eller område kan utlösa utökad lovplikt för åtgärder som annars inte kräver lov. Kontrollera plan, kommunens kulturmiljöunderlag och ev. q/k-bestämmelser.»

5.  **Avstånd till tomtgräns**\
    «Placering närmare än 4,5 meter kräver i regel grannens skriftliga medgivande, annars lov. Du har angett {avstand \| att du inte vet}. Bekräfta måttet på plats och mot karta innan du går vidare.»

**6. Din checklista mot kommunen**\
Alltid: - Ta med fastighetsbeteckning: {beteckning \| hämta hos Lantmäteriet / kommunen}.\
- Fråga 1: Vilken klassning gör nämnden av åtgärden?\
- Fråga 2: Träffas åtgärden av utökad lovplikt, kulturmiljö eller planbestämmelse?\
- Fråga 3: Hur stor lovfri pott återstår på fastigheten?\
- Fråga 4: Gäller strandskydd — och krävs dispens?\
- Fråga 5: Räcker grannmedgivande för placeringen, eller ska lov sökas?\
- Fråga 6: Krävs teknisk anmälan för VA, ventilation eller eldstad även om byggnaden skulle vara lovfri?

Om installation = nej och övrigt A:\
«Själva byggnadsåtgärden kan i vissa fall vara anmälningsfri när den är lovfri. Tekniska installationer är en separat fråga. Bekräfta hos {kommun}.»

Ange aldrig «ansökan krävs» som faktum. Formulera:\
«Om nämnden bedömer att lov eller anmälan behövs: fråga vilken e-tjänst och vilka handlingar som gäller i {kommun}. Avgift enligt kommunens taxa.»

### Sida 3 — sektion 7–8

**7. Nästa steg**\
Standard A utan komplexitetsflagga:\
«1. Kontrollera punkterna i avsnitt 5.\
2. Ställ frågorna i avsnitt 6 till byggnadsnämnden i {kommun}.\
3. Fatta beslut om lov/anmälan först efter kommunens besked.\
4. Om du vill ha handlingar eller ombud: begär offert separat.»

När utredning ändå kan vara motiverad (t.ex. kund själv flaggat osäkerhet i fritext utan att träffa B-ordlista):\
«Om detaljplan, strandskydd eller pott visar sig oklara när du börjar kontrollera är Bygglovsutredning (2 950 kr) nästa steg. Utredningen tar fram fastighetsspecifikt underlag som den här kollen inte omfattar.»

**8. Förbehåll (verbatim, alltid sist)**\
«Denna bygglovskoll är vägledning och underlag baserat på de uppgifter du lämnat och gällande regler per \[datum\]. Den ersätter inte kommunens beslut — det bindande beskedet ges av din kommuns byggnadsnämnd. Detta är inte juridisk rådgivning.»

Inga kommunala taxebelopp. Inga handläggningstider utöver den nationella 10-veckorsregeln, formulerad:\
«Kommunen ska normalt besluta inom 10 veckor från komplett ansökan. Den faktiska tiden varierar. Fråga {kommun}.»

------------------------------------------------------------------------

# 2. Triage — beslutstabell

Körs efter komplett intake, före betalning. Första träff som inte är A vinner. Konservativ: hellre B än A.

## 2.1 Utfall C — utanför tjänsten (körs först)

| Villkor (fritext och/eller val) | Utfall |
|:---|----|
| Fritext eller val handlar om grannes bygge, klagomål på granne | C |
| Status på befintligt öppet ärende («har ni sett mitt ärende», diarienummer) | C |
| Avstyckning, fastighetsbildning, servitut som huvudfråga | C |
| «Har jag redan bygglov?», giltighet av gammalt lov som enda fråga | C |
| Fråga utan eget projekt (allmän juridik, överklagande av annans beslut) | C |

Nyckelord C (fritext, skiftlägesokänsligt, svensk böjning):\
`grannens bygge`, `grannen har byggt`, `avstyckning`, `avstycka`, `diarienummer`, `mitt ärende hos kommunen`, `har jag redan lov`, `gäller mitt bygglov fortfarande` — om de är *huvudfrågan*, inte bisats.

Om både eget projekt och C-signal: manuell regel = C bara när inget eget måttsatt projekt finns. Annars B om tvisteord (se B-ordlista).

## 2.2 Utfall B — utredning, sälj inte 99 kr

Träff på **minst en** rad → B.

| \# | Trigger | Källa |
|:---|----|----|
| B1 | Fastighetstyp = flerbostadshus/BRF eller «annat» | val |
| B2 | Strand/vatten = ja eller vet ej | val |
| B3 | Kulturmiljö / samfällighet / BRF = ja eller vet ej | val |
| B4 | Avstånd till tomtgräns \< 4,5 m eller vet ej | val |
| B5 | Installation VA/ventilation/eldstad = ja eller vet ej | val |
| B6 | Fäst/fristående = «delvis / oklart» | val |
| B7 | Åtgärd = pool | val (anläggning + ofta schakt/mur; för komplex för A) |
| B8 | Åtgärd = annat | val |
| B9 | Tillbyggnad / uterum: yta \> 30 m² **eller** yta ≥ 25 m² (närhet) | mått |
| B10 | Fristående byggnad: yta \> 30 m² **eller** yta ≥ 25 m²; **eller** höjd \> 4,0 m **eller** höjd ≥ 3,7 m | mått |
| B11 | Fristående + detaljplan = nej: använd 50/4,5 som tak, men B vid yta ≥ 45 eller höjd ≥ 4,2 (närhet mot 50/4,5) | mått + plan |
| B12 | Altan/tak/pergola: yta \> 15 m² (konservativ närhetsflagga; laglig tillbyggnadspott är 30 m²) **eller** konstruktion oklart fristående | mått + klass |
| B13 | Plank/mur: höjd \> 1,8 m **eller** höjd ≥ 1,6 m | mått |
| B14 | Befintliga komplement + ny fristående yta: summa \> 45 m² (inom dp / vet ej) eller \> 65 (utanför dp) **eller** summa saknas («vet ej» på befintlig yta när ja på befintliga) | mått |
| B15 | Fritext träffar B-ordlista | fritext |
| B16 | Klassning genuint tvetydig enligt klassningsmatris | härledd |

**B-ordlista (fritext):**\
strandskydd, dispens, sanktionsavgift, i efterhand, svartbygge, olovligt, överklagande, granne-tvist, grann tvist, samfällighet, gemensamhetsanläggning, fornlämning, biotopskydd, rivningslov, marklov, komplementbostad, självständig bostad, uthyrning, två kök.

## 2.3 Klassningsmatris (för både triage och PDF)

| Val «vad» | Fäst/fristående | Sannolik klass | A tillåten? |
|:---|----|----|----|
| Tillbyggnad / uterum | Fäst | Tillbyggnad | Ja, om inga B-flaggor |
| Tillbyggnad / uterum | Fristående | Komplementbyggnad (om sluten) | Ja, om inga B-flaggor |
| Tillbyggnad / uterum | Delvis / oklart | Tvetydig | Nej → B16 |
| Fristående byggnad | Fristående | Komplementbyggnad | Ja, om inga B-flaggor |
| Fristående byggnad | Fäst | Tillbyggnad | Ja, om inga B-flaggor |
| Altan / tak / pergola | Fäst | Tillbyggnad (skärmtak/OPA) om volymökning; annars anläggning altan | A bara om fäst, yta ≤ 15 m², höjd rimlig, inga andra flaggor |
| Altan / tak / pergola | Fristående eller oklart | Tvetydig (fristående tak / carport / byggnad) | Nej → B |
| Plank / mur / staket | — | Plank/mur (staket med hög luftighet kan falla utanför, men A bara vid tydligt plank/mur) | Ja om höjd ≤ 1,5 m och avstånd ≥ 4,5 |
| Fasadändring | — | Fasadändring | Ja om en-/tvåbostad eller fritidshus, kultur = nej, ingen volym i fritext («bygger ut», «inglasning») |
| Fasadändring + fritext om inglasning/volym | — | Tvetydig mot tillbyggnad | Nej → B |
| Pool | — | Anläggning (pool i sig oftast inte egen lovplikt; mur/altan/schakt kan vara det) | Nej → B7 |
| Annat | — | — | Nej → B8 |

Fritidshus behandlas som en-/tvåbostadshus i A-filtret om övrigt stämmer. «Annat» fastighetstyp → B1.

## 2.4 Utfall A — sälj Bygglovskoll

Alla måste vara sanna:

1.  Inte C
2.  Inte någon B-rad
3.  Fastighetstyp ∈ {villa/radhus/parhus, fritidshus}
4.  Klassning entydig enligt matrisen
5.  Projektet ligger **tydligt under** relevant tröskel (inte «nära»)
6.  Avstånd till gräns ≥ 4,5 m (numeriskt)
7.  Strand = nej, kultur/BRF/samfällighet = nej, installation = nej
8.  Detaljplan får vara ja, nej eller vet ej — men vid vet ej skärps närhetströsklarna enligt B10/B14

Om A: lås regelspår + mall-id innan Checkout. Om indata inte matchar en mall → B, ingen improvisation.

## 2.5 Beslutsträd (körordning)

    C-signal utan eget projekt? → C
    annars någon B1–B16? → B
    annars A-villkor 3–8 sanna? → A
    annars → B

------------------------------------------------------------------------

# 3. Tjugo syntetiska testfall

Förväntad klassning är den **sannolika** klassen för PDF/logg. Utfall är triage.

| \# | Kortnamn | Nyckelindata | Utfall | Klassning | Varför |
|:---|----|----|----|----|----|
| 1 | Växthus 12 m² vid tomtgräns | Fristående 12 m², 2,5 m, avstånd 2 m, villa, dp ja, vatten nej, kultur nej, inst. nej | **B** | Komplementbyggnad | B4 avstånd \< 4,5. Briefens typexempel. |
| 2 | Växthus 12 m² mitt på tomten | Som 1 men avstånd 6 m, befintliga komplement nej | **A** | Komplementbyggnad | Under 30/4,0, inga flaggor. |
| 3 | Uterum 26 m² fäst i huset | Tillbyggnad, fäst, 26 m², 3,2 m, avstånd 5 m, villa, allt nej | **B** | Tillbyggnad | B9 närhet (≥ 25 m²) mot 30-potten. Briefexempel 26 m². |
| 4 | Uterum 18 m² fäst | Som 3 men 18 m² | **A** | Tillbyggnad | Tydligt under 30, fäst, inga flaggor. |
| 5 | Fristående lamelltak 20 m² kustnära | Altan/tak, fristående, 20 m², vatten ja, villa | **B** | Tvetydig + strand | B2 + B12 + B16. Briefexempel. |
| 6 | Balkong vinklad→rak i radhus | Fasadändring, radhus, kultur vet ej, avstånd 5 m | **B** | Fasadändring / ev. tillbyggnad | B3 kultur vet ej. Briefexempel. |
| 7 | Balkong rak i villa, kultur nej | Fasadändring, villa, kultur nej, strand nej, inst. nej, avstånd 8 m, ingen volym i fritext | **A** | Fasadändring | Entydig fasad, inga flaggor. |
| 8 | Plank 1,9 m | Plank, 1,9 m, längd 8 m, avstånd 5 m, villa | **B** | Plank/mur | B13 höjd \> 1,8. Briefexempel. |
| 9 | Plank 1,4 m vid uteplats | Plank 1,4 m, avstånd 5 m, villa, allt nej | **A** | Plank/mur | Under 1,6-närhet och 1,8; avstånd ok. |
| 10 | Komplement 28 m² nock 4,2 m | Fristående 28 m², 4,2 m, avstånd 6 m, dp ja | **B** | Komplementbyggnad | B10 höjd \> 4,0. |
| 11 | Komplement 20 m² + befintliga 30 m² | Ny 20, befintliga ja 30 m², dp ja, avstånd 6 | **B** | Komplementbyggnad | B14 summa 50 \> 45. |
| 12 | Förråd 15 m² utanför dp | Fristående 15, höjd 3,8, dp nej, avstånd 8, villa, allt nej | **A** | Komplementbyggnad | Under 50/4,5 och under närhet. |
| 13 | Flerbostad uterum 10 m² | Tillbyggnad 10 m², flerbostadshus | **B** | Tillbyggnad | B1 flerbostad. |
| 14 | Eldstad i friggebod 12 m² | Fristående 12 m², 2,8 m, avstånd 6, inst. ja | **B** | Komplementbyggnad | B5 installation. |
| 15 | «Byggt i efterhand» 10 m² | Fristående 10 m², annars A-tal, fritext «uppfört i efterhand, rädd för sanktionsavgift» | **B** | Komplementbyggnad | B15 ordlista. |
| 16 | Grannes attefall | Fritext «behöver grannen lov för sitt attefall?», inga egna mått | **C** | — | Utanför tjänsten. |
| 17 | Avstyckning | Fritext «kan jag avstycka tomten», typ annat | **C** | — | Fastighetsbildning. |
| 18 | Skjutbart tak 14 m² | Altan/tak, fäst, 14 m², fritext «skjutbart glastak, väggar på två sidor», avstånd 6 | **B** | Tvetydig | B16 + briefens exempel skjutbart/delvis inglasat. |
| 19 | Fasad kulör + kultur ja | Fasadändring, kultur ja | **B** | Fasadändring | B3. |
| 20 | Pool 4×8 villa inland | Pool, avstånd 6, strand nej, kultur nej | **B** | Anläggning | B7. Inte 99-krorsprodukt. |

### Extra kontrollfall (rekommenderas utöver de 20)

| \# | Kortnamn | Utfall | Syfte |
|:---|----|----|----|
| 21 | Vet ej strand, annars «perfekt A» | B | B2 |
| 22 | Vet ej avstånd, annars perfekt | B | B4 |
| 23 | Tillbyggnad 30,0 m² exakt | B | På tröskel = inte «tydligt under» |
| 24 | Fasad + fritext «inglasning av balkong» | B | Volym/tvetydighet |
| 25 | «Har jag redan bygglov sedan 2019?» utan nytt projekt | C | C-regel |

Enhetstestet ska asserta: utfall, klassning, regelspår-id, att PDF:en innehåller verbatim-förbehållet, att förbjudna fraser inte förekommer, att inga kronbelopp för taxa/sanktion skrivs ut.

------------------------------------------------------------------------

# 4. Strandskydd-klustret — struktur utan innehåll

Mål: täcka gapet (~2 200 exponeringar/kvartal, pos ~41). Faktagranskning mot Boverket, Naturvårdsverket och länsstyrelsen. Inget autogenererat bröd.

Ingen sida får utge sig för att ge besked i det enskilda fallet. CTA efter bröd: Bygglovskoll som första steg **bara** när strandfrågan är nej; annars Bygglovsutredning.

## 4.1 Föreslagen URL-karta

1.  `/guide/strandskydd` — huvudguide
2.  `/guide/strandskyddsdispens`
3.  `/guide/strandtomt-regler`
4.  `/guide/attefall-komplement-inom-strandskydd`
5.  `/guide/strandskydd-och-bygglov` (relationen två prövningar)
6.  Ev. ankare, inte nya sidor: kommunmallen får blocket «Strandskydd» med länk till 1 och 5 + länsstyrelsen, ingen lokal praxis.

Inga nya kommunsidor.

## 4.2 Huvudguide `/guide/strandskydd`

**H1:** Strandskydd — vad det är och vad det betyder för dig som vill bygga

Föreslagna H2/H3 (endast rubriker): - Vad strandskyddet skyddar - Var strandskydd gäller - Normalbredd 100 meter - Utökat skydd upp till 300 meter - Sjö, hav, vattendrag — vad räknas - Vem som beslutar vad (kommun / länsstyrelse) - Förbudet — vilka åtgärder som typiskt träffas - Dispens — när den prövas och av vem - Strandskydd och detaljplan - Strandskydd och lovfria åtgärder (PBL-undantag tar inte bort miljöbalken) - Kartor och hur du tar reda på om din tomt träffas - Tillsyn och efterföljande prövning (utan belopp) - Checklista: underlag att ta med till kommunen - Relaterade guidar (dispens, strandtomt, komplement inom strandskydd, bygglov i efterhand) - Källor (Boverket, Naturvårdsverket, miljöbalken 7 kap., relevanta vägledningar)

**Underfrågor att besvara i bröd (redaktionellt, inte FAQ-klickbete som «svaret»):** - Gäller strandskydd på min tomt bara för att jag ser vatten? - Räknas dike och anlagd damm? - Vad är «hemfridszon» / tomtplatsavgränsning? - Får en lovfri komplementbyggnad ligga inom strandskydd? - Är brygga, båthus och friggebod samma prövning? - Vad händer om åtgärden redan är utförd?

## 4.3 `/guide/strandskyddsdispens`

- Vad en dispens är (och inte är)
- Vem som prövar i olika län / delegering
- Särskilda skäl — översikt av lagens punkter, inte «så får du ja»
- Tomtplatsavgränsning
- Fri passage
- Handlingar som normalt begärs
- Förhållandet till bygglov och startbesked
- Överklagande i stora drag (instanskedja, inga utfallslöften)
- När Bygglovsutredning är rätt nästa steg

**Underfrågor:** - Kan jag få dispens för komplementbyggnad? - Räcker «jag ser knappt vattnet» som skäl? - Måste dispensen vinna laga kraft innan jag bygger? - Vad prövas om huset redan står inom strandskydd?

## 4.4 `/guide/strandtomt-regler`

- Vad «strandtomt» betyder i praktiken (inte juridisk term ensam)
- Byggrätt mot strand vs. mot gata
- Befintlig bebyggelse och utbyte / tillbyggnad
- Vegetation, schakt och marklov i korthet (hänvisa, inte uttömma)
- Gemensamhetsanläggning och bryggor
- Skillnad kust / insjö / vattendrag
- Länkar till länsstyrelsens vägledningar (generella, inte påhittad praxis)

**Underfrågor:** - Får jag röja för utsikt? - Gäller samma regler i skärgård som vid en mindre sjö? - Vad betyder prickad mark närmast vattnet?

## 4.5 `/guide/attefall-komplement-inom-strandskydd`

- Begrepp efter 1 dec 2025: komplementbyggnad / komplementbostadshus (friggebod/attefall som sökord)
- PBL-pott vs. strandskyddsförbud — två separata spår
- Varför «lovfritt» inte betyder «dispensfritt»
- Placering, storlek och fri passage som typiska prövningspunkter
- Anmälan/startbesked vs. dispensbeslut
- Länk till huvudguide komplementbyggnad + dispensguiden

**Underfrågor:** - Kan jag använda 30 m²-potten inom strandskydd? - Räknas äldre friggebod mot både pott och strandskyddsprövning? - Vad frågar jag kommunen resp. länsstyrelsen?

## 4.6 `/guide/strandskydd-och-bygglov`

- Två lagar, två beslut
- Ordning: vad som praktiskt bör vara klart först
- När bara den ena prövningen blir aktuell
- «I efterhand» när båda saknas (länk sanktionsavgift + i-efterhand, inga belopp)
- Internlänkar från kommunmall och `/atgard/*`

## 4.7 Internlänkning (krav från brief 10.6)

- Kommunmall: stycke efter «bygglov i kommunen» → strandskydd-huvud + strandskydd-och-bygglov
- `/atgard/komplementbyggnad`, `/atgard/tillbyggnad`, `/atgard/attefall` (om de finns) → komplement-inom-strandskydd
- Pengasidor (sanktionsavgift, i efterhand) ↔ strandskydd-och-bygglov
- Ingen sidgenerator för 289 kommuner

## 4.8 CTA-regel på klustret

Efter innehållet, diskret:

«Vill du ha ett skriftligt underlag för ett avgränsat projekt på en- eller tvåbostadshus **utan** strandnära osäkerhet? Bygglovskoll, 99 kr.\
Ligger tomten nära vatten, eller är du osäker? Då är Bygglovsutredning rätt nivå — Bygglovskoll säljs inte i de fallen.»

------------------------------------------------------------------------

# 5. Kort implementeringsnota (inte kod)

- Regelvärden och trösklar endast från fil `rules/RB-2026-09-08.json` (eller motsv.). LLM får bara språk, inte siffror.
- Matchar inte mall → utfall B.
- Logg per PDF: intake-hash, regelbanksversion, mallversion, triageutfall, tidsstämpel. Ingen lagring av PDF. Fastighetsbeteckning endast i logg + render, rensas enligt 90-dagarsregel.
- Stripe: samma mönster som fullmakt24.se (`/api/verify-session` innan unlock).
- Förbjudna fraser: lint i CI mot copy + renderer.
- Enhetstester: tabellen i avsnitt 3, minst de 20 + de fem kontrollfallen.
- Människa läser diff av regelbank och PDF-fixtures före drift.

**Formuleringslint (blockera build):**\
`\\b(rätt svar|få besked|vi avgör|du behöver inte bygglov|du kan bygga|garanterat|juridiskt bindande)\\b`\
Tillåt inte heller rubriken «Svaret» eller «Besked».

------------------------------------------------------------------------

*Slut på leverans 1–4 enligt brief avsnitt 13.*
