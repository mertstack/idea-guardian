import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Sparkles } from "lucide-react";

import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — FailWise" },
      {
        name: "description",
        content:
          "Free, Pro, and Expert plans for startup founders who want to avoid building failed products.",
      },
    ],
  }),
  component: Pricing,
});

function Pricing() {
  const { t } = useI18n();

  const tiers = [
    {
      name: t("pricing.free.name"),
      price: "$0",
      cadence: t("pricing.cadence.forever"),
      accent: "border-border",
      features: [
        t("pricing.free.f1"),
        t("pricing.free.f2"),
        t("pricing.free.f3"),
        t("pricing.free.f4"),
      ],
      cta: t("pricing.free.cta"),
    },
    {
      name: t("pricing.pro.name"),
      price: "$19",
      cadence: t("pricing.cadence.month"),
      accent: "border-primary shadow-glow",
      highlight: true,
      features: [
        t("pricing.pro.f1"),
        t("pricing.pro.f2"),
        t("pricing.pro.f3"),
        t("pricing.pro.f4"),
        t("pricing.pro.f5"),
      ],
      cta: t("pricing.pro.cta"),
    },
    {
      name: t("pricing.expert.name"),
      price: "$39",
      cadence: t("pricing.cadence.month"),
      accent: "border-accent/60",
      features: [
        t("pricing.expert.f1"),
        t("pricing.expert.f2"),
        t("pricing.expert.f3"),
        t("pricing.expert.f4"),
        t("pricing.expert.f5"),
        t("pricing.expert.f6"),
      ],
      cta: t("pricing.expert.cta"),
    },
  ];

  return (
    <div className="relative min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" /> {t("pricing.badge")}
          </div>
          <h1 className="mt-6 font-display text-5xl font-semibold tracking-tight">
            {t("pricing.title")}
          </h1>
          <p className="mt-4 text-muted-foreground">{t("pricing.sub")}</p>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative flex flex-col rounded-2xl border bg-card p-8 ${tier.accent}`}
            >
              {tier.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                  {t("pricing.mostPopular")}
                </div>
              )}
              <div className="font-display text-lg font-semibold">{tier.name}</div>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="font-display text-5xl font-bold">{tier.price}</span>
                <span className="text-sm text-muted-foreground">{tier.cadence}</span>
              </div>
              <ul className="mt-8 flex-1 space-y-3 text-sm">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                    <span className="text-muted-foreground">{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/analyze"
                className={`mt-8 inline-flex h-11 items-center justify-center rounded-md px-4 text-sm font-medium transition-transform hover:scale-[1.02] ${
                  tier.highlight
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-background/60 text-foreground"
                }`}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
