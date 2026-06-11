import { Link } from "@tanstack/react-router";

import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth-context";

export function BrandMark({ className = "h-4 w-4" }: { className?: string }) {
  // Minimal upward line chart with subtle warning dot
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 17l5-5 4 3 6-8" />
      <path d="M14 7h4v4" />
      <circle cx="18" cy="6" r="1.6" fill="currentColor" stroke="none" className="text-primary" />
    </svg>
  );
}

function LangSwitch() {
  const { lang, setLang } = useI18n();
  return (
    <div className="flex items-center gap-0.5 rounded-md border border-border bg-surface p-0.5 text-[11px]">
      {(["en", "tr"] as const).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`rounded-[5px] px-1.5 py-0.5 font-medium uppercase tracking-wide transition-colors ${
            lang === l ? "bg-background text-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
          aria-label={l.toUpperCase()}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

export function SiteHeader() {
  const { t } = useI18n();
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
        <Link to="/" className="flex items-center gap-2 text-[15px] font-semibold tracking-tight">
          <span className="grid h-7 w-7 place-items-center rounded-md border border-border bg-surface text-foreground">
            <BrandMark className="h-3.5 w-3.5" />
          </span>
          FailWise
        </Link>
        <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
          <Link to="/analyze" className="transition-colors hover:text-foreground">
            {t("nav.analyzer")}
          </Link>
          <a href="/#how-it-works" className="transition-colors hover:text-foreground">
            {t("nav.howItWorks")}
          </a>
          <a href="/#intelligence" className="transition-colors hover:text-foreground">
            {t("nav.intelligence")}
          </a>
          <Link to="/pricing" className="transition-colors hover:text-foreground">
            {t("nav.pricing")}
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <LangSwitch />
          {user ? (
            <>
              <Link
                to="/analyze"
                className="inline-flex h-8 items-center rounded-md bg-primary px-3.5 text-[13px] font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                {t("nav.openApp")}
              </Link>
              <button
                onClick={() => signOut()}
                className="inline-flex h-8 items-center rounded-md border border-border bg-surface px-3 text-[13px] font-medium text-foreground transition-colors hover:bg-surface-2"
              >
                {t("nav.signOut")}
              </button>
            </>
          ) : (
            <>
              <Link
                to="/auth"
                className="hidden h-8 items-center rounded-md px-3 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
              >
                {t("nav.signIn")}
              </Link>
              <Link
                to="/auth"
                className="inline-flex h-8 items-center rounded-md bg-primary px-3.5 text-[13px] font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                {t("nav.signUp")}
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  const { t } = useI18n();
  return (
    <footer className="relative z-10 border-t border-border/60 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 text-xs text-muted-foreground md:flex-row">
        <div className="flex items-center gap-2">
          <BrandMark className="h-3.5 w-3.5" />
          <span>{t("footer.tagline")}</span>
        </div>
        <p>© {new Date().getFullYear()} FailWise. {t("footer.rights")}</p>
      </div>
    </footer>
  );
}
