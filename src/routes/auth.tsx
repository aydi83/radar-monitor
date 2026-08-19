import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { I18nProvider, useI18n } from "@/lib/i18n";
import { RadarMark } from "@/components/radar/RadarMark";
import { LanguageSelector } from "@/components/radar/LanguageSelector";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in to RADAR — free web page monitoring" },
      {
        name: "description",
        content:
          "Create a free RADAR account with your email to monitor a public web page and get told when it really changes.",
      },
      { property: "og:title", content: "Sign in to RADAR" },
      { property: "og:description", content: "Free account to monitor a public web page with RADAR." },
    ],
  }),
  component: () => (
    <I18nProvider>
      <AuthScreen />
    </I18nProvider>
  ),
});

function AuthScreen() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/radar", replace: true });
    });
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setInfo(null);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/radar` },
        });
        if (error) throw error;
        if (!data.session) {
          setInfo(t("checkEmail"));
          return;
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      navigate({ to: "/radar", replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-5 pb-10 pt-6">
      <header className="flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <RadarMark size={22} />
          <span className="text-sm font-semibold tracking-[0.18em]">RADAR</span>
        </Link>
        <LanguageSelector />
      </header>

      <main className="flex flex-1 flex-col justify-center py-10">
        <h1 className="text-2xl font-semibold tracking-tight">
          {mode === "signin" ? t("signIn") : t("createAccount")}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("authSub")}</p>

        <form onSubmit={submit} className="mt-6 space-y-3">
          <div>
            <label htmlFor="email" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {t("email")}
            </label>
            <input
              id="email"
              type="email"
              dir="ltr"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 min-h-12 w-full rounded-2xl border border-border bg-card px-4 text-base outline-none focus-visible:ring-4 focus-visible:ring-ring/20"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {t("password")}
            </label>
            <input
              id="password"
              type="password"
              dir="ltr"
              required
              minLength={6}
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 min-h-12 w-full rounded-2xl border border-border bg-card px-4 text-base outline-none focus-visible:ring-4 focus-visible:ring-ring/20"
            />
          </div>

          {error ? (
            <p role="alert" className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          ) : null}
          {info ? (
            <p role="status" className="rounded-xl bg-success-soft px-3 py-2 text-sm text-success">
              {info}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={busy}
            className="inline-flex min-h-14 w-full items-center justify-center rounded-2xl bg-primary px-6 text-[1.0625rem] font-semibold text-primary-foreground shadow-lift transition-all hover:bg-primary/92 active:scale-[0.99] disabled:opacity-50"
          >
            {busy ? "…" : mode === "signin" ? t("signIn") : t("createAccount")}
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            setMode(mode === "signin" ? "signup" : "signin");
            setError(null);
            setInfo(null);
          }}
          className="mt-5 min-h-11 text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
        >
          {mode === "signin" ? t("noAccount") : t("haveAccount")}
        </button>
      </main>
    </div>
  );
}
