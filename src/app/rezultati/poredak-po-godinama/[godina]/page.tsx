import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EditionTable from "../../EditionTable";
import { EDITIONS, byYear } from "@/lib/results";

export const dynamicParams = false;

export function generateStaticParams() {
  return EDITIONS.map((e) => ({ godina: String(e.year) }));
}

export async function generateMetadata({ params }: { params: Promise<{ godina: string }> }): Promise<Metadata> {
  const { godina } = await params;
  const e = byYear(Number(godina));
  return { title: e ? `${e.n}. Maraton lađa ${e.year}. – rezultati | Maraton lađa` : "Rezultati | Maraton lađa" };
}

export default async function GodinaPage({ params }: { params: Promise<{ godina: string }> }) {
  const { godina } = await params;
  const e = byYear(Number(godina));
  if (!e) notFound();
  return <EditionTable edition={e} />;
}
