import { BrandMark } from "./site-chrome";

export function RiskCard({ idea, score, reason }: { idea: string; score: number; reason: string }) {
  const tier =
    score >= 80 ? "Critical" : score >= 60 ? "High" : score >= 40 ? "Moderate" : "Low";
  const ring = `conic-gradient(var(--primary) ${score * 3.6}deg, oklch(1 0 0 / 0.08) 0deg)`;
  return (
    <div
      id="risk-card-share"
      className="relative overflow-hidden rounded-xl border border-border bg-surface p-7 shadow-elevated"
    >
      <div className="flex items-start justify-between gap-6">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Risk score
          </div>
          <h3 className="max-w-md text-xl font-semibold leading-tight">{idea}</h3>
          <p className="max-w-md text-[13px] leading-relaxed text-muted-foreground">
            <span className="font-medium text-foreground">Top risk · </span>
            {reason}
          </p>
        </div>
        <div
          className="relative grid h-28 w-28 shrink-0 place-items-center rounded-full"
          style={{ background: ring }}
        >
          <div className="grid h-[100px] w-[100px] place-items-center rounded-full bg-surface">
            <div className="text-center">
              <div className="text-3xl font-semibold tabular-nums text-primary">{score}</div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                {tier}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-7 flex items-center justify-between border-t border-border/80 pt-3.5 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <BrandMark className="h-3 w-3" /> failwise.ai
        </span>
        <span>Founder intelligence platform</span>
      </div>
    </div>
  );
}
