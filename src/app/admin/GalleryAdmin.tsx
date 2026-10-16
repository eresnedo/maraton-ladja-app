"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { removeImage, slugify, uploadImage } from "./util";

type Album = { id?: string; slug: string; title: string; year_label: string; cover_url: string; sort: number; published: boolean; count?: number };
type Photo = { id: string; url: string; caption: string | null; sort: number };

export default function GalleryAdmin() {
  const [list, setList] = useState<Album[]>([]);
  const [edit, setEdit] = useState<Album | null>(null);
  const [err, setErr] = useState("");

  const load = useCallback(async () => {
    const { data, error } = await supabase!.from("gallery_albums").select("id, slug, title, year_label, cover_url, sort, published, gallery_photos(count)").order("sort");
    if (error) return setErr(error.message);
    setList(
      (data || []).map((a) => ({
        ...a,
        year_label: a.year_label || "",
        cover_url: a.cover_url || "",
        count: (a.gallery_photos as { count: number }[] | undefined)?.[0]?.count ?? 0,
      })),
    );
  }, []);
  useEffect(() => { load(); }, [load]);

  if (edit) return <AlbumEditor item={edit} onDone={() => { setEdit(null); load(); }} />;

  return (
    <section>
      <div className="ad-head">
        <h1>Galerija</h1>
        <ImportOld onDone={load} />
        <button className="ad-btn" onClick={() => setEdit({ slug: "", title: "", year_label: String(new Date().getFullYear()) + ".", cover_url: "", sort: (list[0]?.sort ?? 20) - 10, published: false })}>+ Novi album</button>
      </div>
      {err && <p className="ad-err">{err}</p>}
      <ul className="ad-list">
        {list.map((a) => (
          <li key={a.id}>
            <button onClick={() => setEdit(a)}>
              {a.cover_url ? <img src={a.cover_url} alt="" /> : <i />}
              <span>
                <b>{a.title}</b>
                <small>{a.year_label} · {a.count} fotografija · {a.published ? "objavljeno" : <em>skriveno</em>}</small>
              </span>
            </button>
          </li>
        ))}
      </ul>
      <p className="ad-note">Albumi su poredani po broju „Redoslijed” (manji = prvi). Album bez fotografija prikazuje se na webu samo kao naslovnica, bez poveznice.</p>
    </section>
  );
}

