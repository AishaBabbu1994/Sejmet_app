import type { Metadata } from "next";
import { Fraunces, Inter, Reem_Kufi, Noto_Naskh_Arabic } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-fraunces",
});
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});
const reemKufi = Reem_Kufi({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-reem",
});
const notoNaskh = Noto_Naskh_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "700"],
  variable: "--font-naskh",
});

export const metadata: Metadata = {
  title: "Qalam — Teclado árabe con transliteración por IA",
  description:
    "Escribe en árabe desde cualquier teclado. Transliteración fonética asistida por IA, teclado virtual y traducción, todo en tu navegador.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${fraunces.variable} ${inter.variable} ${reemKufi.variable} ${notoNaskh.variable}`}>
      <body className="bg-ink text-parchment font-body antialiased">{children}</body>
    </html>
  );
}
