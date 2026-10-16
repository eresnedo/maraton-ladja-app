import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getNews } from "@/lib/content";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Novosti | Maraton lađa",
  description: "Sve aktivnosti Udruge lađara Neretve i Maratona lađa.",
};

function fmtDate(iso: string) {
  return new Date(iso + "T12:00:00").toLocaleDateString("hr-HR", { day: "numeric", month: "long", year: "numeric" });
}

export default async function NovostiPage() {
  const news = await getNews();
  const [featured, ...rest] = news;

  return (
    <>
      <Header />
      <section className="x-phero">
        <div className="x-wrap">
          <p className="x-crumb">
            <Link href="/">Naslovnica</Link> / Novosti
          </p>
          <h1 className="x-display">Novosti</h1>
          <p>Sve aktivnosti Udruge lađara Neretve i Maratona lađa — od pripremnih utrka do dana finala.</p>
        </div>
      </section>

      {featured && (
        <section className="bg-white pt-22 pb-8">
          <div className="x-wrap">
            <Link href={`/novosti/${featured.slug}`} className="grid gap-10 md:grid-cols-[1.2fr_1fr] md:items-center group">
              <div
                className="aspect-16/10.5 overflow-hidden"
                style={{ background: "var(--paper)" }}
              >
                <img src={featured.cover} alt="" className="w-full h-full object-cover" />
              </div>
              <div>
                <time className="block text-red font-700 text-sm mb-3">{fmtDate(featured.date)}</time>
                <h2 className="x-display" style={{ fontSize: "clamp(1.9rem,3.6vw,3.1rem)" }}>
                  {featured.title}
                </h2>
                <p className="mt-4 text-ink/60 leading-relaxed max-w-md">{featured.excerpt}</p>
                <span className="inline-flex items-center gap-2 mt-6 text-sm font-700 uppercase border-b-2 border-red pb-1">Pročitaj vijest →</span>
              </div>
            </Link>
          </div>
        </section>
      )}

      <section className="py-20" style={{ background: "var(--paper)" }}>
        <div className="x-wrap">
          <h2 className="x-display mb-12" style={{ fontSize: "clamp(1.6rem,3.4vw,2.4rem)" }}>
            Starije vijesti
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {rest.map((n) => (
              <Link key={n.slug} href={`/novosti/${n.slug}`} className="block group">
                <div
                  className="aspect-4/3.2 overflow-hidden"
                  style={{ background: "var(--paper)" }}
                >
                  <img src={n.cover} alt="" className="w-full h-full object-cover" />
                </div>
                <time className="block mt-5 text-red font-700 text-sm">{fmtDate(n.date)}</time>
                <h3 className="mt-2 font-800 text-xl uppercase tracking-tight leading-tight group-hover:text-red transition-colors">{n.title}</h3>
                <p className="mt-2 text-ink/60 text-sm leading-snug">{n.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
