export const OLD = "https://maraton-ladja.hr";

export async function getHtml(path: string) {
  const r = await fetch(OLD + path, { headers: { "user-agent": "maraton-ladja-migracija" }, cache: "no-store" });
  if (!r.ok) throw new Error(`${path}: HTTP ${r.status}`);
  return r.text();
}

export const strip = (s: string) =>
  s.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#0?39;/g, "'").replace(/\s+/g, " ").trim();

export const abs = (u: string) => new URL(u, OLD).href;
