import { generateText } from "ai";
import process from "node:process";
import { z } from "zod";

import { createLovableAiGatewayProvider } from "./ai-gateway.server";

// The model sometimes returns numbers/objects where we expect strings.
// Coerce them instead of failing the whole analysis.
const TextField = z.preprocess(
  (v) => (typeof v === "string" ? v : v == null ? "" : typeof v === "object" ? JSON.stringify(v) : String(v)),
  z.string(),
);
const ScoreField = z.preprocess(
  (v) => {
    if (typeof v === "number") return v;
    const n = Number(v);
    return Number.isFinite(n) ? n : 50;
  },
  z.number().min(0).max(100),
);
const SignalField = z.preprocess((v) => {
  const s = String(v ?? "").toLowerCase();
  return ["strong", "neutral", "weak", "critical"].includes(s) ? s : "neutral";
}, z.enum(["strong", "neutral", "weak", "critical"]));
const SeverityField = z.preprocess((v) => {
  const s = String(v ?? "").toLowerCase();
  return ["low", "medium", "high", "critical"].includes(s) ? s : "medium";
}, z.enum(["low", "medium", "high", "critical"]));
const ConfidenceField = z.preprocess((v) => {
  const s = String(v ?? "").toLowerCase();
  return ["low", "medium", "high"].includes(s) ? s : "medium";
}, z.enum(["low", "medium", "high"]));

const DimensionSchema = z.object({
  score: ScoreField,
  signal: SignalField,
  insight: TextField,
  detail: TextField,
});

export const AnalysisSchema = z.object({
  ideaSummary: TextField,
  riskScore: ScoreField,
  confidence: ConfidenceField,
  verdict: TextField,
  recommendation: TextField,
  topFailureReason: TextField,
  dimensions: z.object({
    marketDemand: DimensionSchema,
    competition: DimensionSchema,
    pricing: DimensionSchema,
    distribution: DimensionSchema,
    founderAdvantage: DimensionSchema,
  }),
  failureBreakdown: z.array(
    z.object({
      category: TextField,
      severity: SeverityField,
      issue: TextField,
      detail: TextField,
    }),
  ),
  preMortem: z.array(
    z.object({
      month: TextField,
      event: TextField,
      impact: TextField,
    }),
  ),
  rebuild: z.object({
    positioning: TextField,
    targetAudience: TextField,
    pricingStrategy: TextField,
    mvpRoadmap: z.array(TextField),
    gtmStrategy: TextField,
  }),
});

export type StartupAnalysis = z.infer<typeof AnalysisSchema>;

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

export async function runAnalysis(idea: string, lang: "en" | "tr" = "en"): Promise<StartupAnalysis> {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("Missing LOVABLE_API_KEY");

  const gateway = createLovableAiGatewayProvider(key);
  const isTr = lang === "tr";

  const intro = isTr
    ? `Bu startup fikrini veya şirketi analiz et:\n\n"""${idea}"""\n\nTAM olarak şu yapıya sahip TEK bir JSON nesnesi döndür (düz metin yok, kod bloğu yok). TÜM açıklama/metin değerlerini TÜRKÇE yaz:`
    : `Analyze this startup idea or company:\n\n"""${idea}"""\n\nReturn a SINGLE JSON object (no prose, no code fences) with this exact shape:`;

  const tail = isTr
    ? 'recommendation: 1-2 cümlelik net ve uygulanabilir tavsiye — fikre devam mı, pivot mu, küçültüp test mi edileceğini söyle. 4-6 risk maddesi, 5-6 ön-mortem maddesi ("Ay 1", "Ay 3" gibi), 4-5 adımlık MVP yol haritası. Boyut puanları: YÜKSEK = DAHA GÜÇLÜ sinyal (o boyutta daha az risk). riskScore: 0-100, yüksek = başarısız olma olasılığı yüksek.'
    : 'recommendation: 1-2 sentence clear, actionable advice — push ahead, pivot, or test smaller. 4-6 risks, 5-6 pre-mortem items ("Month 1", "Month 3"), 4-5 step MVP roadmap. Dimension scores: HIGHER = STRONGER signal (less risk). riskScore: 0-100, higher = more likely to fail.';

  const { text } = await generateText({
    model: gateway("google/gemini-3-flash-preview"),
    system: isTr ? SYSTEM_TR : SYSTEM_EN,
    prompt: `${intro}
{
  "ideaSummary": string,
  "riskScore": number,
  "confidence": "low" | "medium" | "high",
  "verdict": string,
  "recommendation": string,
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
  } catch {
    throw new Error("Model returned malformed JSON. Try again.");
  }
  return AnalysisSchema.parse(parsed);
}
