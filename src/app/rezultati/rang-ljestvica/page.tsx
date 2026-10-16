import type { Metadata } from "next";
import { medalTable, EDITIONS } from "@/lib/results";

export const metadata: Metadata = { title: "Rang ljestvica | Maraton lađa" };

export default function RangPage() {
  const rows = medalTable().filter((r) => r.gold + r.silver + r.bronze > 0);
  return (
    <div className="x-wrap">
      <header className="r-head r-head-wide">
        <p className="r-label">Svih vremena · {EDITIONS.length} izdanja</p>
        <h2>Rang ljestvica posada</h2>
        <p className="r-lead">Posade poredane po broju zlatnih, srebrnih i brončanih mjesta na Maratonu lađa. Kod dijeljenih mjesta medalju dobivaju obje posade.</p>
      </header>
      <div className="r-scroll">
        <table className="r-table r-medals">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Posada</th>
              <th scope="col" className="num">1. mjesto</th>
              <th scope="col" className="num">2. mjesto</th>
              <th scope="col" className="num">3. mjesto</th>
              <th scope="col" className="num">Ukupno</th>
              <th scope="col" className="num hide-s">Nastupa</th>
              <th scope="col" className="hide-s">Pobjede</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.club} className={i < 3 ? `m${i + 1}` : ""}>
                <td>{i + 1}.</td>
                <td>{r.name}</td>
                <td className="num strong">{r.gold || "—"}</td>
                <td className="num">{r.silver || "—"}</td>
                <td className="num">{r.bronze || "—"}</td>
                <td className="num">{r.gold + r.silver + r.bronze}</td>
                <td className="num hide-s">{r.starts}</td>
                <td className="hide-s r-years-inline">{r.goldYears.sort((a, b) => a - b).join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="r-source">Izvor: službeni rezultati 1.–{EDITIONS[0].n}. Maratona lađa. Ekipe koje su kroz godine nastupale pod različitim nazivima udruge objedinjene su.</p>
    </div>
  );
}
