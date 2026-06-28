import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";
import { FavoritesProvider } from "@/components/FavoritesProvider";
import { FollowsProvider } from "@/components/FollowsProvider";
import { AuthProvider } from "@/components/AuthProvider";
import { BookingsProvider } from "@/components/BookingsProvider";
import { MessagesProvider } from "@/components/MessagesProvider";
import { I18nProvider } from "@/components/I18nProvider";
import { BottomNav } from "@/components/BottomNav";
import { SideNav } from "@/components/SideNav";
import { WelcomeGate } from "@/components/WelcomeGate";

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
  title: "Glow — Découvrez les meilleures créatrices beauté autour de vous",
  description:
    "Le Pinterest / TikTok géolocalisé de la beauté. Cils, ongles, coiffure, sourcils, maquillage : inspirez-vous et réservez près de chez vous.",
  applicationName: "Glow",
  appleWebApp: { capable: true, title: "Glow", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: "#2a1c16",
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
        <I18nProvider>
          <AuthProvider>
            <FavoritesProvider>
              <FollowsProvider>
                <BookingsProvider>
                  <MessagesProvider>
                    {/* App shell adaptatif : mobile = colonne + barre du bas, desktop = sidebar web */}
                    <div className="mx-auto flex min-h-dvh w-full max-w-[1180px]">
                      <SideNav />
                      <div className="relative min-w-0 flex-1 bg-blanc/40 max-lg:mx-auto max-lg:w-full max-lg:max-w-[520px] lg:border-x lg:border-line/70 lg:shadow-soft">
                        <main className="relative">{children}</main>
                      </div>
                    </div>
                    <BottomNav />
                    <WelcomeGate />
                  </MessagesProvider>
                </BookingsProvider>
              </FollowsProvider>
            </FavoritesProvider>
          </AuthProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
