import type { Metadata } from "next";
import EditionTable from "../EditionTable";
import { LATEST } from "@/lib/results";

export const metadata: Metadata = { title: "Poredak po godinama | Maraton lađa" };

export default function PoredakPage() {
  return <EditionTable edition={LATEST} />;
}
