// Početni (seed) sadržaj dok baza nije povezana ili dok je prazna.
// Isti podaci kao i prije, sada samo kao fallback — pravi izvor je Supabase tablica `news`.
export type NewsItem = {
  slug: string;
  title: string;
  excerpt: string;
  cover_url: string;
  published_at: string;
};

export const NEWS_SEED: NewsItem[] = [
  {
    slug: "ladja-na-neretvi-ne-plastika",
    title: "Lađa na Neretvi, ne plastika: Maraton bez plastike",
    excerpt: "Volonteri i ronioci očistili su korito Neretve od otpada tradicionalnim lađama, uz poruku da rijeka koja nosi 30 godina Maratona zaslužuje čistu vodu.",
    cover_url: "https://maraton-ladja.hr/images/WhatsApp_Image_2026-09-21_at_14.20.32_1.jpeg",
    published_at: "2026-09-24",
  },
  {
    slug: "crni-put-gusar-komin-29-maraton",
    title: "UL Crni put i UL Gusar Komin podijelili tron 29. Maratona lađa",
    excerpt: "Dvije posade prešle rijeku u istom vremenu na 22,5 km ruti — 29. Maraton lađa ponovno je pokazao zašto je srce doline Neretve.",
    cover_url: "https://maraton-ladja.hr/images/770067796_18110548478287565_831642774667007538_n-1-scaled.jpg",
    published_at: "2026-08-12",
  },
  {
    slug: "ladarice-siska-13-maraton-ladarica",
    title: "Lađarice Siska slavile na 13. Maratonu lađarica",
    excerpt: "Posada iz Siska pobijedila je na 13. Maratonu lađarica u vremenu 58:09, na ruti Metković–Opuzen, ispred 17 prijavljenih posada.",
    cover_url: "https://maraton-ladja.hr/images/13-Maraton-ladarice-pobjednice-UL-Sisak.jpg",
    published_at: "2026-08-12",
  },
  {
    slug: "crni-put-brzinske-utrke-opuzen",
    title: "UL Crni put najbrži na brzinskim utrkama u Opuzenu",
    excerpt: "Vremenom 1:23,926 posada Crnog puta osvojila je najbolju startnu poziciju za glavnu utrku Maratona lađa.",
    cover_url: "https://maraton-ladja.hr/images/IMG-20260806-WA0011.jpg",
    published_at: "2026-08-12",
  },
  {
    slug: "brzinske-utrke-opuzen-najava",
    title: "Brzinske utrke u Opuzenu",
    excerpt: "Najava kvalifikacijskih utrka za 29. Maraton lađa, uz svetu misu i dron light show iznad rijeke.",
    cover_url: "https://maraton-ladja.hr/images/brzinske_utrke_2025_-_0673_copy_Large.jpeg",
    published_at: "2026-08-04",
  },
];
