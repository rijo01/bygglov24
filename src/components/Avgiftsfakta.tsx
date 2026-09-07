/**
 * Avgiftsfakta – standardblock som ersätter de avgiftstabeller med påhittade
 * kronbelopp som tidigare fanns i kostnads-, altan-, rivnings-, plank-,
 * solpanels- och pooltexterna.
 *
 * Varför en komponent i stället för text i varje MDX-fil: uppgifterna är
 * YMYL och alla hänvisningar nedan är verifierade mot lagtexten (SFS
 * 2010:900 i lydelse efter Lag 2025:974). Ligger de på ett ställe kan de
 * rättas på ett ställe när lagen ändras igen – i stället för att sju filer
 * glider isär.
 *
 * INGA BELOPP HÄR. Bygglovsavgiften sätts av varje kommuns egen taxa och kan
 * inte anges som en nationell siffra. Lägg aldrig till ett kronbelopp i den
 * här komponenten utan en webbverifierad källa.
 */

const BOVERKET_AVGIFTER =
  "https://www.boverket.se/sv/PBL-kunskapsbanken/lov--byggande/handlaggning/avgifter/";
const BOVERKET_REDUKTION =
  "https://www.boverket.se/sv/PBL-kunskapsbanken/lov--byggande/handlaggning/avgifter/avgiftsreduktion/";

interface Props {
  /** Åtgärd i bestämd form, t.ex. "rivningslovet" – används i ingressen. */
  atgard?: string;
}

export default function Avgiftsfakta({ atgard = "bygglovet" }: Props) {
  return (
    <div className="card p-6 my-8 bg-brand-50 border-brand-100 not-prose">
      <h3 className="font-display font-semibold text-slate-900 mb-3 text-lg">
        Vad {atgard} kostar – och varför vi inte anger något belopp
      </h3>

      <p className="text-sm text-slate-700 leading-relaxed mb-4">
        Det finns ingen nationell taxa. Varje kommun beslutar sin egen
        bygglovstaxa i kommunfullmäktige, och avgiften får inte överstiga
        kommunens genomsnittliga kostnad för den typ av handläggning som
        avgiften avser – självkostnadsprincipen i{" "}
        <strong>12 kap. 10 § plan- och bygglagen</strong>. Därför kan samma
        åtgärd kosta mycket olika i två grannkommuner, och därför publicerar vi
        inga riktvärden i kronor. <strong>Fråga din kommun</strong> efter
        gällande taxa – den ska vara offentlig.
      </p>

      <ul className="text-sm text-slate-700 space-y-2 mb-4 list-disc pl-5 marker:text-brand-500">
        <li>
          Byggnadsnämnden får ta ut avgift för bland annat lov, förhandsbesked,
          startbesked, slutbesked, tekniska samråd, arbetsplatsbesök och
          nybyggnadskartor (12 kap. 8 § PBL).
        </li>
        <li>
          Ligger fastigheten inom detaljplan kan kommunen dessutom ta ut en{" "}
          <strong>planavgift</strong>, om fastigheten har nytta av planen
          (12 kap. 9 § PBL).
        </li>
        <li>
          Avgiften betalas av sökanden och får tas ut i förskott
          (12 kap. 11 § PBL).
        </li>
        <li>
          <strong>Dröjer handläggningen minskar avgiften.</strong> Den ska
          reduceras med en femtedel för varje påbörjad vecka som
          tioveckorsfristen i 9 kap. 99 § PBL överskrids (12 kap. 8 a § PBL).
          Reduktion sker dock inte om fristen överskrids på grund av ett beslut
          enligt 9 kap. 102 § PBL.
        </li>
      </ul>

      <p className="text-sm text-slate-700 leading-relaxed">
        Läs mer hos Boverket:{" "}
        <a
          href={BOVERKET_AVGIFTER}
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-700 underline hover:text-brand-900"
        >
          Avgifter för lov, förhandsbesked och anmälan
        </a>{" "}
        och{" "}
        <a
          href={BOVERKET_REDUKTION}
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-700 underline hover:text-brand-900"
        >
          Reduktion av avgift
        </a>
        .
      </p>
    </div>
  );
}
