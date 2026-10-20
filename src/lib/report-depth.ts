import { z } from "zod";

export const ReportTier = z.enum(["free", "pro", "expert", "intelligence"]);
export type ReportTier = z.infer<typeof ReportTier>;

export const SUPPORT_BY_TIER = {
  free: [],
  pro: ["scoreRationale", "riskActions", "founderTeam"],
  expert: ["scoreRationale", "riskActions", "founderTeam", "validation", "pricingAcquisition", "pivotPlan"],
  intelligence: ["scoreRationale", "riskActions", "founderTeam", "validation", "pricingAcquisition", "pivotPlan", "failedStartups", "capital", "investment", "growth"],
} as const;

export const DecisionSupportSchema = z.array(z.object({
  id: z.string(),
  title: z.string(),
  summary: z.string(),
  actions: z.array(z.string()),
  assumptions: z.array(z.string()),
  evidenceStatus: z.enum(["verified", "estimate", "unknown"]),
  sourceUrls: z.preprocess(value => Array.isArray(value) ? value : [], z.array(z.string())),
})).default([]);
export type DecisionSupport = z.infer<typeof DecisionSupportSchema>;

export function filterDecisionSupport(items: DecisionSupport, tier: ReportTier, evidenceUrls: ReadonlySet<string>): DecisionSupport {
  const allowed: readonly string[] = SUPPORT_BY_TIER[tier];
  const seen = new Set<string>();
  return items.filter(item => {
    if (!allowed.includes(item.id) || seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  }).map(item => {
    const sourceUrls = item.sourceUrls.filter(url => evidenceUrls.has(url) && /^https?:\/\//i.test(url));
    return { ...item, sourceUrls, evidenceStatus: item.evidenceStatus === "verified" && sourceUrls.length === 0 ? "estimate" : item.evidenceStatus };
  });
}