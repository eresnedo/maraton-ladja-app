import type { Metadata } from "next";
import "./globals.css";
import { SITE_URL } from "@/lib/site";

const DESC = "Službena stranica Maratona lađa. 22,5 km tradicionalnim neretvanskim lađama od Metkovića do Ploča.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Maraton lađa",
  description: DESC,
  openGraph: {
    type: "website",
    locale: "hr_HR",
    siteName: "Maraton lađa",
    title: "Maraton lađa",
    description: DESC,
    images: [{ url: "/images/ruta-karta.jpg", width: 1920, height: 578, alt: "Ruta Maratona lađa, Metković – Ploče" }],
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hr" className="js">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
