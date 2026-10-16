import type { Metadata } from "next";
import { Page, Section, Head, Facts, Prose, Cta } from "@/components/Content";

export const metadata: Metadata = { title: "Udruga lađara Neretve | O nama", description: "Udruga lađara Neretve, organizator Maratona lađa." };

export default function Udruga() {
  return (
    <Page title="Udruga lađara Neretve" lead="Organizator Maratona lađa." crumbs={[{ label: "O nama" }, { label: "Udruga lađara Neretve" }]} hero="o-nama">
      <Section>
        <Head title="Tko smo" />
        <Prose>
          <p>
            Udruga lađara Neretve organizira Maraton lađa, utrku tradicionalnim neretvanskim lađama od Metkovića do Ploča, te prateće događaje: Maraton lađarica, brzinske utrke i
            sezonu lađarskih kupova. Udruga promiče tradicijsku kulturu i baštinu doline Neretve, uključujući ekološke inicijative poput programa „Maraton bez plastike”.
          </p>
        </Prose>
      </Section>
      <Section alt>
        <Head title="Tijela udruge" />
        <Facts
          items={[
            { label: "Predsjednik", value: "Luka Oršulić", text: <a href="tel:+385913456300">+385 91 345 6300</a> },
            { label: "Tajnik", value: "Luka Liković", text: <a href="tel:+385913077756">+385 91 307 7756</a> },
            { label: "Poslovna tajnica", value: "Ivana Krstičević", text: <a href="tel:+385976533230">+385 97 653 3230</a> },
          ]}
        />
      </Section>
      <Section>
        <Head title="Podaci o udruzi" />
        <Facts
          cols={4}
          items={[
            { label: "Adresa", value: "Ivana Gundulića 4", text: "20350 Metković, Hrvatska" },
            { label: "OIB", value: "48309934764", text: "Matični broj: 01499355" },
            { label: "IBAN", value: "HR34 2390 0011 1014 3319 2", text: "HPB" },
            { label: "E-mail", value: "Opći upiti", text: <a href="mailto:udruga-ladjara@maraton-ladja.hr">udruga-ladjara@maraton-ladja.hr</a> },
          ]}
        />
      </Section>
      <Cta title="Imaš pitanje za udrugu?" text="Javi nam se izravno." href="/kontakt" label="Kontakt" />
    </Page>
  );
}
