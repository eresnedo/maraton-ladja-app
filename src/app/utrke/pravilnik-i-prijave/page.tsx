import type { Metadata } from "next";
import { Page, Section, Head, Facts, Prose, Cta } from "@/components/Content";

export const metadata: Metadata = { title: "Pravilnik i prijave | Utrke", description: "Službeni pravilnik Maratona lađa i prijava posade." };

export default function Pravilnik() {
  return (
    <Page title="Pravilnik i prijave" lead="Uvjeti natjecanja i prijava ekipe." crumbs={[{ label: "Utrke" }, { label: "Pravilnik i prijave" }]} hero="pravilnik-i-prijave">
      <Section>
        <Head label="Službeni pravilnik" title="Pravilnik 29. Maratona lađa" sub="Objavljen 31. srpnja 2026." />
        <Prose>
          <p>
            Prije svakog izdanja udruga objavljuje službeni pravilnik koji uređuje sastav posade, dopuštene zamjene veslača, opremu lađa i tijek natjecanja. Molimo sve lađare da se
            prije natjecanja upoznaju s njegovim sadržajem i izmjenama u odnosu na prethodne godine.
          </p>
        </Prose>
        <a className="c-file" href="/dokumenti/pravilnik-29-maratona-ladja-2026.pdf" target="_blank" rel="noopener">
          Preuzmi pravilnik 29. Maratona lađa <small>PDF · 328 KB</small>
        </a>
      </Section>
      <Section alt>
        <Head title="Prijava posade" />
        <Facts
          cols={2}
          items={[
            { label: "Prijave i pravilnik", value: "Luka Liković", text: <>Tajnik udruge · <a href="tel:+385913077756">+385 91 307 7756</a></> },
            { label: "Opći upiti", value: "E-mail", text: <><a href="mailto:udruga-ladjara@maraton-ladja.hr">udruga-ladjara@maraton-ladja.hr</a><br />Udruga lađara Neretve, Ivana Gundulića 4, Metković</> },
          ]}
        />
      </Section>
      <Cta title="Spreman za prijavu?" text="Pošalji upit i udruga će ti poslati sve potrebne obrasce." href="/kontakt" label="Kontakt" />
    </Page>
  );
}
