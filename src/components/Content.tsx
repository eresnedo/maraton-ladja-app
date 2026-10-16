import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./content.css";

type Crumb = { label: string; href?: string };

// Hero fotka podstranice: ako postoji public/images/hero/<hero>.(webp|jpg), koristi se; inače čista navy.
function heroImage(key?: string) {
  if (!key) return null;
  for (const ext of ["webp", "jpg", "jpeg", "png"]) {
    const rel = `/images/hero/${key}.${ext}`;
    if (fs.existsSync(path.join(process.cwd(), "public", rel))) return rel;
  }
  return null;
}

export function Page({ title, lead, crumbs, hero, children }: { title: string; lead?: string; crumbs: Crumb[]; hero?: string; children: React.ReactNode }) {
  const img = heroImage(hero) ?? heroImage("naslovna");
  return (
    <>
      <Header />
      <section className={"x-phero" + (img ? " has-img" : "")}>
        {img && <img className="c-hero-img" src={img} alt="" />}
        <div className="x-wrap">
          <p className="x-crumb">
            <Link href="/">Naslovnica</Link>
            {crumbs.map((c) => (
              <span key={c.label}>
                {" / "}
                {c.href ? <Link href={c.href}>{c.label}</Link> : c.label}
              </span>
            ))}
          </p>
          <h1 className={"x-display" + (title.length > 38 ? " c-long" : "")}>{title}</h1>
          {lead && <p>{lead}</p>}
        </div>
      </section>
      <main>{children}</main>
      <Footer />
    </>
  );
}

export function Section({ children, alt, narrow }: { children: React.ReactNode; alt?: boolean; narrow?: boolean }) {
  return (
    <section className={"c-sec" + (alt ? " c-alt" : "")}>
      <div className={"x-wrap" + (narrow ? " c-narrow" : "")}>{children}</div>
    </section>
  );
}

export function Head({ label, title, sub }: { label?: string; title: string; sub?: string }) {
  return (
    <header className="c-head">
      {label && <p className="c-label">{label}</p>}
      <h2>{title}</h2>
      {sub && <p className="c-sub">{sub}</p>}
    </header>
  );
}

export function Facts({ items, cols = 3 }: { items: { label: string; value: string; text?: React.ReactNode }[]; cols?: number }) {
  return (
    <dl className="c-facts" style={{ ["--cols" as string]: cols }}>
      {items.map((f) => (
        <div key={f.label}>
          <dt>{f.label}</dt>
          <dd>{f.value}</dd>
          {f.text && <p>{f.text}</p>}
        </div>
      ))}
    </dl>
  );
}

export function Prose({ children }: { children: React.ReactNode }) {
  return <div className="c-prose">{children}</div>;
}

export function Quote({ children }: { children: React.ReactNode }) {
  return <blockquote className="c-quote">{children}</blockquote>;
}

export function Rows({ items }: { items: { title: string; right: string }[] }) {
  return (
    <ul className="c-rows">
      {items.map((r) => (
        <li key={r.title}>
          <b>{r.title}</b>
          <span>{r.right}</span>
        </li>
      ))}
    </ul>
  );
}

export function Note({ children }: { children: React.ReactNode }) {
  return <p className="c-note">{children}</p>;
}

export function Cta({ title, text, href, label }: { title: string; text: string; href: string; label: string }) {
  const ext = href.startsWith("http");
  return (
    <section className="c-cta">
      <div className="x-wrap">
        <div>
          <h2>{title}</h2>
          <p>{text}</p>
        </div>
        {ext ? (
          <a className="x-btn" href={href} target="_blank" rel="noopener noreferrer">{label}</a>
        ) : (
          <Link className="x-btn" href={href}>{label}</Link>
        )}
      </div>
    </section>
  );
}
