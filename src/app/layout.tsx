import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";
import { FavoritesProvider } from "@/components/FavoritesProvider";
import { BottomNav } from "@/components/BottomNav";

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const body = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Shaymae — Découvrez les meilleures créatrices beauté autour de vous",
  description:
    "Le Pinterest / TikTok géolocalisé de la beauté. Cils, ongles, coiffure, sourcils, maquillage : inspirez-vous et réservez près de chez vous.",
  applicationName: "Shaymae",
  appleWebApp: { capable: true, title: "Shaymae", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: "#fdfaf6",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${display.variable} ${body.variable} h-full`}>
      <body className="min-h-full">
        <FavoritesProvider>
          {/* App shell : cadre « mobile premium » centré sur desktop */}
          <div className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col bg-blanc/40 shadow-soft">
            <main className="relative flex-1">{children}</main>
            <BottomNav />
          </div>
        </FavoritesProvider>
      </body>
    </html>
  );
}
