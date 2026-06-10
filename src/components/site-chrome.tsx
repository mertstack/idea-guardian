import { Link } from "@tanstack/react-router";
import { Skull } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="relative z-10 border-b border-border/40 bg-background/60 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-gradient-to-br from-primary to-destructive text-primary-foreground shadow-glow">
            <Skull className="h-4 w-4" />
          </span>
          FailWise
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <Link to="/analyze" className="transition-colors hover:text-foreground">
            Analyzer
          </Link>
          <Link to="/pricing" className="transition-colors hover:text-foreground">
            Pricing
          </Link>
          <a href="#how" className="transition-colors hover:text-foreground">
            How it works
          </a>
        </nav>
        <Link
          to="/analyze"
          className="inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.02]"
        >
          Analyze idea
        </Link>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="relative z-10 border-t border-border/40 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 text-xs text-muted-foreground md:flex-row">
        <p>© {new Date().getFullYear()} FailWise — Don't build what will fail.</p>
        <p>Startup decision intelligence, powered by AI.</p>
      </div>
    </footer>
  );
}
