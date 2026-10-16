import type { Metadata } from "next";
import Link from "next/link";
import { Page, Section, Head, Facts, Prose, Cta } from "@/components/Content";

export const metadata: Metadata = { title: "Brzinske utrke | Utrke", description: "Kup Slobodne Dalmacije u Opuzenu, utrke za izbor startnih pozicija na Maratonu lađa." };

export default function BrzinskeUtrke() {
  return (
    <Page title="Brzinske utrke" lead="Kup Slobodne Dalmacije u Opuzenu: utrke za izbor startnih pozicija na Maratonu lađa." crumbs={[{ label: "Utrke" }, { label: "Brzinske utrke" }]} hero="brzinske-utrke">
      <Section>
        <Head label="Kup Slobodne Dalmacije" title="Kratke, eksplozivne dionice" />
        <Facts
          items={[
            { label: "Format", value: "Sprint", text: "Kratke dionice na kojima o pobjedniku odlučuju stotinke sekunde." },
            { label: "Mjesto", value: "Opuzen", text: "Nekoliko dana prije glavne utrke, s početkom u 18:00 sati." },
            { label: "Svrha", value: "Startna pozicija", text: "Plasman na sprintu određuje redoslijed biranja startnih pozicija za Maraton lađa." },
          ]}
        />
      </Section>
      <Section alt>
        <Head title="Zašto se voze" />
        <Prose>
          <p>
            Brzinske utrke prethode glavnoj utrci i služe za raspodjelu startnih pozicija: bolji plasman na sprintu znači bolju poziciju na startu u Metkoviću.
            Program prate sveta misa za lađare i lađarice, dodjela nagrada i prstena te dron light show iznad rijeke.
          </p>
          <p>
            2026. godine najbrži je bio UL Crni put Metković s vremenom 1:23,926. Cijeli poredak pročitaj u <Link href="/novosti/ul-crni-put-najbrzi-na-brzinskim-utrkama-u-opuzenu">vijesti s utrke</Link>.
          </p>
        </Prose>
      </Section>
      <Cta title="Pravila kvalifikacija" text="Pravila brzinskih utrka dio su službenog pravilnika Maratona." href="/utrke/pravilnik-i-prijave" label="Pravilnik" />
    </Page>
  );
}
