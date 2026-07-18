import { auth, defineMcp } from "@lovable.dev/mcp-js";

import analyzeStartupTool from "./tools/analyze-startup";

const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "failwise-mcp",
  title: "FailWise MCP",
  version: "0.1.0",
  instructions:
    "FailWise is a founder-intelligence platform. Use `analyze_startup` to evaluate any startup idea or company and get a risk score, dimension scores, failure breakdown, pre-mortem, and rebuild plan. Supports English and Turkish output.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [analyzeStartupTool],
});
