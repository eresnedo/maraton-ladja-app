import type { Metadata } from "next";
import Link from "next/link";
import { EDITIONS, fmtTime, medalTable, records } from "@/lib/results";

export const metadata: Metadata = { title: "Kuća slavnih | Maraton lađa" };

export default function KucaSlavnihPage() {
  const rec = records();
  const champs = medalTable().filter((r) => r.gold > 0);
  return (
    <div className="x-wrap">
      <header className="r-head r-head-wide">
        <p className="r-label">Kuća slavnih</p>
        <h2>Pobjednici i rekordi</h2>
      </header>

      <dl className="r-records">
        {rec.fastest && (
          <div>
            <dt>Najbrža pobjeda</dt>
            <dd>{fmtTime(rec.fastest.time)}</dd>
            <p>{rec.fastest.clubName}, {rec.fastest.year}.</p>
          </div>
        )}
        <div>
          <dt>Najviše pobjeda</dt>
          <dd>{rec.mostWins.gold}</dd>
          <p>{rec.mostWins.name}</p>
        </div>
        <div>
          <dt>Najviše nastupa</dt>
          <dd>{rec.mostStarts.starts}</dd>
          <p>{rec.mostStarts.name}</p>
        </div>
        <div>
          <dt>Najviše posada</dt>
          <dd>{rec.biggest.crews}</dd>
          <p>{rec.biggest.n}. Maraton, {rec.biggest.year}.</p>
        </div>
      </dl>

      <h3 className="r-h3">Pobjednici po godinama</h3>
      <ol className="r-winners">
        {EDITIONS.map((e) => (
          <li key={e.n}>
            <Link href={`/rezultati/poredak-po-godinama/${e.year}`}>
              <span>{e.year}.</span>
              <b>{e.winners.map((w) => w.clubName).join(" i ")}</b>
              <i>{fmtTime(e.winners[0]?.time ?? null)}</i>
            </Link>
          </li>
        ))}
      </ol>

      <h3 className="r-h3">Pobjedničke posade</h3>
      <ul className="r-champs">
        {champs.map((c) => (
          <li key={c.club}>
            <b>{c.gold}×</b>
            <span>{c.name}</span>
            <small>{c.goldYears.sort((a, b) => a - b).join(" · ")}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
