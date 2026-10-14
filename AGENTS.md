# Architecture rules

- Keep public product pages as individual TanStack file routes with their own metadata; shared navigation is provided by SiteHeader and SiteFooter.
- White-label brand switching is a client-side demonstration, not a provisioned tenant; keep all preview identity and sector labels in a browser-safe component.