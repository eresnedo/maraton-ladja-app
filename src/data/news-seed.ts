// Početni sadržaj dok baza nije povezana ili dok je prazna (izvor: src/data/articles.ts).
import { ARTICLES } from "./articles";

export type NewsItem = { slug: string; title: string; excerpt: string; cover_url: string; published_at: string };

export const NEWS_SEED: NewsItem[] = ARTICLES.map((a) => ({
  slug: a.slug,
  title: a.title,
  excerpt: a.excerpt,
  cover_url: a.cover,
  published_at: a.date,
}));
