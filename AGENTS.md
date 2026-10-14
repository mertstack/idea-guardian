# Architecture rules

- Keep public product pages as individual TanStack file routes with their own metadata; shared navigation is provided by SiteHeader and SiteFooter.
- The enterprise panel is a client-side demonstration, not a provisioned tenant; keep its fixed identity and sector selection in a browser-safe component.