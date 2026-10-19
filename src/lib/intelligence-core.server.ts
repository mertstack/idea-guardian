import { generateText } from "ai";
import process from "node:process";
import { z } from "zod";

import { createLovableAiGatewayProvider } from "./ai-gateway.server";
import { DecisionSupportSchema, decisionSupportPrompt, filterDecisionSupport } from "./report-depth";

const T = z.preprocess(
  (v) => (typeof v === "string" ? v : v == null ? "" : typeof v === "object" ? JSON.stringify(v) : String(v)),
  z.string(),
);
const N = z.preprocess((v) => {
  const n = Number(v);
  return Number.isFinite(n) ? Math.max(0, Math.min(100, n)) : 50;
}, z.number());
const enumOf = <V extends string>(vals: readonly V[], d: V) =>
  z.preprocess((v) => {
    const s = String(v ?? "").toLowerCase();
    return (vals as readonly string[]).includes(s) ? s : d;
  }, z.enum(vals as [V, ...V[]]));
const Conf = enumOf(["low", "medium", "high"] as const, "low");
const Arr = <S extends z.ZodTypeAny>(s: S) => z.preprocess((v) => (Array.isArray(v) ? v : []), z.array(s));

export const IntelSchema = z.object({
  decisionSupport: DecisionSupportSchema,
  executiveSummary: T,
  risk: z.object({
    overall: N,
    confidence: Conf,
    meaning: T,
    dimensions: Arr(z.object({ name: T, score: N, confidence: Conf, why: T, sources: Arr(T) })),
    topRisks: Arr(T),
    assumptions: Arr(T),
  }),
  demand: z.object({
    summary: T,
    signals: Arr(
      z.object({
        signal: T,
        type: enumOf(["interest", "frustration", "purchase_intent", "willingness_to_pay"] as const, "interest"),
        source: T,
        url: T,
        date: T,
        why: T,
        strength: enumOf(["weak", "moderate", "strong"] as const, "weak"),
        limitations: T,
      }),
    ),
  }),
  competitors: Arr(
    z.object({
      name: T,
      url: T,
      kind: enumOf(["direct", "indirect"] as const, "direct"),
      pricing: T,
      positioning: T,
      strengths: T,
      weaknesses: T,
      differentiation: T,
      verified: z.preprocess((v) => v === true || v === "true", z.boolean()),
    }),
  ),
  pricing: z.object({ summary: T, recommendation: T }),
  distribution: z.object({
    channels: Arr(
      z.object({ channel: T, why: T, audience: T, experiment: T, estCost: T, metrics: T, risks: T }),
    ),
    first10: Arr(T),
  }),
  decision: z.object({
    verdict: enumOf(["build", "pivot", "test", "stop"] as const, "test"),
    reasons: Arr(T),
    priorities: Arr(T),
    week: Arr(z.object({ day: T, task: T, success: T })),
    month: Arr(z.object({ week: T, focus: T })),
    budget: T,
    continueIf: T,
    pivotIf: T,
    stopIf: T,
  }),
});
export type IntelReport = z.infer<typeof IntelSchema> & {
  sources: { title: string; url: string }[];
  limitations: string[];
};

type Hit = { title: string; url: string; description: string };

