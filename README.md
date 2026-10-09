# Maraton lađa — web

Next.js (App Router) + Supabase. Zamjena za stari skup statičnih `.html` fajlova u `ml-web/` — isti dizajn (crveno-plavi sustav, Barlow Condensed + Fraunces), sad na stacku koji drži bazu za rezultate, novosti i galeriju.

## Pokretanje lokalno

```bash
npm install
cp .env.local.example .env.local   # popuni Supabase URL/key kad projekt postoji
npm run dev
```

Stranice rade i bez `.env.local` — padaju natrag na ugrađeni (seed) sadržaj u `src/data/`, tako da se dizajn uvijek može vidjeti bez baze.

## Baza (Supabase)

1. Napravi projekt na [supabase.com](https://supabase.com).
2. U **SQL Editor** zalijepi i pokreni `supabase/schema.sql` — pravi tablice za posade, izdanja, rezultate, novosti i galeriju (s pogledom `medal_table` za rang ljestvicu).
3. Project → Settings → API → kopiraj `URL` i `anon public key` u `.env.local`.
4. Za upload fotki galerije: Storage → novi bucket (npr. `gallery`, javni read).

## Struktura

- `src/app/` — stranice (App Router), jedna mapa po ruti
- `src/components/Header.tsx`, `Footer.tsx` — zajednički nav/footer (nav se mijenja u `src/data/nav.ts`)
- `src/lib/supabase.ts` — klijent za bazu (vraća `null` dok env nije postavljen)
- `src/data/*-seed.ts` — fallback sadržaj dok baza nije spojena/popunjena
- `supabase/schema.sql` — cijela shema baze

## Što je migrirano, što ostaje

Gotovo: layout, nav/footer, Kontakt, Novosti (čita iz baze).
Sljedeće: Naslovnica (hero/ruta/tracker animacije), ostale podstranice (Utrke, Rezultati, O nama, Galerija) — prebacuju se po istom obrascu kao Novosti, s podacima iz baze gdje ima smisla (rezultati, galerija), statično gdje je sadržaj fiksan (povijest, o udruzi).
