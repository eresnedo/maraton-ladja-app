// Novosti i galerija: čitaju se iz Supabasea, a ako baza nije spojena ili je prazna,
// stranica radi s ugrađenim sadržajem (src/data/articles.ts).
import { supabase } from "@/lib/supabase";
import { ARTICLES, type Article, type Block } from "@/data/articles";

export type { Article, Block };

/** Tekst iz admina u blokove: prazan red = novi odlomak, "## " podnaslov, "1. " / "- " popis, [tekst](link) datoteka. */
export function textToBlocks(text: string): Block[] {
  return text
    .replace(/\r/g, "")
    .split(/\n\s*\n/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((chunk): Block => {
      const lines = chunk.split("\n").map((l) => l.trim()).filter(Boolean);
      if (chunk.startsWith("## ")) return { t: "h", text: chunk.slice(3).trim() };
      const file = chunk.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
      if (file) return { t: "file", text: file[1], href: file[2] };
      if (lines.every((l) => /^\d+\.\s/.test(l))) return { t: "ol", items: lines.map((l) => l.replace(/^\d+\.\s+/, "")) };
      if (lines.every((l) => /^[-•]\s/.test(l))) return { t: "ul", items: lines.map((l) => l.replace(/^[-•]\s+/, "")) };
      return { t: "p", text: lines.join(" ") };
    });
}

type NewsRow = { slug: string; title: string; excerpt: string | null; body: string; cover_url: string | null; published_at: string };

const toArticle = (r: NewsRow): Article => ({
  slug: r.slug,
  title: r.title,
  excerpt: r.excerpt || "",
  cover: r.cover_url || "/images/ruta-karta.jpg",
  date: r.published_at.slice(0, 10),
  body: textToBlocks(r.body || ""),
});

export async function getNews(limit = 50): Promise<Article[]> {
  if (!supabase) return ARTICLES.slice(0, limit);
  const { data, error } = await supabase
    .from("news")
    .select("slug, title, excerpt, body, cover_url, published_at")
    .eq("published", true)
    .order("published_at", { ascending: false })
    .limit(limit);
  if (error || !data || data.length === 0) return ARTICLES.slice(0, limit);
  return (data as NewsRow[]).map(toArticle);
}

export async function getNewsItem(slug: string): Promise<Article | undefined> {
  if (supabase) {
    const { data } = await supabase
      .from("news")
      .select("slug, title, excerpt, body, cover_url, published_at")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();
    if (data) return toArticle(data as NewsRow);
  }
  return ARTICLES.find((a) => a.slug === slug);
}

// ---------- GALERIJA ----------
export type Photo = { url: string; width: number | null; height: number | null; caption: string | null };
export type Album = { slug: string; title: string; year: string; cover: string; count: number };

const FALLBACK_ALBUMS: Album[] = [
  { slug: "29-maraton-ladja", title: "29. Maraton lađa", year: "2026.", cover: "https://maraton-ladja.hr/images/770067796_18110548478287565_831642774667007538_n-1-scaled.jpg", count: 0 },
  { slug: "13-maraton-ladarica", title: "13. Maraton lađarica", year: "2026.", cover: "https://maraton-ladja.hr/images/13-Maraton-ladarica-pobjednice-UL-Sisak.jpg", count: 0 },
  { slug: "vecer-tradicije-2025", title: "Večer tradicije", year: "2025.", cover: "https://maraton-ladja.hr/images/2025/08/19/vecer_tradicije_2025_0032.jpg", count: 0 },
  { slug: "28-maraton-ladja", title: "28. Maraton lađa", year: "2025.", cover: "https://maraton-ladja.hr/images/2025/08/10/28_maraton_0031.jpg", count: 0 },
  { slug: "brzinske-utrke-2025", title: "Brzinske utrke", year: "2025.", cover: "https://maraton-ladja.hr/images/brzinske_utrke_2025_-_0673_copy_Large.jpeg", count: 0 },
  { slug: "27-maraton-ladja", title: "27. Maraton lađa", year: "2024.", cover: "https://maraton-ladja.hr/images/2024/08/14/27_maraton_ladja_2024_0026.jpg", count: 0 },
  { slug: "navalis-prag-2022", title: "Svetojanske svečanosti NAVALIS", year: "Prag, 2022.", cover: "https://maraton-ladja.hr/images/ladjari_web.jpg", count: 0 },
  { slug: "arhivske-fotografije", title: "Arhivske fotografije", year: "1998. – danas", cover: "https://maraton-ladja.hr/images/2022/udruga_ladjara_neretve_o_nama.jpg", count: 0 },
];

type AlbumRow = { id: string; slug: string; title: string; year_label: string | null; cover_url: string | null; gallery_photos?: { count: number }[] };

export async function getAlbums(): Promise<Album[]> {
  if (!supabase) return FALLBACK_ALBUMS;
  const { data, error } = await supabase
    .from("gallery_albums")
    .select("id, slug, title, year_label, cover_url, gallery_photos(count)")
    .eq("published", true)
    .order("sort", { ascending: true });
  if (error || !data || data.length === 0) return FALLBACK_ALBUMS;
  return (data as AlbumRow[]).map((a) => ({
    slug: a.slug,
    title: a.title,
    year: a.year_label || "",
    cover: a.cover_url || "",
    count: a.gallery_photos?.[0]?.count ?? 0,
  }));
}

export async function getAlbum(slug: string): Promise<(Album & { photos: Photo[] }) | undefined> {
  if (!supabase) return undefined;
  const { data } = await supabase
    .from("gallery_albums")
    .select("id, slug, title, year_label, cover_url, gallery_photos(url, width, height, caption, sort)")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  if (!data) return undefined;
  const photos = ((data.gallery_photos || []) as (Photo & { sort: number })[]).sort((a, b) => a.sort - b.sort);
  return { slug: data.slug, title: data.title, year: data.year_label || "", cover: data.cover_url || photos[0]?.url || "", count: photos.length, photos };
}
