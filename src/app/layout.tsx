import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";
import { FavoritesProvider } from "@/components/FavoritesProvider";
import { AuthProvider } from "@/components/AuthProvider";
import { BottomNav } from "@/components/BottomNav";
import { SideNav } from "@/components/SideNav";

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
        <AuthProvider>
          <FavoritesProvider>
            {/* App shell adaptatif : mobile = colonne + barre du bas, desktop = sidebar web */}
            <div className="mx-auto flex min-h-dvh w-full max-w-[1180px]">
              <SideNav />
              <div className="relative min-w-0 flex-1 bg-blanc/40 max-lg:mx-auto max-lg:w-full max-lg:max-w-[520px] lg:border-x lg:border-line/70 lg:shadow-soft">
                <main className="relative">{children}</main>
              </div>
            </div>
            <BottomNav />
          </FavoritesProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
