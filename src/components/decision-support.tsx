import type { DecisionSupport } from "@/lib/report-depth";
import { useI18n } from "@/lib/i18n";

export function DecisionSupportSections({ items }: { items?: DecisionSupport }) {
  const { lang } = useI18n();
  const tr = lang === "tr";
  if (!items?.length) return null;
  const statuses = { verified: tr ? "Kaynaklı bulgu" : "Sourced finding", estimate: tr ? "Tahmin / öneri" : "Estimate / proposal", unknown: tr ? "Bilgi eksik" : "Unknown" };
  return <div className="space-y-8">{items.map(item => <section key={item.id} className="border-t border-border pt-6">
    <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-xl font-semibold">{item.title}</h2><span className="text-xs text-primary">{statuses[item.evidenceStatus]}</span></div>
    <p className="mt-3 whitespace-pre-line text-sm leading-7 text-foreground">{item.summary}</p>
    <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-6">{item.actions.map((action, i) => <li key={i} className="whitespace-pre-line">{action}</li>)}</ol>
    {item.assumptions.length > 0 && <div className="mt-4 border-l-2 border-warning pl-4 text-xs leading-6 text-muted-foreground"><p className="font-medium text-foreground">{tr ? "Varsayımlar ve veri sınırları" : "Assumptions & limitations"}</p><ul className="list-disc pl-4">{item.assumptions.map((a,i) => <li key={i}>{a}</li>)}</ul></div>}
    <div className="mt-3 flex flex-wrap gap-3 text-xs">{item.sourceUrls.map(url => <a key={url} href={url} target="_blank" rel="noreferrer" className="break-all text-primary underline">{url}</a>)}</div>
  </section>)}</div>;
}