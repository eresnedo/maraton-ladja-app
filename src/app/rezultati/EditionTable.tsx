import Link from "next/link";
import { EDITIONS, fmtDate, fmtTime, type Edition } from "@/lib/results";
import ActiveYear from "./ActiveYear";

const STATUS: Record<string, string> = { DSQ: "Diskvalificirani", DNF: "Nisu završili", OOC: "Van konkurencije" };

export default function EditionTable({ edition }: { edition: Edition }) {
  const placed = edition.results.filter((r) => r.status !== "OOC");
  const ooc = edition.results.filter((r) => r.status === "OOC");
  const anyTime = edition.results.some((r) => r.time);
  const winTime = edition.winners[0]?.time ?? null;
  return (
    <div className="x-wrap r-edition">
      <aside className="r-years" aria-label="Izdanja">
        <p className="r-label">Izdanje</p>
        <ul>
          {EDITIONS.map((e) => (
            <li key={e.n}>
              <Link href={`/rezultati/poredak-po-godinama/${e.year}`} className={e.n === edition.n ? "on" : ""}>
                <b>{e.year}.</b>
                <span>{e.n}.</span>
              </Link>
            </li>
          ))}
        </ul>
        <ActiveYear />
      </aside>

      <div className="r-body">
        <header className="r-head">
          <p className="r-label">{edition.n}. Maraton lađa</p>
          <h2>{fmtDate(edition.date, edition.year)}</h2>
          <dl className="r-facts">
            <div><dt>Pobjednik</dt><dd>{edition.winners.map((w) => w.clubName).join(" i ") || "—"}</dd></div>
            <div><dt>Vrijeme pobjednika</dt><dd>{fmtTime(winTime)}</dd></div>
            <div><dt>Posada u utrci</dt><dd>{edition.crews}</dd></div>
          </dl>
        </header>

        <table className="r-table">
          <thead>
            <tr>
              <th scope="col">Mjesto</th>
              <th scope="col">Posada</th>
              {anyTime && <th scope="col" className="num">Vrijeme</th>}
              {anyTime && <th scope="col" className="num hide-s">Zaostatak</th>}
            </tr>
          </thead>
          <tbody>
            {placed.map((r, i) => (
              <tr key={i} className={r.place && r.place <= 3 ? `m${r.place}` : ""}>
                <td>{r.place ? `${r.place}.` : r.status ? "—" : ""}</td>
                <td>
                  {r.crew}
                  {r.status && <em>{STATUS[r.status]}</em>}
                </td>
                {anyTime && <td className="num">{fmtTime(r.time)}</td>}
                {anyTime && <td className="num hide-s">{r.time && winTime && r.place !== 1 ? "+" + fmtTime(r.time - winTime).replace(/^0:0?/, "") : ""}</td>}
              </tr>
            ))}
          </tbody>
        </table>

        {ooc.length > 0 && (
          <>
            <p className="r-label r-sub">Van konkurencije</p>
            <table className="r-table r-ooc">
              <tbody>
                {ooc.map((r, i) => (
                  <tr key={i}>
                    <td>{r.crew}</td>
                    {anyTime && <td className="num">{fmtTime(r.time)}</td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {!anyTime && <p className="r-note">Za ovo izdanje službena vremena nisu sačuvana, objavljen je samo poredak.</p>}
        <p className="r-source">Izvor: službeni rezultati Udruge lađara Neretve. Nazivi posada navedeni su kako su objavljeni te godine.</p>
      </div>
    </div>
  );
}
