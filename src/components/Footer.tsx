import Link from "next/link";
import { getAllKommuner } from "@/lib/content";

const TOTALA_KOMMUNER = 290;

const atgarder = [
  { href: "/atgard/attefallsatgard", label: "Attefallsåtgärder" },
  { href: "/atgard/tillbyggnad", label: "Tillbyggnad" },
  { href: "/atgard/carport-garage", label: "Carport & Garage" },
  { href: "/atgard/altan-uteplats", label: "Altan & Uteplats" },
  { href: "/atgard/friggebod", label: "Friggebod" },
  { href: "/atgard/plank-mur", label: "Plank & Mur" },
];

const guider = [
  { href: "/guide/nya-regler-2026", label: "Nya regler 2026 (PBL-reformen)" },
  { href: "/guide/bygglov-i-efterhand", label: "Bygglov i efterhand" },
  { href: "/kalkylator", label: "Bygglovskalkylator" },
  { href: "/guide/ansokan", label: "Ansöka om bygglov" },
  { href: "/guide/kostnad", label: "Vad kostar bygglov?" },
  { href: "/guide/overklaga-bygglov", label: "Överklaga avslag" },
];

const storstader = [
  { href: "/kommun/stockholm", label: "Stockholm" },
  { href: "/kommun/goteborg", label: "Göteborg" },
  { href: "/kommun/malmo", label: "Malmö" },
  { href: "/kommun/uppsala", label: "Uppsala" },
  { href: "/kommun/vaxjo", label: "Växjö" },
];

export default function Footer() {
  const kommunCount = getAllKommuner().length;
  return (
    <footer className="bg-brand-950 text-white mt-20">
      <div className="container-wide py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M9 1L16 6V17H11V12H7V17H2V6L9 1Z" fill="white" strokeWidth="0.5"/>
                </svg>
              </div>
              <span className="font-display font-semibold text-xl">
                Bygglov<span className="text-brand-400">24</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              En oberoende guide till bygglov i Sverige. Information för {kommunCount} av {TOTALA_KOMMUNER} kommuner.
            </p>
            <div className="mt-5 flex items-center gap-2 text-xs text-slate-500">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5"/><path d="M7 4v3l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              Uppdaterat {new Date().getFullYear()}
            </div>
          </div>

          {/* Åtgärder */}
          <div>
            <h4 className="font-display font-semibold text-sm uppercase tracking-wider text-slate-400 mb-4">Åtgärdstyper</h4>
            <ul className="space-y-2.5">
              {atgarder.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-slate-300 hover:text-white text-sm transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Guider */}
          <div>
            <h4 className="font-display font-semibold text-sm uppercase tracking-wider text-slate-400 mb-4">Guider</h4>
            <ul className="space-y-2.5">
              {guider.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-slate-300 hover:text-white text-sm transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kommuner */}
          <div>
            <h4 className="font-display font-semibold text-sm uppercase tracking-wider text-slate-400 mb-4">Populära kommuner</h4>
            <ul className="space-y-2.5">
              {storstader.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-slate-300 hover:text-white text-sm transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/kommun" className="text-brand-400 hover:text-brand-300 text-sm font-medium transition-colors">
                  Alla kommuner →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Bygglov24.se – Informationen är vägledande och ersätter inte juridisk rådgivning.</p>
          <div className="flex gap-5">
            <Link href="/integritetspolicy" className="hover:text-slate-300 transition-colors">Integritetspolicy</Link>
            <Link href="/om-oss" className="hover:text-slate-300 transition-colors">Om oss</Link>
            <a href="mailto:info@bygglov24.se" className="hover:text-slate-300 transition-colors">Kontakt</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
