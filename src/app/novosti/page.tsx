import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { NEWS_SEED, type NewsItem } from "@/data/news-seed";

export const metadata: Metadata = {
  title: "Novosti | Maraton lađa",
  description: "Sve aktivnosti Udruge lađara Neretve i Maratona lađa.",
};

async function getNews(): Promise<NewsItem[]> {
  // Dok Supabase env varijable nisu postavljene (.env.local), stranica radi s početnim sadržajem.
  if (!supabase) return NEWS_SEED;
  const { data, error } = await supabase
    .from("news")
    .select("slug, title, excerpt, cover_url, published_at")
    .order("published_at", { ascending: false })
    .limit(20);
  if (error || !data || data.length === 0) return NEWS_SEED;
  return data as NewsItem[];
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("hr-HR", { day: "numeric", month: "long", year: "numeric" });
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
            <a href="/">Naslovnica</a> / Novosti
          </p>
          <h1 className="x-display">Novosti</h1>
          <p>Sve aktivnosti Udruge lađara Neretve i Maratona lađa — od pripremnih utrka do dana finala.</p>
        </div>
      </section>

      {featured && (
        <section className="bg-white pt-22 pb-8">
          <div className="x-wrap">
            <a href={`/novosti/${featured.slug}`} className="grid gap-10 md:grid-cols-[1.2fr_1fr] md:items-center group">
              <div
                className="aspect-16/10.5 overflow-hidden"
                style={{ background: "linear-gradient(135deg, var(--ocean), var(--navy2))", clipPath: "polygon(0 0,100% 0,100% 92%,92% 100%,0 100%)" }}
              >
                <img src={featured.cover_url} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div>
                <time className="block text-red font-700 text-sm mb-3">{fmtDate(featured.published_at)}</time>
                <h2 className="x-display" style={{ fontSize: "clamp(1.9rem,3.6vw,3.1rem)" }}>
                  {featured.title}
                </h2>
                <p className="mt-4 text-ink/60 leading-relaxed max-w-md">{featured.excerpt}</p>
                <span className="inline-flex items-center gap-2 mt-6 text-sm font-700 uppercase border-b-2 border-red pb-1">Pročitaj vijest →</span>
              </div>
            </a>
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
              <a key={n.slug} href={`/novosti/${n.slug}`} className="block group">
                <div
                  className="aspect-4/3.2 overflow-hidden"
                  style={{ background: "linear-gradient(135deg, var(--ocean), var(--navy2))", clipPath: "polygon(0 0,100% 0,100% 86%,86% 100%,0 100%)" }}
                >
                  <img src={n.cover_url} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <time className="block mt-5 text-red font-700 text-sm">{fmtDate(n.published_at)}</time>
                <h3 className="mt-2 font-800 text-xl uppercase tracking-tight leading-tight group-hover:text-red transition-colors">{n.title}</h3>
                <p className="mt-2 text-ink/60 text-sm leading-snug">{n.excerpt}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
