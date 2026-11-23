import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import "./fantasy-theme.css";

export const metadata: Metadata = {
  title: "SYGEC-IA • OMNIA — Gestion CTD, enseignement et accompagnement citoyen.",
  description: "OMNIA oriente les visiteurs vers la gestion CTD avec MIORA, l’enseignement avec FELIX et les demandes d’actes d’état civil avec MIA.",
  applicationName: "OMNIA"
};
export const viewport: Viewport = { themeColor: "#080b20", width: "device-width", initialScale: 1 };
export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <html lang="fr"><body>{children}</body></html>;
}