import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Brain,
  ClipboardCheck,
  Compass,
  LineChart,
  Share2,
  Sparkles,
  Target,
  TrendingDown,
} from "lucide-react";

import { SiteFooter, SiteHeader } from "@/components/site-chrome";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FailWise — Don't build what will fail" },
      {
        name: "description",
        content:
          "AI startup intelligence that analyzes your idea for failure risk, simulates a pre-mortem, and rebuilds it for success.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="relative min-h-screen">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[900px]"
        style={{ background: "var(--gradient-hero)" }}
      />
      <SiteHeader />

      {/* Hero */}
      <section className="relative mx-auto max-w-6xl px-6 pt-24 pb-20 text-center">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 text-xs text-muted-foreground backdrop-blur">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          Startup decision intelligence — before you build
        </div>
        <h1 className="mx-auto mt-8 max-w-4xl font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl">
          Don't build what will <span className="text-gradient-risk">fail.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
          FailWise is an AI that analyzes your startup before you waste time and money — risk score,
          pre-mortem simulation, and a rebuild strategy in under a minute.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to="/analyze"
            className="group inline-flex h-12 items-center gap-2 rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.02] glow-primary"
          >
            Analyze your idea
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            to="/pricing"
            className="inline-flex h-12 items-center rounded-md border border-border bg-card/60 px-6 text-sm font-medium text-foreground backdrop-blur hover:bg-card"
          >
            See pricing
          </Link>
        </div>

        {/* Mock dashboard preview */}
        <div className="relative mx-auto mt-20 max-w-5xl">
          <div className="absolute -inset-8 -z-10 rounded-3xl bg-gradient-to-b from-primary/20 to-transparent blur-3xl" />
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-elevated">
            <div className="flex items-center gap-1.5 border-b border-border bg-background/40 px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-warning/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
              <span className="ml-3 font-mono text-xs text-muted-foreground">
                failwise.ai/analyze
              </span>
            </div>
            <div className="grid gap-6 p-8 md:grid-cols-3">
              <div className="md:col-span-1">
                <div className="rounded-xl border border-border bg-background/40 p-6 text-left">
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">
                    Risk score
                  </div>
                  <div className="mt-2 font-display text-6xl font-bold text-gradient-risk">82</div>
                  <div className="mt-1 text-sm text-muted-foreground">Critical — likely to fail</div>
                </div>
              </div>
              <div className="space-y-3 md:col-span-2">
                {[
                  ["Product-Market Fit", "No clear urgent pain", "high"],
                  ["Pricing", "Underpriced for B2B buyer", "medium"],
                  ["Competition", "Crowded category, no moat", "critical"],
                ].map(([cat, issue, sev]) => (
                  <div
                    key={cat}
                    className="flex items-center justify-between rounded-lg border border-border bg-background/40 px-4 py-3 text-left"
                  >
                    <div>
                      <div className="text-xs uppercase tracking-widest text-muted-foreground">
                        {cat}
                      </div>
                      <div className="text-sm text-foreground">{issue}</div>
                    </div>
                    <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-medium text-primary">
                      {sev}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="how" className="mx-auto max-w-6xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <div className="text-xs uppercase tracking-widest text-primary">How it works</div>
          <h2 className="mt-3 font-display text-4xl font-semibold">
            Stress-test your startup before reality does.
          </h2>
        </div>
        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="group relative rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/40"
            >
              <div className="mb-4 grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="font-display text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-6 py-24">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-12 text-center shadow-elevated">
          <div
            className="absolute inset-0 -z-10 opacity-60"
            style={{ background: "var(--gradient-hero)" }}
          />
          <h2 className="font-display text-4xl font-semibold md:text-5xl">
            Check it <span className="text-gradient-risk">before</span> you build it.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Indie hackers, founders, and product builders use FailWise to avoid the dead ideas and
            sharpen the live ones.
          </p>
          <Link
            to="/analyze"
            className="mt-8 inline-flex h-12 items-center gap-2 rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground glow-primary"
          >
            Run a free analysis <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

const features = [
  {
    icon: Brain,
    title: "Startup Risk Analyzer",
    body: "AI scores your idea 0–100 and explains the failure probability in plain language.",
  },
  {
    icon: TrendingDown,
    title: "Failure Breakdown Engine",
    body: "PMF, pricing, market timing, competition, growth — every weak point named and ranked.",
  },
  {
    icon: LineChart,
    title: "Pre-Mortem Simulator",
    body: "A month-by-month simulation of how this startup dies in the next 6–12 months.",
  },
  {
    icon: Compass,
    title: "Rebuild Mode",
    body: "New positioning, sharper ICP, smarter pricing, and an MVP roadmap that survives.",
  },
  {
    icon: Share2,
    title: "Shareable Risk Card",
    body: "One-click beautiful card for X and LinkedIn. Make founders fear and follow you.",
  },
  {
    icon: Target,
    title: "Decision Intelligence",
    body: "Not content. Not advice. A decision system you check before writing the first line of code.",
  },
];

void ClipboardCheck;
