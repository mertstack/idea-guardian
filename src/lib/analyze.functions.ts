import { createServerFn } from "@tanstack/react-start";
import { generateText, Output } from "ai";
import { z } from "zod";

import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const DimensionSchema = z.object({
  score: z.number().min(0).max(100),
  signal: z.enum(["strong", "neutral", "weak", "critical"]),
  insight: z.string(),
  detail: z.string(),
});

const AnalysisSchema = z.object({
  ideaSummary: z.string(),
  riskScore: z.number().min(0).max(100),
  confidence: z.enum(["low", "medium", "high"]),
  verdict: z.string(),
  topFailureReason: z.string(),
  dimensions: z.object({
    marketDemand: DimensionSchema,
    competition: DimensionSchema,
    pricing: DimensionSchema,
    distribution: DimensionSchema,
    founderAdvantage: DimensionSchema,
  }),
  failureBreakdown: z.array(
    z.object({
      category: z.string(),
      severity: z.enum(["low", "medium", "high", "critical"]),
      issue: z.string(),
      detail: z.string(),
    }),
  ),
  preMortem: z.array(
    z.object({
      month: z.string(),
      event: z.string(),
      impact: z.string(),
    }),
  ),
  rebuild: z.object({
    positioning: z.string(),
    targetAudience: z.string(),
    pricingStrategy: z.string(),
    mvpRoadmap: z.array(z.string()),
    gtmStrategy: z.string(),
  }),
});

export type StartupAnalysis = z.infer<typeof AnalysisSchema>;

const InputSchema = z.object({
  idea: z.string().min(5).max(2000),
});

const SYSTEM = `You are FailWise, a founder intelligence analyst.
You evaluate startup ideas and companies with the rigor of a senior YC partner and the data orientation of an investor analyst.
Be precise, contrarian where warranted, and constructive. No fluff, no doom-mongering. Founders use this to make better decisions before they build.
Tone: calm, sharp, data-driven, investor-grade.`;

export const analyzeStartup = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => InputSchema.parse(d))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const gateway = createLovableAiGatewayProvider(key);

    const { experimental_output } = await generateText({
      model: gateway("google/gemini-3-flash-preview"),
      system: SYSTEM,
      prompt: `Analyze this startup idea or company:\n\n"""${data.idea}"""\n\nReturn structured intelligence:
- ideaSummary: one crisp sentence describing what it is
- riskScore: 0-100 overall failure probability (higher = more likely to fail). Calibrate honestly.
- confidence: low/medium/high based on idea clarity
- verdict: one punchy sentence (max 15 words)
- topFailureReason: the #1 reason this likely fails
- dimensions: score each on 0-100 (HIGHER = STRONGER signal / less risk on that dimension), with signal label (strong/neutral/weak/critical), one-line insight, and 1-2 sentence detail.
  - marketDemand: is there real, urgent demand? evidence of pull?
  - competition: how crowded/defensible? moat potential?
  - pricing: pricing power, willingness to pay, unit economics
  - distribution: realistic channels to acquire users at sane CAC
  - founderAdvantage: founder-market fit, unfair advantage
- failureBreakdown: 4-6 specific risks across PMF, pricing, timing, competition, growth, unit economics, team
- preMortem: 5-6 timeline events showing how this fails over 12 months ("Month 1", "Month 3"…)
- rebuild: how to make it work — positioning, sharper audience, pricing strategy, 4-5 step MVP roadmap, GTM`,
      experimental_output: Output.object({ schema: AnalysisSchema }),
    });

    return experimental_output;
  });
