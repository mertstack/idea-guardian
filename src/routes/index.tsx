import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Compass,
  Gauge,
  LineChart,
  Megaphone,
  Network,
  ShieldCheck,
  Sparkles,
  Tag,
  UserCheck,
} from "lucide-react";

import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FailWise — Founder intelligence platform" },
      {
        name: "description",
        content:
          "FailWise is the founder intelligence platform. Score your idea on market demand, competition, pricing, distribution, and founder advantage before you build.",
      },
      { property: "og:title", content: "FailWise — Founder intelligence platform" },
      {
        property: "og:description",
        content: "AI startup intelligence: risk score, pre-mortem, and rebuild plan.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  const { t } = useI18n();
  return (
    <div className="relative min-h-screen">
      <SiteHeader />

      {/* Hero */}
      <section className="relative mx-auto max-w-6xl px-6 pt-20 pb-24">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 px-3 py-1 text-[12px] text-muted-foreground backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            {t("hero.badge")}
          </div>
          <h1 className="mt-7 text-balance text-5xl font-semibold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
            {t("hero.title.a")} <span className="text-primary">{t("hero.title.b")}</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-[17px] leading-relaxed text-muted-foreground md:text-lg">
            {t("hero.subtitle")}
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/analyze"
              className="group inline-flex h-11 items-center gap-2 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {t("hero.cta.analyze")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/pricing"
              className="inline-flex h-11 items-center gap-1.5 rounded-md border border-border bg-surface px-5 text-sm font-medium text-foreground hover:bg-surface-2"
            >
              {t("hero.cta.pricing")} <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <p className="mt-5 text-xs text-muted-foreground">
            {t("hero.note")}
          </p>
        </div>


        {/* Dashboard preview */}
        <DashboardPreview />
      </section>

      {/* Intelligence dimensions */}
      <section id="intelligence" className="mx-auto max-w-6xl px-6 py-24">
        <SectionHeader
          eyebrow="Intelligence"
          title="Five dimensions of startup viability"
          sub="Every analysis is graded across the dimensions that decide which startups survive."
        />
        <div className="mt-14 grid gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
          {dimensions.map((d) => (
            <div key={d.title} className="group relative bg-surface p-7">
              <div className="flex items-center gap-2.5 text-[12px] uppercase tracking-wider text-muted-foreground">
                <d.icon className="h-3.5 w-3.5 text-primary" />
                {d.eyebrow}
              </div>
              <h3 className="mt-3 text-lg font-semibold">{d.title}</h3>
              <p className="mt-1.5 text-[14px] leading-relaxed text-muted-foreground">{d.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How risk score works */}
      <section id="how-it-works" className="mx-auto max-w-6xl px-6 py-24">
        <SectionHeader
          eyebrow="Methodology"
          title="How the Risk Score works"
          sub="A composite signal calibrated against the dimensions that actually predict failure."
        />
        <div className="mt-14 grid gap-10 lg:grid-cols-[1.1fr_1fr]">
          <ol className="space-y-6">
            {[
              {
                t: "Idea decomposition",
                b: "Your idea is parsed into market, audience, product, business model, and channel hypotheses.",
              },
              {
                t: "Dimension scoring",
                b: "Each of the five intelligence dimensions is scored 0–100 with a signal label and a structured rationale.",
              },
              {
                t: "Risk weighting",
                b: "Dimensions are weighted by historical impact on early-stage outcomes. Distribution and demand carry the most weight.",
              },
              {
                t: "Composite score",
                b: "The dimensions are combined into a single 0–100 Risk Score with a calibrated verdict and confidence level.",
              },
            ].map((s, i) => (
              <li key={s.t} className="flex gap-4">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md border border-border bg-surface text-[12px] font-medium tabular-nums text-muted-foreground">
                  {i + 1}
                </span>
                <div>
                  <div className="text-[15px] font-medium">{s.t}</div>
                  <p className="mt-1 text-[14px] leading-relaxed text-muted-foreground">{s.b}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="rounded-xl border border-border bg-surface p-7">
            <div className="flex items-center justify-between text-[12px] uppercase tracking-wider text-muted-foreground">
              <span>Risk score · interpretation</span>
              <Gauge className="h-3.5 w-3.5" />
            </div>
            <div className="mt-5 space-y-3">
              {[
                { label: "0–39 · Low risk", color: "bg-success", desc: "Strong signal across most dimensions." },
                { label: "40–59 · Moderate", color: "bg-warning", desc: "Workable, but specific weaknesses to address." },
                { label: "60–79 · High", color: "bg-primary", desc: "Material risks — rebuild before committing." },
                { label: "80–100 · Critical", color: "bg-primary", desc: "Likely to fail as currently framed." },
              ].map((row) => (
                <div key={row.label} className="flex items-center gap-3 rounded-md border border-border bg-background/40 p-3">
                  <span className={`h-2 w-2 rounded-full ${row.color}`} />
                  <div className="flex-1">
                    <div className="text-[13px] font-medium">{row.label}</div>
                    <div className="text-[12px] text-muted-foreground">{row.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-6 py-24">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-surface px-10 py-14 text-center">
          <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
            Validate before you build.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[15px] text-muted-foreground">
            One analysis can save a quarter of wasted engineering. Run yours in under a minute.
          </p>
          <Link
            to="/analyze"
            className="mt-7 inline-flex h-11 items-center gap-2 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Start free analysis <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function SectionHeader({
  eyebrow,
  title,
  sub,
}: {
  eyebrow: string;
  title: string;
  sub?: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <div className="text-[12px] font-medium uppercase tracking-wider text-primary">{eyebrow}</div>
      <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight md:text-4xl">
        {title}
      </h2>
      {sub && <p className="mx-auto mt-3 max-w-xl text-[15px] text-muted-foreground">{sub}</p>}
    </div>
  );
}

function DashboardPreview() {
  const bars = [
    { label: "Market Demand", val: 72, tone: "success" },
    { label: "Competition", val: 38, tone: "primary" },
    { label: "Pricing", val: 58, tone: "warning" },
    { label: "Distribution", val: 41, tone: "primary" },
    { label: "Founder Advantage", val: 66, tone: "success" },
  ] as const;

  return (
    <div className="relative mx-auto mt-16 max-w-5xl">
      <div className="absolute -inset-12 -z-10 rounded-[2rem] bg-[radial-gradient(ellipse_at_top,oklch(0.66_0.22_25/0.15),transparent_70%)] blur-2xl" />
      <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-elevated">
        <div className="flex items-center justify-between border-b border-border bg-background/40 px-4 py-2.5">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-border-strong" />
            <span className="h-2.5 w-2.5 rounded-full bg-border-strong" />
            <span className="h-2.5 w-2.5 rounded-full bg-border-strong" />
            <span className="ml-3 font-mono text-[11px] text-muted-foreground">
              failwise.ai / analyze
            </span>
          </div>
          <span className="rounded-full border border-border px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
            Live
          </span>
        </div>
        <div className="grid gap-6 p-8 md:grid-cols-[260px_1fr]">
          <div className="rounded-xl border border-border bg-background/40 p-6">
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Risk score</div>
            <div className="mt-2 text-6xl font-semibold tabular-nums text-primary">68</div>
            <div className="mt-1 text-sm text-muted-foreground">High risk · medium confidence</div>
            <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-border">
              <div className="h-full rounded-full bg-primary" style={{ width: "68%" }} />
            </div>
          </div>
          <div className="space-y-2">
            {bars.map((b) => (
              <div
                key={b.label}
                className="flex items-center gap-4 rounded-md border border-border bg-background/40 px-4 py-2.5"
              >
                <span className="w-44 text-[13px] text-foreground">{b.label}</span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-border">
                  <div
                    className={`h-full rounded-full ${
                      b.tone === "success"
                        ? "bg-success"
                        : b.tone === "warning"
                          ? "bg-warning"
                          : "bg-primary"
                    }`}
                    style={{ width: `${b.val}%` }}
                  />
                </div>
                <span className="w-10 text-right font-mono text-[12px] tabular-nums text-muted-foreground">
                  {b.val}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const dimensions = [
  {
    icon: BarChart3,
    eyebrow: "Market",
    title: "Market Demand Analysis",
    body: "Is there urgent, paid demand? We grade pull signal, market size, and timing.",
  },
  {
    icon: Network,
    eyebrow: "Competition",
    title: "Competition Analysis",
    body: "Density of the category, defensibility, and the realistic moat you can build.",
  },
  {
    icon: Tag,
    eyebrow: "Pricing",
    title: "Pricing Analysis",
    body: "Willingness-to-pay, anchor pricing, and the unit economics that follow.",
  },
  {
    icon: Megaphone,
    eyebrow: "Distribution",
    title: "Distribution Analysis",
    body: "The channels you can realistically own — and what CAC looks like there.",
  },
  {
    icon: UserCheck,
    eyebrow: "Founder",
    title: "Founder Advantage Analysis",
    body: "Founder-market fit, distribution edge, and the unfair advantage you bring.",
  },
  {
    icon: ShieldCheck,
    eyebrow: "Output",
    title: "Calibrated Risk Score",
    body: "A composite 0–100 score with confidence level and a structured rationale.",
  },
];

void Sparkles;
void LineChart;
void Compass;