function AlbumEditor({ item, onDone }: { item: Album; onDone: () => void }) {
  const [a, setA] = useState<Album>(item);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [slugTouched, setSlugTouched] = useState(!!item.id);
  const [busy, setBusy] = useState("");
  const [err, setErr] = useState("");
  const set = (p: Partial<Album>) => setA((v) => ({ ...v, ...p }));

  const loadPhotos = useCallback(async (id: string) => {
    const { data } = await supabase!.from("gallery_photos").select("id, url, caption, sort").eq("album_id", id).order("sort");
    setPhotos(data || []);
  }, []);
  useEffect(() => { if (item.id) loadPhotos(item.id); }, [item.id, loadPhotos]);

  async function save(): Promise<string | undefined> {
    setErr("");
    if (!a.title.trim() || !a.slug.trim()) { setErr("Naslov i adresa su obavezni."); return; }
    const row = { slug: a.slug, title: a.title, year_label: a.year_label, cover_url: a.cover_url || null, sort: a.sort, published: a.published };
    if (a.id) {
      const { error } = await supabase!.from("gallery_albums").update(row).eq("id", a.id);
      if (error) { setErr(error.message); return; }
      return a.id;
    }
    const { data, error } = await supabase!.from("gallery_albums").insert(row).select("id").single();
    if (error) { setErr(error.code === "23505" ? "Album s tom adresom već postoji." : error.message); return; }
    set({ id: data.id });
    return data.id as string;
  }

  async function onUpload(files: FileList | null) {
    if (!files?.length) return;
    const id = await save();
    if (!id) return;
    let sort = photos.reduce((m, p) => Math.max(m, p.sort), 0);
    let cover = a.cover_url;
    const list = [...files];
    for (let k = 0; k < list.length; k++) {
      setBusy(`Učitavam ${k + 1} / ${list.length}…`);
      try {
        const { url, width, height } = await uploadImage(list[k], `gallery/${a.slug}`, 2000);
        const { error } = await supabase!.from("gallery_photos").insert({ album_id: id, url, width, height, sort: ++sort });
        if (error) throw error;
        if (!cover) {
          cover = url;
          await supabase!.from("gallery_albums").update({ cover_url: url }).eq("id", id);
          set({ cover_url: url });
        }
      } catch (e) {
        setErr(`${list[k].name}: ${(e as Error).message}`);
      }
    }
    setBusy("");
    loadPhotos(id);
  }

  async function delPhoto(p: Photo) {
    if (!confirm("Obrisati ovu fotografiju?")) return;
    await supabase!.from("gallery_photos").delete().eq("id", p.id);
    await removeImage(p.url);
    if (a.cover_url === p.url) {
      const next = photos.find((x) => x.id !== p.id)?.url || "";
      set({ cover_url: next });
      await supabase!.from("gallery_albums").update({ cover_url: next || null }).eq("id", a.id!);
    }
    setPhotos((v) => v.filter((x) => x.id !== p.id));
  }

  async function setCover(url: string) {
    set({ cover_url: url });
    if (a.id) await supabase!.from("gallery_albums").update({ cover_url: url }).eq("id", a.id);
  }

  async function removeAlbum() {
    if (!a.id || !confirm(`Obrisati album „${a.title}” i sve njegove fotografije?`)) return;
    setBusy("Brišem…");
    for (const p of photos) await removeImage(p.url);
    const { error } = await supabase!.from("gallery_albums").delete().eq("id", a.id);
    setBusy("");
    if (error) return setErr(error.message);
    onDone();
  }

  return (
    <section className="ad-form">
      <div className="ad-head">
        <h1>{a.id ? "Uredi album" : "Novi album"}</h1>
        <button className="ad-link" onClick={onDone}>← Natrag</button>
      </div>
      <label>Naslov
        <input value={a.title} onChange={(e) => set({ title: e.target.value, ...(slugTouched ? {} : { slug: slugify(e.target.value) }) })} />
      </label>
      <div className="ad-row">
        <label>Adresa (URL)
          <input value={a.slug} onChange={(e) => { setSlugTouched(true); set({ slug: slugify(e.target.value) }); }} />
          <small>/galerija/{a.slug || "…"}</small>
        </label>
        <label>Godina / mjesto
          <input value={a.year_label} onChange={(e) => set({ year_label: e.target.value })} placeholder="2026." />
        </label>
        <label>Redoslijed
          <input type="number" value={a.sort} onChange={(e) => set({ sort: Number(e.target.value) })} />
        </label>
      </div>
      <label className="ad-check">
        <input type="checkbox" checked={a.published} onChange={(e) => set({ published: e.target.checked })} /> Prikaži na webu
      </label>
      {err && <p className="ad-err">{err}</p>}
      <div className="ad-actions">
        <button className="ad-btn" disabled={!!busy} onClick={async () => { if (await save()) onDone(); }}>Spremi</button>
        <label className="ad-btn ad-ghost ad-upload">
          + Dodaj fotografije
          <input type="file" accept="image/*" multiple disabled={!!busy} onChange={(e) => { onUpload(e.target.files); e.target.value = ""; }} />
        </label>
        {a.id && <button className="ad-link ad-danger" onClick={removeAlbum}>Obriši album</button>}
        {busy && <span className="ad-busy">{busy}</span>}
      </div>
      <p className="ad-note">Fotografije se prije slanja automatski smanje na 2000 px, pa možeš dodati originale s mobitela ili fotoaparata.</p>
      <ul className="ad-photos">
        {photos.map((p) => (
          <li key={p.id} className={p.url === a.cover_url ? "is-cover" : ""}>
            <img src={p.url} alt="" loading="lazy" />
            <div>
              {p.url === a.cover_url ? <span>Naslovna</span> : <button onClick={() => setCover(p.url)}>Postavi kao naslovnu</button>}
              <button className="ad-danger" onClick={() => delPhoto(p)}>Obriši</button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

// ---------- Jednokratni uvoz albuma sa starog weba (fotografije ostaju na maraton-ladja.hr) ----------
const OLD_SEEDS = ["vecer-tradicije-2025", "28-maraton-ladja", "brzinske-utrke-2025", "27-maraton-ladja", "navalis-prag-2022", "arhivske-fotografije"];
type OldAlbum = { title: string; desc: string; cover: string; path: string };

function ImportOld({ onDone }: { onDone: () => void }) {
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  async function run() {
    if (!confirm("Uvesti sve albume sa starog weba maraton-ladja.hr? Albumi koji su već uvezeni preskaču se.")) return;
    setBusy(true);
    try {
      setMsg("Čitam popis albuma…");
      const res = await fetch("/api/stari-web/galerija").then((r) => r.json());
      if (res.error) throw new Error(res.error);
      const albums: OldAlbum[] = res.albums;

      // ukloni privremene prazne albume koje stari web zamjenjuje
      const { data: seeds } = await supabase!.from("gallery_albums").select("id, slug, gallery_photos(count)").in("slug", OLD_SEEDS);
      for (const a of seeds || []) if (!((a.gallery_photos as { count: number }[])?.[0]?.count)) await supabase!.from("gallery_albums").delete().eq("id", a.id);

      let done = 0, photos = 0;
      for (let i = 0; i < albums.length; i++) {
        const o = albums[i];
        const slug = o.path.slice(1);
        setMsg(`${i + 1} / ${albums.length}: ${o.title}`);
        const { data: existing } = await supabase!.from("gallery_albums").select("id, gallery_photos(count)").eq("slug", slug).maybeSingle();
        if ((existing?.gallery_photos as { count: number }[] | undefined)?.[0]?.count) continue;
        const list = await fetch(`/api/stari-web/album?path=${encodeURIComponent(o.path)}`).then((r) => r.json());
        const urls: string[] = list.photos || [];
        if (!urls.length) continue;
        const year = o.desc.match(/(\d{4})\./)?.[1];
        const row = {
          slug,
          title: o.title.replace(/\s+FOTO$/i, "").replace(/\s+/g, " ").trim(),
          year_label: /navalis/i.test(o.title) ? "Prag, 2022." : year ? `${year}.` : /arhiv/i.test(o.title) ? "Arhiva" : "",
          cover_url: o.cover,
          sort: 100 + i * 10,
          published: true,
        };
        let id = existing?.id as string | undefined;
        if (id) await supabase!.from("gallery_albums").update(row).eq("id", id);
        else {
          const { data, error } = await supabase!.from("gallery_albums").insert(row).select("id").single();
          if (error) throw error;
          id = data.id;
        }
        for (let k = 0; k < urls.length; k += 500) {
          const chunk = urls.slice(k, k + 500).map((url, j) => ({ album_id: id, url, sort: k + j + 1 }));
          const { error } = await supabase!.from("gallery_photos").insert(chunk);
          if (error) throw error;
        }
        done++;
        photos += urls.length;
      }
      setMsg(`Gotovo: ${done} albuma, ${photos} fotografija.`);
      onDone();
    } catch (e) {
      setMsg("Greška: " + (e as Error).message);
    }
    setBusy(false);
  }

  return (
    <span className="ad-import">
      {msg && <span className="ad-busy">{msg}</span>}
      <button className="ad-btn ad-ghost" disabled={busy} onClick={run}>{busy ? "Uvozim…" : "Uvezi sa starog weba"}</button>
    </span>
  );
}
