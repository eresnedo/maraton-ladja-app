-- Maraton lađa · Supabase shema (novosti, galerija, administracija)
-- Pokreni JEDNOM u Supabase: SQL Editor → New query → zalijepi sve → Run.
-- Rezultati utrka zasad ostaju u repozitoriju (src/data/results.json).

-- ============ ADMINISTRATORI ============
create table if not exists public.admins (
  email text primary key,
  created_at timestamptz not null default now()
);
alter table public.admins enable row level security;
-- popis se uređuje samo ovdje u SQL editoru, ne preko weba

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins where lower(email) = lower(coalesce(auth.jwt() ->> 'email', '')));
$$;

insert into public.admins (email) values ('nedoadacardano@gmail.com') on conflict do nothing;

-- ============ NOVOSTI ============
create table if not exists public.news (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text,
  body text not null default '',          -- odlomci odvojeni praznim redom; "## " podnaslov, "1. " / "- " popis
  cover_url text,
  published_at timestamptz not null default now(),
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists news_published_at_idx on public.news (published_at desc);
alter table public.news enable row level security;
drop policy if exists "news: javno čitanje objavljenih" on public.news;
create policy "news: javno čitanje objavljenih" on public.news for select using (published or public.is_admin());
drop policy if exists "news: admin uređuje" on public.news;
create policy "news: admin uređuje" on public.news for all using (public.is_admin()) with check (public.is_admin());

-- ============ GALERIJA ============
create table if not exists public.gallery_albums (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  year_label text,                        -- "2026." ili "Prag, 2022."
  cover_url text,
  sort int not null default 100,
  published boolean not null default false,
  created_at timestamptz not null default now()
);
create table if not exists public.gallery_photos (
  id uuid primary key default gen_random_uuid(),
  album_id uuid not null references public.gallery_albums(id) on delete cascade,
  url text not null,
  width int,
  height int,
  caption text,
  sort int not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists gallery_photos_album_idx on public.gallery_photos (album_id, sort);
alter table public.gallery_albums enable row level security;
alter table public.gallery_photos enable row level security;
drop policy if exists "albumi: javno čitanje" on public.gallery_albums;
create policy "albumi: javno čitanje" on public.gallery_albums for select using (published or public.is_admin());
drop policy if exists "albumi: admin uređuje" on public.gallery_albums;
create policy "albumi: admin uređuje" on public.gallery_albums for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists "fotke: javno čitanje" on public.gallery_photos;
create policy "fotke: javno čitanje" on public.gallery_photos for select using (
  exists (select 1 from public.gallery_albums a where a.id = album_id and (a.published or public.is_admin())));
drop policy if exists "fotke: admin uređuje" on public.gallery_photos;
create policy "fotke: admin uređuje" on public.gallery_photos for all using (public.is_admin()) with check (public.is_admin());

-- ============ SPREMIŠTE ZA SLIKE ============
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 10485760, array['image/jpeg','image/png','image/webp','application/pdf'])
on conflict (id) do nothing;
drop policy if exists "media: admin upload" on storage.objects;
create policy "media: admin upload" on storage.objects for insert to authenticated with check (bucket_id = 'media' and public.is_admin());
drop policy if exists "media: admin izmjena" on storage.objects;
create policy "media: admin izmjena" on storage.objects for update to authenticated using (bucket_id = 'media' and public.is_admin());
drop policy if exists "media: admin brisanje" on storage.objects;
create policy "media: admin brisanje" on storage.objects for delete to authenticated using (bucket_id = 'media' and public.is_admin());

-- ============ POČETNI SADRŽAJ ============
insert into public.news (slug, title, excerpt, body, cover_url, published_at, published) values
('lada-na-neretvi-ne-plastika-maraton-bez-plastike', 'Lađa na Neretvi, ne plastika – Maraton bez plastike', 'Četrdesetak volontera, ronilaca i članova udruga očistilo obalu i dno Neretve u Metkoviću.', 'Četrdesetak volontera, ronilaca i članova udruga očistilo obalu i dno Neretve u Metkoviću.

U Metkoviću je 20. rujna 2026. provedena ekološka akcija „Lađa na Neretvi, ne plastika - Maraton bez plastike“, usmjerena na čišćenje priobalja i riječnog dna Neretve te na podizanje svijesti o onečišćenju okoliša plastikom i drugim otpadom. U akciji je sudjelovalo oko 40 volontera, ronilaca, članova udruga, sportskih klubova i građana.

Akcija je provedena u sklopu projekta TETHYS4ADRION, kao doprinos pilot-mjeri „Plastic-free event“, kojom se potiče smanjenje uporabe jednokratne plastike i održiviji način organizacije događanja.

## Tradicionalna lađa u službi zaštite okoliša

Čišćenje se odvijalo istovremeno na više lokacija. Udruga lađara Neretve i Udruga Gusarice Metković koristile su tradicionalnu neretvansku lađu kako bi došle do teško dostupnih dijelova priobalja - plovilo koje je stoljećima dio identiteta ovog kraja tako je poslužilo zaštiti rijeke koja ga je i stvorila.

Podvodno čišćenje riječnog dna na području Lučkog mosta proveli su ronioci Ekološko-ronilačkog kluba „Malo more“.

U čišćenju obale, prikupljanju i razvrstavanju otpada sudjelovali su i predstavnici Udruge mladih Kolektiv, Šrek Delte 5, BK Relaks, Udruge Dobra, PD Gledovac i Udruge Impact, uz brojne volontere i građane.

## Otpad koji neće završiti u moru

Uklanjanjem otpada smanjena je količina koja bi nizvodno mogla dospjeti prema ušću Neretve i Jadranskom moru.

Prikupljeni otpad bit će razvrstan i evidentiran prema vrstama materijala, a podaci će se koristiti u bazi ČistiMO! Instituta za oceanografiju i ribarstvo iz Splita. Time akcija dobiva i komponentu građanske znanosti - sudionici ne samo da fizički uklanjaju otpad, nego doprinose i prikupljanju podataka važnih za praćenje onečišćenja.

Kroz pilot-mjeru „Plastic-free event“ Udruga lađara Neretve nastavlja raditi na smanjenju uporabe jednokratne plastike i promicanju održivijih događanja.

Lađa na Neretvi, ne plastika – čuvajmo Neretvu zajedno!

Projekt je sufinanciran kroz program Interreg IPA ADRION 2021.–2027.', 'https://maraton-ladja.hr/images/WhatsApp_Image_2026-09-21_at_14.20.32_1.jpeg', '2026-09-24 12:00:00+02', true),
('ul-crni-put-i-ul-gusar-komin-podijelili-tron-29-maratona-lada', 'UL Crni put i UL Gusar Komin podijelili tron 29. Maratona lađa', 'Neretva je i ove godine bila poprište velikog spektakla — 29. Maraton lađa, odveslan na 22,5 km duge dionice od Metkovića do Ploča, završio je dramatičnom završnicom i…', 'Neretva je i ove godine bila poprište velikog spektakla — 29. Maraton lađa, odveslan na 22,5 km duge dionice od Metkovića do Ploča, završio je dramatičnom završnicom i neizvjesnom borbom za sam vrh. Nakon više od sat vremena napornog veslanja, dvije posade stigle su na cilj izjednačene, pa su prvo mjesto i pobjednički tron podijelile UL Crni put i UL Gusar Komin.

Drugo mjesto osvojila je posada UL Baćina, dok je treće pripalo lađarima UL Sveti Ilija Metković. U ovogodišnjem izdanju najmasovnijeg sportskog događaja u Hrvatskoj nastupilo je ukupno 30 posada, a atmosfera na rivi u Pločama, gdje je utrka i završila, još je jednom pokazala zašto je Maraton lađa srce i duša doline Neretve.

## Službeni poredak 29. Maratona lađa

1. UL Crni put / UL Gusar Komin
2. UL Baćina
3. UL Sveti Ilija Metković
4. UL Zagreb
5. UL Stablina
6. UL Crni put – Moreno
7. UL Zagreb 2
8. UOTV Rogotin
9. UL Općine Slivno
10. UL Sisak
11. SU Argo Bjelovar
12. UL Jerkovac
13. Lađari MUP RH
14. HŠD Ogranak Bjelovar Šumari
15. KUU Škrapa Momići
16. UL Sv. Roko Podrujnica
17. UL Domagojevi gusari Vid
18. UL Marsonia Slavonski Brod
19. SU Argo – Senatori
20. SVU Đakovo
21. UL Sveti Ilija Metković 2
22. KNOBVSLJ Škrapa Momići
23. Veterani 4. gardijske brigade
24. Udruga Krapinski lađari
25. UL Jerkovac 2
26. UL Vidonje Mlinište
27. Salašari Somborski HKUD Vladimir Nazor
28. UL Crni put 2
29. HPB Sport
30. UL Torcida Ploče

Čestitamo svim posadama na uloženom trudu, borbenosti i sportskom duhu, a pobjednicima na sjajnom rezultatu. Neretvanska lađa i ove je godine pokazala svu svoju snagu, a tradicija duga gotovo tri desetljeća nastavlja se prenositi s koljena na koljeno.

Vidimo se sljedeće godine na jubilarnom, 30. Maratonu lađa – pripremite se za spektakl!', 'https://maraton-ladja.hr/images/770067796_18110548478287565_831642774667007538_n-1-scaled.jpg', '2026-08-12 12:00:00+02', true),
('ladarice-siska-slavile-na-13-maratonu-ladarica', 'Lađarice Siska slavile na 13. Maratonu lađarica', 'Neretvom je zaplovila ženska snaga i borbenost — održan je 13. Maraton lađarica na dionici Metković – Opuzen, koji je i ove godine okupio ekipe iz cijele Hrvatske i regije.…', 'Neretvom je zaplovila ženska snaga i borbenost — održan je 13. Maraton lađarica na dionici Metković – Opuzen, koji je i ove godine okupio ekipe iz cijele Hrvatske i regije. Najbržima su se pokazale lađarice Udruge lađarica Sisak, koje su još jednom potvrdile status jedne od najjačih ženskih posada, ostvarivši pobjedničko vrijeme od 58.09.

Drugo mjesto izborile su lađarice ekipe MUP RH – Lađarice u plavom (59.56), dok su treće mjesto osvojile veslačice Udruge lađara Zagreb (1:00.00), u tijesnoj borbi za sam vrh poretka.

## Konačni poredak 13. Maratona lađarica

1. Udruga lađarica Sisak — 58.09
2. MUP RH – Lađarice u plavom — 59.56
3. Udruga lađara Zagreb — 1:00.00
4. Udruga lađara Marsonia Slavonski Brod — 1:00.45
5. Udruga Gusarice Metković — 1:01.38
6. Udruga lađara Stablina — 1:02.01
7. Udruga lađara Baćina — 1:02.17
8. Sportsko veslačka udruga Đakovo — 1:02.23
9. Udruga lađara Gusari Komin — 1:02.46
10. Udruga lađarica Metkovke Metković — 1:04.48
11. HPB Sport — 1:05.30
12. Udruga lađara Jerkovac Metković — 1:06.35
13. Udruga za očuvanje neretvanske baštine Opuzen — 1:06.56
14. Lađarice Pivac — 1:08.02
15. HKUD Vladimir Nazor Salašari Somborski — 1:08.11
16. Udruga Vinkovačke veslačice Vinkovci — 1:08.18

Ovogodišnji Maraton lađarica okupio je čak 17 prijavljenih ekipa, među kojima i nekoliko debitantskih posada, što potvrđuje sve veći interes za žensko lađarstvo na Neretvi. Apsolutni rekord staze i dalje drže zlatne Donjanke Donje iz 2020. godine, s vremenom od 50 minuta i 33 sekunde.', 'https://maraton-ladja.hr/images/13-Maraton-ladarica-pobjednice-UL-Sisak.jpg', '2026-08-12 12:00:00+02', true),
('ul-crni-put-najbrzi-na-brzinskim-utrkama-u-opuzenu', 'UL Crni put najbrži na brzinskim utrkama u Opuzenu', 'Brzinskim utrkama u Opuzenu - Kupom Slobodne Dalmacije i službeno je otvoreno ovogodišnje, 29. izdanje Maratona lađa. Na kratkim, eksplozivnim dionicama, gdje o pobjedniku…', 'Brzinskim utrkama u Opuzenu - Kupom Slobodne Dalmacije i službeno je otvoreno ovogodišnje, 29. izdanje Maratona lađa. Na kratkim, eksplozivnim dionicama, gdje o pobjedniku odlučuju stotinke sekunde, snaga i savršena usklađenost posade, najbržima su se pokazali lađari UL Crni put Metković.

Metkovska posada dominirala je od početka do kraja, ostvarivši najbolje vrijeme utrke od 1:23.926. Drugo mjesto izborila je ekipa UL Zagreb s vremenom 1:25.909, dok su treće mjesto osvojili lađari UL Baćina (1:26.304).

Rezultatima brzinske utrke ekipe su, prema ostvarenom plasmanu, odabrale svoje startne pozicije za glavnu utrku - Maraton lađa od Metkovića do Ploča.

Čestitamo svim posadama na sudjelovanju i borbenosti te im želimo puno sreće na Maratonu lađa.

## Konačni poredak – brzinske utrke, Kup Slobodne Dalmacije

1. UL Crni put Metković — 1:23.926
2. UL Zagreb — 1:25.909
3. UL Baćina — 1:26.304
4. UL Crni put Moreno Metković — 1:26.313
5. UL Gusari Komin — 1:26.373
6. UL Stablina — 1:26.503
7. UL Sv. Ilija Metković — 1:27.774
8. Lađari MUP RH — 1:27.917
9. UL Općine Slivno — 1:28.046
10. UL Zagreb 2 — 1:28.421
11. UL Jerkovac — 1:29.249
12. UOTV Rogotin — 1:29.539
13. UL Sv. Roko Podrujnica — 1:29.789
14. SU Argo Bjelovar — 1:29.811
15. UL Sisak — 1:30.224
16. Hrvatsko šumarsko društvo – ogranak Bjelovar Šumari — 1:30.537
17. Sportsko veslačka udruga Đakovo — 1:30.986
18. KUU Škrapa Momići — 1:31.137
19. UL Domagojevi gusari Vid — 1:31.660
20. UL Sv. Ilija 2 Metković — 1:31.956
21. UL Marsonia Slavonski Brod — 1:32.751
22. SU Argo – Senatori Bjelovar — 1:33.596
23. UL Crni put 2 — 1:33.944
24. Udruga Krapinski lađari — 1:34.584
25. UL Vidonje Mlinište — 1:35.491
26. UL Jerkovac 2 — 1:35.840
27. Klub navijača, obožavatelja, bivših veslača, simpatizera i ljubitelja Škrapa Momići — 1:36.290
28. Veterani 4. gardijske brigade — 1:36.382
29. HPB Sport — 1:38.435

Nije startala: UL Torcida Ploče.', 'https://maraton-ladja.hr/images/IMG-20260806-WA0011.jpg', '2026-08-12 12:00:00+02', true),
('brzinske-utrke-u-opuzenu', 'Brzinske utrke u Opuzenu', 'U srijedu, 5. kolovoza 2026. godine, u Opuzenu se održavaju tradicionalne brzinske utrke – Kup Slobodna Dalmacija, s početkom u 18:00 sati.', 'U srijedu, 5. kolovoza 2026. godine, u Opuzenu se održavaju tradicionalne brzinske utrke – Kup Slobodna Dalmacija, s početkom u 18:00 sati.

Natjecateljski dio programa predviđen je do 21 sat, nakon čega će ekipe, prema ostvarenom plasmanu, odabrati svoje startne pozicije za Maraton lađa.

Nakon utrka slijedi dodjela nagrada za najbolje ekipe, priznanja pojedincima te dodjela prstena. Program će uveličati i spektakularni Dron light show.

Cjelokupni program započinje svetom misom u 17:00 sati za sve lađare i lađarice u Crkvi sv. Stjepana Prvomučenika u Opuzenu.

Pozivamo sve ljubitelje lađarstva da dođu u Opuzen i podrže svoje ekipe u prvom nadmetanju ovogodišnjeg Maratona lađa.

## Satnica nastupa

- 18:00 — Klub navijača, obožavatelja, bivših veslača, simpatizera i ljubitelja Škrapa Momići – debitanti
- 18:05 — Udruga Krapinski lađari – debitanti
- 18:10 — Udruga lađara Crni put – Moreno – debitanti
- 18:15 — Udruga lađara Sv. Ilija 2 – Povratnici
- 18:20 — Udruga lađara Torcida Ploče
- 18:25 — Salašari Somborski HKUD Vladimir Nazor
- 18:30 — HPB Sport
- 18:35 — Udruga lađara Jerkovac 2
- 18:40 — Udruga lađara Vidonje Mlinište
- 18:45 — Veterani 4. gardijske brigade
- 18:50 — Udruga lađara Domagojevi gusari Vid
- 18:55 — Udruga lađara Crni put 2
- 19:00 — Udruga lađara Marsonia Slavonski Brod
- 19:05 — Sportska udruga Argo – Senatori
- 19:10 — Udruga lađara Sv. Roko Podrujnica
- 19:15 — Sportsko veslačka udruga Đakovo
- 19:20 — Udruga lađara Sisak
- 19:25 — HŠDO Ogranak Bjelovar Šumari
- 19:30 — Lađari MUP RH
- 19:35 — KUU Škrapa Momići
- 19:40 — Udruga lađara Općine Slivno
- 19:45 — Udruga lađara Jerkovac
- 19:50 — Sportska udruga Argo Bjelovar
- 19:55 — Udruga lađara Sv. Ilija Metković
- 20:00 — Udruga lađara Crni put Metković
- 20:05 — Udruga lađara Baćina
- 20:10 — Udruga lađara Zagreb 2
- 20:15 — UOTV Rogotin
- 20:20 — Udruga lađara Stablina
- 20:25 — Gusari Komin
- 20:30 — Udruga lađara Zagreb

Vremena su okvirna i podložna manjim izmjenama.', 'https://maraton-ladja.hr/images/brzinske_utrke_2025_-_0673_copy_Large.jpeg', '2026-08-04 12:00:00+02', true),
('objavljen-pravilnik-29-maratona-lada', 'Objavljen Pravilnik 29. Maratona lađa', 'Obavještavamo sve ekipe da je objavljen službeni Pravilnik 29. Maratona lađa.', 'Obavještavamo sve ekipe da je objavljen službeni Pravilnik 29. Maratona lađa.

Molimo sve lađare da se prije početka natjecanja upoznaju s njegovim sadržajem kako bi bili upoznati sa svim pravilima i eventualnim izmjenama u odnosu na prethodne godine.

Pravilnik je dostupan za preuzimanje u nastavku, kao i na stranici Pravilnik i prijave.

[Preuzmi pravilnik 29. Maratona lađa (PDF)](/dokumenti/pravilnik-29-maratona-ladja-2026.pdf)', 'https://maraton-ladja.hr/images/maraton_ladja_clanak_2026.jpg', '2026-07-31 12:00:00+02', true)
on conflict (slug) do nothing;

insert into public.gallery_albums (slug, title, year_label, cover_url, sort, published) values
('29-maraton-ladja', '29. Maraton lađa', '2026.', 'https://maraton-ladja.hr/images/770067796_18110548478287565_831642774667007538_n-1-scaled.jpg', 10, true),
('13-maraton-ladarica', '13. Maraton lađarica', '2026.', 'https://maraton-ladja.hr/images/13-Maraton-ladarica-pobjednice-UL-Sisak.jpg', 20, true),
('vecer-tradicije-2025', 'Večer tradicije', '2025.', 'https://maraton-ladja.hr/images/2025/08/19/vecer_tradicije_2025_0032.jpg', 30, true),
('28-maraton-ladja', '28. Maraton lađa', '2025.', 'https://maraton-ladja.hr/images/2025/08/10/28_maraton_0031.jpg', 40, true),
('brzinske-utrke-2025', 'Brzinske utrke', '2025.', 'https://maraton-ladja.hr/images/brzinske_utrke_2025_-_0673_copy_Large.jpeg', 50, true),
('27-maraton-ladja', '27. Maraton lađa', '2024.', 'https://maraton-ladja.hr/images/2024/08/14/27_maraton_ladja_2024_0026.jpg', 60, true),
('navalis-prag-2022', 'Svetojanske svečanosti NAVALIS', 'Prag, 2022.', 'https://maraton-ladja.hr/images/ladjari_web.jpg', 70, true),
('arhivske-fotografije', 'Arhivske fotografije', '1998. – danas', 'https://maraton-ladja.hr/images/2022/udruga_ladjara_neretve_o_nama.jpg', 80, true)
on conflict (slug) do nothing;
