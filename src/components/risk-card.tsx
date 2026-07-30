import { BrandMark } from "./site-chrome";
import { useI18n } from "@/lib/i18n";

export function RiskCard({ idea, score, reason }: { idea: string; score: number; reason: string }) {
  const { t } = useI18n();
  const tier =
    score >= 80
      ? t("risk.tier.critical")
      : score >= 60
        ? t("risk.tier.high")
        : score >= 40
          ? t("risk.tier.moderate")
          : t("risk.tier.low");

  const R = 52;
  const C = 2 * Math.PI * R;
  const dash = (Math.min(Math.max(score, 0), 100) / 100) * C;

  return (
    <div
      id="risk-card-share"
      className="group relative overflow-hidden rounded-2xl border border-border bg-surface shadow-elevated"
    >
      {/* ambient wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full opacity-[0.18] blur-3xl"
        style={{ background: "var(--primary)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage: "radial-gradient(circle at 80% 0%, black, transparent 70%)",
        }}
      />

      <div className="relative flex items-start justify-between gap-8 p-8">
        <div className="min-w-0 space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            {t("risk.scoreLabel")}
          </div>
          <h3 className="max-w-md text-[22px] font-semibold leading-[1.25] tracking-[-0.02em] text-balance">
            {idea}
          </h3>
          <div className="max-w-md space-y-1.5 border-l-2 border-primary/40 pl-3.5">
            <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">
              {t("risk.topRisk")}
            </div>
            <p className="text-[13px] leading-relaxed text-muted-foreground">{reason}</p>
          </div>
        </div>

        <div className="relative grid h-32 w-32 shrink-0 place-items-center">
          <svg viewBox="0 0 120 120" className="h-32 w-32 -rotate-90">
            <circle
              cx="60"
              cy="60"
              r={R}
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-border"
            />
            <circle
              cx="60"
              cy="60"
              r={R}
              fill="none"
              stroke="var(--primary)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${dash} ${C}`}
              style={{ transition: "stroke-dasharray 900ms cubic-bezier(0.16,1,0.3,1)" }}
            />
          </svg>
          <div className="absolute inset-0 grid place-items-center">
            <div className="text-center">
              <div className="font-mono text-[34px] font-semibold leading-none tabular-nums text-primary">
                {score}
              </div>
              <div className="mt-1.5 text-[9px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                {tier}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative flex items-center justify-between border-t border-border/70 px-8 py-4 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1.5 font-medium text-foreground/80">
          <BrandMark className="h-3 w-3 text-primary" /> failwise.ai
        </span>
        <span className="tracking-wide">{t("risk.platform")}</span>
      </div>
    </div>
  );
}
