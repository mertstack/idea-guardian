import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { runAnalysis } from "./analyze-core.server";

export type { StartupAnalysis } from "./analyze-core.server";

const InputSchema = z.object({
  idea: z.string().min(1).max(4000),
  lang: z.enum(["en", "tr"]).optional().default("en"),
});

export const analyzeStartup = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => InputSchema.parse(d))
  .handler(async ({ data }) => runAnalysis(data.idea, data.lang));
