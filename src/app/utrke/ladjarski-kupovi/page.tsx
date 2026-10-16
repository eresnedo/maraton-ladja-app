import type { Metadata } from "next";
import { Page, Section, Head, Rows, Prose, Note, Cta } from "@/components/Content";

export const metadata: Metadata = { title: "Lađarski kupovi | Utrke", description: "Sezona lađarskih kupova diljem Hrvatske, priprema za Maraton lađa." };

const KUPOVI = [
  { title: "Lađarski kup Općine Slivno", right: "Slivno · 30. 5. 2026." },
  { title: "Lađarski kup Grada Lipika", right: "Lipik · 30. 5. 2026." },
  { title: "Lađarski kup Sv. Kvirina", right: "Sisak · 6. 6. 2026." },
  { title: "Lađarski kup Grada Slavonskog Broda", right: "Slavonski Brod · 20. 6. 2026." },
  { title: "Lađarski kup Sv. Ante", right: "Komin · 20. 6. 2026." },
  { title: "Lađarski kup kneza Domagoja", right: "Vid · 21. 6. 2026." },
  { title: "Lađarski kup Borovik", right: "Đakovo · 27. 6. 2026." },
  { title: "Lađarski kup župe Bagalovići", right: "Krvavac · 11. 7. 2026." },
  { title: "Lađarski kup Sv. Ilije", right: "Metković · 19. 7. 2026." },
];

export default function LadjarskiKupovi() {
  return (
    <Page title="Lađarski kupovi" lead="Sezona kupova diljem Hrvatske, priprema za Maraton lađa." crumbs={[{ label: "Utrke" }, { label: "Lađarski kupovi" }]} hero="ladjarski-kupovi">
      <Section>
        <Head label="Sezona 2026." title="Kalendar kupova" sub="Devet kupova prije glavne utrke." />
        <Rows items={KUPOVI} />
        <Note>Kalendar za 2027. objavit ćemo čim udruga potvrdi termine.</Note>
      </Section>
      <Section alt>
        <Prose>
          <p>
            Lađarski kupovi održavaju se diljem Hrvatske tijekom proljeća i ljeta i okupljaju posade iz mjesta uz Neretvu i šire. Služe kao priprema i provjera forme uoči glavnog događaja,
            Maratona lađa u kolovozu.
          </p>
        </Prose>
      </Section>
      <Cta title="Organiziraš kup u svom mjestu?" text="Javi se udruzi da ga uvrstimo u kalendar." href="/kontakt" label="Kontakt" />
    </Page>
  );
}
