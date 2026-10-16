"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { slugify, uploadImage } from "./util";

type News = { id?: string; slug: string; title: string; excerpt: string; body: string; cover_url: string; published_at: string; published: boolean };

const today = () => new Date().toISOString().slice(0, 10);
const EMPTY: News = { slug: "", title: "", excerpt: "", body: "", cover_url: "", published_at: today(), published: false };

export default function NewsAdmin() {
  const [list, setList] = useState<News[]>([]);
  const [edit, setEdit] = useState<News | null>(null);
  const [err, setErr] = useState("");

  const load = useCallback(async () => {
    const { data, error } = await supabase!.from("news").select("id, slug, title, excerpt, body, cover_url, published_at, published").order("published_at", { ascending: false });
    if (error) setErr(error.message);
    else setList((data || []).map((n) => ({ ...n, excerpt: n.excerpt || "", cover_url: n.cover_url || "", published_at: String(n.published_at).slice(0, 10) })));
  }, []);
  useEffect(() => { load(); }, [load]);

  if (edit) return <Editor item={edit} onDone={() => { setEdit(null); load(); }} />;

  return (
    <section>
      <div className="ad-head">
        <h1>Novosti</h1>
        <button className="ad-btn" onClick={() => setEdit({ ...EMPTY, published_at: today() })}>+ Nova vijest</button>
      </div>
      {err && <p className="ad-err">{err}</p>}
      <ul className="ad-list">
        {list.map((n) => (
          <li key={n.id}>
            <button onClick={() => setEdit(n)}>
              {n.cover_url ? <img src={n.cover_url} alt="" /> : <i />}
              <span>
                <b>{n.title}</b>
                <small>{new Date(n.published_at + "T12:00:00").toLocaleDateString("hr-HR")} · {n.published ? "objavljeno" : <em>skica</em>}</small>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Editor({ item, onDone }: { item: News; onDone: () => void }) {
  const [n, setN] = useState<News>(item);
  const [slugTouched, setSlugTouched] = useState(!!item.id);
  const [busy, setBusy] = useState("");
  const [err, setErr] = useState("");
  const set = (p: Partial<News>) => setN((v) => ({ ...v, ...p }));

  async function save(publish?: boolean) {
    setErr("");
    if (!n.title.trim() || !n.slug.trim()) return setErr("Naslov i adresa su obavezni.");
    setBusy("Spremam…");
    const row = { ...n, published: publish ?? n.published, published_at: n.published_at + "T12:00:00+02:00", updated_at: new Date().toISOString() };
    const { error } = n.id ? await supabase!.from("news").update(row).eq("id", n.id) : await supabase!.from("news").insert(row);
    setBusy("");
    if (error) return setErr(error.code === "23505" ? "Vijest s tom adresom već postoji." : error.message);
    onDone();
  }

  async function remove() {
    if (!n.id || !confirm(`Obrisati vijest „${n.title}”?`)) return;
    const { error } = await supabase!.from("news").delete().eq("id", n.id);
    if (error) return setErr(error.message);
    onDone();
  }

  async function onCover(f: File | undefined) {
    if (!f) return;
    setBusy("Učitavam sliku…");
    try {
      const { url } = await uploadImage(f, "news", 1800);
      set({ cover_url: url });
    } catch (e) {
      setErr((e as Error).message);
    }
    setBusy("");
  }

  return (
    <section className="ad-form">
      <div className="ad-head">
        <h1>{n.id ? "Uredi vijest" : "Nova vijest"}</h1>
        <button className="ad-link" onClick={onDone}>← Natrag</button>
      </div>
      <label>Naslov
        <input value={n.title} onChange={(e) => set({ title: e.target.value, ...(slugTouched ? {} : { slug: slugify(e.target.value) }) })} />
      </label>
      <div className="ad-row">
        <label>Adresa (URL)
          <input value={n.slug} onChange={(e) => { setSlugTouched(true); set({ slug: slugify(e.target.value) }); }} />
          <small>/novosti/{n.slug || "…"}</small>
        </label>
        <label>Datum
          <input type="date" value={n.published_at} onChange={(e) => set({ published_at: e.target.value })} />
        </label>
      </div>
      <label>Kratki opis (prikazuje se na popisu)
        <textarea rows={2} value={n.excerpt} onChange={(e) => set({ excerpt: e.target.value })} />
      </label>
      <label>Naslovna fotografija
        <div className="ad-cover">
          {n.cover_url && <img src={n.cover_url} alt="" />}
          <input type="file" accept="image/*" onChange={(e) => onCover(e.target.files?.[0])} />
        </div>
      </label>
      <label>Tekst
        <textarea rows={18} value={n.body} onChange={(e) => set({ body: e.target.value })} />
        <small>Prazan red = novi odlomak · <code>## Podnaslov</code> · popis: redovi s <code>- </code> ili <code>1. </code> · dokument: <code>[Pravilnik (PDF)](https://…)</code></small>
      </label>
      {err && <p className="ad-err">{err}</p>}
      <div className="ad-actions">
        {n.published ? (
          <>
            <button className="ad-btn" disabled={!!busy} onClick={() => save()}>Spremi</button>
            <button className="ad-btn ad-ghost" disabled={!!busy} onClick={() => save(false)}>Povuci s weba</button>
          </>
        ) : (
          <>
            <button className="ad-btn" disabled={!!busy} onClick={() => save(true)}>Objavi</button>
            <button className="ad-btn ad-ghost" disabled={!!busy} onClick={() => save(false)}>Spremi kao skicu</button>
          </>
        )}
        {n.id && <button className="ad-link ad-danger" onClick={remove}>Obriši</button>}
        {busy && <span className="ad-busy">{busy}</span>}
      </div>
      <p className="ad-note">Promjene se na webu vide unutar jedne minute.</p>
    </section>
  );
}
