export type NavChild = { label: string; href: string };
export type NavItem = { label: string; href?: string; children?: NavChild[] };

// Izmjena izbornika ide SAMO ovdje — Header ga čita odavde.
export const MENU: NavItem[] = [
  {
    label: "Utrke",
    children: [
      { label: "Maraton lađa", href: "/utrke/maraton-ladja" },
      { label: "Maraton lađarica", href: "/utrke/maraton-ladarica" },
      { label: "Brzinske utrke", href: "/utrke/brzinske-utrke" },
      { label: "Lađarski kupovi", href: "/utrke/ladjarski-kupovi" },
      { label: "Pravilnik i prijave", href: "/utrke/pravilnik-i-prijave" },
    ],
  },
  {
    label: "Rezultati",
    children: [
      { label: "Rang ljestvica", href: "/rezultati/rang-ljestvica" },
      { label: "Poredak po godinama", href: "/rezultati/poredak-po-godinama" },
      { label: "Maraton lađarica", href: "/rezultati/maraton-ladarica" },
      { label: "Arhiva izdanja", href: "/rezultati/arhiva" },
      { label: "Kuća slavnih", href: "/rezultati/kuca-slavnih" },
    ],
  },
  { label: "Novosti", href: "/novosti" },
  { label: "Galerija", href: "/galerija" },
  {
    label: "O nama",
    children: [
      { label: "Udruga lađara Neretve", href: "/o-nama/udruga" },
      { label: "Kako je počelo", href: "/o-nama/kako-je-pocelo" },
      { label: "Povijest lađarstva", href: "/o-nama/povijest" },
      { label: "Monografija", href: "/o-nama/monografija" },
    ],
  },
  { label: "Kontakt", href: "/kontakt" },
];
