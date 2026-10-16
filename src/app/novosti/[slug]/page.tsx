import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Page, Section } from "@/components/Content";
import { ARTICLES, getArticle } from "@/data/articles";
import "./article.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) return {};
  return { title: `${a.title} | Maraton lađa`, description: a.excerpt, openGraph: { title: a.title, description: a.excerpt, images: [a.cover] } };
}

const fmt = (iso: string) => new Date(iso + "T12:00:00").toLocaleDateString("hr-HR", { day: "numeric", month: "long", year: "numeric" });

export default async function Clanak({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) notFound();
  const others = ARTICLES.filter((x) => x.slug !== a.slug).slice(0, 3);
  return (
    <Page title={a.title} crumbs={[{ label: "Novosti", href: "/novosti" }, { label: fmt(a.date) }]}>
      <Section narrow>
        <time className="a-date">{fmt(a.date)}</time>
        <figure className="a-cover">
          <img src={a.cover} alt="" />
        </figure>
        <div className="c-prose">
          {a.body.map((b, i) => {
            if (b.t === "file")
              return (
                <a key={i} className="c-file" href={b.href} target="_blank" rel="noopener">
                  {b.text}
                </a>
              );
            if (b.t === "ol") return <ol key={i}>{b.items.map((x, j) => <li key={j}>{x}</li>)}</ol>;
            if (b.t === "ul") return <ul key={i} className="a-schedule">{b.items.map((x, j) => <li key={j}>{x}</li>)}</ul>;
            if (b.t === "h") return <h3 key={i}>{b.text}</h3>;
            return <p key={i}>{b.text}</p>;
          })}
        </div>
      </Section>
      <Section alt>
        <div className="a-more">
          <h2>Još novosti</h2>
          <Link href="/novosti">Sve novosti →</Link>
        </div>
        <ul className="a-list">
          {others.map((o) => (
            <li key={o.slug}>
              <Link href={`/novosti/${o.slug}`}>
                <time>{fmt(o.date)}</time>
                <b>{o.title}</b>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </Page>
  );
}
