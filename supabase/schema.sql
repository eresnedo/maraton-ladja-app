-- Maraton lađa — shema baze (Supabase/Postgres)
-- Pokreni u Supabase SQL editoru (Project → SQL Editor → New query).

-- ============ POSADE ============
create table crews (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,              -- npr. "UL Crni put"
  place text,                              -- mjesto iz kojeg je posada
  founded_year int,
  logo_url text,
  created_at timestamptz default now()
);

-- ============ IZDANJA MARATONA ============
create table editions (
  id uuid primary key default gen_random_uuid(),
  number int not null unique,              -- 1, 2, 3 ... 30
  race_type text not null default 'maraton' check (race_type in ('maraton','ladarice','brzinske')),
  event_date date,
  distance_km numeric(4,1) default 22.5,
  route text,                              -- "Metković – Opuzen – Ploče"
  weather_note text,
  spectators_est int,
  notes text,
  created_at timestamptz default now()
);

-- ============ REZULTATI (poredak po izdanju) ============
create table results (
  id uuid primary key default gen_random_uuid(),
  edition_id uuid not null references editions(id) on delete cascade,
  crew_id uuid not null references crews(id) on delete cascade,
  place int not null,                      -- 1 = zlato, 2 = srebro, 3 = bronca...
  finish_time interval,                    -- vrijeme utrke, ako postoji
  notes text,
  unique (edition_id, crew_id)
);

-- brza agregacija medalja po posadi (pogled, ne tablica)
create view medal_table as
select
  c.id as crew_id,
  c.name as crew_name,
  count(*) filter (where r.place = 1) as gold,
  count(*) filter (where r.place = 2) as silver,
  count(*) filter (where r.place = 3) as bronze,
  count(*) as total_podiums
from crews c
join results r on r.crew_id = c.id
where r.place <= 3
group by c.id, c.name
order by gold desc, silver desc, bronze desc;

-- ============ NOVOSTI ============
create table news (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text,
  body text,                               -- markdown ili HTML
  cover_url text,
  published_at timestamptz not null default now(),
  created_at timestamptz default now()
);

-- ============ GALERIJA ============
create table gallery_albums (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,                     -- "29. Maraton lađa"
  year int not null,
  cover_url text,
  edition_id uuid references editions(id),
  created_at timestamptz default now()
);

create table gallery_photos (
  id uuid primary key default gen_random_uuid(),
  album_id uuid not null references gallery_albums(id) on delete cascade,
  url text not null,                       -- Supabase Storage javni URL
  width int,
  height int,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- ============ INDEKSI ============
create index on results (edition_id);
create index on results (crew_id);
create index on gallery_photos (album_id);
create index on news (published_at desc);
create index on editions (race_type, number);

-- ============ ROW LEVEL SECURITY ============
-- Javno čitanje za sve tablice, pisanje samo za prijavljene (admin) korisnike.
alter table crews enable row level security;
alter table editions enable row level security;
alter table results enable row level security;
alter table news enable row level security;
alter table gallery_albums enable row level security;
alter table gallery_photos enable row level security;

create policy "javno čitanje" on crews for select using (true);
create policy "javno čitanje" on editions for select using (true);
create policy "javno čitanje" on results for select using (true);
create policy "javno čitanje" on news for select using (true);
create policy "javno čitanje" on gallery_albums for select using (true);
create policy "javno čitanje" on gallery_photos for select using (true);

create policy "admin piše" on crews for all using (auth.role() = 'authenticated');
create policy "admin piše" on editions for all using (auth.role() = 'authenticated');
create policy "admin piše" on results for all using (auth.role() = 'authenticated');
create policy "admin piše" on news for all using (auth.role() = 'authenticated');
create policy "admin piše" on gallery_albums for all using (auth.role() = 'authenticated');
create policy "admin piše" on gallery_photos for all using (auth.role() = 'authenticated');
