import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Kontakt | Maraton lađa",
  description: "Udruga lađara Neretve — kontakt, adresa i upiti za Maraton lađa.",
};

const OFFICIALS = [
  { role: "Predsjednik", name: "Luka Oršulić", phone: "+385913456300", display: "+385 91 345 6300" },
  { role: "Tajnik", name: "Luka Liković", phone: "+385913077756", display: "+385 91 307 7756" },
  { role: "Poslovna tajnica", name: "Ivana Krstičević", phone: "+385976533230", display: "+385 97 653 3230" },
];

export default function KontaktPage() {
  return (
    <>
      <Header />
      <section className="x-phero">
        <div className="x-wrap">
          <p className="x-crumb">
            <a href="/">Naslovnica</a> / Kontakt
          </p>
          <h1 className="x-display">Kontakt</h1>
          <p>Pitanja o prijavama, gostovanju na rijeci ili suradnji — udruga odgovara na svaki upit.</p>
        </div>
      </section>

      <section className="bg-white py-26">
        <div className="x-wrap">
          <div className="grid grid-cols-1 md:grid-cols-4 border-t border-ink/10">
            <div className="py-8 pr-7 border-b md:border-r border-ink/10">
              <b className="block text-[.78rem] tracking-[.16em] uppercase text-red font-800 mb-4">Udruga</b>
              <div className="font-700 text-xl uppercase tracking-tight mb-2">Udruga lađara Neretve</div>
              <span className="block text-ink/60 text-sm">Ivana Gundulića 4</span>
              <span className="block text-ink/60 text-sm mb-1">20350 Metković, Hrvatska</span>
              <a href="mailto:udruga-ladjara@maraton-ladja.hr" className="text-ink/60 text-sm hover:text-red">
                udruga-ladjara@maraton-ladja.hr
              </a>
            </div>
            {OFFICIALS.map((o) => (
              <div key={o.name} className="py-8 pr-7 border-b md:border-r last:border-r-0 border-ink/10">
                <b className="block text-[.78rem] tracking-[.16em] uppercase text-red font-800 mb-4">{o.role}</b>
                <div className="font-700 text-xl uppercase tracking-tight mb-2">{o.name}</div>
                <a href={`tel:${o.phone}`} className="text-ink/90 text-sm" style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontWeight: 600 }}>
                  {o.display}
                </a>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 mt-12">
            <a href="https://www.facebook.com/maraton.ladja" target="_blank" rel="noopener" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-ink/15 text-sm font-700 uppercase hover:border-red hover:text-red transition-colors">
              Facebook
            </a>
            <a href="https://www.instagram.com/maratonlada/" target="_blank" rel="noopener" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-ink/15 text-sm font-700 uppercase hover:border-red hover:text-red transition-colors">
              Instagram
            </a>
            <a href="https://www.youtube.com/channel/UCHXQoo10tUMeSctWJtm70gQ" target="_blank" rel="noopener" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-ink/15 text-sm font-700 uppercase hover:border-red hover:text-red transition-colors">
              YouTube
            </a>
          </div>
        </div>
      </section>

      <section className="py-28" style={{ background: "linear-gradient(200deg, var(--navy) 0%, var(--navy2) 100%)", color: "#fff" }}>
        <div className="x-wrap grid gap-14 md:grid-cols-2">
          <div>
            <p className="x-tag mb-4">Pošalji upit</p>
            <h2 className="x-display mb-9" style={{ fontSize: "clamp(2rem,4.4vw,3.2rem)" }}>
              Javi nam se izravno.
            </h2>
            <ContactForm />
          </div>
          <div className="rounded-2xl overflow-hidden shadow-2xl">
            <iframe
              src="https://maps.google.com/maps?q=Ivana%20Gundulića%204%2C%2020350%20Metković&z=15&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Karta: Ivana Gundulića 4, Metković"
              className="w-full h-80 border-0"
              style={{ filter: "grayscale(.25) contrast(1.05)" }}
            />
            <div className="p-7" style={{ background: "var(--navy2)", borderTop: "3px solid var(--red)" }}>
              <b className="block font-700 text-xl uppercase tracking-tight mb-1">Udruga lađara Neretve</b>
              <span className="block text-white/55 text-sm mb-4">Ivana Gundulića 4, 20350 Metković</span>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Ivana+Gundulića+4,+20350+Metković"
                target="_blank"
                rel="noopener"
                className="text-red text-sm font-700 uppercase"
              >
                Otvori u Google kartama →
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
