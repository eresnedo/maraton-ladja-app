import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { ARTICLES } from "@/data/articles";
import { EDITIONS } from "@/lib/results";

const STATIC = [
  "", "/novosti", "/galerija", "/kontakt",
  "/utrke/maraton-ladja", "/utrke/maraton-ladarica", "/utrke/brzinske-utrke", "/utrke/ladjarski-kupovi", "/utrke/pravilnik-i-prijave",
  "/rezultati/poredak-po-godinama", "/rezultati/maraton-ladarica", "/rezultati/rang-ljestvica", "/rezultati/arhiva", "/rezultati/kuca-slavnih",
  "/o-nama/udruga", "/o-nama/kako-je-pocelo", "/o-nama/povijest", "/o-nama/monografija",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...STATIC.map((p) => ({ url: SITE_URL + p, changeFrequency: "monthly" as const, priority: p === "" ? 1 : 0.7 })),
    ...ARTICLES.map((a) => ({ url: `${SITE_URL}/novosti/${a.slug}`, lastModified: a.date, priority: 0.6 })),
    ...EDITIONS.map((e) => ({ url: `${SITE_URL}/rezultati/poredak-po-godinama/${e.year}`, priority: 0.5 })),
  ];
}
