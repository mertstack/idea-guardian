import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Sparkles } from "lucide-react";

import { SiteFooter, SiteHeader } from "@/components/site-chrome";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — FailWise" },
      {
        name: "description",
        content: "Free, Pro, and Expert plans for startup founders who want to avoid building failed products.",
      },
    ],
  }),
  component: Pricing,
});

const tiers = [
  {
    name: "Free",
    price: "$0",
    cadence: "forever",
    accent: "border-border",
    features: [
      "1 analysis per month",
      "Basic failure explanation",
      "Limited results access",
      "Watermark on share cards",
    ],
    cta: "Start free",
  },
  {
    name: "Pro",
    price: "$19",
    cadence: "/month",
    accent: "border-primary shadow-glow",
    highlight: true,
    features: [
      "Unlimited startup analyses",
      "Full failure breakdown engine",
      "Risk score + insights",
      "Pre-mortem simulation",
      "Shareable cards (no watermark)",
    ],
    cta: "Get Pro",
  },
  {
    name: "Expert",
    price: "$39",
    cadence: "/month",
    accent: "border-accent/60",
    features: [
      "Everything in Pro",
      "Advanced 6–12 month pre-mortem",
      "Full rebuild engine (MVP + pricing + GTM)",
      "Investor-style PDF reports",
      "Competitor failure comparisons",
      "Weekly startup risk insights",
    ],
    cta: "Go Expert",
  },
];

function Pricing() {
  return (
    <div className="relative min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" /> Simple, founder-friendly pricing
          </div>
          <h1 className="mt-6 font-display text-5xl font-semibold tracking-tight">
            Pay less than one bad sprint.
          </h1>
          <p className="mt-4 text-muted-foreground">
            One avoided dead-end pays for years of FailWise.
          </p>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`relative flex flex-col rounded-2xl border bg-card p-8 ${t.accent}`}
            >
              {t.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                  Most popular
                </div>
              )}
              <div className="font-display text-lg font-semibold">{t.name}</div>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="font-display text-5xl font-bold">{t.price}</span>
                <span className="text-sm text-muted-foreground">{t.cadence}</span>
              </div>
              <ul className="mt-8 flex-1 space-y-3 text-sm">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                    <span className="text-muted-foreground">{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/analyze"
                className={`mt-8 inline-flex h-11 items-center justify-center rounded-md px-4 text-sm font-medium transition-transform hover:scale-[1.02] ${
                  t.highlight
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-background/60 text-foreground"
                }`}
              >
                {t.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
