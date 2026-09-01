import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Lang = "en" | "tr";

type Dict = Record<string, string>;

const en: Dict = {
  // Nav
  "nav.analyzer": "Analyzer",
  "nav.howItWorks": "How it works",
  "nav.intelligence": "Intelligence",
  "nav.pricing": "Pricing",
  "nav.openApp": "Open app",
  "nav.signIn": "Sign in",
  "nav.signUp": "Sign up",
  "nav.signOut": "Sign out",

  // Hero
  "hero.badge": "Founder intelligence · Pre-build clarity",
  "hero.title.a": "Don't build what will",
  "hero.title.b": "fail.",
  "hero.subtitle":
    "FailWise is the AI intelligence layer founders run before they build — scoring your idea across market demand, competition, pricing, distribution, and founder advantage.",
  "hero.cta.analyze": "Analyze your idea",
  "hero.cta.pricing": "See pricing",
  "hero.note": "Free analysis · No credit card · Used by indie hackers, founders & product teams",

  // Landing sections
  "land.intel.eyebrow": "Intelligence",
  "land.intel.title": "Five dimensions of startup viability",
  "land.intel.sub": "Every analysis is graded across the dimensions that decide which startups survive.",
  "land.how.eyebrow": "Methodology",
  "land.how.title": "How the Risk Score works",
  "land.how.sub": "A composite signal calibrated against the dimensions that actually predict failure.",
  "land.how.s1.t": "Idea decomposition",
  "land.how.s1.b": "Your idea is parsed into market, audience, product, business model, and channel hypotheses.",
  "land.how.s2.t": "Dimension scoring",
  "land.how.s2.b": "Each of the five intelligence dimensions is scored 0–100 with a signal label and a structured rationale.",
  "land.how.s3.t": "Risk weighting",
  "land.how.s3.b": "Dimensions are weighted by historical impact on early-stage outcomes. Distribution and demand carry the most weight.",
  "land.how.s4.t": "Composite score",
  "land.how.s4.b": "The dimensions are combined into a single 0–100 Risk Score with a calibrated verdict and confidence level.",
  "land.tiers.title": "Risk score · interpretation",
  "land.tier.low": "0–39 · Low risk",
  "land.tier.low.d": "Strong signal across most dimensions.",
  "land.tier.mod": "40–59 · Moderate",
  "land.tier.mod.d": "Workable, but specific weaknesses to address.",
  "land.tier.high": "60–79 · High",
  "land.tier.high.d": "Material risks — rebuild before committing.",
  "land.tier.crit": "80–100 · Critical",
  "land.tier.crit.d": "Likely to fail as currently framed.",
  "land.cta.title": "Validate before you build.",
  "land.cta.sub": "One analysis can save a quarter of wasted engineering. Run yours in under a minute.",
  "land.cta.btn": "Start free analysis",

  // Dimension cards (landing)
  "dim.market.eyebrow": "Market",
  "dim.market.title": "Market Demand Analysis",
  "dim.market.body": "Is there urgent, paid demand? We grade pull signal, market size, and timing.",
  "dim.comp.eyebrow": "Competition",
  "dim.comp.title": "Competition Analysis",
  "dim.comp.body": "Density of the category, defensibility, and the realistic moat you can build.",
  "dim.price.eyebrow": "Pricing",
  "dim.price.title": "Pricing Analysis",
  "dim.price.body": "Willingness-to-pay, anchor pricing, and the unit economics that follow.",
  "dim.dist.eyebrow": "Distribution",
  "dim.dist.title": "Distribution Analysis",
  "dim.dist.body": "The channels you can realistically own — and what CAC looks like there.",
  "dim.founder.eyebrow": "Founder",
  "dim.founder.title": "Founder Advantage Analysis",
  "dim.founder.body": "Founder-market fit, distribution edge, and the unfair advantage you bring.",
  "dim.output.eyebrow": "Output",
  "dim.output.title": "Calibrated Risk Score",
  "dim.output.body": "A composite 0–100 score with confidence level and a structured rationale.",

  // Dashboard preview
  "preview.risk": "Risk score",
  "preview.riskNote": "High risk · medium confidence",
  "preview.live": "Live",

  // Analyzer
  "an.eyebrow": "Founder intelligence",
  "an.title": "Run an analysis",
  "an.sub": "Drop in an idea or company. Get the risk score, dimension breakdown, pre-mortem, and a rebuild plan.",
  "an.placeholder": "e.g. A marketplace for freelance climate scientists…",
  "an.analyzing": "Analyzing…",
  "an.analyze": "Analyze",
  "an.history": "History",
  "an.historyEmpty": "Your analyzed ideas will appear here.",
  "an.empty.title": "Ready when you are",
  "an.empty.sub": "Try one of these to see how FailWise breaks an idea down.",
  "an.steps.title": "Running intelligence pass…",
  "an.step.1": "Decomposing the idea",
  "an.step.2": "Scoring market demand",
  "an.step.3": "Mapping competition & moat",
  "an.step.4": "Modeling pricing & distribution",
  "an.step.5": "Synthesizing rebuild strategy",
  "an.verdict": "Verdict",
  "an.confidence": "confidence",
  "an.recommendation": "Recommendation",
  "an.copy": "Copy insight",
  "an.copied": "Copied to clipboard",
  "an.copyFail": "Copy failed",
  "an.share": "Share on X",
  "an.dim.title": "Intelligence Breakdown",
  "an.dim.sub": "Scores across the five viability dimensions.",
  "an.signal": "signal",
  "an.risks.title": "Risk Breakdown",
  "an.risks.sub": "Specific risks to address before building.",
  "an.pm.title": "Pre-Mortem",
  "an.pm.sub": "How this fails over the next 12 months.",
  "an.rb.title": "Rebuild Strategy",
  "an.rb.sub": "The version of this that could actually win.",
  "an.rb.positioning": "New positioning",
  "an.rb.audience": "Sharper audience",
  "an.rb.pricing": "Pricing strategy",
  "an.rb.gtm": "Go-to-market",
  "an.rb.mvp": "MVP roadmap",
  "an.ideaSummary": "Idea summary",
  "an.disclaimerTitle": "Disclaimer",
  "an.disclaimer": "Proceed with caution. FailWise insights are AI-generated and do not constitute financial, legal, or business advice. Final decisions are your responsibility — FailWise assumes no liability.",
  "an.fail": "Analysis failed. Try again.",

  // Dimension labels (analyzer)
  "dim.marketDemand": "Market Demand",
  "dim.competition": "Competition",
  "dim.pricing": "Pricing",
  "dim.distribution": "Distribution",
  "dim.founderAdvantage": "Founder Advantage",

  // Signals
  "sig.strong": "strong",
  "sig.neutral": "neutral",
  "sig.weak": "weak",
  "sig.critical": "critical",

  // Severity
  "sev.low": "low",
  "sev.medium": "medium",
  "sev.high": "high",
  "sev.critical": "critical",

  // Confidence
  "conf.low": "low",
  "conf.medium": "medium",
  "conf.high": "high",

  // Risk card
  "risk.scoreLabel": "Risk score",
  "risk.tier.low": "Low",
  "risk.tier.moderate": "Moderate",
  "risk.tier.high": "High",
  "risk.tier.critical": "Critical",
  "risk.topRisk": "Top risk",
  "risk.platform": "Founder intelligence platform",

  // Footer / Auth
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

  // Pricing
  "pricing.badge": "Simple, founder-friendly pricing",
  "pricing.title": "Pay less than one bad sprint.",
  "pricing.sub": "One avoided dead-end pays for years of FailWise.",
  "pricing.mostPopular": "Most popular",
  "pricing.cadence.forever": "forever",
  "pricing.cadence.month": "/month",
  "pricing.free.name": "Free",
  "pricing.free.f1": "1 analysis per month",
  "pricing.free.f2": "Basic failure explanation",
  "pricing.free.f3": "Limited results access",
  "pricing.free.f4": "Watermark on share cards",
  "pricing.free.cta": "Start free",
  "pricing.pro.name": "Pro",
  "pricing.pro.f1": "Unlimited startup analyses",
  "pricing.pro.f2": "Full failure breakdown engine",
  "pricing.pro.f3": "Risk score + insights",
  "pricing.pro.f4": "Pre-mortem simulation",
  "pricing.pro.f5": "Shareable cards (no watermark)",
  "pricing.pro.cta": "Get Pro",
  "pricing.expert.name": "Expert",
  "pricing.expert.f1": "Everything in Pro",
  "pricing.expert.f2": "Advanced 6–12 month pre-mortem",
  "pricing.expert.f3": "Full rebuild engine (MVP + pricing + GTM)",
  "pricing.expert.f4": "Investor-style PDF reports",
  "pricing.expert.f5": "Competitor failure comparisons",
  "pricing.expert.f6": "Weekly startup risk insights",
  "pricing.expert.cta": "Go Expert",
  "meta.title.home": "FailWise — Founder intelligence platform",
  "meta.title.analyze": "Analyzer — FailWise",
  "meta.title.pricing": "Pricing — FailWise",
  "meta.title.auth": "FailWise — Sign in",
};


