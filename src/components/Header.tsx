"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MENU } from "@/data/nav";

// Nasljeđuje ponašanje starog assets/site.js: proziran preko heroa dok se ne skrola,
// bijela podloga nakon scrolla ili kad je otvoren mobilni izbornik.
export default function Header({ transparent = false }: { transparent?: boolean }) {
  const [solid, setSolid] = useState(!transparent);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!transparent) return;
    const onScroll = () => setSolid(window.scrollY > 40 || open);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [transparent, open]);

  const textClass = solid ? "text-ink/70" : "text-white/75";

  return (
    <header
      className={
        "fixed top-0 inset-x-0 z-50 transition-all duration-300 " +
        (solid ? "bg-white shadow-sm" : "")
      }
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 h-28 flex items-center justify-between gap-8">
        <Link href="/" className="flex items-center shrink-0">
          <img src="/img/logo.png" alt="Maraton lađa" width={80} height={80} className="h-20 w-20 object-contain" />
        </Link>

        <nav className="hidden lg:flex items-center gap-9 text-[16px] font-600 tight">
          {MENU.map((item) =>
            item.children ? (
              <div className="relative group" key={item.label}>
                <button className={"py-2 flex items-center gap-1.5 hover:text-red transition-colors " + textClass}>
                  {item.label}
                  <svg className="w-3 h-3 mt-0.5 transition-transform duration-200 group-hover:rotate-180" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path d="M2.5 4.5L6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <div className="absolute left-0 top-full pt-4 opacity-0 invisible translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200">
                  <div className="bg-white rounded-xl shadow-2xl border border-ink/5 py-2 min-w-[230px]">
                    {item.children.map((c) => (
                      <Link key={c.href} href={c.href} className="block px-5 py-2.5 text-[15px] text-ink/70 hover:text-red hover:bg-paper transition-colors">
                        {c.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link key={item.href} href={item.href!} className={"py-2 hover:text-red transition-colors " + textClass}>
                {item.label}
              </Link>
            )
          )}
        </nav>

        <div className="flex items-center gap-5">
          <a href="#" className={"hidden sm:block text-sm font-600 hover:text-red " + textClass}>EN</a>
          <button
            className={"lg:hidden p-2 -mr-2 " + (solid ? "text-ink" : "text-white")}
            aria-label={open ? "Zatvori izbornik" : "Otvori izbornik"}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden bg-white border-t border-ink/10 shadow-xl max-h-[80vh] overflow-y-auto">
          <div className="px-6 py-4 flex flex-col divide-y divide-ink/10">
            {MENU.map((item) =>
              item.children ? (
                <div className="py-3.5" key={item.label}>
                  <div className="font-600 text-ink mb-2">{item.label}</div>
                  <div className="flex flex-col gap-2.5 pl-4 text-ink/60">
                    {item.children.map((c) => (
                      <Link key={c.href} href={c.href} onClick={() => setOpen(false)}>
                        {c.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link key={item.href} href={item.href!} className="py-3.5 font-600 text-ink" onClick={() => setOpen(false)}>
                  {item.label}
                </Link>
              )
            )}
          </div>
        </div>
      )}
    </header>
  );
}
