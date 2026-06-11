import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
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
Tone: calm, sharp, data-driven, investor-grade.
You always reply with a single valid JSON object — no prose, no markdown fences.`;

function extractJson(text: string): string {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1] : text;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("No JSON object found in model response");
  return candidate.slice(start, end + 1);
}

export const analyzeStartup = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => InputSchema.parse(d))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const gateway = createLovableAiGatewayProvider(key);

    const { text } = await generateText({
      model: gateway("google/gemini-3-flash-preview"),
      system: SYSTEM,
      prompt: `Analyze this startup idea or company:\n\n"""${data.idea}"""\n\nReturn a SINGLE JSON object (no prose, no code fences) with this exact shape:
{
  "ideaSummary": string,                                  // one crisp sentence
  "riskScore": number,                                    // 0-100, higher = more likely to fail
  "confidence": "low" | "medium" | "high",
  "verdict": string,                                      // one punchy sentence, max 15 words
  "topFailureReason": string,                             // #1 reason this likely fails
  "dimensions": {
    "marketDemand":     { "score": number, "signal": "strong"|"neutral"|"weak"|"critical", "insight": string, "detail": string },
    "competition":      { "score": number, "signal": "strong"|"neutral"|"weak"|"critical", "insight": string, "detail": string },
    "pricing":          { "score": number, "signal": "strong"|"neutral"|"weak"|"critical", "insight": string, "detail": string },
    "distribution":     { "score": number, "signal": "strong"|"neutral"|"weak"|"critical", "insight": string, "detail": string },
    "founderAdvantage": { "score": number, "signal": "strong"|"neutral"|"weak"|"critical", "insight": string, "detail": string }
  },
  "failureBreakdown": [ { "category": string, "severity": "low"|"medium"|"high"|"critical", "issue": string, "detail": string } ],  // 4-6 items
  "preMortem":        [ { "month": string, "event": string, "impact": string } ],                                                  // 5-6 items, e.g. "Month 1"
  "rebuild": {
    "positioning": string,
    "targetAudience": string,
    "pricingStrategy": string,
    "mvpRoadmap": [string],   // 4-5 steps
    "gtmStrategy": string
  }
}

Dimension scores: HIGHER = STRONGER signal (less risk on that dimension).`,
    });

    let parsed: unknown;
    try {
      parsed = JSON.parse(extractJson(text));
    } catch (e) {
      console.error("Failed to parse AI JSON:", text);
      throw new Error("Model returned malformed JSON. Try again.");
    }
    return AnalysisSchema.parse(parsed);
  });
