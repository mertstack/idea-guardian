import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  AlertTriangle,
  Check,
  ChevronRight,
  Clock,
  Copy,
  History,
  Loader2,
  Rocket,
  Sparkles,
  Wand2,
  X,
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
        content: "Get your startup's failure risk score, pre-mortem, and rebuild plan.",
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

const HISTORY_KEY = "failwise.history.v1";
const SAMPLES = [
  "An AI Notion for dentists",
  "Uber but for dog walkers in tier-3 Indian cities",
  "Subscription box for indie board games",
  "A no-code tool to build internal HR portals",
];

function AnalyzePage() {
  const analyze = useServerFn(analyzeStartup);
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
    mutationFn: async (input: string) => analyze({ data: { idea: input } }),
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
    onError: (err: Error) => {
      toast.error(err?.message || "Analysis failed. Try again.");
    },
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

      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 lg:grid-cols-[260px_1fr]">
        {/* Sidebar history */}
        <aside className="hidden lg:block">
          <div className="sticky top-6 space-y-3">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
              <History className="h-3.5 w-3.5" /> History
            </div>
            {history.length === 0 ? (
              <p className="rounded-lg border border-dashed border-border p-4 text-xs text-muted-foreground">
                Your analyzed ideas will appear here.
              </p>
            ) : (
              <ul className="space-y-1.5">
                {history.map((h) => (
                  <li key={h.id}>
                    <button
                      onClick={() => setActive(h)}
                      className={`group flex w-full items-start gap-2 rounded-lg border px-3 py-2.5 text-left text-xs transition-colors ${
                        active?.id === h.id
                          ? "border-primary/50 bg-primary/5"
                          : "border-border bg-card hover:border-border/80"
                      }`}
                    >
                      <span className="mt-0.5 inline-flex h-5 min-w-8 items-center justify-center rounded bg-primary/15 px-1 font-mono text-[10px] text-primary">
                        {h.score}
                      </span>
                      <span className="line-clamp-2 flex-1 text-foreground">{h.idea}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>

        <main className="space-y-10">
          {/* Input */}
          <section>
            <h1 className="font-display text-3xl font-semibold md:text-4xl">
              Stress-test your startup
            </h1>
            <p className="mt-2 text-muted-foreground">
              Drop in an idea or a company name. Get the risk score, the failure timeline, and the
              rebuild plan.
            </p>
            <form onSubmit={onSubmit} className="mt-6">
              <div className="relative rounded-2xl border border-border bg-card p-2 shadow-elevated focus-within:border-primary/60">
                <textarea
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  rows={3}
                  placeholder="e.g. A marketplace for freelance climate scientists…"
                  className="w-full resize-none rounded-xl bg-transparent px-4 py-3 text-base outline-none placeholder:text-muted-foreground"
                />
                <div className="flex flex-wrap items-center justify-between gap-3 px-2 pb-2 pt-1">
                  <div className="flex flex-wrap gap-1.5">
                    {SAMPLES.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setIdea(s)}
                        className="rounded-full border border-border bg-background/60 px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                  <button
                    type="submit"
                    disabled={mutation.isPending || !idea.trim()}
                    className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground disabled:opacity-50 glow-primary"
                  >
                    {mutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Analyzing…
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" /> Analyze
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </section>

          {mutation.isPending && <AnalyzingState />}

          {!mutation.isPending && !result && (
            <EmptyState onPick={(s) => setIdea(s)} />
          )}

          {result && active && (
            <ResultsView idea={active.idea} analysis={result} />
          )}
        </main>
      </div>
    </div>
  );
}

function AnalyzingState() {
  const steps = [
    "Reading the idea",
    "Mapping the market",
    "Hunting failure modes",
    "Simulating 12-month pre-mortem",
    "Drafting rebuild strategy",
  ];
  return (
    <div className="rounded-2xl border border-border bg-card p-8">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin text-primary" /> FailWise is thinking…
      </div>
      <ul className="mt-6 space-y-3">
        {steps.map((s, i) => (
          <li
            key={s}
            className="flex items-center gap-3 text-sm text-foreground"
            style={{ animation: `fade-in 400ms ease-out ${i * 200}ms both` }}
          >
            <span className="grid h-5 w-5 place-items-center rounded-full bg-primary/15 text-primary">
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
    <div className="rounded-2xl border border-dashed border-border p-10 text-center">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary">
        <Sparkles className="h-5 w-5" />
      </div>
      <h3 className="mt-4 font-display text-xl font-semibold">Ready when you are</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        Try one of these to see how FailWise breaks an idea down:
      </p>
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        {SAMPLES.map((s) => (
          <button
            key={s}
            onClick={() => onPick(s)}
            className="rounded-full border border-border bg-card px-3 py-1.5 text-xs hover:border-primary/50"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

function ResultsView({ idea, analysis }: { idea: string; analysis: StartupAnalysis }) {
  const copyInsight = async () => {
    const text = `🪦 FailWise verdict on "${idea}"
Risk: ${analysis.riskScore}/100
Top reason: ${analysis.topFailureReason}

Powered by FailWise AI`;
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
        low: "text-success bg-success/10",
        medium: "text-warning bg-warning/10",
        high: "text-primary bg-primary/15",
        critical: "text-destructive bg-destructive/15",
      }) as const,
    [],
  );

  return (
    <div className="space-y-8" style={{ animation: "fade-in 500ms ease-out" }}>
      {/* Verdict + Risk card */}
      <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <div className="rounded-2xl border border-border bg-card p-8">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Verdict</div>
          <h2 className="mt-3 font-display text-3xl font-semibold leading-tight">
            {analysis.verdict}
          </h2>
          <p className="mt-4 text-sm text-muted-foreground">{analysis.ideaSummary}</p>
          <div className="mt-6 flex gap-2">
            <button
              onClick={copyInsight}
              className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-background/60 px-3 text-xs hover:border-primary/50"
            >
              <Copy className="h-3.5 w-3.5" /> Copy insight
            </button>
            <ShareButton idea={idea} score={analysis.riskScore} />
          </div>
        </div>
        <RiskCard idea={idea} score={analysis.riskScore} reason={analysis.topFailureReason} />
      </div>

      {/* Failure breakdown */}
      <Section
        icon={AlertTriangle}
        title="Failure Breakdown"
        subtitle="Where this idea is most likely to crack"
      >
        <div className="grid gap-3 md:grid-cols-2">
          {analysis.failureBreakdown.map((f, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center justify-between">
                <div className="text-xs uppercase tracking-widest text-muted-foreground">
                  {f.category}
                </div>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase ${sevColor[f.severity]}`}>
                  {f.severity}
                </span>
              </div>
              <div className="mt-2 font-display text-lg font-semibold">{f.issue}</div>
              <p className="mt-1 text-sm text-muted-foreground">{f.detail}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Pre-mortem timeline */}
      <Section
        icon={Clock}
        title="Pre-Mortem Simulation"
        subtitle="How this dies, month by month"
      >
        <ol className="relative space-y-5 border-l border-border/80 pl-6">
          {analysis.preMortem.map((p, i) => (
            <li key={i} className="relative">
              <span className="absolute -left-[31px] grid h-5 w-5 place-items-center rounded-full bg-primary/20 text-primary ring-4 ring-background">
                <X className="h-3 w-3" />
              </span>
              <div className="text-xs font-mono uppercase tracking-widest text-primary">
                {p.month}
              </div>
              <div className="mt-1 font-display text-lg font-semibold">{p.event}</div>
              <p className="mt-1 text-sm text-muted-foreground">{p.impact}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* Rebuild */}
      <Section
        icon={Wand2}
        title="Rebuild Strategy"
        subtitle="The version of this idea that could actually win"
        accent
      >
        <div className="grid gap-4 md:grid-cols-2">
          <RebuildCard label="New positioning" text={analysis.rebuild.positioning} />
          <RebuildCard label="Sharper audience" text={analysis.rebuild.targetAudience} />
          <RebuildCard label="Pricing strategy" text={analysis.rebuild.pricingStrategy} />
          <RebuildCard label="Go-to-market" text={analysis.rebuild.gtmStrategy} />
        </div>
        <div className="mt-6 rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Rocket className="h-4 w-4 text-success" /> MVP roadmap
          </div>
          <ol className="mt-4 space-y-2">
            {analysis.rebuild.mvpRoadmap.map((step, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-gradient-to-br from-success/30 to-accent/30 font-mono text-xs">
                  {i + 1}
                </span>
                <span className="text-muted-foreground">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      <p className="pt-2 text-center text-xs text-muted-foreground">
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
  accent,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <section>
      <div className="mb-5 flex items-end justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
            <Icon className={`h-3.5 w-3.5 ${accent ? "text-success" : "text-primary"}`} />
            {title}
          </div>
          {subtitle && (
            <h3 className="mt-1 font-display text-2xl font-semibold">{subtitle}</h3>
          )}
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </div>
      {children}
    </section>
  );
}

function RebuildCard({ label, text }: { label: string; text: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="text-xs uppercase tracking-widest text-success">{label}</div>
      <p className="mt-2 text-sm text-foreground">{text}</p>
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
      className="inline-flex h-9 items-center gap-2 rounded-md bg-foreground px-3 text-xs font-medium text-background hover:opacity-90"
    >
      Share on X
    </a>
  );
}
