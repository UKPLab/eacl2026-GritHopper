import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ukplab.github.io"),
  title: "GRITHopper: Decomposition-Free Multi-Hop Dense Retrieval",
  description:
    "GRITHopper-7B achieves state-of-the-art performance on multi-hop dense retrieval benchmarks without query decomposition. Accepted at EACL 2026 Main Conference. By UKP Lab, TU Darmstadt & Cohere.",
  keywords: [
    "GRITHopper",
    "multi-hop retrieval",
    "multi-hop dense retrieval",
    "dense retrieval",
    "NLP",
    "natural language processing",
    "information retrieval",
    "question answering",
    "query decomposition",
    "GRIT",
    "EACL 2026",
    "UKP Lab",
    "TU Darmstadt",
    "Cohere",
    "Justus-Jonas Erker",
    "Nils Reimers",
    "Iryna Gurevych",
    "HotpotQA",
    "MuSiQue",
    "2WikiMultiHopQA",
  ],
  authors: [
    { name: "Justus-Jonas Erker", url: "https://erker.ai" },
    { name: "Nils Reimers", url: "https://nils-reimers.de" },
    { name: "Iryna Gurevych" },
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: "/eacl2026-GritHopper/",
  },
  verification: {
    google: "jWN1CPnojGY7LpC87u9nvJPHTomFiW968CXEjLZwoZ4",
  },
  openGraph: {
    title: "GRITHopper: Decomposition-Free Multi-Hop Dense Retrieval",
    description:
      "State-of-the-art multi-hop dense retrieval without query decomposition. Accepted at EACL 2026. Code, model & paper available.",
    type: "website",
    url: "https://ukplab.github.io/eacl2026-GritHopper/",
    siteName: "GRITHopper",
    locale: "en_US",
    images: [
      {
        url: "/eacl2026-GritHopper/logos/grithopper-logo.jpeg",
        width: 200,
        height: 200,
        alt: "GRITHopper Logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "GRITHopper: Decomposition-Free Multi-Hop Dense Retrieval",
    description:
      "State-of-the-art multi-hop dense retrieval without query decomposition. EACL 2026.",
    images: ["/eacl2026-GritHopper/logos/grithopper-logo.jpeg"],
  },
  // Google Scholar / academic citation metadata
  other: {
    "citation_title": "GRITHopper: Decomposition-Free Multi-Hop Dense Retrieval",
    "citation_author": [
      "Erker, Justus-Jonas",
      "Reimers, Nils",
      "Gurevych, Iryna",
    ],
    "citation_publication_date": "2026",
    "citation_conference_title":
      "Proceedings of the 2026 Conference of the European Chapter of the Association for Computational Linguistics (EACL)",
    "citation_arxiv_id": "2503.07519",
    "citation_pdf_url": "https://arxiv.org/pdf/2503.07519.pdf",
    "citation_abstract_html_url": "https://arxiv.org/abs/2503.07519",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
