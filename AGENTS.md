# Architecture rules

- Keep public product pages as individual TanStack file routes with their own metadata; shared navigation is provided by SiteHeader and SiteFooter.
- The enterprise panel is a client-side demonstration, not a provisioned tenant; keep its fixed identity and sector selection in a browser-safe component.
- Keep analysis-depth policies and evidence filtering in the browser-safe report-depth module, with generated sections rendered by DecisionSupportSections; this keeps tier differences consistent across both analysis engines.
- Tier selections are report-depth previews, not paid entitlements; no billing or subscription enforcement is provisioned, so never represent a client-selected tier as a purchased plan.