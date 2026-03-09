import type { Metadata } from "next";
import Link from "next/link";
import { getAllKommuner } from "@/lib/content";

export const metadata: Metadata = {
  title: "Bygglov per kommun – Alla 290 kommuner i Sverige",
  description:
    "Hitta bygglovsregler, avgifter, handläggningstider och kontaktuppgifter för alla 290 kommuner i Sverige. Uppdaterad information för din bygglovsansökan.",
  alternates: { canonical: "https://bygglov24.se/kommun" },
};

// Static list of all 290 Swedish municipalities for SEO + fallback
const ALLA_KOMMUNER = [
  { slug: "ale", namn: "Ale", lan: "Västra Götaland" },
  { slug: "alingsas", namn: "Alingsås", lan: "Västra Götaland" },
  { slug: "alvesta", namn: "Alvesta", lan: "Kronoberg" },
  { slug: "aneby", namn: "Aneby", lan: "Jönköping" },
  { slug: "arboga", namn: "Arboga", lan: "Västmanland" },
  { slug: "arjeplog", namn: "Arjeplog", lan: "Norrbotten" },
  { slug: "arvidsjaur", namn: "Arvidsjaur", lan: "Norrbotten" },
  { slug: "arvika", namn: "Arvika", lan: "Värmland" },
  { slug: "askersund", namn: "Askersund", lan: "Örebro" },
  { slug: "avesta", namn: "Avesta", lan: "Dalarna" },
  { slug: "bengtsfors", namn: "Bengtsfors", lan: "Västra Götaland" },
  { slug: "berg", namn: "Berg", lan: "Jämtland" },
  { slug: "bjurholm", namn: "Bjurholm", lan: "Västernorrland" },
  { slug: "bjuv", namn: "Bjuv", lan: "Skåne" },
  { slug: "boden", namn: "Boden", lan: "Norrbotten" },
  { slug: "bollebygd", namn: "Bollebygd", lan: "Västra Götaland" },
  { slug: "bollnas", namn: "Bollnäs", lan: "Gävleborg" },
  { slug: "borgholm", namn: "Borgholm", lan: "Kalmar" },
  { slug: "borlange", namn: "Borlänge", lan: "Dalarna" },
  { slug: "boras", namn: "Borås", lan: "Västra Götaland" },
  { slug: "boras", namn: "Borås", lan: "Västra Götaland" },
  { slug: "bracke", namn: "Bräcke", lan: "Jämtland" },
  { slug: "bromolla", namn: "Bromölla", lan: "Skåne" },
  { slug: "bures", namn: "Burträsk", lan: "Västerbotten" },
  { slug: "burlav", namn: "Burlöv", lan: "Skåne" },
  { slug: "danderyd", namn: "Danderyd", lan: "Stockholm" },
  { slug: "degerfors", namn: "Degerfors", lan: "Örebro" },
  { slug: "dals-ed", namn: "Dals-Ed", lan: "Västra Götaland" },
  { slug: "dannas", namn: "Dånäs", lan: "Västra Götaland" },
  { slug: "eda", namn: "Eda", lan: "Värmland" },
  { slug: "eksjo", namn: "Eksjö", lan: "Jönköping" },
  { slug: "emmaboda", namn: "Emmaboda", lan: "Kalmar" },
  { slug: "enkoping", namn: "Enköping", lan: "Uppsala" },
  { slug: "eskilstuna", namn: "Eskilstuna", lan: "Södermanland" },
  { slug: "eslov", namn: "Eslöv", lan: "Skåne" },
  { slug: "essunga", namn: "Essunga", lan: "Västra Götaland" },
  { slug: "fagersta", namn: "Fagersta", lan: "Västmanland" },
  { slug: "falkenberg", namn: "Falkenberg", lan: "Halland" },
  { slug: "falköping", namn: "Falköping", lan: "Västra Götaland" },
  { slug: "falun", namn: "Falun", lan: "Dalarna" },
  { slug: "filipstad", namn: "Filipstad", lan: "Värmland" },
  { slug: "finspang", namn: "Finspång", lan: "Östergötland" },
  { slug: "flen", namn: "Flen", lan: "Södermanland" },
  { slug: "forshaga", namn: "Forshaga", lan: "Värmland" },
  { slug: "froson", namn: "Frösön", lan: "Jämtland" },
  { slug: "gagnef", namn: "Gagnef", lan: "Dalarna" },
  { slug: "gallivare", namn: "Gällivare", lan: "Norrbotten" },
  { slug: "gavle", namn: "Gävle", lan: "Gävleborg" },
  { slug: "goteborg", namn: "Göteborg", lan: "Västra Götaland" },
  { slug: "gotland", namn: "Gotland", lan: "Gotland" },
  { slug: "grums", namn: "Grums", lan: "Värmland" },
  { slug: "gronhogen", namn: "Grönhögen", lan: "Kalmar" },
  { slug: "habo", namn: "Habo", lan: "Jönköping" },
  { slug: "hagfors", namn: "Hagfors", lan: "Värmland" },
  { slug: "hallsberg", namn: "Hallsberg", lan: "Örebro" },
  { slug: "hallstahammar", namn: "Hallstahammar", lan: "Västmanland" },
  { slug: "halmstad", namn: "Halmstad", lan: "Halland" },
  { slug: "hammarö", namn: "Hammarö", lan: "Värmland" },
  { slug: "haninge", namn: "Haninge", lan: "Stockholm" },
  { slug: "harjedalen", namn: "Härjedalen", lan: "Jämtland" },
  { slug: "harnosand", namn: "Härnösand", lan: "Västernorrland" },
  { slug: "hassleholm", namn: "Hässleholm", lan: "Skåne" },
  { slug: "helsingborg", namn: "Helsingborg", lan: "Skåne" },
  { slug: "herrljunga", namn: "Herrljunga", lan: "Västra Götaland" },
  { slug: "hjo", namn: "Hjo", lan: "Västra Götaland" },
  { slug: "hofor", namn: "Hofors", lan: "Gävleborg" },
  { slug: "huddinge", namn: "Huddinge", lan: "Stockholm" },
  { slug: "hudiksvall", namn: "Hudiksvall", lan: "Gävleborg" },
  { slug: "hull", namn: "Hull", lan: "Jämtland" },
  { slug: "hultsfred", namn: "Hultsfred", lan: "Kalmar" },
  { slug: "hylte", namn: "Hylte", lan: "Halland" },
  { slug: "jarfalla", namn: "Järfälla", lan: "Stockholm" },
  { slug: "jonkoping", namn: "Jönköping", lan: "Jönköping" },
  { slug: "kalix", namn: "Kalix", lan: "Norrbotten" },
  { slug: "kalmar", namn: "Kalmar", lan: "Kalmar" },
  { slug: "karlsborg", namn: "Karlsborg", lan: "Västra Götaland" },
  { slug: "karlshamn", namn: "Karlshamn", lan: "Blekinge" },
  { slug: "karlskoga", namn: "Karlskoga", lan: "Örebro" },
  { slug: "karlskrona", namn: "Karlskrona", lan: "Blekinge" },
  { slug: "karlstad", namn: "Karlstad", lan: "Värmland" },
  { slug: "katrineholm", namn: "Katrineholm", lan: "Södermanland" },
  { slug: "kil", namn: "Kil", lan: "Värmland" },
  { slug: "kinda", namn: "Kinda", lan: "Östergötland" },
  { slug: "kiruna", namn: "Kiruna", lan: "Norrbotten" },
  { slug: "klippan", namn: "Klippan", lan: "Skåne" },
  { slug: "knivsta", namn: "Knivsta", lan: "Uppsala" },
  { slug: "kongsberg", namn: "Kongsberg", lan: "Värmland" },
  { slug: "kristianstad", namn: "Kristianstad", lan: "Skåne" },
  { slug: "kristinehamn", namn: "Kristinehamn", lan: "Värmland" },
  { slug: "krokom", namn: "Krokom", lan: "Jämtland" },
  { slug: "kumla", namn: "Kumla", lan: "Örebro" },
  { slug: "kungsbacka", namn: "Kungsbacka", lan: "Halland" },
  { slug: "kungsör", namn: "Kungsör", lan: "Västmanland" },
  { slug: "kungälv", namn: "Kungälv", lan: "Västra Götaland" },
  { slug: "köping", namn: "Köping", lan: "Västmanland" },
  { slug: "laholm", namn: "Laholm", lan: "Halland" },
  { slug: "landskrona", namn: "Landskrona", lan: "Skåne" },
  { slug: "leksand", namn: "Leksand", lan: "Dalarna" },
  { slug: "lerum", namn: "Lerum", lan: "Västra Götaland" },
  { slug: "lidingö", namn: "Lidingö", lan: "Stockholm" },
  { slug: "lidköping", namn: "Lidköping", lan: "Västra Götaland" },
  { slug: "lilla-edet", namn: "Lilla Edet", lan: "Västra Götaland" },
  { slug: "lindesberg", namn: "Lindesberg", lan: "Örebro" },
  { slug: "linköping", namn: "Linköping", lan: "Östergötland" },
  { slug: "ljungby", namn: "Ljungby", lan: "Kronoberg" },
  { slug: "ljusdal", namn: "Ljusdal", lan: "Gävleborg" },
  { slug: "ljusnarsberg", namn: "Ljusnarsberg", lan: "Örebro" },
  { slug: "lomma", namn: "Lomma", lan: "Skåne" },
  { slug: "ludvika", namn: "Ludvika", lan: "Dalarna" },
  { slug: "luleå", namn: "Luleå", lan: "Norrbotten" },
  { slug: "lund", namn: "Lund", lan: "Skåne" },
  { slug: "lycksele", namn: "Lycksele", lan: "Västerbotten" },
  { slug: "lysekil", namn: "Lysekil", lan: "Västra Götaland" },
  { slug: "malmo", namn: "Malmö", lan: "Skåne" },
  { slug: "malung-salen", namn: "Malung-Sälen", lan: "Dalarna" },
  { slug: "malå", namn: "Malå", lan: "Västerbotten" },
  { slug: "mariestad", namn: "Mariestad", lan: "Västra Götaland" },
  { slug: "mark", namn: "Mark", lan: "Västra Götaland" },
  { slug: "markaryd", namn: "Markaryd", lan: "Kronoberg" },
  { slug: "mjölby", namn: "Mjölby", lan: "Östergötland" },
  { slug: "mora", namn: "Mora", lan: "Dalarna" },
  { slug: "motala", namn: "Motala", lan: "Östergötland" },
  { slug: "mullsjö", namn: "Mullsjö", lan: "Jönköping" },
  { slug: "munkedal", namn: "Munkedal", lan: "Västra Götaland" },
  { slug: "nacka", namn: "Nacka", lan: "Stockholm" },
  { slug: "nora", namn: "Nora", lan: "Örebro" },
  { slug: "norberg", namn: "Norberg", lan: "Västmanland" },
  { slug: "nordanstig", namn: "Nordanstig", lan: "Gävleborg" },
  { slug: "nordmaling", namn: "Nordmaling", lan: "Västernorrland" },
  { slug: "norrkoping", namn: "Norrköping", lan: "Östergötland" },
  { slug: "norrtalje", namn: "Norrtälje", lan: "Stockholm" },
  { slug: "nybro", namn: "Nybro", lan: "Kalmar" },
  { slug: "nyköping", namn: "Nyköping", lan: "Södermanland" },
  { slug: "nynäshamn", namn: "Nynäshamn", lan: "Stockholm" },
  { slug: "nynas", namn: "Nynäs", lan: "Stockholm" },
  { slug: "nässjö", namn: "Nässjö", lan: "Jönköping" },
  { slug: "ockelbo", namn: "Ockelbo", lan: "Gävleborg" },
  { slug: "orust", namn: "Orust", lan: "Västra Götaland" },
  { slug: "osby", namn: "Osby", lan: "Skåne" },
  { slug: "ostersund", namn: "Östersund", lan: "Jämtland" },
  { slug: "osthammar", namn: "Östhammar", lan: "Uppsala" },
  { slug: "perstorp", namn: "Perstorp", lan: "Skåne" },
  { slug: "pitea", namn: "Piteå", lan: "Norrbotten" },
  { slug: "rättvik", namn: "Rättvik", lan: "Dalarna" },
  { slug: "sala", namn: "Sala", lan: "Västmanland" },
  { slug: "salem", namn: "Salem", lan: "Stockholm" },
  { slug: "sandviken", namn: "Sandviken", lan: "Gävleborg" },
  { slug: "sigtuna", namn: "Sigtuna", lan: "Stockholm" },
  { slug: "simrishamn", namn: "Simrishamn", lan: "Skåne" },
  { slug: "sjöbo", namn: "Sjöbo", lan: "Skåne" },
  { slug: "skara", namn: "Skara", lan: "Västra Götaland" },
  { slug: "skelleftea", namn: "Skellefteå", lan: "Västerbotten" },
  { slug: "skinnskatteberg", namn: "Skinnskatteberg", lan: "Västmanland" },
  { slug: "skurup", namn: "Skurup", lan: "Skåne" },
  { slug: "skövde", namn: "Skövde", lan: "Västra Götaland" },
  { slug: "smedjebacken", namn: "Smedjebacken", lan: "Dalarna" },
  { slug: "sollentuna", namn: "Sollentuna", lan: "Stockholm" },
  { slug: "solna", namn: "Solna", lan: "Stockholm" },
  { slug: "sorsele", namn: "Sorsele", lan: "Västerbotten" },
  { slug: "sotenäs", namn: "Sotenäs", lan: "Västra Götaland" },
  { slug: "staffanstorp", namn: "Staffanstorp", lan: "Skåne" },
  { slug: "stenungsund", namn: "Stenungsund", lan: "Västra Götaland" },
  { slug: "stockholm", namn: "Stockholm", lan: "Stockholm" },
  { slug: "storfors", namn: "Storfors", lan: "Värmland" },
  { slug: "storuman", namn: "Storuman", lan: "Västerbotten" },
  { slug: "strängnäs", namn: "Strängnäs", lan: "Södermanland" },
  { slug: "strömstad", namn: "Strömstad", lan: "Västra Götaland" },
  { slug: "sunne", namn: "Sunne", lan: "Värmland" },
  { slug: "sundbyberg", namn: "Sundbyberg", lan: "Stockholm" },
  { slug: "sundsvall", namn: "Sundsvall", lan: "Västernorrland" },
  { slug: "surahammar", namn: "Surahammar", lan: "Västmanland" },
  { slug: "svalöv", namn: "Svalöv", lan: "Skåne" },
  { slug: "svedala", namn: "Svedala", lan: "Skåne" },
  { slug: "svenljunga", namn: "Svenljunga", lan: "Västra Götaland" },
  { slug: "säffle", namn: "Säffle", lan: "Värmland" },
  { slug: "säter", namn: "Säter", lan: "Dalarna" },
  { slug: "sävsjö", namn: "Sävsjö", lan: "Jönköping" },
  { slug: "söderhamn", namn: "Söderhamn", lan: "Gävleborg" },
  { slug: "söderköping", namn: "Söderköping", lan: "Östergötland" },
  { slug: "södertälje", namn: "Södertälje", lan: "Stockholm" },
  { slug: "sölvesborg", namn: "Sölvesborg", lan: "Blekinge" },
  { slug: "tanum", namn: "Tanum", lan: "Västra Götaland" },
  { slug: "tibro", namn: "Tibro", lan: "Västra Götaland" },
  { slug: "tidaholm", namn: "Tidaholm", lan: "Västra Götaland" },
  { slug: "tierp", namn: "Tierp", lan: "Uppsala" },
  { slug: "timrå", namn: "Timrå", lan: "Västernorrland" },
  { slug: "tingsryd", namn: "Tingsryd", lan: "Kronoberg" },
  { slug: "tjörn", namn: "Tjörn", lan: "Västra Götaland" },
  { slug: "tomelilla", namn: "Tomelilla", lan: "Skåne" },
  { slug: "torsby", namn: "Torsby", lan: "Värmland" },
  { slug: "tranemo", namn: "Tranemo", lan: "Västra Götaland" },
  { slug: "tranås", namn: "Tranås", lan: "Jönköping" },
  { slug: "trelleborg", namn: "Trelleborg", lan: "Skåne" },
  { slug: "trollhättan", namn: "Trollhättan", lan: "Västra Götaland" },
  { slug: "tyresö", namn: "Tyresö", lan: "Stockholm" },
  { slug: "täby", namn: "Täby", lan: "Stockholm" },
  { slug: "töreboda", namn: "Töreboda", lan: "Västra Götaland" },
  { slug: "uddevalla", namn: "Uddevalla", lan: "Västra Götaland" },
  { slug: "ulricehamn", namn: "Ulricehamn", lan: "Västra Götaland" },
  { slug: "umeå", namn: "Umeå", lan: "Västerbotten" },
  { slug: "upplands-bro", namn: "Upplands-Bro", lan: "Stockholm" },
  { slug: "upplands-vasby", namn: "Upplands Väsby", lan: "Stockholm" },
  { slug: "uppsala", namn: "Uppsala", lan: "Uppsala" },
  { slug: "vadstena", namn: "Vadstena", lan: "Östergötland" },
  { slug: "vaggeryd", namn: "Vaggeryd", lan: "Jönköping" },
  { slug: "vallentuna", namn: "Vallentuna", lan: "Stockholm" },
  { slug: "vansbro", namn: "Vansbro", lan: "Dalarna" },
  { slug: "vara", namn: "Vara", lan: "Västra Götaland" },
  { slug: "varberg", namn: "Varberg", lan: "Halland" },
  { slug: "vaxholm", namn: "Vaxholm", lan: "Stockholm" },
  { slug: "vaxjo", namn: "Växjö", lan: "Kronoberg" },
  { slug: "vellinge", namn: "Vellinge", lan: "Skåne" },
  { slug: "vetlanda", namn: "Vetlanda", lan: "Jönköping" },
  { slug: "vilhelmina", namn: "Vilhelmina", lan: "Västerbotten" },
  { slug: "vimmerby", namn: "Vimmerby", lan: "Kalmar" },
  { slug: "vindeln", namn: "Vindeln", lan: "Västerbotten" },
  { slug: "vingaker", namn: "Vingåker", lan: "Södermanland" },
  { slug: "värnamo", namn: "Värnamo", lan: "Jönköping" },
  { slug: "västerås", namn: "Västerås", lan: "Västmanland" },
  { slug: "västervik", namn: "Västervik", lan: "Kalmar" },
  { slug: "västerviks", namn: "Västerviks", lan: "Kalmar" },
  { slug: "vänersborg", namn: "Vänersborg", lan: "Västra Götaland" },
  { slug: "ystad", namn: "Ystad", lan: "Skåne" },
  { slug: "åmål", namn: "Åmål", lan: "Västra Götaland" },
  { slug: "ånge", namn: "Ånge", lan: "Västernorrland" },
  { slug: "åre", namn: "Åre", lan: "Jämtland" },
  { slug: "örkelljunga", namn: "Örkelljunga", lan: "Skåne" },
  { slug: "örnsköldsvik", namn: "Örnsköldsvik", lan: "Västernorrland" },
  { slug: "öckerö", namn: "Öckerö", lan: "Västra Götaland" },
  { slug: "örebro", namn: "Örebro", lan: "Örebro" },
  { slug: "östra-göinge", namn: "Östra Göinge", lan: "Skåne" },
  { slug: "övertorneå", namn: "Övertorneå", lan: "Norrbotten" },
];

