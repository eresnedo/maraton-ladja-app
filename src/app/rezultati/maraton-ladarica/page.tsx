import type { Metadata } from "next";
import Link from "next/link";
import data from "@/data/ladarice.json";

export const metadata: Metadata = { title: "Rezultati Maratona lađarica | Maraton lađa" };

// m:ss ili h:mm:ss
const fmt = (s: number) => {
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), x = s % 60;
  return h ? `${h}:${String(m).padStart(2, "0")}:${String(x).padStart(2, "0")}` : `${m}:${String(x).padStart(2, "0")}`;
};

export default function LadariceRezultati() {
  const win = data.results[0].t;
  const date = new Date(data.date + "T12:00:00").toLocaleDateString("hr-HR", { day: "numeric", month: "long", year: "numeric" });
  return (
    <div className="x-wrap">
      <header className="r-head r-head-wide">
        <p className="r-label">{data.edition}. Maraton lađarica · {data.route}</p>
        <h2>{date}</h2>
        <dl className="r-facts">
          <div><dt>Pobjednice</dt><dd>{data.results[0].n}</dd></div>
          <div><dt>Vrijeme</dt><dd>{fmt(win)}</dd></div>
          <div><dt>Rekord staze</dt><dd>{data.record.time} · {data.record.crew}, {data.record.year}.</dd></div>
        </dl>
      </header>
      <table className="r-table">
        <thead>
          <tr>
            <th scope="col">Mjesto</th>
            <th scope="col">Posada</th>
            <th scope="col" className="num">Vrijeme</th>
            <th scope="col" className="num hide-s">Zaostatak</th>
          </tr>
        </thead>
        <tbody>
          {data.results.map((r) => (
            <tr key={r.p} className={r.p <= 3 ? `m${r.p}` : ""}>
              <td>{r.p}.</td>
              <td>{r.n}</td>
              <td className="num">{fmt(r.t)}</td>
              <td className="num hide-s">{r.p > 1 ? "+" + fmt(r.t - win) : ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="r-label r-sub">Van konkurencije</p>
      <table className="r-table r-ooc">
        <tbody>
          {data.ooc.map((r) => (
            <tr key={r.n}><td>{r.n}</td><td className="num">{fmt(r.t)}</td></tr>
          ))}
        </tbody>
      </table>
      <p className="r-source">
        Izvor: službeni rezultati {data.edition}. Maratona lađarica. Rezultati ranijih izdanja bit će dodani naknadno. Više o utrci na stranici{" "}
        <Link href="/utrke/maraton-ladarica" className="r-link">Maraton lađarica</Link>.
      </p>
    </div>
  );
}
