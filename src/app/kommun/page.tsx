import type { Metadata } from "next";
import { getAllKommuner } from "@/lib/content";

const TOTALA_KOMMUNER = 290;
const PUBLICERADE = getAllKommuner().length;

export const metadata: Metadata = {
  title: "Bygglov per kommun – Bygglovsregler för Sveriges kommuner",
  description:
    "Hitta bygglovsregler, avgifter, handläggningstider och kontaktuppgifter för din kommun. Vi täcker " +
    `${PUBLICERADE} av ${TOTALA_KOMMUNER} kommuner i Sverige – uppdaterad information för din bygglovsansökan.`,
  alternates: { canonical: "https://bygglov24.se/kommun" },
};

// Komplett katalog över Sveriges 290 kommuner (SCB) med ASCII-slugs + län.
// Vilka som har en publicerad guide avgörs av MDX-filerna i content/kommuner
// (se hasMdx nedan). Habo (Jönköping) har nyckeln "habo-jonkoping" eftersom
// "habo" redan används av Håbo (Uppsala) – båda blir "habo" vid ASCII-normalisering.
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
  { slug: "bjurholm", namn: "Bjurholm", lan: "Västerbotten" },
  { slug: "bjuv", namn: "Bjuv", lan: "Skåne" },
  { slug: "boden", namn: "Boden", lan: "Norrbotten" },
  { slug: "bollebygd", namn: "Bollebygd", lan: "Västra Götaland" },
  { slug: "bollnas", namn: "Bollnäs", lan: "Gävleborg" },
  { slug: "borgholm", namn: "Borgholm", lan: "Kalmar" },
  { slug: "borlange", namn: "Borlänge", lan: "Dalarna" },
  { slug: "boras", namn: "Borås", lan: "Västra Götaland" },
  { slug: "botkyrka", namn: "Botkyrka", lan: "Stockholm" },
  { slug: "boxholm", namn: "Boxholm", lan: "Östergötland" },
  { slug: "bromolla", namn: "Bromölla", lan: "Skåne" },
  { slug: "bracke", namn: "Bräcke", lan: "Jämtland" },
  { slug: "burlov", namn: "Burlöv", lan: "Skåne" },
  { slug: "bastad", namn: "Båstad", lan: "Skåne" },
  { slug: "dals-ed", namn: "Dals-Ed", lan: "Västra Götaland" },
  { slug: "danderyd", namn: "Danderyd", lan: "Stockholm" },
  { slug: "degerfors", namn: "Degerfors", lan: "Örebro" },
  { slug: "dorotea", namn: "Dorotea", lan: "Västerbotten" },
  { slug: "eda", namn: "Eda", lan: "Värmland" },
  { slug: "ekero", namn: "Ekerö", lan: "Stockholm" },
  { slug: "eksjo", namn: "Eksjö", lan: "Jönköping" },
  { slug: "emmaboda", namn: "Emmaboda", lan: "Kalmar" },
  { slug: "enkoping", namn: "Enköping", lan: "Uppsala" },
  { slug: "eskilstuna", namn: "Eskilstuna", lan: "Södermanland" },
  { slug: "eslov", namn: "Eslöv", lan: "Skåne" },
  { slug: "essunga", namn: "Essunga", lan: "Västra Götaland" },
  { slug: "fagersta", namn: "Fagersta", lan: "Västmanland" },
  { slug: "falkenberg", namn: "Falkenberg", lan: "Halland" },
  { slug: "falkoping", namn: "Falköping", lan: "Västra Götaland" },
  { slug: "falun", namn: "Falun", lan: "Dalarna" },
  { slug: "filipstad", namn: "Filipstad", lan: "Värmland" },
  { slug: "finspang", namn: "Finspång", lan: "Östergötland" },
  { slug: "flen", namn: "Flen", lan: "Södermanland" },
  { slug: "forshaga", namn: "Forshaga", lan: "Värmland" },
  { slug: "fargelanda", namn: "Färgelanda", lan: "Västra Götaland" },
  { slug: "gagnef", namn: "Gagnef", lan: "Dalarna" },
  { slug: "gislaved", namn: "Gislaved", lan: "Jönköping" },
  { slug: "gnesta", namn: "Gnesta", lan: "Södermanland" },
  { slug: "gnosjo", namn: "Gnosjö", lan: "Jönköping" },
  { slug: "gotland", namn: "Gotland", lan: "Gotland" },
  { slug: "grums", namn: "Grums", lan: "Värmland" },
  { slug: "grastorp", namn: "Grästorp", lan: "Västra Götaland" },
  { slug: "gullspang", namn: "Gullspång", lan: "Västra Götaland" },
  { slug: "gallivare", namn: "Gällivare", lan: "Norrbotten" },
  { slug: "gavle", namn: "Gävle", lan: "Gävleborg" },
  { slug: "goteborg", namn: "Göteborg", lan: "Västra Götaland" },
  { slug: "gotene", namn: "Götene", lan: "Västra Götaland" },
  { slug: "habo-jonkoping", namn: "Habo", lan: "Jönköping" },
  { slug: "hagfors", namn: "Hagfors", lan: "Värmland" },
  { slug: "hallsberg", namn: "Hallsberg", lan: "Örebro" },
  { slug: "hallstahammar", namn: "Hallstahammar", lan: "Västmanland" },
  { slug: "halmstad", namn: "Halmstad", lan: "Halland" },
  { slug: "hammaro", namn: "Hammarö", lan: "Värmland" },
  { slug: "haninge", namn: "Haninge", lan: "Stockholm" },
  { slug: "haparanda", namn: "Haparanda", lan: "Norrbotten" },
  { slug: "heby", namn: "Heby", lan: "Uppsala" },
  { slug: "hedemora", namn: "Hedemora", lan: "Dalarna" },
  { slug: "helsingborg", namn: "Helsingborg", lan: "Skåne" },
  { slug: "herrljunga", namn: "Herrljunga", lan: "Västra Götaland" },
  { slug: "hjo", namn: "Hjo", lan: "Västra Götaland" },
  { slug: "hofors", namn: "Hofors", lan: "Gävleborg" },
  { slug: "huddinge", namn: "Huddinge", lan: "Stockholm" },
  { slug: "hudiksvall", namn: "Hudiksvall", lan: "Gävleborg" },
  { slug: "hultsfred", namn: "Hultsfred", lan: "Kalmar" },
  { slug: "hylte", namn: "Hylte", lan: "Halland" },
  { slug: "habo", namn: "Håbo", lan: "Uppsala" },
  { slug: "hallefors", namn: "Hällefors", lan: "Örebro" },
  { slug: "harjedalen", namn: "Härjedalen", lan: "Jämtland" },
  { slug: "harnosand", namn: "Härnösand", lan: "Västernorrland" },
  { slug: "harryda", namn: "Härryda", lan: "Västra Götaland" },
  { slug: "hassleholm", namn: "Hässleholm", lan: "Skåne" },
  { slug: "hoganas", namn: "Höganäs", lan: "Skåne" },
  { slug: "hogsby", namn: "Högsby", lan: "Kalmar" },
  { slug: "horby", namn: "Hörby", lan: "Skåne" },
  { slug: "hoor", namn: "Höör", lan: "Skåne" },
  { slug: "jokkmokk", namn: "Jokkmokk", lan: "Norrbotten" },
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
  { slug: "kramfors", namn: "Kramfors", lan: "Västernorrland" },
  { slug: "kristianstad", namn: "Kristianstad", lan: "Skåne" },
  { slug: "kristinehamn", namn: "Kristinehamn", lan: "Värmland" },
  { slug: "krokom", namn: "Krokom", lan: "Jämtland" },
  { slug: "kumla", namn: "Kumla", lan: "Örebro" },
  { slug: "kungsbacka", namn: "Kungsbacka", lan: "Halland" },
  { slug: "kungsor", namn: "Kungsör", lan: "Västmanland" },
  { slug: "kungalv", namn: "Kungälv", lan: "Västra Götaland" },
  { slug: "kavlinge", namn: "Kävlinge", lan: "Skåne" },
  { slug: "koping", namn: "Köping", lan: "Västmanland" },
  { slug: "laholm", namn: "Laholm", lan: "Halland" },
  { slug: "landskrona", namn: "Landskrona", lan: "Skåne" },
  { slug: "laxa", namn: "Laxå", lan: "Örebro" },
  { slug: "lekeberg", namn: "Lekeberg", lan: "Örebro" },
  { slug: "leksand", namn: "Leksand", lan: "Dalarna" },
  { slug: "lerum", namn: "Lerum", lan: "Västra Götaland" },
  { slug: "lessebo", namn: "Lessebo", lan: "Kronoberg" },
  { slug: "lidingo", namn: "Lidingö", lan: "Stockholm" },
  { slug: "lidkoping", namn: "Lidköping", lan: "Västra Götaland" },
  { slug: "lilla-edet", namn: "Lilla Edet", lan: "Västra Götaland" },
  { slug: "lindesberg", namn: "Lindesberg", lan: "Örebro" },
  { slug: "linkoping", namn: "Linköping", lan: "Östergötland" },
  { slug: "ljungby", namn: "Ljungby", lan: "Kronoberg" },
  { slug: "ljusdal", namn: "Ljusdal", lan: "Gävleborg" },
  { slug: "ljusnarsberg", namn: "Ljusnarsberg", lan: "Örebro" },
  { slug: "lomma", namn: "Lomma", lan: "Skåne" },
  { slug: "ludvika", namn: "Ludvika", lan: "Dalarna" },
  { slug: "lulea", namn: "Luleå", lan: "Norrbotten" },
  { slug: "lund", namn: "Lund", lan: "Skåne" },
  { slug: "lycksele", namn: "Lycksele", lan: "Västerbotten" },
  { slug: "lysekil", namn: "Lysekil", lan: "Västra Götaland" },
  { slug: "malmo", namn: "Malmö", lan: "Skåne" },
  { slug: "malung-salen", namn: "Malung–Sälen", lan: "Dalarna" },
  { slug: "mala", namn: "Malå", lan: "Västerbotten" },
  { slug: "mariestad", namn: "Mariestad", lan: "Västra Götaland" },
  { slug: "mark", namn: "Mark", lan: "Västra Götaland" },
  { slug: "markaryd", namn: "Markaryd", lan: "Kronoberg" },
  { slug: "mellerud", namn: "Mellerud", lan: "Västra Götaland" },
  { slug: "mjolby", namn: "Mjölby", lan: "Östergötland" },
  { slug: "mora", namn: "Mora", lan: "Dalarna" },
  { slug: "motala", namn: "Motala", lan: "Östergötland" },
  { slug: "mullsjo", namn: "Mullsjö", lan: "Jönköping" },
  { slug: "munkedal", namn: "Munkedal", lan: "Västra Götaland" },
  { slug: "munkfors", namn: "Munkfors", lan: "Värmland" },
  { slug: "molndal", namn: "Mölndal", lan: "Västra Götaland" },
  { slug: "monsteras", namn: "Mönsterås", lan: "Kalmar" },
  { slug: "morbylanga", namn: "Mörbylånga", lan: "Kalmar" },
  { slug: "nacka", namn: "Nacka", lan: "Stockholm" },
  { slug: "nora", namn: "Nora", lan: "Örebro" },
  { slug: "norberg", namn: "Norberg", lan: "Västmanland" },
  { slug: "nordanstig", namn: "Nordanstig", lan: "Gävleborg" },
  { slug: "nordmaling", namn: "Nordmaling", lan: "Västerbotten" },
  { slug: "norrkoping", namn: "Norrköping", lan: "Östergötland" },
  { slug: "norrtalje", namn: "Norrtälje", lan: "Stockholm" },
  { slug: "norsjo", namn: "Norsjö", lan: "Västerbotten" },
  { slug: "nybro", namn: "Nybro", lan: "Kalmar" },
  { slug: "nykvarn", namn: "Nykvarn", lan: "Stockholm" },
  { slug: "nykoping", namn: "Nyköping", lan: "Södermanland" },
  { slug: "nynashamn", namn: "Nynäshamn", lan: "Stockholm" },
  { slug: "nassjo", namn: "Nässjö", lan: "Jönköping" },
  { slug: "ockelbo", namn: "Ockelbo", lan: "Gävleborg" },
  { slug: "olofstrom", namn: "Olofström", lan: "Blekinge" },
  { slug: "orsa", namn: "Orsa", lan: "Dalarna" },
  { slug: "orust", namn: "Orust", lan: "Västra Götaland" },
  { slug: "osby", namn: "Osby", lan: "Skåne" },
  { slug: "oskarshamn", namn: "Oskarshamn", lan: "Kalmar" },
  { slug: "ovanaker", namn: "Ovanåker", lan: "Gävleborg" },
  { slug: "oxelosund", namn: "Oxelösund", lan: "Södermanland" },
  { slug: "pajala", namn: "Pajala", lan: "Norrbotten" },
  { slug: "partille", namn: "Partille", lan: "Västra Götaland" },
  { slug: "perstorp", namn: "Perstorp", lan: "Skåne" },
  { slug: "pitea", namn: "Piteå", lan: "Norrbotten" },
  { slug: "ragunda", namn: "Ragunda", lan: "Jämtland" },
  { slug: "robertsfors", namn: "Robertsfors", lan: "Västerbotten" },
  { slug: "ronneby", namn: "Ronneby", lan: "Blekinge" },
  { slug: "rattvik", namn: "Rättvik", lan: "Dalarna" },
  { slug: "sala", namn: "Sala", lan: "Västmanland" },
  { slug: "salem", namn: "Salem", lan: "Stockholm" },
  { slug: "sandviken", namn: "Sandviken", lan: "Gävleborg" },
  { slug: "sigtuna", namn: "Sigtuna", lan: "Stockholm" },
  { slug: "simrishamn", namn: "Simrishamn", lan: "Skåne" },
  { slug: "sjobo", namn: "Sjöbo", lan: "Skåne" },
  { slug: "skara", namn: "Skara", lan: "Västra Götaland" },
  { slug: "skelleftea", namn: "Skellefteå", lan: "Västerbotten" },
  { slug: "skinnskatteberg", namn: "Skinnskatteberg", lan: "Västmanland" },
  { slug: "skurup", namn: "Skurup", lan: "Skåne" },
  { slug: "skovde", namn: "Skövde", lan: "Västra Götaland" },
  { slug: "smedjebacken", namn: "Smedjebacken", lan: "Dalarna" },
  { slug: "solleftea", namn: "Sollefteå", lan: "Västernorrland" },
  { slug: "sollentuna", namn: "Sollentuna", lan: "Stockholm" },
  { slug: "solna", namn: "Solna", lan: "Stockholm" },
  { slug: "sorsele", namn: "Sorsele", lan: "Västerbotten" },
  { slug: "sotenas", namn: "Sotenäs", lan: "Västra Götaland" },
  { slug: "staffanstorp", namn: "Staffanstorp", lan: "Skåne" },
  { slug: "stenungsund", namn: "Stenungsund", lan: "Västra Götaland" },
  { slug: "stockholm", namn: "Stockholm", lan: "Stockholm" },
  { slug: "storfors", namn: "Storfors", lan: "Värmland" },
  { slug: "storuman", namn: "Storuman", lan: "Västerbotten" },
  { slug: "strangnas", namn: "Strängnäs", lan: "Södermanland" },
  { slug: "stromstad", namn: "Strömstad", lan: "Västra Götaland" },
  { slug: "stromsund", namn: "Strömsund", lan: "Jämtland" },
  { slug: "sundbyberg", namn: "Sundbyberg", lan: "Stockholm" },
  { slug: "sundsvall", namn: "Sundsvall", lan: "Västernorrland" },
  { slug: "sunne", namn: "Sunne", lan: "Värmland" },
  { slug: "surahammar", namn: "Surahammar", lan: "Västmanland" },
  { slug: "svalov", namn: "Svalöv", lan: "Skåne" },
  { slug: "svedala", namn: "Svedala", lan: "Skåne" },
  { slug: "svenljunga", namn: "Svenljunga", lan: "Västra Götaland" },
  { slug: "saffle", namn: "Säffle", lan: "Värmland" },
  { slug: "sater", namn: "Säter", lan: "Dalarna" },
  { slug: "savsjo", namn: "Sävsjö", lan: "Jönköping" },
  { slug: "soderhamn", namn: "Söderhamn", lan: "Gävleborg" },
  { slug: "soderkoping", namn: "Söderköping", lan: "Östergötland" },
  { slug: "sodertalje", namn: "Södertälje", lan: "Stockholm" },
  { slug: "solvesborg", namn: "Sölvesborg", lan: "Blekinge" },
  { slug: "tanum", namn: "Tanum", lan: "Västra Götaland" },
  { slug: "tibro", namn: "Tibro", lan: "Västra Götaland" },
  { slug: "tidaholm", namn: "Tidaholm", lan: "Västra Götaland" },
  { slug: "tierp", namn: "Tierp", lan: "Uppsala" },
  { slug: "timra", namn: "Timrå", lan: "Västernorrland" },
  { slug: "tingsryd", namn: "Tingsryd", lan: "Kronoberg" },
  { slug: "tjorn", namn: "Tjörn", lan: "Västra Götaland" },
  { slug: "tomelilla", namn: "Tomelilla", lan: "Skåne" },
  { slug: "torsby", namn: "Torsby", lan: "Värmland" },
  { slug: "torsas", namn: "Torsås", lan: "Kalmar" },
  { slug: "tranemo", namn: "Tranemo", lan: "Västra Götaland" },
  { slug: "tranas", namn: "Tranås", lan: "Jönköping" },
  { slug: "trelleborg", namn: "Trelleborg", lan: "Skåne" },
  { slug: "trollhattan", namn: "Trollhättan", lan: "Västra Götaland" },
  { slug: "trosa", namn: "Trosa", lan: "Södermanland" },
  { slug: "tyreso", namn: "Tyresö", lan: "Stockholm" },
  { slug: "taby", namn: "Täby", lan: "Stockholm" },
  { slug: "toreboda", namn: "Töreboda", lan: "Västra Götaland" },
  { slug: "uddevalla", namn: "Uddevalla", lan: "Västra Götaland" },
  { slug: "ulricehamn", namn: "Ulricehamn", lan: "Västra Götaland" },
  { slug: "umea", namn: "Umeå", lan: "Västerbotten" },
  { slug: "upplands-vasby", namn: "Upplands Väsby", lan: "Stockholm" },
  { slug: "upplands-bro", namn: "Upplands-Bro", lan: "Stockholm" },
  { slug: "uppsala", namn: "Uppsala", lan: "Uppsala" },
  { slug: "uppvidinge", namn: "Uppvidinge", lan: "Kronoberg" },
  { slug: "vadstena", namn: "Vadstena", lan: "Östergötland" },
  { slug: "vaggeryd", namn: "Vaggeryd", lan: "Jönköping" },
  { slug: "valdemarsvik", namn: "Valdemarsvik", lan: "Östergötland" },
  { slug: "vallentuna", namn: "Vallentuna", lan: "Stockholm" },
  { slug: "vansbro", namn: "Vansbro", lan: "Dalarna" },
  { slug: "vara", namn: "Vara", lan: "Västra Götaland" },
  { slug: "varberg", namn: "Varberg", lan: "Halland" },
  { slug: "vaxholm", namn: "Vaxholm", lan: "Stockholm" },
  { slug: "vellinge", namn: "Vellinge", lan: "Skåne" },
  { slug: "vetlanda", namn: "Vetlanda", lan: "Jönköping" },
  { slug: "vilhelmina", namn: "Vilhelmina", lan: "Västerbotten" },
  { slug: "vimmerby", namn: "Vimmerby", lan: "Kalmar" },
  { slug: "vindeln", namn: "Vindeln", lan: "Västerbotten" },
  { slug: "vingaker", namn: "Vingåker", lan: "Södermanland" },
  { slug: "vargarda", namn: "Vårgårda", lan: "Västra Götaland" },
  { slug: "vanersborg", namn: "Vänersborg", lan: "Västra Götaland" },
  { slug: "vannas", namn: "Vännäs", lan: "Västerbotten" },
  { slug: "varmdo", namn: "Värmdö", lan: "Stockholm" },
  { slug: "varnamo", namn: "Värnamo", lan: "Jönköping" },
  { slug: "vastervik", namn: "Västervik", lan: "Kalmar" },
  { slug: "vasteras", namn: "Västerås", lan: "Västmanland" },
  { slug: "vaxjo", namn: "Växjö", lan: "Kronoberg" },
  { slug: "ydre", namn: "Ydre", lan: "Östergötland" },
  { slug: "ystad", namn: "Ystad", lan: "Skåne" },
  { slug: "amal", namn: "Åmål", lan: "Västra Götaland" },
  { slug: "ange", namn: "Ånge", lan: "Västernorrland" },
  { slug: "are", namn: "Åre", lan: "Jämtland" },
  { slug: "arjang", namn: "Årjäng", lan: "Värmland" },
  { slug: "asele", namn: "Åsele", lan: "Västerbotten" },
  { slug: "astorp", namn: "Åstorp", lan: "Skåne" },
  { slug: "atvidaberg", namn: "Åtvidaberg", lan: "Östergötland" },
  { slug: "almhult", namn: "Älmhult", lan: "Kronoberg" },
  { slug: "alvdalen", namn: "Älvdalen", lan: "Dalarna" },
  { slug: "alvkarleby", namn: "Älvkarleby", lan: "Uppsala" },
  { slug: "alvsbyn", namn: "Älvsbyn", lan: "Norrbotten" },
  { slug: "angelholm", namn: "Ängelholm", lan: "Skåne" },
  { slug: "ockero", namn: "Öckerö", lan: "Västra Götaland" },
  { slug: "odeshog", namn: "Ödeshög", lan: "Östergötland" },
  { slug: "orebro", namn: "Örebro", lan: "Örebro" },
  { slug: "orkelljunga", namn: "Örkelljunga", lan: "Skåne" },
  { slug: "ornskoldsvik", namn: "Örnsköldsvik", lan: "Västernorrland" },
  { slug: "ostersund", namn: "Östersund", lan: "Jämtland" },
  { slug: "osteraker", namn: "Österåker", lan: "Stockholm" },
  { slug: "osthammar", namn: "Östhammar", lan: "Uppsala" },
  { slug: "ostra-goinge", namn: "Östra Göinge", lan: "Skåne" },
  { slug: "overkalix", namn: "Överkalix", lan: "Norrbotten" },
  { slug: "overtornea", namn: "Övertorneå", lan: "Norrbotten" },
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
          Hitta specifik information om bygglovsregler, avgifter och handläggningstider för din kommun. Vi täcker {PUBLICERADE} av {TOTALA_KOMMUNER} kommuner i Sverige.
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
              {grouped[lan].map((k) =>
                hasMdx(k.slug) ? (
                  <a
                    key={k.slug}
                    href={`/kommun/${k.slug}`}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors bg-brand-100 text-brand-800 hover:bg-brand-200 border border-brand-200"
                  >
                    {k.namn}
                  </a>
                ) : (
                  <span
                    key={k.slug}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium bg-slate-50 text-slate-400 border border-slate-100 cursor-default"
                    title="Kommer snart"
                  >
                    {k.namn}
                  </span>
                )
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