const tr: Dict = {
  // Nav
  "nav.analyzer": "Analiz",
  "nav.howItWorks": "Nasıl çalışır",
  "nav.intelligence": "Zekâ",
  "nav.pricing": "Fiyatlandırma",
  "nav.openApp": "Uygulamayı aç",
  "nav.signIn": "Giriş yap",
  "nav.signUp": "Kayıt ol",
  "nav.signOut": "Çıkış yap",

  // Hero
  "hero.badge": "Kurucu zekâsı · İnşa öncesi netlik",
  "hero.title.a": "Başarısız olacak olanı",
  "hero.title.b": "inşa etme.",
  "hero.subtitle":
    "FailWise, kurucuların inşa etmeden önce çalıştırdığı yapay zekâ katmanıdır — fikrini pazar talebi, rekabet, fiyatlandırma, dağıtım ve kurucu avantajı boyutlarında puanlar.",
  "hero.cta.analyze": "Fikrini analiz et",
  "hero.cta.pricing": "Fiyatları gör",
  "hero.note": "Ücretsiz analiz · Kart gerekmez · Indie hacker, kurucu ve ürün ekiplerinin tercihi",

  // Landing sections
  "land.intel.eyebrow": "Zekâ",
  "land.intel.title": "Startup canlılığının beş boyutu",
  "land.intel.sub": "Her analiz, hangi startup'ların hayatta kalacağını belirleyen boyutlar üzerinden değerlendirilir.",
  "land.how.eyebrow": "Metodoloji",
  "land.how.title": "Risk Skoru nasıl çalışır",
  "land.how.sub": "Başarısızlığı gerçekten öngören boyutlara göre kalibre edilmiş bileşik bir sinyal.",
  "land.how.s1.t": "Fikir ayrıştırma",
  "land.how.s1.b": "Fikrin; pazar, hedef kitle, ürün, iş modeli ve kanal hipotezlerine ayrıştırılır.",
  "land.how.s2.t": "Boyut puanlama",
  "land.how.s2.b": "Beş zekâ boyutunun her biri 0–100 arası puanlanır; sinyal etiketi ve yapılandırılmış gerekçe ile birlikte.",
  "land.how.s3.t": "Risk ağırlıklandırma",
  "land.how.s3.b": "Boyutlar, erken aşama sonuçları üzerindeki tarihsel etkilerine göre ağırlıklandırılır. En çok ağırlığı dağıtım ve talep taşır.",
  "land.how.s4.t": "Bileşik skor",
  "land.how.s4.b": "Boyutlar birleştirilerek tek bir 0–100 Risk Skoru, kalibre edilmiş karar ve güven seviyesi üretilir.",
  "land.tiers.title": "Risk skoru · yorumlama",
  "land.tier.low": "0–39 · Düşük risk",
  "land.tier.low.d": "Çoğu boyutta güçlü sinyal.",
  "land.tier.mod": "40–59 · Orta",
  "land.tier.mod.d": "Yapılabilir, ancak ele alınması gereken belirli zayıflıklar var.",
  "land.tier.high": "60–79 · Yüksek",
  "land.tier.high.d": "Önemli riskler — taahhüt etmeden önce yeniden kur.",
  "land.tier.crit": "80–100 · Kritik",
  "land.tier.crit.d": "Mevcut hâliyle başarısız olma olasılığı yüksek.",
  "land.cta.title": "İnşa etmeden önce doğrula.",
  "land.cta.sub": "Bir analiz, çeyrek dönemlik boşa giden mühendisliği kurtarabilir. Seninkini bir dakikadan kısa sürede çalıştır.",
  "land.cta.btn": "Ücretsiz analize başla",

  // Dimension cards (landing)
  "dim.market.eyebrow": "Pazar",
  "dim.market.title": "Pazar Talebi Analizi",
  "dim.market.body": "Acil ve ücretli talep var mı? Çekim sinyalini, pazar büyüklüğünü ve zamanlamayı değerlendiririz.",
  "dim.comp.eyebrow": "Rekabet",
  "dim.comp.title": "Rekabet Analizi",
  "dim.comp.body": "Kategorinin yoğunluğu, savunulabilirlik ve gerçekçi olarak kurabileceğin hendek.",
  "dim.price.eyebrow": "Fiyat",
  "dim.price.title": "Fiyatlandırma Analizi",
  "dim.price.body": "Ödeme istekliliği, çapa fiyat ve bunlardan doğan birim ekonomi.",
  "dim.dist.eyebrow": "Dağıtım",
  "dim.dist.title": "Dağıtım Analizi",
  "dim.dist.body": "Gerçekçi olarak sahiplenebileceğin kanallar ve oradaki CAC.",
  "dim.founder.eyebrow": "Kurucu",
  "dim.founder.title": "Kurucu Avantajı Analizi",
  "dim.founder.body": "Kurucu-pazar uyumu, dağıtım avantajı ve getirdiğin haksız avantaj.",
  "dim.output.eyebrow": "Çıktı",
  "dim.output.title": "Kalibre Edilmiş Risk Skoru",
  "dim.output.body": "Güven seviyesi ve yapılandırılmış gerekçe ile birlikte bileşik 0–100 skor.",

  // Dashboard preview
  "preview.risk": "Risk skoru",
  "preview.riskNote": "Yüksek risk · orta güven",
  "preview.live": "Canlı",

  // Analyzer
  "an.eyebrow": "Kurucu zekâsı",
  "an.title": "Analiz çalıştır",
  "an.sub": "Bir fikir veya şirket gir. Risk skoru, boyut kırılımı, ön-mortem ve yeniden kurma planını al.",
  "an.placeholder": "örn. Serbest çalışan iklim bilimcileri için bir pazaryeri…",
  "an.analyzing": "Analiz ediliyor…",
  "an.analyze": "Analiz et",
  "an.history": "Geçmiş",
  "an.historyEmpty": "Analiz ettiğin fikirler burada görünecek.",
  "an.empty.title": "Hazır olduğunda başla",
  "an.empty.sub": "FailWise'ın bir fikri nasıl parçaladığını görmek için birini dene.",
  "an.steps.title": "Zekâ geçişi çalışıyor…",
  "an.step.1": "Fikir ayrıştırılıyor",
  "an.step.2": "Pazar talebi puanlanıyor",
  "an.step.3": "Rekabet ve hendek haritalanıyor",
  "an.step.4": "Fiyat ve dağıtım modelleniyor",
  "an.step.5": "Yeniden kurma stratejisi sentezleniyor",
  "an.verdict": "Karar",
  "an.confidence": "güven",
  "an.recommendation": "Tavsiye",
  "an.copy": "İçgörüyü kopyala",
  "an.copied": "Panoya kopyalandı",
  "an.copyFail": "Kopyalanamadı",
  "an.share": "X'te paylaş",
  "an.dim.title": "Zekâ Kırılımı",
  "an.dim.sub": "Beş canlılık boyutundaki puanlar.",
  "an.signal": "sinyal",
  "an.risks.title": "Risk Kırılımı",
  "an.risks.sub": "İnşa etmeden önce ele alınması gereken belirli riskler.",
  "an.pm.title": "Ön-Mortem",
  "an.pm.sub": "Önümüzdeki 12 ayda bu nasıl başarısız olur.",
  "an.rb.title": "Yeniden Kurma Stratejisi",
  "an.rb.sub": "Bunun gerçekten kazanabilecek versiyonu.",
  "an.rb.positioning": "Yeni konumlandırma",
  "an.rb.audience": "Daha keskin hedef kitle",
  "an.rb.pricing": "Fiyatlandırma stratejisi",
  "an.rb.gtm": "Pazara giriş",
  "an.rb.mvp": "MVP yol haritası",
  "an.ideaSummary": "Fikir özeti",
  "an.disclaimerTitle": "Yasal Uyarı",
  "an.disclaimer": "Lütfen dikkatli olun. FailWise içgörüleri yapay zekâ tarafından üretilir; finansal, hukuki veya ticari tavsiye niteliği taşımaz. Nihai kararlar sizin sorumluluğunuzdadır — FailWise sonuçlardan sorumlu tutulamaz.",
  "an.fail": "Analiz başarısız oldu. Tekrar dene.",

  // Dimension labels (analyzer)
  "dim.marketDemand": "Pazar Talebi",
  "dim.competition": "Rekabet",
  "dim.pricing": "Fiyatlandırma",
  "dim.distribution": "Dağıtım",
  "dim.founderAdvantage": "Kurucu Avantajı",

  // Signals
  "sig.strong": "güçlü",
  "sig.neutral": "nötr",
  "sig.weak": "zayıf",
  "sig.critical": "kritik",

  // Severity
  "sev.low": "düşük",
  "sev.medium": "orta",
  "sev.high": "yüksek",
  "sev.critical": "kritik",

  // Confidence
  "conf.low": "düşük",
  "conf.medium": "orta",
  "conf.high": "yüksek",

  // Risk card
  "risk.scoreLabel": "Risk skoru",
  "risk.tier.low": "Düşük",
  "risk.tier.moderate": "Orta",
  "risk.tier.high": "Yüksek",
  "risk.tier.critical": "Kritik",
  "risk.topRisk": "En büyük risk",
  "risk.platform": "Kurucu zekâsı platformu",

  // Footer / Auth
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

  // Pricing
  "pricing.badge": "Basit, kurucu dostu fiyatlandırma",
  "pricing.title": "Kötü bir sprint'ten daha az öde.",
  "pricing.sub": "Kaçırılan tek bir çıkmaz sokak, yıllarca FailWise'ın parasını çıkarır.",
  "pricing.mostPopular": "En popüler",
  "pricing.cadence.forever": "sonsuza dek",
  "pricing.cadence.month": "/ay",
  "pricing.free.name": "Ücretsiz",
  "pricing.free.f1": "Ayda 1 analiz",
  "pricing.free.f2": "Temel başarısızlık açıklaması",
  "pricing.free.f3": "Sınırlı sonuç erişimi",
  "pricing.free.f4": "Paylaşım kartlarında filigran",
  "pricing.free.cta": "Ücretsiz başla",
  "pricing.pro.name": "Pro",
  "pricing.pro.f1": "Sınırsız startup analizi",
  "pricing.pro.f2": "Tam başarısızlık kırılım motoru",
  "pricing.pro.f3": "Risk skoru + içgörüler",
  "pricing.pro.f4": "Ön-mortem simülasyonu",
  "pricing.pro.f5": "Paylaşılabilir kartlar (filigransız)",
  "pricing.pro.cta": "Pro'ya geç",
  "pricing.expert.name": "Uzman",
  "pricing.expert.f1": "Pro'daki her şey",
  "pricing.expert.f2": "Gelişmiş 6–12 aylık ön-mortem",
  "pricing.expert.f3": "Tam yeniden kurma motoru (MVP + fiyat + GTM)",
  "pricing.expert.f4": "Yatırımcı tarzı PDF raporlar",
  "pricing.expert.f5": "Rakip başarısızlık karşılaştırmaları",
  "pricing.expert.f6": "Haftalık startup risk içgörüleri",
  "pricing.expert.cta": "Uzman'a geç",
  "meta.title.home": "FailWise — Kurucu zekâsı platformu",
  "meta.title.analyze": "Analiz — FailWise",
  "meta.title.pricing": "Fiyatlandırma — FailWise",
  "meta.title.auth": "FailWise — Giriş yap",
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

  // Keep <html lang> and the document title localized
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = lang;
    const path = window.location.pathname;
    const key = path.startsWith("/analyze")
      ? "meta.title.analyze"
      : path.startsWith("/pricing")
        ? "meta.title.pricing"
        : path.startsWith("/auth")
          ? "meta.title.auth"
          : "meta.title.home";
    document.title = dicts[lang][key] ?? dicts.en[key];
  }, [lang]);



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
    return { lang: "en", setLang: () => {}, t: (k) => dicts.en[k] ?? k };
  }
  return ctx;
}

export function useT() {
  return useI18n().t;
}
