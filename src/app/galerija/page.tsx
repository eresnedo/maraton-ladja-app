import type { Metadata } from "next";
import { Page, Section, Head, Prose, Note } from "@/components/Content";
import "./galerija.css";

export const metadata: Metadata = { title: "Galerija | Maraton lađa", description: "Fotografije i snimke s Maratona lađa." };

// TODO: kad se spoji Supabase, albumi dolaze iz tablica gallery_albums / gallery_photos.
const ALBUMS = [
  { title: "29. Maraton lađa", year: "2026.", img: "https://maraton-ladja.hr/images/770067796_18110548478287565_831642774667007538_n-1-scaled.jpg" },
  { title: "13. Maraton lađarica", year: "2026.", img: "https://maraton-ladja.hr/images/13-Maraton-ladarica-pobjednice-UL-Sisak.jpg" },
  { title: "Večer tradicije", year: "2025.", img: "https://maraton-ladja.hr/images/2025/08/19/vecer_tradicije_2025_0032.jpg" },
  { title: "28. Maraton lađa", year: "2025.", img: "https://maraton-ladja.hr/images/2025/08/10/28_maraton_0031.jpg" },
  { title: "Brzinske utrke", year: "2025.", img: "https://maraton-ladja.hr/images/brzinske_utrke_2025_-_0673_copy_Large.jpeg" },
  { title: "27. Maraton lađa", year: "2024.", img: "https://maraton-ladja.hr/images/2024/08/14/27_maraton_ladja_2024_0026.jpg" },
  { title: "Svetojanske svečanosti NAVALIS", year: "Prag, 2022.", img: "https://maraton-ladja.hr/images/ladjari_web.jpg" },
  { title: "Arhivske fotografije", year: "1998. – danas", img: "https://maraton-ladja.hr/images/2022/udruga_ladjara_neretve_o_nama.jpg" },
];

export default function Galerija() {
  return (
    <Page title="Galerija" lead="Fotografije i snimke s rijeke." crumbs={[{ label: "Galerija" }]} hero="galerija">
      <Section>
        <Head label="Albumi" title="Od 1998. do danas" />
        <ul className="g-grid">
          {ALBUMS.map((a) => (
            <li key={a.title}>
              <div className="g-img">
                <img src={a.img} alt={a.title} loading="lazy" />
              </div>
              <b>{a.title}</b>
              <span>{a.year}</span>
            </li>
          ))}
        </ul>
        <Note>Cijeli albumi s fotografijama dolaze uskoro. Do tada su fotografije dostupne na službenim društvenim mrežama.</Note>
      </Section>
      <Section alt>
        <Head title="Video i društvene mreže" />
        <Prose>
          <p>Snimke utrka i drugih događanja dostupne su na službenim kanalima udruge.</p>
        </Prose>
        <div className="g-links">
          <a className="c-file" href="https://www.youtube.com/channel/UCHXQoo10tUMeSctWJtm70gQ" target="_blank" rel="noopener noreferrer">YouTube</a>
          <a className="c-file" href="https://www.facebook.com/maraton.ladja" target="_blank" rel="noopener noreferrer">Facebook</a>
          <a className="c-file" href="https://www.instagram.com/maratonlada/" target="_blank" rel="noopener noreferrer">Instagram</a>
        </div>
      </Section>
    </Page>
  );
}
