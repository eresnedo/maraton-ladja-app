import type { Metadata } from "next";
import { Page, Section, Head, Prose, Note, Cta } from "@/components/Content";

export const metadata: Metadata = { title: "Monografija | O nama", description: "25 godina Maratona lađa, online monografija." };

export default function Monografija() {
  return (
    <Page title="Monografija" lead="25 godina Maratona lađa, online izdanje." crumbs={[{ label: "O nama" }, { label: "Monografija" }]} hero="monografija">
      <Section>
        <Head title="25 godina Maratona lađa" />
        <Prose>
          <p>
            Povodom jubileja udruga je objavila online monografiju „25 godina Maratona lađa”, koja dokumentira put ovog događaja od prve utrke 1998. do danas.
          </p>
        </Prose>
        <a className="c-file" href="https://maraton-ladja.hr/monografija-25-godina-maratona-ladja" target="_blank" rel="noopener">
          Otvori monografiju <small>maraton-ladja.hr</small>
        </a>
        <Note>Monografija je zasad na starom webu. Prije prebacivanja domene treba je preseliti ovamo.</Note>
      </Section>
      <Cta title="Zanima te povijest?" text="Pročitaj priču o nastanku Maratona i povijest lađarstva." href="/o-nama/kako-je-pocelo" label="Kako je počelo" />
    </Page>
  );
}
