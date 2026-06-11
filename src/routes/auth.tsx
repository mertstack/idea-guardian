import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth-context";
import { BrandMark } from "@/components/site-chrome";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "FailWise — Sign in" },
      { name: "description", content: "Sign in or create your FailWise account." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { t, lang, setLang } = useI18n();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate({ to: "/analyze" });
  }, [user, loading, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success(t("auth.success.signedIn"));
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin + "/analyze" },
        });
        if (error) throw error;
        toast.success(t("auth.success.signedUp"));
      }
      navigate({ to: "/analyze" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("auth.error.generic"));
    } finally {
      setBusy(false);
    }
  };

  const onGoogle = async () => {
    setBusy(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin + "/analyze",
      });
      if (result.error) {
        toast.error(result.error.message || t("auth.error.generic"));
        setBusy(false);
        return;
      }
      if (result.redirected) return;
      navigate({ to: "/analyze" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("auth.error.generic"));
      setBusy(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-background">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link to="/" className="flex items-center gap-2 text-[15px] font-semibold tracking-tight">
          <span className="grid h-7 w-7 place-items-center rounded-md border border-border bg-surface text-foreground">
            <BrandMark className="h-3.5 w-3.5" />
          </span>
          FailWise
        </Link>
        <div className="flex items-center gap-1 rounded-md border border-border bg-surface p-0.5 text-xs">
          {(["en", "tr"] as const).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`rounded-[5px] px-2 py-1 font-medium uppercase tracking-wide transition-colors ${
                lang === l ? "bg-background text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </header>

      <main className="mx-auto flex max-w-md flex-col px-6 py-12">
        <div className="rounded-xl border border-border bg-surface p-7">
          <h1 className="text-2xl font-semibold tracking-tight">
            {mode === "signin" ? t("auth.title.signIn") : t("auth.title.signUp")}
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {mode === "signin" ? t("auth.sub.signIn") : t("auth.sub.signUp")}
          </p>

          <button
            type="button"
            onClick={onGoogle}
            disabled={busy}
            className="mt-6 inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border border-border bg-background text-sm font-medium text-foreground transition-colors hover:bg-surface-2 disabled:opacity-60"
          >
            <GoogleIcon className="h-4 w-4" />
            {t("auth.google")}
          </button>

          <div className="my-5 flex items-center gap-3 text-[11px] uppercase tracking-wider text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            {t("auth.or")}
            <span className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={onSubmit} className="space-y-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground">{t("auth.email")}</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none transition-colors focus:border-primary"
                placeholder="you@startup.com"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">{t("auth.password")}</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none transition-colors focus:border-primary"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={busy}
              className="mt-2 inline-flex h-10 w-full items-center justify-center rounded-md bg-primary text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
            >
              {mode === "signin" ? t("auth.submit.signIn") : t("auth.submit.signUp")}
            </button>
          </form>

          <button
            type="button"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="mt-5 w-full text-center text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            {mode === "signin" ? t("auth.toggle.toSignUp") : t("auth.toggle.toSignIn")}
          </button>
        </div>
      </main>
    </div>
  );
}

function GoogleIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.5c-.2 1.4-1.6 4-5.5 4-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.3 14.6 2.3 12 2.3 6.7 2.3 2.4 6.6 2.4 12s4.3 9.7 9.6 9.7c5.5 0 9.2-3.9 9.2-9.4 0-.6-.1-1.1-.2-1.6H12z"
      />
    </svg>
  );
}
