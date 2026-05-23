import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Integritetspolicy – Bygglov24",
  description:
    "Integritetspolicy för Bygglov24. Så hanterar vi dina personuppgifter enligt GDPR – ändamål, lagringstid, dina rättigheter och kontakt.",
  alternates: { canonical: "https://bygglov24.se/integritetspolicy" },
};

const lastUpdated = "23 maj 2025";

export default function IntegritetspolicyPage() {
  return (
    <div className="py-12">
      <div className="container-content">
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <Link href="/" className="hover:text-brand-600 transition-colors">Hem</Link>
          <span>/</span>
          <span className="text-slate-900">Integritetspolicy</span>
        </nav>

        <div className="mb-10">
          <h1 className="font-display text-4xl font-bold text-slate-900 mb-3">
            Integritetspolicy
          </h1>
          <p className="text-sm text-slate-500">Senast uppdaterad: {lastUpdated}</p>
        </div>

        <article className="prose-bygglov">
          <h2>1. Personuppgiftsansvarig</h2>
          <p>
            <strong>Bygglov24</strong> är personuppgiftsansvarig för behandlingen av dina personuppgifter på <a href="https://bygglov24.se">bygglov24.se</a>. Vid frågor om vår personuppgiftsbehandling, kontakta oss på:
          </p>
          <ul>
            <li>E-post: <a href="mailto:info@bygglov24.se">info@bygglov24.se</a></li>
          </ul>

          <h2>2. Vilka uppgifter vi samlar in</h2>
          <p>
            När du fyller i vårt offertformulär eller på annat sätt kontaktar oss samlar vi in följande uppgifter:
          </p>
          <ul>
            <li><strong>Namn</strong></li>
            <li><strong>E-postadress</strong></li>
            <li><strong>Telefonnummer</strong></li>
            <li><strong>Meddelande</strong> – beskrivning av ditt byggprojekt (frivilligt)</li>
            <li><strong>Kommun och åtgärdstyp</strong> – om du anger detta i samband med formuläret</li>
          </ul>
          <p>
            Utöver detta loggar våra hostingleverantörer (Vercel) tekniska uppgifter som IP-adress, webbläsartyp och tidpunkt för besök i syfte att leverera tjänsten och förhindra missbruk.
          </p>

          <h2>3. Ändamål med behandlingen</h2>
          <p>
            Vi behandlar dina personuppgifter för följande ändamål:
          </p>
          <ul>
            <li><strong>Matchning med bygglovskonsult</strong> – för att koppla dig till en lokal konsult som kan hjälpa dig med ditt byggprojekt</li>
            <li><strong>Kommunikation</strong> – för att svara på dina frågor och återkoppla i ditt ärende</li>
            <li><strong>Förbättring av tjänsten</strong> – aggregerad statistik om hur sajten används</li>
          </ul>

          <h2>4. Rättslig grund</h2>
          <p>
            Behandlingen sker med stöd av:
          </p>
          <ul>
            <li><strong>Samtycke</strong> (artikel 6.1 a GDPR) – när du skickar in offertformuläret samtycker du till att vi behandlar och vidareförmedlar uppgifterna</li>
            <li><strong>Berättigat intresse</strong> (artikel 6.1 f GDPR) – för säker drift av webbplatsen och förhindrande av missbruk</li>
          </ul>

          <h2>5. Vem vi delar uppgifter med</h2>
          <p>
            För att utföra matchningen kan vi dela dina kontaktuppgifter med en eller flera bygglovskonsulter som verkar i din kommun. Konsulten kontaktar dig sedan direkt för att diskutera ditt projekt.
          </p>
          <p>
            Vi använder följande personuppgiftsbiträden för att leverera tjänsten:
          </p>
          <ul>
            <li><strong>Vercel Inc.</strong> – hosting och drift av webbplatsen</li>
            <li><strong>Web3Forms</strong> – mottagning av meddelanden från offertformuläret</li>
          </ul>
          <p>
            Vi säljer aldrig dina personuppgifter till tredje part.
          </p>

          <h2>6. Lagringstid</h2>
          <p>
            Vi sparar dina personuppgifter så länge det är nödvändigt för det ändamål de samlades in för:
          </p>
          <ul>
            <li><strong>Offertförfrågningar</strong> – sparas i upp till 24 månader efter att ärendet avslutats, för att kunna återkomma vid följdfrågor</li>
            <li><strong>E-postkorrespondens</strong> – sparas så länge det är relevant för pågående ärenden, normalt upp till 24 månader</li>
            <li><strong>Tekniska loggar</strong> – sparas i högst 30 dagar</li>
          </ul>
          <p>
            Du kan när som helst begära att vi raderar dina uppgifter tidigare.
          </p>

          <h2>7. Dina rättigheter enligt GDPR</h2>
          <p>
            Du har enligt dataskyddsförordningen följande rättigheter:
          </p>
          <ul>
            <li><strong>Rätt till tillgång</strong> – du kan begära ett utdrag av de uppgifter vi har om dig</li>
            <li><strong>Rätt till rättelse</strong> – om uppgifter är felaktiga kan du begära rättelse</li>
            <li><strong>Rätt till radering ("rätten att bli glömd")</strong> – du kan begära att vi raderar dina uppgifter</li>
            <li><strong>Rätt till begränsning</strong> – du kan begära att vi begränsar behandlingen i vissa situationer</li>
            <li><strong>Rätt till dataportabilitet</strong> – du kan få ut dina uppgifter i ett strukturerat format</li>
            <li><strong>Rätt att invända</strong> – mot behandling som sker med stöd av berättigat intresse</li>
            <li><strong>Rätt att återkalla samtycke</strong> – när behandlingen sker med stöd av samtycke</li>
          </ul>
          <p>
            För att utöva någon av dessa rättigheter, mejla oss på <a href="mailto:info@bygglov24.se">info@bygglov24.se</a>.
          </p>

          <h2>8. Cookies</h2>
          <p>
            Bygglov24 använder endast <strong>nödvändiga cookies</strong> som krävs för att webbplatsen ska fungera, samt cookies för anonym besöksstatistik via Google Analytics.
          </p>
          <p>
            Vi använder inte marknadsföringscookies eller cookies för spårning över andra webbplatser. Du kan i din webbläsare när som helst rensa eller blockera cookies.
          </p>

          <h2>9. Säkerhet</h2>
          <p>
            Vi vidtar lämpliga tekniska och organisatoriska åtgärder för att skydda dina personuppgifter mot obehörig åtkomst, förlust eller förstörelse. All trafik till och från webbplatsen sker via HTTPS-kryptering.
          </p>

          <h2>10. Klagomål till tillsynsmyndighet</h2>
          <p>
            Om du anser att vi behandlat dina personuppgifter felaktigt har du rätt att lämna ett klagomål till tillsynsmyndigheten:
          </p>
          <p>
            <strong>Integritetsskyddsmyndigheten (IMY)</strong><br />
            Box 8114, 104 20 Stockholm<br />
            E-post: <a href="mailto:imy@imy.se">imy@imy.se</a><br />
            Webbplats: <a href="https://www.imy.se" target="_blank" rel="noopener noreferrer">imy.se</a>
          </p>

          <h2>11. Ändringar i policyn</h2>
          <p>
            Vi kan komma att uppdatera den här integritetspolicyn när tjänsten utvecklas eller när lagstiftningen ändras. Den senaste versionen finns alltid tillgänglig på denna sida. Datum för senaste uppdatering anges högst upp.
          </p>
        </article>
      </div>
    </div>
  );
}
