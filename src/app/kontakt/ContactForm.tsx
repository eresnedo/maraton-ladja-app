"use client";

import { useState } from "react";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent("Upit s web stranice — " + name);
    const body = encodeURIComponent(message + "\n\n— " + name + " (" + email + ")");
    window.location.href = `mailto:udruga-ladjara@maraton-ladja.hr?subject=${subject}&body=${body}`;
  }

  const fieldCls = "w-full bg-transparent border-0 border-b border-white/25 text-white text-lg py-2.5 focus:outline-none focus:border-red placeholder:text-white/30";

  return (
    <form onSubmit={onSubmit}>
      <div className="grid gap-5 sm:grid-cols-2 mb-5">
        <div>
          <label className="block text-[.78rem] tracking-[.14em] uppercase text-white/50 mb-2">Ime i prezime</label>
          <input className={fieldCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="Ivan Ivić" required />
        </div>
        <div>
          <label className="block text-[.78rem] tracking-[.14em] uppercase text-white/50 mb-2">E-mail</label>
          <input type="email" className={fieldCls} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ivan@email.com" required />
        </div>
      </div>
      <div className="mb-5">
        <label className="block text-[.78rem] tracking-[.14em] uppercase text-white/50 mb-2">Poruka</label>
        <textarea className={fieldCls + " min-h-26 resize-y"} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Vaš upit…" required />
      </div>
      <button className="x-btn" type="submit">
        <span>Pošalji poruku</span>
      </button>
      <p className="mt-4 text-sm text-white/40">Otvara vaš e-mail klijent s pripremljenom porukom prema udruzi.</p>
    </form>
  );
}
