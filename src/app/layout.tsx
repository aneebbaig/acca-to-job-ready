import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Serif, IBM_Plex_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

// The Plex superfamily: Serif for display (restraint), Sans for body (not the
// Inter/Roboto default), Mono for all figures (accounting is numbers).
const plexSans = IBM_Plex_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});
const plexSerif = IBM_Plex_Serif({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});
const plexMono = IBM_Plex_Mono({
  variable: "--font-mono-plex",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "ACCA → Job-Ready",
    template: "%s · ACCA → Job-Ready",
  },
  description:
    "A clear roadmap, real practice, and honest progress tracking for ACCA affiliates building toward their first job.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plexSans.variable} ${plexSerif.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
