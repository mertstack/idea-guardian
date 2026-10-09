import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { AlertTriangle, ExternalLink, Loader2, Radar, Target, Users, Gauge, ListChecks } from "lucide-react";

import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n";
import { runIntelligenceReport, type IntelReport } from "@/lib/intelligence.functions";

export const Route = createFileRoute("/intelligence")({
  head: () => ({
    meta: [
      { title: "Intelligence Report — FailWise" },
      { name: "description", content: "Evidence-based competitor, demand, risk and distribution analysis with a BUILD / PIVOT / TEST / STOP plan." },
      { property: "og:title", content: "FailWise Intelligence Report" },
      { property: "og:description", content: "Know what to do next with sourced startup intelligence." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: IntelligencePage,
});

type Saved = { id: string; idea: string; at: number; report: IntelReport };
const KEY = "failwise.intel.reports";

function IntelligencePage() {
  const { lang } = useI18n();
  const tr = lang === "tr";
  const L = (en: string, t: string) => (tr ? t : en);
  const { user, loading: authLoading } = useAuth();
  const run = useServerFn(runIntelligenceReport);
  const [idea, setIdea] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<Saved[]>([]);
  const [current, setCurrent] = useState<Saved | null>(null);

  useEffect(() => {
    try {
      setSaved(JSON.parse(localStorage.getItem(KEY) || "[]"));
    } catch {
      /* ignore */
    }
  }, []);

  async function submit() {
    if (idea.trim().length < 3) return;
    setBusy(true);
    setError(null);
    try {
      const report = await run({ data: { idea: idea.trim(), lang } });
      const item: Saved = { id: crypto.randomUUID(), idea: idea.trim(), at: Date.now(), report };
      const next = [item, ...saved].slice(0, 20);
      setSaved(next);
      localStorage.setItem(KEY, JSON.stringify(next));
      setCurrent(item);
    } catch (e) {
      setError((e as Error).message || L("Something went wrong.", "Bir şeyler ters gitti."));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-6 py-14">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 px-3 py-1 text-xs text-primary">
          Intelligence · $59/{L("mo", "ay")}
        </div>
        <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight">
          {L("Don't just evaluate your idea. Know what to do next.", "Sadece fikrini değerlendirme. Sırada ne yapacağını bil.")}
        </h1>
        <p className="mt-3 text-muted-foreground">
          {L(
            "Live web research on competitors and demand, an explainable risk score, a first-customer plan and a clear BUILD / PIVOT / TEST / STOP decision.",
            "Rakipler ve talep için canlı web araştırması, açıklanabilir risk skoru, ilk müşteri planı ve net bir BUILD / PIVOT / TEST / STOP kararı.",
          )}
        </p>

        {!authLoading && !user ? (
          <div className="mt-8 rounded-xl border border-border bg-card p-6">
            <p className="text-sm">{L("Sign in to run an Intelligence report.", "Intelligence raporu için giriş yap.")}</p>
            <Link to="/auth" search={{ next: "/intelligence" }} className="mt-4 inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground">
              {L("Sign in", "Giriş yap")}
            </Link>
          </div>
        ) : (
          <div className="mt-8 rounded-xl border border-border bg-card p-5">
            <textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              rows={4}
              maxLength={4000}
              placeholder={L("Describe your startup idea, target customer and business model…", "Startup fikrini, hedef müşteriyi ve iş modelini anlat…")}
              className="w-full resize-none rounded-md border border-border bg-background p-3 text-sm outline-none focus:border-primary/60"
            />
            <div className="mt-3 flex items-center justify-between gap-3">
              <span className="text-xs text-muted-foreground">
                {L("Takes ~30–60 seconds. Sources are searched live.", "~30–60 saniye sürer. Kaynaklar canlı aranır.")}
              </span>
              <button
                onClick={submit}
                disabled={busy || idea.trim().length < 3}
                className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground disabled:opacity-50"
              >
                {busy && <Loader2 className="h-4 w-4 animate-spin" />}
                {busy ? L("Researching…", "Araştırılıyor…") : L("Generate report", "Rapor oluştur")}
              </button>
            </div>
            {error && (
              <div className="mt-3 flex items-start gap-2 rounded-md border border-primary/40 bg-primary/10 p-3 text-sm">
                <AlertTriangle className="mt-0.5 h-4 w-4 text-primary" /> {error}
              </div>
            )}
          </div>
        )}

        {saved.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {saved.map((s) => (
              <button
                key={s.id}
                onClick={() => setCurrent(s)}
                className={`max-w-[240px] truncate rounded-md border px-3 py-1.5 text-xs ${current?.id === s.id ? "border-primary text-foreground" : "border-border text-muted-foreground hover:text-foreground"}`}
              >
                {s.idea}
              </button>
            ))}
          </div>
        )}

        {current ? (
          <Report r={current.report} L={L} />
        ) : (
          !busy && (
            <p className="mt-10 text-center text-sm text-muted-foreground">
              {L("No report selected yet.", "Henüz seçili rapor yok.")}
            </p>
          )
        )}
      </main>
      <SiteFooter />
    </div>
  );
}

function Section({ n, title, icon, children }: { n: number; title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-card p-6">
      <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
        <span className="font-mono text-xs text-primary">{String(n).padStart(2, "0")}</span>
        {icon}
        {title}
      </h2>
      <div className="mt-4 space-y-3 text-sm leading-relaxed text-foreground/90">{children}</div>
    </section>
  );
}

const A = ({ url }: { url: string }) =>
  url ? (
    <a href={url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">
      {new URL(url).hostname.replace("www.", "")} <ExternalLink className="h-3 w-3" />
    </a>
  ) : null;

function Report({ r, L }: { r: IntelReport; L: (a: string, b: string) => string }) {
  const verdictLabel = r.decision.verdict.toUpperCase();
  return (
    <div className="mt-10 space-y-5">
      <Section n={1} title={L("Executive summary", "Yönetici özeti")}>
        <p>{r.executiveSummary}</p>
      </Section>

      <Section n={2} title={L("Risk score & confidence", "Risk skoru ve güven")} icon={<Gauge className="h-4 w-4" />}>
        <div className="flex flex-wrap items-baseline gap-3">
          <span className="font-mono text-5xl font-bold text-primary">{Math.round(r.risk.overall)}</span>
          <span className="text-muted-foreground">/100 · {L("confidence", "güven")}: {r.risk.confidence}</span>
        </div>
        <p className="text-xs text-muted-foreground">
          {L("Higher = more risk. This is a structured judgment, not a probability of success or a validated prediction.", "Yüksek = daha fazla risk. Bu yapılandırılmış bir değerlendirmedir; başarı olasılığı veya doğrulanmış bir tahmin değildir.")} {r.risk.meaning}
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {r.risk.dimensions.map((d) => (
            <div key={d.name} className="rounded-lg border border-border p-3">
              <div className="flex justify-between font-medium">
                <span>{d.name}</span>
                <span className="font-mono text-primary">{Math.round(d.score)}</span>
              </div>
              <div className="mt-1 h-1 rounded bg-muted">
                <div className="h-1 rounded bg-primary" style={{ width: `${d.score}%` }} />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">{d.why}</p>
              <p className="mt-1 text-[11px] text-muted-foreground">{L("confidence", "güven")}: {d.confidence}</p>
              <div className="mt-1 flex flex-wrap gap-2 text-xs">{d.sources.map((s) => <A key={s} url={s} />)}</div>
            </div>
          ))}
        </div>
        <div>
          <div className="font-medium">{L("Fix these first", "Önce bunları çöz")}</div>
          <ol className="mt-1 list-decimal pl-5">{r.risk.topRisks.map((x) => <li key={x}>{x}</li>)}</ol>
        </div>
      </Section>

      <Section n={3} title={L("Market demand & evidence", "Pazar talebi ve kanıt")} icon={<Radar className="h-4 w-4" />}>
        <p>{r.demand.summary}</p>
        {r.demand.signals.length === 0 ? (
          <p className="text-muted-foreground">{L("No verifiable demand signals were found in live sources.", "Canlı kaynaklarda doğrulanabilir talep sinyali bulunamadı.")}</p>
        ) : (
          r.demand.signals.map((s, i) => (
            <div key={i} className="rounded-lg border border-border p-3">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded border border-border px-1.5 py-0.5 uppercase">{s.type.replace(/_/g, " ")}</span>
                <span className="rounded border border-border px-1.5 py-0.5">{s.strength}</span>
                {s.date && <span className="text-muted-foreground">{s.date}</span>}
                <A url={s.url} />
              </div>
              <p className="mt-2 font-medium">{s.signal}</p>
              <p className="text-xs text-muted-foreground">{s.why}</p>
              {s.limitations && <p className="mt-1 text-[11px] text-muted-foreground">⚠ {s.limitations}</p>}
            </div>
          ))
        )}
      </Section>

      <Section n={4} title={L("Competitor intelligence", "Rakip istihbaratı")} icon={<Users className="h-4 w-4" />}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-xs">
            <thead className="text-muted-foreground">
              <tr>{[L("Name", "Ad"), L("Pricing", "Fiyat"), L("Positioning", "Konum"), L("Strengths", "Güçlü"), L("Weaknesses", "Zayıf"), L("Your edge", "Farkın")].map((h) => <th key={h} className="border-b border-border p-2">{h}</th>)}</tr>
            </thead>
            <tbody>
              {r.competitors.map((c) => (
                <tr key={c.name} className="align-top">
                  <td className="border-b border-border p-2">
                    <div className="font-medium">{c.name}</div>
                    <div className="text-muted-foreground">{c.kind}</div>
                    {c.url ? <A url={c.url} /> : <span className="text-[11px] text-muted-foreground">{L("AI estimate · unverified", "YZ tahmini · doğrulanmadı")}</span>}
                  </td>
                  <td className="border-b border-border p-2">{c.pricing}</td>
                  <td className="border-b border-border p-2">{c.positioning}</td>
                  <td className="border-b border-border p-2">{c.strengths}</td>
                  <td className="border-b border-border p-2">{c.weaknesses}</td>
                  <td className="border-b border-border p-2">{c.differentiation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section n={5} title={L("Pricing & monetization", "Fiyatlandırma ve gelir")}>
        <p>{r.pricing.summary}</p>
        <p className="font-medium">{r.pricing.recommendation}</p>
      </Section>

      <Section n={6} title={L("Distribution & first customers", "Dağıtım ve ilk müşteriler")} icon={<Target className="h-4 w-4" />}>
        {r.distribution.channels.map((c) => (
          <div key={c.channel} className="rounded-lg border border-border p-3">
            <div className="font-medium">{c.channel}</div>
            <p className="text-xs text-muted-foreground">{c.why} · {c.audience}</p>
            <p className="mt-1"><b>{L("First experiment", "İlk deney")}:</b> {c.experiment}</p>
            <p className="text-xs"><b>{L("Est. cost/effort", "Tahmini maliyet/efor")}:</b> {c.estCost} · <b>{L("Metrics", "Metrikler")}:</b> {c.metrics}</p>
            <p className="text-xs text-muted-foreground">⚠ {c.risks}</p>
          </div>
        ))}
        <div className="font-medium">{L("Plan for the first 10 customers", "İlk 10 müşteri planı")}</div>
        <ol className="list-decimal pl-5">{r.distribution.first10.map((x) => <li key={x}>{x}</li>)}</ol>
      </Section>

      <Section n={7} title={L("Key risks & unverified assumptions", "Ana riskler ve doğrulanmamış varsayımlar")}>
        <ul className="list-disc pl-5">{r.risk.assumptions.map((x) => <li key={x}>{x}</li>)}</ul>
        {r.limitations.length > 0 && (
          <div className="rounded-md border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
            <b>{L("Data limitations", "Veri sınırları")}:</b> {r.limitations.join(" · ")}
          </div>
        )}
      </Section>

      <Section n={8} title={L("Recommendation", "Tavsiye")} icon={<ListChecks className="h-4 w-4" />}>
        <div className="inline-flex rounded-md border border-primary bg-primary/10 px-4 py-2 font-mono text-2xl font-bold text-primary">{verdictLabel}</div>
        <ul className="list-disc pl-5">{r.decision.reasons.map((x) => <li key={x}>{x}</li>)}</ul>
        <div className="font-medium">{L("Top 3 actions", "En önemli 3 aksiyon")}</div>
        <ol className="list-decimal pl-5">{r.decision.priorities.map((x) => <li key={x}>{x}</li>)}</ol>
        <div className="grid gap-2 text-xs sm:grid-cols-3">
          <div className="rounded border border-border p-2"><b>{L("Continue if", "Devam et eğer")}:</b> {r.decision.continueIf}</div>
          <div className="rounded border border-border p-2"><b>{L("Pivot if", "Pivot yap eğer")}:</b> {r.decision.pivotIf}</div>
          <div className="rounded border border-border p-2"><b>{L("Stop if", "Dur eğer")}:</b> {r.decision.stopIf}</div>
        </div>
        {r.decision.budget && <p className="text-xs text-muted-foreground">{L("Estimated budget", "Tahmini bütçe")}: {r.decision.budget}</p>}
      </Section>

      <Section n={9} title={L("7-day validation plan", "7 günlük doğrulama planı")}>
        {r.decision.week.map((d) => (
          <div key={d.day} className="flex gap-3 border-b border-border pb-2 last:border-0">
            <span className="w-14 shrink-0 font-mono text-xs text-primary">{d.day}</span>
            <div><div>{d.task}</div><div className="text-xs text-muted-foreground">✓ {d.success}</div></div>
          </div>
        ))}
      </Section>

      <Section n={10} title={L("30-day action plan", "30 günlük aksiyon planı")}>
        {r.decision.month.map((w) => (
          <div key={w.week} className="flex gap-3"><span className="w-16 shrink-0 font-mono text-xs text-primary">{w.week}</span><span>{w.focus}</span></div>
        ))}
      </Section>

      {r.sources.length > 0 && (
        <Section n={11} title={L("Sources", "Kaynaklar")}>
          <ul className="space-y-1 text-xs">
            {r.sources.map((s) => (
              <li key={s.url}><a href={s.url} target="_blank" rel="noreferrer" className="text-primary hover:underline">{s.title || s.url}</a></li>
            ))}
          </ul>
        </Section>
      )}
    </div>
  );
}
