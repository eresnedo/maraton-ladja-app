"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import NewsAdmin from "./NewsAdmin";
import GalleryAdmin from "./GalleryAdmin";

export default function AdminPage() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [tab, setTab] = useState<"news" | "gallery">("news");

  useEffect(() => {
    if (!supabase) return setSession(null);
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);

  if (!supabase)
    return (
      <main className="ad-box">
        <h1>Administracija</h1>
        <p className="ad-err">Baza nije spojena: u Vercelu nedostaju NEXT_PUBLIC_SUPABASE_URL i NEXT_PUBLIC_SUPABASE_ANON_KEY.</p>
      </main>
    );
  if (session === undefined) return <main className="ad-box"><p>Učitavanje…</p></main>;
  if (!session) return <Login />;

  return (
    <>
      <header className="ad-top">
        <Link href="/" className="ad-brand">Maraton lađa · Admin</Link>
        <nav>
          <button className={tab === "news" ? "on" : ""} onClick={() => setTab("news")}>Novosti</button>
          <button className={tab === "gallery" ? "on" : ""} onClick={() => setTab("gallery")}>Galerija</button>
        </nav>
        <span className="ad-user">{session.user.email}</span>
        <button className="ad-link" onClick={() => supabase!.auth.signOut()}>Odjava</button>
      </header>
      <main className="ad-main">{tab === "news" ? <NewsAdmin /> : <GalleryAdmin />}</main>
    </>
  );
}

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <main className="ad-box">
      <h1>Administracija</h1>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          setErr("");
          const { error } = await supabase!.auth.signInWithPassword({ email, password });
          if (error) setErr(error.message === "Invalid login credentials" ? "Pogrešan email ili lozinka." : error.message);
          setBusy(false);
        }}
      >
        <label>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="username" /></label>
        <label>Lozinka<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" /></label>
        {err && <p className="ad-err">{err}</p>}
        <button className="ad-btn" disabled={busy}>{busy ? "Prijava…" : "Prijava"}</button>
      </form>
    </main>
  );
}
