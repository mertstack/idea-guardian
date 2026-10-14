import { useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Blocks, Building2, Layers, Users } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { EnterprisePreview } from "@/components/enterprise-preview";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/enterprise")({
  head: () => ({ meta: [
    { title: "Şirketlere özel çözümler — FailWise" },
    { name: "description", content: "Danışmanlık, kuluçka ve yatırım ekipleri için markalı müşteri paneli, hizmet kataloğu ve entegrasyon çözümleri." },
    { property: "og:title", content: "Kendi markanla, kendi panelinle — FailWise" },
    { property: "og:description", content: "FailWise ile şirketlere özel girişim değerlendirme deneyimini keşfedin." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Enterprise,
});

function Enterprise() {
  const { lang } = useI18n();
  const tr = lang === "tr";
  const text = (turkish: string, english: string) => tr ? turkish : english;
  useEffect(() => { document.title = tr ? "Şirketlere özel çözümler — FailWise" : "Enterprise solutions — FailWise"; }, [tr]);
  const features = [
    { icon: Building2, tr: "Kendi markanız", en: "Your brand", bodyTr: "Markanızın kimliğine uygun bir değerlendirme deneyimi. Müşteri ilişkisi sizinle başlar, sizinle devam eder.", bodyEn: "An evaluation experience aligned with your identity. The client relationship starts and stays with you." },
    { icon: Users, tr: "Müşteri paneli", en: "Client workspace", bodyTr: "Projeler, analizler ve müşteri raporları için ortak bir çalışma alanı tasarlayın.", bodyEn: "Design a shared workspace for projects, analyses and client reports." },
    { icon: Layers, tr: "Kendi kataloğunuz", en: "Your catalog", bodyTr: "Danışmanlık paketlerinizi ve değerlendirme hizmetlerinizi kendi teklifiniz etrafında düzenleyin.", bodyEn: "Organize consulting packages and evaluation services around your own offering." },
    { icon: Blocks, tr: "API & entegrasyon", en: "API & integrations", bodyTr: "CRM, mevcut araçlarınız ve iş akışlarınızla bağlantı ihtiyaçlarını birlikte planlayın.", bodyEn: "Plan connections to your CRM, existing tools and workflows around your requirements." },
  ];
  return <div className="relative min-h-screen">
    <SiteHeader />
    <main className="relative z-10">
      <section className="mx-auto max-w-6xl px-6 pb-16 pt-14 sm:pt-20">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <p className="mb-5 flex items-center justify-center gap-2 text-xs font-medium text-primary"><Building2 className="h-4 w-4" />FailWise / {text("Şirketlere özel", "For businesses")}</p>
          <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">{text("kendi markanla,", "your brand,")}<br /><span className="text-primary">{text("kendi panelinle", "your workspace")}</span></h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted-foreground">{text("Danışmanlık şirketleri, kuluçka merkezleri, yatırım ve inovasyon ekipleri için; girişim zekâsını kendi müşteri deneyiminizin bir parçasına dönüştürün.", "For consultancies, incubators, investment and innovation teams: make startup intelligence part of your own client experience.")}</p>
        </div>
        <EnterprisePreview turkish={tr} />
      </section>
      <section className="border-y border-border bg-background/70 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-10 max-w-2xl"><p className="text-xs font-medium text-primary">{text("SİZİN İŞİNİZ. SİZİN DENEYİMİNİZ.", "YOUR BUSINESS. YOUR EXPERIENCE.")}</p><h2 className="mt-3 text-3xl font-semibold">{text("Tek bir altyapı, size özel bir deneyim.", "One foundation. An experience of your own.")}</h2></div>
          <div className="grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">{features.map(item => <div key={item.en}><item.icon className="mb-5 h-6 w-6 text-primary" /><h3 className="text-base font-semibold">{text(item.tr, item.en)}</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">{text(item.bodyTr, item.bodyEn)}</p></div>)}</div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center"><div className="max-w-xl"><p className="mb-3 text-xs font-medium text-primary">FailWise {text("Kurumsal", "Enterprise")}</p><h2 className="text-3xl font-semibold">{text("Bir sonraki adım, sizin ekibinizle.", "Your team. Your next chapter.")}</h2><p className="mt-4 text-sm leading-6 text-muted-foreground">{text("Önce analiz deneyimini keşfedin. Şirketinize özel kapsamı, müşteri akışlarını ve entegrasyon ihtiyaçlarını bunun üzerine şekillendirin.", "Explore the analysis experience first. Shape your company-specific scope, client workflows and integrations around it.")}</p></div><Button asChild size="lg"><Link to="/analyze">{text("Analiz deneyimini dene", "Try the analysis experience")}<ArrowRight /></Link></Button></div>
        <p className="mt-10 border-t border-border pt-5 text-xs leading-5 text-muted-foreground">{text("Bu sayfadaki panel temsili bir önizlemedir; gösterilen veriler örnektir. White-label, müşteri yönetimi ve API özellikleri bu önizlemede etkin değildir.", "The panel is an illustrative preview with sample data. White-label, client management and API features are not enabled in this preview.")}</p>
      </section>
    </main><SiteFooter />
  </div>;
}