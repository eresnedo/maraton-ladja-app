import type { Metadata } from "next";
import Link from "next/link";
import { EDITIONS, fmtDate, fmtTime } from "@/lib/results";

export const metadata: Metadata = { title: "Arhiva izdanja | Maraton lađa" };

export default function ArhivaPage() {
  return (
    <div className="x-wrap">
      <header className="r-head r-head-wide">
        <p className="r-label">1998. — {EDITIONS[0].year}.</p>
        <h2>Arhiva izdanja</h2>
        <p className="r-lead">Svako izdanje Maratona lađa: datum, pobjednik, vrijeme pobjede i broj posada.</p>
      </header>
      <div className="r-scroll">
        <table className="r-table r-archive">
          <thead>
            <tr>
              <th scope="col">Izdanje</th>
              <th scope="col">Datum</th>
              <th scope="col">Pobjednik</th>
              <th scope="col" className="num">Vrijeme</th>
              <th scope="col" className="num hide-s">Posada</th>
              <th scope="col" aria-label="Poredak" />
            </tr>
          </thead>
          <tbody>
            {EDITIONS.map((e) => (
              <tr key={e.n}>
                <td className="strong">{e.n}.</td>
                <td>{fmtDate(e.date, e.year)}</td>
                <td>{e.winners.map((w) => w.clubName).join(" i ")}</td>
                <td className="num">{fmtTime(e.winners[0]?.time ?? null)}</td>
                <td className="num hide-s">{e.crews}</td>
                <td className="num">
                  <Link href={`/rezultati/poredak-po-godinama/${e.year}`} className="r-link">Poredak →</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
