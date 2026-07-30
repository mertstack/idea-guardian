import { BrandMark } from "./site-chrome";
import { useI18n } from "@/lib/i18n";

export function RiskCard({ idea, score, reason }: { idea: string; score: number; reason: string }) {
  const { t } = useI18n();
  const clamped = Math.min(Math.max(Math.round(score), 0), 100);
  const tier =
    clamped >= 80
      ? t("risk.tier.critical")
      : clamped >= 60
        ? t("risk.tier.high")
        : clamped >= 40
          ? t("risk.tier.moderate")
          : t("risk.tier.low");

  const R = 54;
  const C = 2 * Math.PI * R;
  const dash = (clamped / 100) * C;
  const TICKS = 60;

  return (
    <div
      id="risk-card-share"
      className="group relative overflow-hidden rounded-2xl border border-border bg-surface shadow-elevated"
    >
      {/* top hairline accent */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, color-mix(in oklab, var(--primary) 70%, transparent), transparent)",
        }}
      />
      {/* ambient wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-28 -top-28 h-72 w-72 rounded-full opacity-[0.16] blur-3xl transition-opacity duration-500 group-hover:opacity-[0.26]"
        style={{ background: "var(--primary)" }}
      />
      {/* fine grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "26px 26px",
          maskImage: "radial-gradient(circle at 85% -10%, black, transparent 65%)",
        }}
      />

      <div className="relative flex items-start justify-between gap-8 p-8">
        <div className="min-w-0 space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
            </span>
            {t("risk.scoreLabel")}
          </div>

          <h3 className="max-w-md text-balance text-[23px] font-semibold leading-[1.22] tracking-[-0.022em]">
            {idea}
          </h3>

          <div className="max-w-md rounded-lg border border-border/70 bg-background/40 p-4">
            <div className="mb-1.5 flex items-center gap-2">
              <span className="h-3 w-[2px] rounded-full bg-primary" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
                {t("risk.topRisk")}
              </span>
            </div>
            <p className="text-[13px] leading-relaxed text-muted-foreground">{reason}</p>
          </div>
        </div>

        <div className="relative grid h-36 w-36 shrink-0 place-items-center">
          <svg viewBox="0 0 140 140" className="h-36 w-36">
            {/* tick ring */}
            <g opacity="0.5">
              {Array.from({ length: TICKS }).map((_, i) => {
                const a = (i / TICKS) * Math.PI * 2 - Math.PI / 2;
                const on = i / TICKS <= clamped / 100;
                const r1 = 66;
                const r2 = on ? 61 : 63;
                return (
                  <line
                    key={i}
                    x1={70 + Math.cos(a) * r1}
                    y1={70 + Math.sin(a) * r1}
                    x2={70 + Math.cos(a) * r2}
                    y2={70 + Math.sin(a) * r2}
                    stroke={on ? "var(--primary)" : "currentColor"}
                    className={on ? "" : "text-border"}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                );
              })}
            </g>
            <g transform="rotate(-90 70 70)">
              <circle
                cx="70"
                cy="70"
                r={R}
                fill="none"
                stroke="currentColor"
                strokeWidth="7"
                className="text-border"
              />
              <circle
                cx="70"
                cy="70"
                r={R}
                fill="none"
                stroke="var(--primary)"
                strokeWidth="7"
                strokeLinecap="round"
                strokeDasharray={`${dash} ${C}`}
                style={{ transition: "stroke-dasharray 900ms cubic-bezier(0.16,1,0.3,1)" }}
              />
            </g>
          </svg>
          <div className="absolute inset-0 grid place-items-center">
            <div className="text-center">
              <div className="font-mono text-[36px] font-semibold leading-none tabular-nums text-primary">
                {clamped}
              </div>
              <div className="mt-2 text-[9px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                {tier}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative flex items-center justify-between border-t border-border/70 bg-background/30 px-8 py-4 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1.5 font-medium text-foreground/80">
          <BrandMark className="h-3 w-3 text-primary" /> failwise.ai
        </span>
        <span className="tracking-wide">{t("risk.platform")}</span>
      </div>
    </div>
  );
}
