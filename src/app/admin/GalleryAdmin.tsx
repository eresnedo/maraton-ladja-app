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
