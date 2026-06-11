import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Check,
  Clock,
  Copy,
  History,
  Loader2,
  Megaphone,
  Network,
  Rocket,
  Sparkles,
  Tag,
  UserCheck,
  Wand2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { RiskCard } from "@/components/risk-card";
import { SiteHeader } from "@/components/site-chrome";
import { analyzeStartup, type StartupAnalysis } from "@/lib/analyze.functions";

export const Route = createFileRoute("/analyze")({
  head: () => ({
    meta: [
      { title: "Analyzer — FailWise" },
      {
        name: "description",
        content: "Score your startup across market demand, competition, pricing, distribution, and founder advantage.",
      },
    ],
  }),
  component: AnalyzePage,
});

type HistoryItem = {
  id: string;
  idea: string;
  score: number;
  createdAt: number;
  analysis: StartupAnalysis;
};

const HISTORY_KEY = "failwise.history.v2";
const SAMPLES = [
  "AI Notion for dental clinics",
  "Uber for dog walkers in tier-3 cities",
  "Subscription box for indie board games",
  "No-code internal HR portals",
];

function AnalyzePage() {
  const analyze = useServerFn(analyzeStartup);
  const { lang } = useI18n();
  const [idea, setIdea] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [active, setActive] = useState<HistoryItem | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      if (raw) setHistory(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  const mutation = useMutation({
    mutationFn: async (input: string) => analyze({ data: { idea: input, lang } }),
    onSuccess: (analysis, input) => {
      const item: HistoryItem = {
        id: crypto.randomUUID(),
        idea: input,
        score: analysis.riskScore,
        createdAt: Date.now(),
        analysis,
      };
      const next = [item, ...history].slice(0, 20);
      setHistory(next);
      setActive(item);
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
    },
    onError: (err: Error) => toast.error(err?.message || "Analysis failed. Try again."),
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim() || mutation.isPending) return;
    mutation.mutate(idea.trim());
  };

  const result = active?.analysis;

  return (
    <div className="relative min-h-screen">
      <SiteHeader />

      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-10 lg:grid-cols-[240px_1fr]">
        {/* Sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-20 space-y-3">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-muted-foreground">
              <History className="h-3.5 w-3.5" /> History
            </div>
            {history.length === 0 ? (
              <p className="rounded-md border border-dashed border-border p-4 text-[12px] text-muted-foreground">
                Your analyzed ideas will appear here.
              </p>
            ) : (
              <ul className="space-y-1">
                {history.map((h) => (
                  <li key={h.id}>
                    <button
                      onClick={() => setActive(h)}
                      className={`group flex w-full items-start gap-2.5 rounded-md border px-3 py-2.5 text-left text-[12px] transition-colors ${
                        active?.id === h.id
                          ? "border-border-strong bg-surface"
                          : "border-transparent hover:bg-surface"
                      }`}
                    >
                      <span className="mt-0.5 inline-flex h-5 min-w-[28px] items-center justify-center rounded border border-border bg-background px-1 font-mono text-[10px] tabular-nums text-foreground">
                        {h.score}
                      </span>
                      <span className="line-clamp-2 flex-1 text-foreground/90">{h.idea}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>

        <main className="space-y-12">
          <section>
            <div className="text-[12px] font-medium uppercase tracking-wider text-primary">
              Founder intelligence
            </div>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
              Run an analysis
            </h1>
            <p className="mt-2 max-w-2xl text-[15px] text-muted-foreground">
              Drop in an idea or company. Get the risk score, dimension breakdown, pre-mortem, and
              a rebuild plan.
            </p>

            <form onSubmit={onSubmit} className="mt-6">
              <div className="rounded-xl border border-border bg-surface focus-within:border-border-strong">
                <textarea
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  rows={3}
                  placeholder="e.g. A marketplace for freelance climate scientists…"
                  className="w-full resize-none rounded-xl bg-transparent px-4 py-3.5 text-[15px] outline-none placeholder:text-muted-foreground"
                />
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-3 py-2.5">
                  <div className="flex flex-wrap gap-1.5">
                    {SAMPLES.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setIdea(s)}
                        className="rounded-md border border-border bg-background/40 px-2 py-1 text-[11px] text-muted-foreground hover:text-foreground"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                  <button
                    type="submit"
                    disabled={mutation.isPending || !idea.trim()}
                    className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-3.5 text-[13px] font-medium text-primary-foreground disabled:opacity-50 hover:bg-primary/90"
                  >
                    {mutation.isPending ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" /> Analyzing…
                      </>
                    ) : (
                      <>
                        Analyze <ArrowRight className="h-3.5 w-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </section>

          {mutation.isPending && <AnalyzingState />}
          {!mutation.isPending && !result && <EmptyState onPick={setIdea} />}
          {result && active && <ResultsView idea={active.idea} analysis={result} />}
        </main>
      </div>
    </div>
  );
}

function AnalyzingState() {
  const steps = [
    "Decomposing the idea",
    "Scoring market demand",
    "Mapping competition & moat",
    "Modeling pricing & distribution",
    "Synthesizing rebuild strategy",
  ];
  return (
    <div className="rounded-xl border border-border bg-surface p-7">
      <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
        <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" /> Running intelligence pass…
      </div>
      <ul className="mt-6 space-y-3">
        {steps.map((s, i) => (
          <li
            key={s}
            className="flex items-center gap-3 text-[13px] text-foreground"
            style={{ animation: `fade-in 400ms ease-out ${i * 220}ms both` }}
          >
            <span className="grid h-5 w-5 place-items-center rounded-full border border-border bg-background text-muted-foreground">
              <Check className="h-3 w-3" />
            </span>
            {s}
          </li>
        ))}
      </ul>
    </div>
  );
}

function EmptyState({ onPick }: { onPick: (s: string) => void }) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-surface/40 p-10 text-center">
      <div className="mx-auto grid h-10 w-10 place-items-center rounded-md border border-border bg-surface text-muted-foreground">
        <Sparkles className="h-4 w-4" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">Ready when you are</h3>
      <p className="mx-auto mt-2 max-w-md text-[13px] text-muted-foreground">
        Try one of these to see how FailWise breaks an idea down.
      </p>
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        {SAMPLES.map((s) => (
          <button
            key={s}
            onClick={() => onPick(s)}
            className="rounded-md border border-border bg-surface px-3 py-1.5 text-[12px] hover:border-border-strong"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

const DIM_META = {
  marketDemand: { label: "Market Demand", icon: BarChart3 },
  competition: { label: "Competition", icon: Network },
  pricing: { label: "Pricing", icon: Tag },
  distribution: { label: "Distribution", icon: Megaphone },
  founderAdvantage: { label: "Founder Advantage", icon: UserCheck },
} as const;

function ResultsView({ idea, analysis }: { idea: string; analysis: StartupAnalysis }) {
  const copyInsight = async () => {
    const text = `FailWise analysis · "${idea}"
Risk score: ${analysis.riskScore}/100 (${analysis.confidence} confidence)
Top risk: ${analysis.topFailureReason}

Powered by FailWise — founder intelligence platform`;
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Copy failed");
    }
  };

  const sevColor = useMemo(
    () =>
      ({
        low: "text-success bg-success/10 border-success/20",
        medium: "text-warning bg-warning/10 border-warning/20",
        high: "text-primary bg-primary/10 border-primary/20",
        critical: "text-primary bg-primary/15 border-primary/30",
      }) as const,
    [],
  );

  return (
    <div className="space-y-10" style={{ animation: "fade-in 400ms ease-out" }}>
      {/* Verdict + risk card */}
      <div className="grid gap-5 lg:grid-cols-[1fr_1.05fr]">
        <div className="rounded-xl border border-border bg-surface p-7">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
            Verdict · {analysis.confidence} confidence
          </div>
          <h2 className="mt-3 text-2xl font-semibold leading-snug tracking-tight">
            {analysis.verdict}
          </h2>
          <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
            {analysis.ideaSummary}
          </p>
          <div className="mt-6 flex gap-2">
            <button
              onClick={copyInsight}
              className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-background/40 px-3 text-[12px] hover:border-border-strong"
            >
              <Copy className="h-3 w-3" /> Copy insight
            </button>
            <ShareButton idea={idea} score={analysis.riskScore} />
          </div>
        </div>
        <RiskCard idea={idea} score={analysis.riskScore} reason={analysis.topFailureReason} />
      </div>

      {/* Dimensions */}
      <Section title="Intelligence Breakdown" subtitle="Scores across the five viability dimensions.">
        <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
          {(Object.keys(DIM_META) as Array<keyof typeof DIM_META>).map((k) => {
            const dim = analysis.dimensions[k];
            const meta = DIM_META[k];
            const Icon = meta.icon;
            const tone =
              dim.signal === "strong"
                ? "bg-success"
                : dim.signal === "neutral"
                  ? "bg-warning"
                  : dim.signal === "weak"
                    ? "bg-primary"
                    : "bg-primary";
            return (
              <div key={k} className="bg-surface p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[12px] uppercase tracking-wider text-muted-foreground">
                    <Icon className="h-3.5 w-3.5" />
                    {meta.label}
                  </div>
                  <span className="font-mono text-sm tabular-nums text-foreground">
                    {dim.score}
                  </span>
                </div>
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-border">
                  <div className={`h-full rounded-full ${tone}`} style={{ width: `${dim.score}%` }} />
                </div>
                <div className="mt-4 text-[14px] font-medium">{dim.insight}</div>
                <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
                  {dim.detail}
                </p>
                <div className="mt-4 inline-flex items-center rounded-full border border-border bg-background/40 px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                  {dim.signal} signal
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* Failure breakdown */}
      <Section
        icon={AlertTriangle}
        title="Risk Breakdown"
        subtitle="Specific risks to address before building."
      >
        <div className="grid gap-3 md:grid-cols-2">
          {analysis.failureBreakdown.map((f, i) => (
            <div key={i} className="rounded-xl border border-border bg-surface p-5">
              <div className="flex items-center justify-between">
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  {f.category}
                </div>
                <span
                  className={`rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase ${sevColor[f.severity]}`}
                >
                  {f.severity}
                </span>
              </div>
              <div className="mt-2 text-[15px] font-medium">{f.issue}</div>
              <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">{f.detail}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Pre-mortem */}
      <Section icon={Clock} title="Pre-Mortem" subtitle="How this fails over the next 12 months.">
        <ol className="relative space-y-5 border-l border-border pl-6">
          {analysis.preMortem.map((p, i) => (
            <li key={i} className="relative">
              <span className="absolute -left-[29px] h-2 w-2 translate-y-1.5 rounded-full bg-primary ring-4 ring-background" />
              <div className="font-mono text-[11px] uppercase tracking-wider text-primary">
                {p.month}
              </div>
              <div className="mt-1 text-[15px] font-medium">{p.event}</div>
              <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{p.impact}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* Rebuild */}
      <Section icon={Wand2} title="Rebuild Strategy" subtitle="The version of this that could actually win.">
        <div className="grid gap-3 md:grid-cols-2">
          <RebuildCard label="New positioning" text={analysis.rebuild.positioning} />
          <RebuildCard label="Sharper audience" text={analysis.rebuild.targetAudience} />
          <RebuildCard label="Pricing strategy" text={analysis.rebuild.pricingStrategy} />
          <RebuildCard label="Go-to-market" text={analysis.rebuild.gtmStrategy} />
        </div>
        <div className="mt-4 rounded-xl border border-border bg-surface p-6">
          <div className="flex items-center gap-2 text-[13px] font-medium">
            <Rocket className="h-3.5 w-3.5 text-success" /> MVP roadmap
          </div>
          <ol className="mt-4 space-y-2.5">
            {analysis.rebuild.mvpRoadmap.map((step, i) => (
              <li key={i} className="flex items-start gap-3 text-[13px]">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded border border-border bg-background font-mono text-[10px] tabular-nums text-muted-foreground">
                  {i + 1}
                </span>
                <span className="text-muted-foreground">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      <p className="pt-2 text-center text-[11px] text-muted-foreground">
        FailWise insights are AI-generated. Use as a sharpening tool, not gospel.
      </p>
    </div>
  );
}

function Section({
  icon: Icon,
  title,
  subtitle,
  children,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-5">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-muted-foreground">
          {Icon && <Icon className="h-3.5 w-3.5" />}
          {title}
        </div>
        {subtitle && <h3 className="mt-1.5 text-xl font-semibold tracking-tight">{subtitle}</h3>}
      </div>
      {children}
    </section>
  );
}

function RebuildCard({ label, text }: { label: string; text: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <div className="text-[11px] uppercase tracking-wider text-success">{label}</div>
      <p className="mt-2 text-[14px] leading-relaxed text-foreground">{text}</p>
    </div>
  );
}

function ShareButton({ idea, score }: { idea: string; score: number }) {
  const text = encodeURIComponent(
    `My startup idea scored ${score}/100 on FailWise:\n\n"${idea}"\n\nFind your startup's risk score 👇`,
  );
  const url = "https://failwise.ai";
  return (
    <a
      target="_blank"
      rel="noreferrer"
      href={`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(url)}`}
      className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-background/40 px-3 text-[12px] hover:border-border-strong"
    >
      Share on X
    </a>
  );
}
