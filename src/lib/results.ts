import data from "@/data/results.json";

// Izvor: službeni PDF-ovi rezultata 1.–29. Maratona lađa (scripts/results/ za ponovno generiranje).
type RawResult = { e: number; p: number | null; c: string; n: string; t: number | null; s: "DSQ" | "DNF" | "OOC" | null };
type RawEdition = { n: number; date: string | null; notes: string };

export type Result = { place: number | null; club: string; clubName: string; crew: string; time: number | null; status: RawResult["s"] };
export type Edition = { n: number; year: number; date: string | null; results: Result[]; winners: Result[]; crews: number; notes: string };

const RAW = data as unknown as { editions: RawEdition[]; clubs: Record<string, string>; results: RawResult[] };
export const CLUBS = RAW.clubs;

export const EDITIONS: Edition[] = RAW.editions
  .map((e) => {
    const results = RAW.results
      .filter((r) => r.e === e.n)
      .map((r) => ({ place: r.p, club: r.c, clubName: RAW.clubs[r.c] || r.n, crew: r.n, time: r.t, status: r.s }));
    return {
      n: e.n,
      year: 1997 + e.n,
      date: e.date,
      results,
      winners: results.filter((r) => r.place === 1),
      crews: results.filter((r) => r.status !== "OOC").length,
      notes: e.notes,
    };
  })
  .sort((a, b) => b.n - a.n);

export const LATEST = EDITIONS[0];
export const byYear = (year: number) => EDITIONS.find((e) => e.year === year);

export function fmtTime(sec: number | null) {
  if (sec == null) return "—";
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.floor(sec % 60);
  const cs = Math.round((sec % 1) * 100);
  const base = `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return cs ? `${base},${String(cs).padStart(2, "0")}` : base;
}

export function fmtDate(iso: string | null, year: number) {
  if (!iso) return `${year}.`;
  return new Date(iso + "T12:00:00").toLocaleDateString("hr-HR", { day: "numeric", month: "long", year: "numeric" });
}

export type MedalRow = { club: string; name: string; gold: number; silver: number; bronze: number; starts: number; best: number | null; goldYears: number[] };
export function medalTable(): MedalRow[] {
  const m = new Map<string, MedalRow>();
  for (const e of EDITIONS) {
    for (const r of e.results) {
      if (r.status === "OOC") continue;
      const row = m.get(r.club) || { club: r.club, name: r.clubName, gold: 0, silver: 0, bronze: 0, starts: 0, best: null, goldYears: [] };
      row.starts++;
      if (r.place === 1) { row.gold++; row.goldYears.push(e.year); }
      if (r.place === 2) row.silver++;
      if (r.place === 3) row.bronze++;
      if (r.place && (row.best === null || r.place < row.best)) row.best = r.place;
      m.set(r.club, row);
    }
  }
  return [...m.values()].sort((a, b) => b.gold - a.gold || b.silver - a.silver || b.bronze - a.bronze || b.starts - a.starts || a.name.localeCompare(b.name, "hr"));
}

export function records() {
  const wins = EDITIONS.flatMap((e) => e.winners.filter((w) => w.time).map((w) => ({ ...w, year: e.year })));
  const fastest = wins.sort((a, b) => (a.time ?? 1e9) - (b.time ?? 1e9))[0];
  const table = medalTable();
  const mostWins = table[0];
  const mostStarts = [...table].sort((a, b) => b.starts - a.starts)[0];
  const biggest = [...EDITIONS].sort((a, b) => b.crews - a.crews)[0];
  return { fastest, mostWins, mostStarts, biggest };
}
