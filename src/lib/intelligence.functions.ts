import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

import { runIntelligence } from "./intelligence-core.server";

export type { IntelReport } from "./intelligence-core.server";

const Input = z.object({
  idea: z.string().min(3).max(4000),
  lang: z.enum(["en", "tr"]).default("en"),
});

// Signed-in users only. Plan checks go here once payments are set up.
export const runIntelligenceReport = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => Input.parse(d))
  .handler(async ({ data }) => runIntelligence(data.idea, data.lang));
