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
  idea: z.string().min(1).max(4000),
  lang: z.enum(["en", "tr"]).optional().default("en"),
});

const SYSTEM_EN = `You are FailWise, a founder intelligence analyst.
You evaluate ANY startup idea, company, product concept, or even rough/vague ideas with the rigor of a senior YC partner and the data orientation of an investor analyst.
NEVER refuse. NEVER tell the user the input is too vague, too short, too absurd, or unanalyzable. If the input is short or unclear, make reasonable assumptions, state them inside ideaSummary, and proceed with a full analysis. Treat absurd inputs as hypothetical concepts and still produce a complete analysis.
Be precise, contrarian where warranted, and CONSTRUCTIVE. Always return useful insight, risks, and a rebuild plan.
Tone: calm, sharp, data-driven, investor-grade.
You always reply with a single valid JSON object — no prose, no markdown fences.
Write ALL string values in English.`;

const SYSTEM_TR = `Sen FailWise'sın — bir kurucu zekâsı analistisin.
HERHANGİ bir startup fikrini, şirketi, ürün konseptini, hatta belirsiz/kaba fikirleri kıdemli bir YC ortağı titizliği ve yatırımcı analisti veri yönelimiyle değerlendirirsin.
ASLA reddetme. Kullanıcıya girdinin çok belirsiz, çok kısa, çok absürt veya analiz edilemez olduğunu SÖYLEME. Girdi kısa veya net değilse makul varsayımlar yap, bunları ideaSummary içinde belirt ve tam analizi yap. Absürt girdileri varsayımsal konsept olarak ele al ve yine tam analiz üret.
Net, gerektiğinde aykırı düşünen ve YAPICI ol. Her zaman faydalı içgörü, riskler ve yeniden kurma planı döndür.
Ton: sakin, keskin, veri odaklı, yatırımcı kalitesinde.
Her zaman tek bir geçerli JSON nesnesi ile yanıt verirsin — düz metin yok, markdown bloğu yok.
TÜM string değerleri TÜRKÇE yaz. JSON anahtarlarını İngilizce bırak. "signal", "severity", "confidence" enum değerleri İngilizce kalmalı (strong/neutral/weak/critical, low/medium/high, low/medium/high/critical). Sadece insan tarafından okunan metinleri Türkçeleştir.`;

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
    const isTr = data.lang === "tr";

    const intro = isTr
      ? `Bu startup fikrini veya şirketi analiz et:\n\n"""${data.idea}"""\n\nTAM olarak şu yapıya sahip TEK bir JSON nesnesi döndür (düz metin yok, kod bloğu yok). TÜM açıklama/metin değerlerini TÜRKÇE yaz:`
      : `Analyze this startup idea or company:\n\n"""${data.idea}"""\n\nReturn a SINGLE JSON object (no prose, no code fences) with this exact shape:`;

    const tail = isTr
      ? '4-6 risk maddesi, 5-6 ön-mortem maddesi ("Ay 1", "Ay 3" gibi), 4-5 adımlık MVP yol haritası. Boyut puanları: YÜKSEK = DAHA GÜÇLÜ sinyal (o boyutta daha az risk). riskScore: 0-100, yüksek = başarısız olma olasılığı yüksek.'
      : '4-6 risks, 5-6 pre-mortem items ("Month 1", "Month 3"), 4-5 step MVP roadmap. Dimension scores: HIGHER = STRONGER signal (less risk). riskScore: 0-100, higher = more likely to fail.';

    const { text } = await generateText({
      model: gateway("google/gemini-3-flash-preview"),
      system: isTr ? SYSTEM_TR : SYSTEM_EN,
      prompt: `${intro}
{
  "ideaSummary": string,
  "riskScore": number,
  "confidence": "low" | "medium" | "high",
  "verdict": string,
  "topFailureReason": string,
  "dimensions": {
    "marketDemand":     { "score": number, "signal": "strong"|"neutral"|"weak"|"critical", "insight": string, "detail": string },
    "competition":      { "score": number, "signal": "strong"|"neutral"|"weak"|"critical", "insight": string, "detail": string },
    "pricing":          { "score": number, "signal": "strong"|"neutral"|"weak"|"critical", "insight": string, "detail": string },
    "distribution":     { "score": number, "signal": "strong"|"neutral"|"weak"|"critical", "insight": string, "detail": string },
    "founderAdvantage": { "score": number, "signal": "strong"|"neutral"|"weak"|"critical", "insight": string, "detail": string }
  },
  "failureBreakdown": [ { "category": string, "severity": "low"|"medium"|"high"|"critical", "issue": string, "detail": string } ],
  "preMortem":        [ { "month": string, "event": string, "impact": string } ],
  "rebuild": {
    "positioning": string,
    "targetAudience": string,
    "pricingStrategy": string,
    "mvpRoadmap": [string],
    "gtmStrategy": string
  }
}

${tail}`,
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
