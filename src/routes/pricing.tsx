import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Building2, Check, Sparkles } from "lucide-react";

import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — FailWise" },
      {
        name: "description",
        content:
          "Free, Pro, Expert and Intelligence plans for founders who want evidence before they build.",
      },
      { property: "og:title", content: "Pricing — FailWise" },
      { property: "og:description", content: "Free, Pro, Expert and Intelligence plans for founders." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Pricing,
});

function Pricing() {
  const { t, lang } = useI18n();

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
    {
      name: t("pricing.intel.name"),
      price: "$59",
      cadence: t("pricing.cadence.month"),
      accent: "border-primary/50 bg-gradient-to-b from-primary/[0.07] to-card",
      premium: true,
      tagline: t("pricing.intel.tag"),
      features: [
        t("pricing.intel.f1"),
        t("pricing.intel.f2"),
        t("pricing.intel.f3"),
        t("pricing.intel.f4"),
        t("pricing.intel.f5"),
        t("pricing.intel.f6"),
      ],
      cta: t("pricing.intel.cta"),
    },
  ] as Array<{ name: string; price: string; cadence: string; accent: string; highlight?: boolean; premium?: boolean; tagline?: string; features: string[]; cta: string }>;

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

        <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
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
              {tier.premium && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full border border-primary/40 bg-background px-3 py-1 text-xs font-medium text-primary">
                  {t("pricing.premium")}
                </div>
              )}
              <div className="font-display text-lg font-semibold">{tier.name}</div>
              {tier.tagline && <p className="mt-1 text-xs text-muted-foreground">{tier.tagline}</p>}
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
                to={tier.premium ? "/intelligence" : "/analyze"}
                className={`mt-8 inline-flex h-11 items-center justify-center rounded-md px-4 text-sm font-medium transition-transform hover:scale-[1.02] ${
                  tier.highlight || tier.premium
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-background/60 text-foreground"
                }`}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>
        <div className="mt-14 flex flex-col justify-between gap-6 border-y border-border py-8 sm:flex-row sm:items-center">
          <div className="max-w-lg"><p className="mb-3 flex items-center gap-2 text-xs font-medium text-primary"><Building2 className="h-4 w-4" />FailWise B2B</p><h2 className="text-2xl font-semibold">{lang === "tr" ? "kendi markanla, kendi panelinle" : "your brand, your workspace"}</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">{lang === "tr" ? "Danışmanlık, yatırım ve inovasyon ekipleri için şirketlere özel deneyimi keşfedin." : "Explore a company-specific experience for consulting, investment and innovation teams."}</p></div>
          <Button asChild variant="outline"><Link to="/enterprise">{lang === "tr" ? "Kurumsal çözümleri keşfet" : "Explore enterprise solutions"}<ArrowRight /></Link></Button>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
