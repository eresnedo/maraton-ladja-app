"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/rezultati/poredak-po-godinama", label: "Poredak po godinama" },
  { href: "/rezultati/rang-ljestvica", label: "Rang ljestvica" },
  { href: "/rezultati/arhiva", label: "Arhiva izdanja" },
  { href: "/rezultati/kuca-slavnih", label: "Kuća slavnih" },
];

export default function ResultsTabs() {
  const path = usePathname();
  return (
    <nav className="r-tabs" aria-label="Rezultati">
      <div className="x-wrap">
        {TABS.map((t) => (
          <Link key={t.href} href={t.href} className={path.startsWith(t.href) ? "on" : ""} aria-current={path.startsWith(t.href) ? "page" : undefined}>
            {t.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
