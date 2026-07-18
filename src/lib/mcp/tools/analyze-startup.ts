import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

import { runAnalysis } from "@/lib/analyze-core.server";

export default defineTool({
  name: "analyze_startup",
  title: "Analyze startup idea",
  description:
    "Run a FailWise founder-intelligence analysis on a startup idea or company. Returns a risk score (0-100), a verdict, five dimension scores (market demand, competition, pricing, distribution, founder advantage), a failure breakdown, a pre-mortem timeline, and a rebuild plan.",
  inputSchema: {
    idea: z
      .string()
      .min(1)
      .max(4000)
      .describe("The startup idea, product concept, or company name to analyze."),
    lang: z
      .enum(["en", "tr"])
      .optional()
      .describe("Output language. 'en' (default) for English, 'tr' for Turkish."),
  },
  annotations: { readOnlyHint: true, idempotentHint: false, openWorldHint: true },
  handler: async ({ idea, lang }) => {
    const analysis = await runAnalysis(idea, lang ?? "en");
    return {
      content: [{ type: "text", text: JSON.stringify(analysis, null, 2) }],
      structuredContent: { analysis },
    };
  },
});
