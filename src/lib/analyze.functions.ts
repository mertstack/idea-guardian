import { createServerFn } from "@tanstack/react-start";
import { generateText, Output } from "ai";
import { z } from "zod";

import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const AnalysisSchema = z.object({
  ideaSummary: z.string(),
  riskScore: z.number().min(0).max(100),
  verdict: z.string(),
  topFailureReason: z.string(),
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

const SYSTEM = `You are FailWise, a brutally honest startup intelligence analyst.
You analyze startup ideas or existing companies for failure risk before founders waste time and money.
Be sharp, specific, and contrarian. No fluff. No generic advice. Use concrete examples and numbers when possible.
Tone: direct, smart, founder-to-founder. Like a senior YC partner who's seen 1000 startups die.`;

export const analyzeStartup = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => InputSchema.parse(d))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const gateway = createLovableAiGatewayProvider(key);

    const { experimental_output } = await generateText({
      model: gateway("google/gemini-3-flash-preview"),
      system: SYSTEM,
      prompt: `Analyze this startup idea or company for failure risk:\n\n"""${data.idea}"""\n\nProvide:
- ideaSummary: one crisp sentence describing what it is
- riskScore: 0-100 (higher = more likely to fail). Be honest, most ideas score 60-85.
- verdict: one punchy sentence (max 15 words)
- topFailureReason: the #1 reason this likely fails
- failureBreakdown: 4-6 specific risks across categories like Product-Market Fit, Pricing, Market Timing, Competition, Growth, Unit Economics, Team
- preMortem: 5-6 timeline events showing how this fails over 12 months (month: "Month 1", "Month 3", etc.)
- rebuild: how to fix it — new positioning, sharper audience, smarter pricing, 4-5 step MVP roadmap, GTM strategy`,
      experimental_output: Output.object({ schema: AnalysisSchema }),
    });

    return experimental_output;
  });
