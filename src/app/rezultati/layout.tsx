import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ResultsTabs from "./ResultsTabs";
import "./results.css";

export default function RezultatiLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <section className="x-phero">
        <div className="x-wrap">
          <p className="x-crumb">
            <Link href="/">Naslovnica</Link> / Rezultati
          </p>
          <h1 className="x-display">Rezultati</h1>
          <p>Službeni poredak svih Maratona lađa od 1998. godine.</p>
        </div>
      </section>
      <ResultsTabs />
      <main className="r-main">{children}</main>
      <Footer />
    </>
  );
}
