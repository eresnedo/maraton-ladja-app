"use client";

import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RouteStory from "@/components/RouteStory";
import Partners from "@/components/Partners";
import type { Article } from "@/data/articles";

const fmtNews = (iso: string) => new Date(iso + "T12:00:00").toLocaleDateString("hr-HR", { day: "numeric", month: "long", year: "numeric" });
import "./home.css";

const CALENDAR = [
  { name: "Brzinske utrke", where: "Opuzen", when: "Datum u najavi", href: "/utrke/brzinske-utrke" },
  { name: "14. Maraton lađarica", where: "Metković · Opuzen", when: "Datum u najavi", href: "/utrke/maraton-ladarica" },
  { name: "30. Maraton lađa", where: "Metković · Opuzen · Ploče", when: "Kolovoz 2027.", href: "/utrke/maraton-ladja", main: true },
  { name: "Lađarski kupovi", where: "Dolina Neretve", when: "Cijela sezona", href: "/utrke/ladjarski-kupovi" },
];

const HISTORY = [
  { year: "1998.", title: "Prva utrka", text: "13. rujna, po kiši: 18 lađa i više od 20 000 gledatelja na obalama Neretve." },
  { year: "Danas", title: "Tradicija koja traje", text: "Ista lađa, isti ritam bubnja i ista ruta. Posade se smjenjuju, generacija za generacijom." },
  { year: "2027.", title: "30. izdanje", text: "Jubilarni Maraton lađa: 33 identične lađe i više od 400 veslača na startu." },
];

const EXPLORE = [
  { n: "01", title: "Rezultati", text: "Poredak svih posada, po godinama", href: "/rezultati/poredak-po-godinama" },
  { n: "02", title: "Kuća slavnih", text: "Pobjednici, rekordi i legende", href: "/rezultati/kuca-slavnih" },
  { n: "03", title: "Galerija", text: "Fotografije i snimke s rijeke", href: "/galerija" },
  { n: "04", title: "Pravilnik i prijave", text: "Uvjeti natjecanja i prijava ekipe", href: "/utrke/pravilnik-i-prijave" },
];


const hideBroken = (e: React.SyntheticEvent<HTMLImageElement>) => {
  e.currentTarget.style.display = "none";
};

export default function HomeClient({ news }: { news: Article[] }) {
  return (
    <>
      <Header transparent />

      {/* HERO */}
      <section className="h-hero">
        <img className="h-hero-img" src="https://maraton-ladja.hr/images/Maraton_Laa-2.jpg" alt="Lađe na Neretvi tijekom Maratona" onError={hideBroken} />
        <div className="h-hero-shade" />
        <div className="x-wrap h-hero-inner">
          <p className="h-kicker">30. izdanje · kolovoz 2027.</p>
          <h1 className="h-title">Maraton lađa</h1>
          <p className="h-lead">
            22,5 kilometara tradicionalnim neretvanskim lađama, od Metkovića do Ploča. Deset vesala, jedan ritam bubnja i rijeka koja na jedan dan postane stadion.
          </p>
          <div className="h-cta">
            <Link className="h-btn" href="/rezultati/arhiva">
              Rezultati 2026.
            </Link>
            <a className="h-btn h-btn-ghost" href="#ruta">
              Pogledaj rutu
            </a>
          </div>

        </div>
      </section>

      {/* O MARATONU + BROJKE */}
      <section className="h-sec" id="o-nama">
        <div className="x-wrap h-intro">
          <div>
            <p className="h-label">Od 1998.</p>
            <h2 className="h-h2">Središnji događaj doline Neretve</h2>
          </div>
          <p className="h-body">
            Prva utrka održana je 13. rujna 1998., po kiši, s 18 lađa i više od 20 000 gledatelja. Danas je Maraton lađa najveća sportska i kulturna manifestacija doline Neretve, a lađa je ostala ista: drvena, teška i veslana snagom posade.
          </p>
        </div>
        <div className="x-wrap">
          <dl className="h-stats">
            <div><dt>22,5</dt><dd>kilometara rute</dd></div>
            <div><dt>30.</dt><dd>izdanje 2027.</dd></div>
            <div><dt>33</dt><dd>identične lađe</dd></div>
            <div><dt>400+</dt><dd>veslača na rijeci</dd></div>
          </dl>
        </div>
      </section>

      {/* RUTA */}
      <RouteStory />

      {/* POVIJEST */}
      <section className="h-sec h-sec-paper">
        <div className="x-wrap">
          <div className="h-head">
            <div>
              <p className="h-label">Tri desetljeća</p>
              <h2 className="h-h2">Godina za godinom</h2>
            </div>
            <Link href="/o-nama/kako-je-pocelo" className="h-more">Kako je počelo</Link>
          </div>
          <ol className="h-history">
            {HISTORY.map((x) => (
              <li key={x.year}>
                <span>{x.year}</span>
                <h3>{x.title}</h3>
                <p>{x.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* NOVOSTI */}
      <section className="h-sec">
        <div className="x-wrap">
          <div className="h-head">
            <div>
              <p className="h-label">Novosti</p>
              <h2 className="h-h2">Najnovije</h2>
            </div>
            <Link href="/novosti" className="h-more">Sve novosti</Link>
          </div>
          <div className="h-cards">
            {news.slice(0, 3).map((n) => (
              <Link key={n.slug} href={`/novosti/${n.slug}`} className="h-card">
                <div className="h-card-img">
                  <img src={n.cover} alt="" loading="lazy" onError={hideBroken} />
                </div>
                <time>{fmtNews(n.date)}</time>
                <h3>{n.title}</h3>
                <p>{n.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* KALENDAR */}
      <section className="h-sec h-sec-paper">
        <div className="x-wrap">
          <div className="h-head">
            <div>
              <p className="h-label">Sezona 2027.</p>
              <h2 className="h-h2">Kalendar natjecanja</h2>
            </div>
          </div>
          <ul className="h-rows">
            {CALENDAR.map((c) => (
              <li key={c.name}>
                <Link href={c.href} className={"h-row" + (c.main ? " is-main" : "")}>
                  <b>{c.name}</b>
                  <span>{c.where}</span>
                  <span>{c.when}</span>
                  <i aria-hidden="true">→</i>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ISTRAŽI */}
      <section className="h-sec h-sec-navy">
        <div className="x-wrap">
          <div className="h-head">
            <div>
              <p className="h-label">Maraton lađa</p>
              <h2 className="h-h2">Istraži</h2>
            </div>
          </div>
          <div className="h-explore">
            {EXPLORE.map((x) => (
              <Link key={x.n} href={x.href} className="h-tile">
                <small>{x.n}</small>
                <h3>{x.title}</h3>
                <p>{x.text}</p>
                <i aria-hidden="true">→</i>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* PARTNERI */}
      <Partners />

      <Footer />
    </>
  );
}
