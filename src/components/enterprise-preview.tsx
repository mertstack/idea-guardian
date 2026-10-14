import { useState } from "react";
import { ArrowUpRight, Building2, ChevronRight, FolderOpen, LayoutGrid, LineChart, MoreHorizontal, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandMark } from "@/components/site-chrome";

const sectors = [
  { tr: "Danışmanlık", en: "Consultancies", detailTr: "Müşterilerinizin fikirlerini ortak bir değerlendirme sürecinde ele alın.", detailEn: "Bring your clients' ideas into one shared evaluation process." },
  { tr: "Kuluçka merkezleri", en: "Incubators", detailTr: "Girişim portföyünüzü aynı değerlendirme çerçevesiyle takip edin.", detailEn: "Follow your startup portfolio with a consistent evaluation framework." },
  { tr: "Yatırım ekipleri", en: "Investment teams", detailTr: "İlk değerlendirmeden yatırım görüşmesine, daha net içgörülerle ilerleyin.", detailEn: "Move from initial screening to investment discussions with clearer insights." },
  { tr: "İnovasyon ekipleri", en: "Innovation teams", detailTr: "Yeni iş fikirlerini büyük yatırımlardan önce değerlendirin.", detailEn: "Evaluate new business ideas before committing major resources." },
];

export function EnterprisePreview({ turkish }: { turkish: boolean }) {
  const [selected, setSelected] = useState(0);
  const text = (tr: string, en: string) => turkish ? tr : en;
  const sector = sectors[selected] ?? sectors[0];
  return (
    <div id="panel-preview" className="scroll-mt-24">
      <div className="mb-5 flex flex-wrap justify-center gap-2" aria-label={text("Sektör seçimi", "Sector selection")}>
        {sectors.map((item, i) => <Button key={item.en} variant={i === selected ? "default" : "outline"} size="sm" aria-pressed={i === selected} onClick={() => setSelected(i)}><Building2 />{turkish ? item.tr : item.en}</Button>)}
      </div>
      <p aria-live="polite" className="mx-auto mb-8 min-h-12 max-w-2xl text-center text-sm leading-6 text-muted-foreground">{turkish ? sector.detailTr : sector.detailEn}</p>
      <div className="overflow-hidden rounded-lg border border-border-strong bg-surface shadow-elevated">
        <div className="flex items-center justify-between border-b border-border bg-background px-4 py-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-primary" />{text("Kurumsal çalışma alanı", "Enterprise workspace")}</span>
          <span>{text("Örnek panel", "Sample workspace")}</span>
        </div>
        <div className="flex">
          <aside className="hidden w-48 shrink-0 border-r border-border bg-background/50 p-5 md:block">
            <div className="mb-9 flex items-center gap-2 font-semibold"><BrandMark className="h-5 w-5 text-primary" />FailWise</div>
            <div className="space-y-2 text-xs">
              {[{ icon: LayoutGrid, tr: "Genel bakış", en: "Overview" }, { icon: Users, tr: "Müşteriler", en: "Clients" }, { icon: FolderOpen, tr: "Katalog", en: "Catalog" }, { icon: LineChart, tr: "Raporlar", en: "Reports" }].map((item, i) => <div key={item.en} className={`flex items-center gap-2 rounded-md px-3 py-2.5 ${i === 0 ? "bg-primary/10 text-primary" : "text-muted-foreground"}`}><item.icon className="h-4 w-4" />{text(item.tr, item.en)}</div>)}
            </div>
            <div className="mt-20 border-t border-border pt-4 text-xs text-muted-foreground">FailWise · {text("Kurumsal", "Enterprise")}</div>
          </aside>
          <div className="min-w-0 flex-1 p-5 sm:p-8">
            <div className="mb-7 flex items-center justify-between gap-3"><div><p className="mb-2 text-xs text-muted-foreground">FailWise / {text("Çalışma alanı", "Workspace")}</p><h2 className="text-xl font-semibold">{text("Portföyünüze genel bakış", "Your portfolio at a glance")}</h2></div><MoreHorizontal className="h-5 w-5 shrink-0 text-muted-foreground" /></div>
            <div className="grid grid-cols-3 divide-x divide-border border-y border-border py-5">
              {[{ tr: "Aktif projeler", en: "Active projects", value: "24" }, { tr: "Müşteriler", en: "Clients", value: "12" }, { tr: "Tamamlanan analiz", en: "Completed analyses", value: "86" }].map(item => <div key={item.en} className="px-2 first:pl-0 sm:px-5"><div className="min-h-9 text-[11px] text-muted-foreground sm:min-h-6 sm:text-xs">{text(item.tr, item.en)}</div><div className="mt-2 font-mono text-2xl font-semibold sm:text-3xl">{item.value}</div></div>)}
            </div>
            <div className="mt-7 grid gap-7 lg:grid-cols-[1.2fr_1fr]">
              <div><div className="flex items-center justify-between text-sm font-medium">{text("Değerlendirme aktivitesi", "Evaluation activity")}<span className="text-xs font-normal text-muted-foreground">{text("Son 6 ay", "Last 6 months")}</span></div>
                <svg role="img" aria-label={text("Örnek analiz aktivitesi grafiği", "Sample analysis activity chart")} viewBox="0 0 360 130" className="mt-5 w-full text-primary"><g className="text-border" stroke="currentColor"><path d="M0 25H360M0 65H360M0 105H360" /></g><path d="M0 109L60 90L120 96L180 60L240 72L300 34L360 15" fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round"/><circle cx="300" cy="34" r="4" fill="currentColor" /></svg>
                <div className="mt-1 flex justify-between font-mono text-[10px] text-muted-foreground">{(turkish ? ["MAY", "HAZ", "TEM", "AĞU", "EYL", "EKİ"] : ["MAY", "JUN", "JUL", "AUG", "SEP", "OCT"]).map(month => <span key={month}>{month}</span>)}</div>
              </div>
              <div><h3 className="mb-3 text-sm font-medium">{text("Hizmet kataloğu", "Service catalog")}</h3>{[{ tr: "Fikir analizi", en: "Idea analysis" }, { tr: "Pazar değerlendirmesi", en: "Market assessment" }, { tr: "Risk raporu", en: "Risk report" }].map(item => <div key={item.en} className="flex items-center justify-between border-b border-border py-3 text-xs"><span className="flex items-center gap-2"><ArrowUpRight className="h-3.5 w-3.5 text-primary" />{text(item.tr, item.en)}</span><ChevronRight className="h-3.5 w-3.5 text-muted-foreground" /></div>)}</div>
            </div>
            <div className="mt-7 flex items-center gap-2 border-t border-border pt-4 text-[11px] text-muted-foreground"><BrandMark className="h-3.5 w-3.5" />{text("FailWise ile desteklenir", "Powered by FailWise")}</div>
          </div>
        </div>
      </div>
    </div>
  );
}