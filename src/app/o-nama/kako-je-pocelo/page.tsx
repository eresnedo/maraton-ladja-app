import type { Metadata } from "next";
import { Page, Section, Head, Prose, Quote, Cta } from "@/components/Content";

export const metadata: Metadata = { title: "Kako je počelo | O nama", description: "Priča o nastanku Maratona lađa 1998. godine." };

export default function KakoJePocelo() {
  return (
    <Page title="Kako je počelo" lead="Priča o nastanku Maratona lađa 1998." crumbs={[{ label: "O nama" }, { label: "Kako je počelo" }]} hero="kako-je-pocelo">
      <Section>
        <Head title="Vizija jednog čovjeka" />
        <Prose>
          <p>
            Ideja Maratona lađa nije nastala sama od sebe: proizvod je životnog djela Miljenka „Milojka” Glasovića, čovjeka čija je ljubav prema krajoliku Neretve, izgrađena kroz rad u
            umjetničkom obrazovanju, marketingu i medijima, rodila viziju utrke tradicionalnim lađama. Mnogi su u početku ideju smatrali nemogućom. Tko će veslati dvadesetak kilometara u
            plovilima koja su gotovo izumrla?
          </p>
          <p>
            Njegova upornost pokazala se zaraznom. Okupio je i pokrenuo ekipe iz mjesta diljem doline: Rogotina, Opuzena, Podgradine-Slivna, Ploča, Vidonja, Krvavca i drugih. Svaka je
            skupina iskopala oštećene lađe iz mulja, popravila ih i pripremila za prvo izdanje.
          </p>
        </Prose>
      </Section>
      <Section alt>
        <Head label="13. rujna 1998." title="Dan kada je sve počelo" />
        <Quote>Kakvi smo mi to pomorci ako nam vrijeme smeta?</Quote>
        <Prose>
          <p>
            Kiša je padala cijelo jutro. Unatoč zabrinutosti zbog vremena, svi kapetani posada složili su se: utrka se vozi. Kiša je prestala prije starta. Osamnaest lađa s oko 200
            veslača sudjelovalo je u utrci, a obale je pratilo više od 20.000 gledatelja.
          </p>
          <p>Danas je Maraton lađa prepoznata hrvatska kulturna institucija, a kroz njegovu povijest nastupilo je više od devedeset posada i 4.000 veslača.</p>
        </Prose>
      </Section>
      <Cta title="Želiš znati više?" text="Pročitaj i povijest lađarstva doline Neretve." href="/o-nama/povijest" label="Povijest lađarstva" />
    </Page>
  );
}
