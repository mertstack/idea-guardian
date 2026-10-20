import { describe, expect, test } from "bun:test";
import { SUPPORT_BY_TIER, filterDecisionSupport, DecisionSupportSchema } from "./report-depth";

describe("report depth rules", () => {
  test("missing evidence URLs remain empty rather than blocking an analysis", () => {
    const items = DecisionSupportSchema.parse([{ id: "riskActions", title: "Risk", summary: "Next steps", actions: [], assumptions: [], evidenceStatus: "estimate", sourceUrls: null }]);
    expect(items[0].sourceUrls).toEqual([]);
  });
  test("most additions belong to Intelligence, with smaller Pro and Expert sets", () => {
    expect(SUPPORT_BY_TIER.pro).toHaveLength(3);
    expect(SUPPORT_BY_TIER.expert).toHaveLength(6);
    expect(SUPPORT_BY_TIER.intelligence).toHaveLength(10);
    expect(SUPPORT_BY_TIER.pro).not.toContain("capital");
    expect(SUPPORT_BY_TIER.expert).not.toContain("investment");
    expect(SUPPORT_BY_TIER.intelligence).toContain("capital");
    expect(SUPPORT_BY_TIER.intelligence).toContain("investment");
    expect(SUPPORT_BY_TIER.intelligence).toContain("growth");
  });
  test("unverified URLs and unsupported sections never become sourced findings", () => {
    const base = { title: "Finding", summary: "Estimate", actions: [], assumptions: [], evidenceStatus: "verified", sourceUrls: ["https://invented.example"] };
    const result = filterDecisionSupport([{ ...base, id: "scoreRationale" }, { ...base, id: "capital" }], "pro", new Set());
    expect(result).toHaveLength(1);
    expect(result[0]?.sourceUrls).toEqual([]);
    expect(result[0]?.evidenceStatus).toBe("estimate");
  });
  test("Intelligence includes growth while Pro does not", () => {
    expect(SUPPORT_BY_TIER.intelligence).toContain("growth");
    expect(SUPPORT_BY_TIER.pro).not.toContain("growth");
  });
});
