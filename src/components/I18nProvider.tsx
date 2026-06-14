"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

export type Lang = "fr" | "en" | "ar" | "es";

export const LANGS: { key: Lang; label: string; flag: string }[] = [
  { key: "fr", label: "Français", flag: "🇫🇷" },
  { key: "en", label: "English", flag: "🇬🇧" },
  { key: "ar", label: "العربية", flag: "🇸🇦" },
  { key: "es", label: "Español", flag: "🇪🇸" },
];

type Dict = Record<string, string>;

const DICT: Record<Lang, Dict> = {
  fr: {
    "nav.feed": "Accueil", "nav.search": "Recherche", "nav.map": "Carte",
    "nav.trends": "Tendances", "nav.inspirations": "Inspirations", "nav.messages": "Messages",
    "nav.appointments": "Rendez-vous", "nav.formations": "Formations", "nav.studio": "Espace pro",
    "nav.subscription": "Abonnement", "nav.account": "Compte",
    "common.findPro": "Trouver une créatrice", "common.signin": "Se connecter",
    "common.signup": "Créer un compte", "common.logout": "Déconnexion",
    "common.book": "Réserver", "common.bookThis": "Réserver cette prestation",
    "common.verified": "Vérifiée", "common.loyal": "Cliente fidèle",
    "common.salon": "Salon", "common.mobile": "Se déplace", "common.from": "Dès",
    "common.near": "Beauté près de vous", "common.message": "Message",
    "lang.label": "Langue",
  },
  en: {
    "nav.feed": "Home", "nav.search": "Search", "nav.map": "Map",
    "nav.trends": "Trends", "nav.inspirations": "Inspirations", "nav.messages": "Messages",
    "nav.appointments": "Bookings", "nav.formations": "Training", "nav.studio": "Pro space",
    "nav.subscription": "Plans", "nav.account": "Account",
    "common.findPro": "Find an artist", "common.signin": "Sign in",
    "common.signup": "Create account", "common.logout": "Log out",
    "common.book": "Book", "common.bookThis": "Book this service",
    "common.verified": "Verified", "common.loyal": "Loyal client",
    "common.salon": "Salon", "common.mobile": "Mobile", "common.from": "From",
    "common.near": "Beauty near you", "common.message": "Message",
    "lang.label": "Language",
  },
  ar: {
    "nav.feed": "الرئيسية", "nav.search": "بحث", "nav.map": "الخريطة",
    "nav.trends": "الرائج", "nav.inspirations": "إلهام", "nav.messages": "الرسائل",
    "nav.appointments": "المواعيد", "nav.formations": "تدريب", "nav.studio": "فضاء المحترفات",
    "nav.subscription": "الاشتراك", "nav.account": "الحساب",
    "common.findPro": "ابحثي عن فنانة", "common.signin": "تسجيل الدخول",
    "common.signup": "إنشاء حساب", "common.logout": "تسجيل الخروج",
    "common.book": "حجز", "common.bookThis": "احجزي هذه الخدمة",
    "common.verified": "موثّقة", "common.loyal": "عميلة وفية",
    "common.salon": "صالون", "common.mobile": "متنقّلة", "common.from": "ابتداءً من",
    "common.near": "الجمال بقربك", "common.message": "رسالة",
    "lang.label": "اللغة",
  },
  es: {
    "nav.feed": "Inicio", "nav.search": "Buscar", "nav.map": "Mapa",
    "nav.trends": "Tendencias", "nav.inspirations": "Inspiración", "nav.messages": "Mensajes",
    "nav.appointments": "Citas", "nav.formations": "Formación", "nav.studio": "Espacio pro",
    "nav.subscription": "Planes", "nav.account": "Cuenta",
    "common.findPro": "Encontrar una artista", "common.signin": "Entrar",
    "common.signup": "Crear cuenta", "common.logout": "Salir",
    "common.book": "Reservar", "common.bookThis": "Reservar este servicio",
    "common.verified": "Verificada", "common.loyal": "Clienta fiel",
    "common.salon": "Salón", "common.mobile": "A domicilio", "common.from": "Desde",
    "common.near": "Belleza cerca de ti", "common.message": "Mensaje",
    "lang.label": "Idioma",
  },
};

interface I18nCtx {
  lang: Lang;
  dir: "ltr" | "rtl";
  setLang: (l: Lang) => void;
  t: (key: string) => string;
}

const Ctx = createContext<I18nCtx | null>(null);
const KEY = "shaymae:lang";

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("fr");

  useEffect(() => {
    try {
      const l = localStorage.getItem(KEY) as Lang | null;
      if (l && DICT[l]) setLangState(l);
    } catch {}
  }, []);

  useEffect(() => {
    const dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.setAttribute("lang", lang);
    document.documentElement.setAttribute("dir", dir);
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    localStorage.setItem(KEY, l);
  }, []);

  const t = useCallback(
    (key: string) => DICT[lang][key] ?? DICT.fr[key] ?? key,
    [lang]
  );

  return (
    <Ctx.Provider value={{ lang, dir: lang === "ar" ? "rtl" : "ltr", setLang, t }}>
      {children}
    </Ctx.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
