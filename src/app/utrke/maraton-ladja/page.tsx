import type { Metadata } from "next";
import Link from "next/link";
import { Page, Section, Head, Facts, Prose, Quote, Cta } from "@/components/Content";

export const metadata: Metadata = { title: "Maraton lađa | Utrke", description: "22,5 kilometara tradicionalnim neretvanskim lađama, od Metkovića do Ploča." };

export default function MaratonLadja() {
  return (
    <Page title="Maraton lađa" lead="22,5 kilometara tradicionalnim neretvanskim lađama, od Metkovića do Ploča." crumbs={[{ label: "Utrke" }, { label: "Maraton lađa" }]} hero="maraton-ladja">
      <Section>
        <Head label="Glavna utrka" title="22,58 km nizvodno" />
        <Facts
          cols={4}
          items={[
            { label: "Ruta", value: "22,58 km", text: "Metković → Opuzen → Ploče, nizvodno Neretvom i kanalima do cilja u Pločama." },
            { label: "Start", value: "17:00", text: "Ekipe kreću iz Metkovića, ispod mosta, uz ispraćaj tisuća gledatelja s obale." },
            { label: "Posada", value: "10 + 2", text: "Deset veslača, bubnjar koji drži ritam i parićar koji upravlja lađom." },
            { label: "Izdanje", value: "30.", text: "Jubilarno, 30. izdanje vozi se u kolovozu 2027. godine." },
          ]}
        />
      </Section>
      <Section alt>
        <Head title="Tijek utrke" />
        <Prose>
          <p>
            Utrka kreće iz Metkovića i vodi nizvodno prema Opuzenu, jedinom mjestu gdje je dopuštena zamjena do šest veslača, pa dalje kroz Komin i Banju do cilja u Pločama.
            Cijelu rutu, postaju po postaju, možeš pogledati na <Link href="/#ruta">karti na naslovnici</Link>.
          </p>
        </Prose>
        <Quote>Deset vesala, jedan ritam bubnja i rijeka koja na jedan dan postane stadion.</Quote>
        <Prose>
          <p>
            Prije glavne utrke održavaju se <b>brzinske utrke</b> u Opuzenu (Kup Slobodne Dalmacije) koje određuju startne pozicije, te niz <b>lađarskih kupova</b> diljem Hrvatske tijekom sezone.
            Na 29. Maratonu lađa 2026. godine prvo mjesto podijelile su posade UL Crni put i UL Gusar Komin.
          </p>
        </Prose>
      </Section>
      <Cta title="Svi rezultati od 1998." text="Službeni poredak svakog izdanja Maratona lađa." href="/rezultati/poredak-po-godinama" label="Rezultati" />
    </Page>
  );
}
