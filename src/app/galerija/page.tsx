import type { Metadata } from "next";
import Link from "next/link";
import { Page, Section, Head, Prose, Note } from "@/components/Content";
import { getAlbums } from "@/lib/content";
import "./galerija.css";

export const metadata: Metadata = { title: "Galerija | Maraton lađa", description: "Fotografije i snimke s Maratona lađa." };

export const revalidate = 60;

export default async function Galerija() {
  const albums = await getAlbums();
  const anyPhotos = albums.some((a) => a.count > 0);
  return (
    <Page title="Galerija" lead="Fotografije i snimke s rijeke." crumbs={[{ label: "Galerija" }]} hero="galerija">
      <Section>
        <Head label="Albumi" title="Od 1998. do danas" />
        <ul className="g-grid">
          {albums.map((a) => {
            const inner = (
              <>
                <div className="g-img">{a.cover && <img src={a.cover} alt={a.title} loading="lazy" />}</div>
                <b>{a.title}</b>
                <span>{a.year}{a.count > 0 ? ` · ${a.count} fotografija` : ""}</span>
              </>
            );
            return <li key={a.slug}>{a.count > 0 ? <Link href={`/galerija/${a.slug}`} className="g-link">{inner}</Link> : inner}</li>;
          })}
        </ul>
        {!anyPhotos && <Note>Cijeli albumi s fotografijama dolaze uskoro. Do tada su fotografije dostupne na službenim društvenim mrežama.</Note>}
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
