"use client";
import Link from "next/link";
import { useState } from "react";

const nav = [
  { href: "/atgard", label: "Åtgärdstyper" },
  { href: "/kommun", label: "Kommuner" },
  { href: "/guide/attefallsatgard", label: "Attefallsåtgärder" },
  { href: "/guide/bygglovsbefriat", label: "Bygglovsbefriat" },
  { href: "/konsult", label: "Hitta konsult" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#dce8f5] shadow-sm">
      <div className="container-wide">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center shadow-sm group-hover:bg-brand-700 transition-colors">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 1L16 6V17H11V12H7V17H2V6L9 1Z" fill="white" stroke="white" strokeWidth="0.5" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="font-display font-semibold text-xl text-brand-950 tracking-tight">
              Bygglov<span className="text-brand-600">24</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-brand-700 hover:bg-brand-50 rounded-lg transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/konsult" className="btn-primary text-sm py-2 px-4">
              Få offert gratis
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 7H13M8 2L13 7L8 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </Link>
          </div>

          {/* Mobile burger */}
          <button
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            onClick={() => setOpen(!open)}
            aria-label="Meny"
          >
            {open ? (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 4L16 16M16 4L4 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 5H17M3 10H17M3 15H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            )}
          </button>
        </div>

        {/* Mobile nav */}
        {open && (
          <div className="md:hidden py-3 border-t border-slate-100 space-y-1">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block px-3 py-2.5 text-sm font-medium text-slate-700 hover:text-brand-700 hover:bg-brand-50 rounded-lg transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-2 pb-1">
              <Link href="/konsult" className="btn-primary text-sm w-full justify-center">
                Få offert gratis →
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
