import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Lang = "en" | "tr";

type Dict = Record<string, string>;

const en: Dict = {
  "nav.analyzer": "Analyzer",
  "nav.howItWorks": "How it works",
  "nav.intelligence": "Intelligence",
  "nav.pricing": "Pricing",
  "nav.openApp": "Open app",
  "nav.signIn": "Sign in",
  "nav.signUp": "Sign up",
  "nav.signOut": "Sign out",

  "hero.badge": "Founder intelligence · Pre-build clarity",
  "hero.title.a": "Don't build what will",
  "hero.title.b": "fail.",
  "hero.subtitle":
    "FailWise is the AI intelligence layer founders run before they build — scoring your idea across market demand, competition, pricing, distribution, and founder advantage.",
  "hero.cta.analyze": "Analyze your idea",
  "hero.cta.pricing": "See pricing",
  "hero.note": "Free analysis · No credit card · Used by indie hackers, founders & product teams",

  "footer.tagline": "FailWise — Founder intelligence platform",
  "footer.rights": "All rights reserved.",

  "auth.title.signIn": "Sign in to FailWise",
  "auth.title.signUp": "Create your FailWise account",
  "auth.sub.signIn": "Welcome back. Continue your analyses.",
  "auth.sub.signUp": "Start scoring ideas before you build.",
  "auth.email": "Email",
  "auth.password": "Password",
  "auth.submit.signIn": "Sign in",
  "auth.submit.signUp": "Create account",
  "auth.google": "Continue with Google",
  "auth.or": "or",
  "auth.toggle.toSignUp": "Don't have an account? Sign up",
  "auth.toggle.toSignIn": "Already have an account? Sign in",
  "auth.error.generic": "Something went wrong. Please try again.",
  "auth.success.signedIn": "Signed in.",
  "auth.success.signedUp": "Account created.",

  "lang.switch": "Language",
};

const tr: Dict = {
  "nav.analyzer": "Analiz",
  "nav.howItWorks": "Nasıl çalışır",
  "nav.intelligence": "Zekâ",
  "nav.pricing": "Fiyatlandırma",
  "nav.openApp": "Uygulamayı aç",
  "nav.signIn": "Giriş yap",
  "nav.signUp": "Kayıt ol",
  "nav.signOut": "Çıkış yap",

  "hero.badge": "Kurucu zekâsı · İnşa öncesi netlik",
  "hero.title.a": "Başarısız olacak olanı",
  "hero.title.b": "inşa etme.",
  "hero.subtitle":
    "FailWise, kurucuların inşa etmeden önce çalıştırdığı yapay zekâ zekâ katmanıdır — fikrinizi pazar talebi, rekabet, fiyatlandırma, dağıtım ve kurucu avantajı boyutlarında puanlar.",
  "hero.cta.analyze": "Fikrini analiz et",
  "hero.cta.pricing": "Fiyatları gör",
  "hero.note": "Ücretsiz analiz · Kart gerekmez · Indie hacker'lar, kurucular ve ürün ekipleri kullanıyor",

  "footer.tagline": "FailWise — Kurucu zekâsı platformu",
  "footer.rights": "Tüm hakları saklıdır.",

  "auth.title.signIn": "FailWise'a giriş yap",
  "auth.title.signUp": "FailWise hesabını oluştur",
  "auth.sub.signIn": "Tekrar hoş geldin. Analizlerine devam et.",
  "auth.sub.signUp": "İnşa etmeden önce fikirleri puanlamaya başla.",
  "auth.email": "E-posta",
  "auth.password": "Şifre",
  "auth.submit.signIn": "Giriş yap",
  "auth.submit.signUp": "Hesap oluştur",
  "auth.google": "Google ile devam et",
  "auth.or": "veya",
  "auth.toggle.toSignUp": "Hesabın yok mu? Kayıt ol",
  "auth.toggle.toSignIn": "Zaten hesabın var mı? Giriş yap",
  "auth.error.generic": "Bir şeyler ters gitti. Lütfen tekrar dene.",
  "auth.success.signedIn": "Giriş yapıldı.",
  "auth.success.signedUp": "Hesap oluşturuldu.",

  "lang.switch": "Dil",
};

const dicts: Record<Lang, Dict> = { en, tr };

type I18nCtx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
};

const I18nContext = createContext<I18nCtx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("failwise.lang") as Lang | null;
      if (saved === "en" || saved === "tr") setLangState(saved);
    } catch {
      /* noop */
    }
  }, []);

  const value = useMemo<I18nCtx>(() => {
    return {
      lang,
      setLang: (l) => {
        setLangState(l);
        try {
          localStorage.setItem("failwise.lang", l);
        } catch {
          /* noop */
        }
      },
      t: (key) => dicts[lang][key] ?? dicts.en[key] ?? key,
    };
  }, [lang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nCtx {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    // Safe fallback so SSR / mis-mount never crashes
    return { lang: "en", setLang: () => {}, t: (k) => dicts.en[k] ?? k };
  }
  return ctx;
}

export function useT() {
  return useI18n().t;
}