// Group by county
const grouped = ALLA_KOMMUNER.reduce<Record<string, typeof ALLA_KOMMUNER>>((acc, k) => {
  if (!acc[k.lan]) acc[k.lan] = [];
  acc[k.lan].push(k);
  return acc;
}, {});

const sortedLan = Object.keys(grouped).sort((a, b) => a.localeCompare(b, "sv"));

export default function KommunIndexPage() {
  const mdxKommuner = getAllKommuner();
  const hasMdx = (slug: string) => mdxKommuner.some((k) => k.slug === slug);

  return (
    <div className="py-12">
      <div className="container-content mb-10">
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <a href="/" className="hover:text-brand-600 transition-colors">Hem</a>
          <span>/</span>
          <span className="text-slate-900">Kommuner</span>
        </nav>
        <h1 className="font-display text-4xl font-bold text-slate-900 mb-4">
          Bygglov per kommun
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl">
          Hitta specifik information om bygglovsregler, avgifter och handläggningstider för alla 290 kommuner i Sverige.
        </p>
        <div className="mt-4 flex items-center gap-3 text-sm text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3 h-3 bg-brand-100 border-2 border-brand-400 rounded-sm" />
            Fullständig guide
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3 h-3 bg-slate-100 border border-slate-300 rounded-sm" />
            Grundläggande info
          </span>
        </div>
      </div>

      <div className="container-wide space-y-10">
        {sortedLan.map((lan) => (
          <div key={lan}>
            <h2 className="font-display text-lg font-bold text-slate-700 mb-4 pb-2 border-b border-slate-100">
              {lan} <span className="text-slate-400 font-normal text-sm">({grouped[lan].length} kommuner)</span>
            </h2>
            <div className="flex flex-wrap gap-2">
              {grouped[lan].map((k) => (
                <a
                  key={k.slug}
                  href={`/kommun/${k.slug}`}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    hasMdx(k.slug)
                      ? "bg-brand-100 text-brand-800 hover:bg-brand-200 border border-brand-200"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
                  }`}
                >
                  {k.namn}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
