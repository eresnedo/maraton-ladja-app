import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Page, Section } from "@/components/Content";
import { getAlbum, getAlbums } from "@/lib/content";
import AlbumGrid from "./AlbumGrid";
import "../galerija.css";

export const revalidate = 60;

export async function generateStaticParams() {
  return (await getAlbums()).filter((a) => a.count > 0).map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const a = await getAlbum((await params).slug);
  if (!a) return {};
  return { title: `${a.title} | Galerija | Maraton lađa`, openGraph: { title: a.title, images: a.cover ? [a.cover] : [] } };
}

export default async function AlbumPage({ params }: { params: Promise<{ slug: string }> }) {
  const a = await getAlbum((await params).slug);
  if (!a || a.photos.length === 0) notFound();
  return (
    <Page title={a.title} lead={`${a.year} · ${a.photos.length} fotografija`} crumbs={[{ label: "Galerija", href: "/galerija" }, { label: a.title }]} hero="galerija">
      <Section>
        <AlbumGrid photos={a.photos} title={a.title} />
      </Section>
    </Page>
  );
}
