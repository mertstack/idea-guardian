import { Skull } from "lucide-react";

export function RiskCard({ idea, score, reason }: { idea: string; score: number; reason: string }) {
  const tier =
    score >= 80 ? "Critical" : score >= 60 ? "High" : score >= 40 ? "Moderate" : "Low";
  const ring = `conic-gradient(var(--primary) ${score * 3.6}deg, oklch(0.30 0.012 35) 0deg)`;
  return (
    <div
      id="risk-card-share"
      className="relative overflow-hidden rounded-2xl border border-border bg-card p-8 shadow-elevated"
      style={{
        backgroundImage:
          "radial-gradient(circle at 80% 0%, oklch(0.70 0.21 32 / 0.18), transparent 60%)",
      }}
    >
      <div className="flex items-start justify-between gap-6">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1 text-xs uppercase tracking-widest text-muted-foreground">
            <Skull className="h-3 w-3 text-primary" /> Failure Risk Card
          </div>
          <h3 className="max-w-md font-display text-2xl font-semibold leading-tight">
            {idea}
          </h3>
          <p className="max-w-md text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Top risk: </span>
            {reason}
          </p>
        </div>
        <div className="relative grid h-32 w-32 shrink-0 place-items-center rounded-full" style={{ background: ring }}>
          <div className="grid h-[110px] w-[110px] place-items-center rounded-full bg-card">
            <div className="text-center">
              <div className="font-display text-3xl font-bold text-gradient-risk">{score}</div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{tier} risk</div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8 flex items-center justify-between border-t border-border/60 pt-4 text-xs text-muted-foreground">
        <span className="font-mono">failwise.ai</span>
        <span>Powered by FailWise AI</span>
      </div>
    </div>
  );
}
