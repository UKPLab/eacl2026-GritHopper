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
  title: "GRITHopper: Decomposition-Free Multi-Hop Dense Retrieval",
  description: "GRITHopper-7B achieves state-of-the-art performance on multi-hop dense retrieval benchmarks. EACL 2026.",
  keywords: ["multi-hop retrieval", "dense retrieval", "NLP", "information retrieval", "GRITHopper"],
  authors: [
    { name: "Justus-Jonas Erker" },
    { name: "Nils Reimers" },
    { name: "Iryna Gurevych" },
  ],
  openGraph: {
    title: "GRITHopper: Decomposition-Free Multi-Hop Dense Retrieval",
    description: "State-of-the-art multi-hop dense retrieval model. EACL 2026.",
    type: "website",
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