async function search(query: string, limit = 6): Promise<Hit[]> {
  const lk = process.env.LOVABLE_API_KEY;
  const fk = process.env.FIRECRAWL_API_KEY;
  if (!lk || !fk) throw new Error("Web search is not configured");
  const res = await fetch("https://connector-gateway.lovable.dev/firecrawl/v2/search", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${lk}`, "X-Connection-Api-Key": fk },
    body: JSON.stringify({ query, limit }),
  });
  if (!res.ok) throw new Error(`Search failed [${res.status}]: ${(await res.text()).slice(0, 200)}`);
  const json = (await res.json()) as { data?: { web?: Hit[] } | Hit[] };
  const list = Array.isArray(json.data) ? json.data : (json.data?.web ?? []);
  return list
    .filter((h) => h?.url)
    .map((h) => ({ title: h.title ?? "", url: h.url, description: (h.description ?? "").slice(0, 300) }));
}

function extractJson(text: string) {
  const f = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const c = f ? f[1] : text;
  return c.slice(c.indexOf("{"), c.lastIndexOf("}") + 1);
}

export async function runIntelligence(idea: string, lang: "en" | "tr", tier: "expert" | "intelligence" = "intelligence"): Promise<IntelReport> {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("Missing LOVABLE_API_KEY");
  const short = idea.slice(0, 160);
  const limitations: string[] = [];
  const queries: [string, string][] = [
    ["competitors", `${short} competitors alternatives pricing`],
    ["reddit", `site:reddit.com ${short} problem`],
    ["reviews", `${short} reviews complaints`],
    ...(tier === "intelligence" ? [["failures", `${short} failed startups shutdown lessons`] as [string, string]] : []),
  ];
  const results = await Promise.all(
    queries.map(async ([label, q]) => {
      try {
        return [label, await search(q)] as const;
      } catch (e) {
        limitations.push(`${label}: ${(e as Error).message}`);
        return [label, [] as Hit[]] as const;
      }
    }),
  );
  const seen = new Set<string>();
  const sources: { title: string; url: string }[] = [];
  const evidence = results
    .map(([label, hits]) => {
      const lines = hits.map((h) => {
        if (!seen.has(h.url)) {
          seen.add(h.url);
          sources.push({ title: h.title, url: h.url });
        }
        return `- [${h.title}](${h.url}) — ${h.description}`;
      });
      return `## ${label}\n${lines.join("\n") || "(no results)"}`;
    })
    .join("\n\n");
  if (sources.length === 0) limitations.push("No live web sources were found; all findings are AI estimates.");
  limitations.push("Search-trend volume and paid review databases are not connected.");

  const gateway = createLovableAiGatewayProvider(key);
  const langRule =
    lang === "tr"
      ? "Write ALL human-readable strings in TURKISH. Keep JSON keys and enum values in English."
      : "Write all strings in English.";

  const { text } = await generateText({
    model: gateway("google/gemini-3-flash-preview"),
    system: `You are FailWise Intelligence, an evidence-first startup analyst. ${langRule}
RULES: Only cite URLs that appear in the EVIDENCE block. Never invent competitors, prices, posts, quotes or numbers. If a competitor is from your general knowledge (not in evidence), set verified=false and url="". If pricing is unknown write "Not found". Mark all cost figures as estimates. Do not guarantee results or invent conversion rates. Do not default to BUILD; pick build/pivot/test/stop based on evidence. If evidence is thin, use low confidence. Risk score: 0-100, HIGHER = MORE RISK (not probability of failure). Dimension scores use the same scale (higher = riskier). Reply with ONE JSON object only.`,
    prompt: `IDEA:\n"""${idea}"""\n\nEVIDENCE (live web search results):\n${evidence}\n\nReturn JSON with this shape:
{"executiveSummary":string,
"risk":{"overall":number,"confidence":"low|medium|high","meaning":string,"dimensions":[{"name":"Market demand|Competition|Pricing|Distribution|Execution","score":number,"confidence":"low|medium|high","why":string,"sources":[url]}],"topRisks":[3 strings],"assumptions":[strings]},
"demand":{"summary":string,"signals":[{"signal":string,"type":"interest|frustration|purchase_intent|willingness_to_pay","source":string,"url":string,"date":string,"why":string,"strength":"weak|moderate|strong","limitations":string}]},
"competitors":[{"name":string,"url":string,"kind":"direct|indirect","pricing":string,"positioning":string,"strengths":string,"weaknesses":string,"differentiation":string,"verified":boolean}],
"pricing":{"summary":string,"recommendation":string},
"distribution":{"channels":[{"channel":string,"why":string,"audience":string,"experiment":string,"estCost":string,"metrics":string,"risks":string}],"first10":[strings]},
"decision":{"verdict":"build|pivot|test|stop","reasons":[strings],"priorities":[3 strings],"week":[{"day":"Day 1","task":string,"success":string}],"month":[{"week":"Week 1","focus":string}],"budget":string,"continueIf":string,"pivotIf":string,"stopIf":string}}
Use exactly 5 risk dimensions, up to 6 competitors (fewer or none when evidence is insufficient), 2-4 distribution channels (only ones that fit), 7 days, 4 weeks.
${decisionSupportPrompt(tier)}`,
  });

  let parsed: unknown;
  try {
    parsed = JSON.parse(extractJson(text));
  } catch {
    throw new Error("The report could not be generated. Please try again.");
  }
  const r = IntelSchema.safeParse(parsed);
  if (!r.success) throw new Error("The report came back incomplete. Please try again.");
  // Drop any URL the model cited that wasn't in the evidence.
  const ok = (u: string) => seen.has(u);
  const data = r.data;
  data.competitors.forEach((c) => {
    if (!ok(c.url)) {
      c.url = "";
      c.verified = false;
    }
  });
  data.demand.signals = data.demand.signals.filter((s) => ok(s.url));
  data.risk.dimensions.forEach((d) => (d.sources = d.sources.filter(ok)));
  return { ...data, decisionSupport: filterDecisionSupport(data.decisionSupport, tier, seen), sources, limitations };
}
