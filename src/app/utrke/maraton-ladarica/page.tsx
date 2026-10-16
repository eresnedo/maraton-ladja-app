import type { Metadata } from "next";
import Link from "next/link";
import { Page, Section, Head, Facts, Prose, Quote, Cta } from "@/components/Content";

export const metadata: Metadata = { title: "Maraton lađarica | Utrke", description: "Utrka ženskih lađarskih posada, Metković – Opuzen." };

export default function MaratonLadarica() {
  return (
    <Page title="Maraton lađarica" lead="Utrka ženskih lađarskih posada na dionici Metković – Opuzen." crumbs={[{ label: "Utrke" }, { label: "Maraton lađarica" }]} hero="maraton-ladarica">
      <Section>
        <Head label="Ženska snaga na rijeci" title="Metković – Opuzen" />
        <Facts
          items={[
            { label: "Ruta", value: "Metković – Opuzen", text: "Kraća, jednako zahtjevna dionica glavne rute." },
            { label: "2026. pobjednice", value: "UL Sisak", text: "13. izdanje dobile su lađarice iz Siska, u vremenu 58:09." },
            { label: "Rekord staze", value: "50:33", text: "Donjanke Donje, 2020. godine." },
          ]}
        />
      </Section>
      <Section alt>
        <Head title="O utrci" />
        <Prose>
          <p>
            Maraton lađarica dio je istog kolovoškog programa kao i glavni Maraton lađa. Utrka okuplja ženske posade iz cijele Hrvatske i regije; 2026. godine prijavljeno je 17 ekipa,
            među njima i nekoliko debitantskih. Cijeli poredak 13. izdanja pročitaj u <Link href="/novosti/ladarice-siska-slavile-na-13-maratonu-ladarica">vijesti s utrke</Link>.
          </p>
        </Prose>
        <Quote>Ista rijeka, isti ritam bubnja.</Quote>
      </Section>
      <Cta title="Želiš prijaviti posadu?" text="Javi se udruzi za uvjete i rokove prijave." href="/kontakt" label="Kontakt" />
    </Page>
  );
}
