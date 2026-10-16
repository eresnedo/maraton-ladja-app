import type { Metadata } from "next";
import { Page, Section, Head, Prose, Quote, Cta } from "@/components/Content";

export const metadata: Metadata = { title: "Povijest lađarstva | O nama", description: "Lađe i lađari doline Neretve kroz stoljeća." };

export default function Povijest() {
  return (
    <Page title="Povijest lađarstva" lead="Lađe i lađari doline Neretve kroz stoljeća." crumbs={[{ label: "O nama" }, { label: "Povijest lađarstva" }]} hero="povijest">
      <Section>
        <Head title="Stoljeća uz rijeku" />
        <Prose>
          <p>
            Lađa (teretni čamac) i trupa (manje plovilo) stoljećima su bile nezaobilazne u životu stanovnika Neretve: služile su za prijevoz tereta i ljudi te bile ključni put
            komunikacije.
          </p>
        </Prose>
        <Quote>U lađi se rađalo i umiralo.</Quote>
      </Section>
      <Section alt>
        <Head title="Kroz povijesne izvore" />
        <Prose>
          <h3>17. stoljeće</h3>
          <p>
            Najraniji zapisi pojavljuju se u mletačkim izvorima i u „Kronici fra Pavla Šilobadovića o gusarenju na Primorju (1662.–1686.)”. Mletački dokumenti ove čamce nazivaju
            „čopula”, opisujući veća plovila koja su nosila oko šest osoba.
          </p>
          <h3>18. stoljeće</h3>
          <p>
            Talijanski putopisac Alberto Fortis u djelu „Viaggio in Dalmazia” (1774.) zabilježio je da su stanovnici Neretve koristili mala, laka plovila bez jasno razdvojenog pramca i
            krme, pokretana dugim veslima, s veslačima koji su sjedili.
          </p>
          <h3>19. stoljeće</h3>
          <p>
            Francesco Lanza u medicinsko-prirodoslovnom djelu iz 1842. detaljno opisuje gradnju lađa: jednostavna drvena plovila bez palube i balasta, građena za plovidbu plitkim
            močvarnim područjima.
          </p>
          <h3>Moderno doba</h3>
          <p>
            Do kraja 20. stoljeća ceste i motorizirani prijevoz istisnuli su tradicionalne lađe. Prvi organizirani Maraton lađa 1998. godine, s osamnaest posada, ponovno je oživio
            interes za obnovu i očuvanje ovih plovila.
          </p>
        </Prose>
      </Section>
      <Cta title="Otkrij kako je sve počelo" text="Priča o prvom Maratonu lađa 1998. godine." href="/o-nama/kako-je-pocelo" label="Kako je počelo" />
    </Page>
  );
}
