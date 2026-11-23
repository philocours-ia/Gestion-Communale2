import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "SYGEC-IA • OMNIA — Gérer, enseigner et rédiger.",
  description: "Un écosystème d'intelligences spécialisées pour la gestion des CTD, l'enseignement, la recherche et la rédaction.",
  applicationName: "OMNIA"
};
export const viewport: Viewport = { themeColor: "#1d1d37", width: "device-width", initialScale: 1 };
export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <html lang="fr"><body>{children}</body></html>;
}