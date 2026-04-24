import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

interface Props {
  onSuccess: () => void;
}

export function LoginScreen({ onSuccess }: Props) {
  const { t } = useTranslation();
  const { login } = useAuth();
  const [username, setUsername] = useState("Admin");
  const [password, setPassword] = useState("Admin");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(username, password);
      onSuccess();
    } catch {
      setError(t("login.error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      {/* Decorative background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute -right-40 bottom-0 h-[420px] w-[420px] rounded-full bg-accent/40 blur-3xl" />
      </div>

      {/* Top bar */}
      <header className="relative z-10 flex items-center justify-between px-4 py-4 sm:px-8">
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-md bg-primary text-primary-foreground shadow-card">
            <Mail className="h-4 w-4" />
          </div>
          <span className="text-sm font-semibold tracking-tight text-foreground">
            {t("app.name")}
          </span>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-card px-1 py-1 shadow-card">
          {/* Reuse switchers but they're styled for header bg — provide a wrapper */}
          <div className="text-foreground">
            <LangAndTheme />
          </div>
        </div>
      </header>

      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-8 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="grid w-full max-w-5xl grid-cols-1 overflow-hidden rounded-2xl border border-border bg-card shadow-popover lg:grid-cols-2"
        >
          {/* Brand panel */}
          <div className="relative hidden flex-col justify-between bg-gradient-to-br from-primary via-primary to-[oklch(0.36_0.16_257)] p-10 text-primary-foreground lg:flex">
            <div>
              <div className="mb-6 flex items-center gap-2">
                <div className="grid h-9 w-9 place-items-center rounded-md bg-white/15 backdrop-blur">
                  <Mail className="h-5 w-5" />
                </div>
                <span className="text-lg font-semibold">{t("app.name")}</span>
              </div>
              <h2 className="text-3xl font-bold leading-tight tracking-tight">
                {t("app.tagline")}
              </h2>
              <p className="mt-3 max-w-sm text-sm text-primary-foreground/80">
                {t("login.subtitle")}
              </p>
            </div>
            <div className="space-y-2 text-xs text-primary-foreground/70">
              <p>© {new Date().getFullYear()} enContact</p>
              <p>{t("login.footer")}</p>
            </div>
            {/* Decorative dots */}
            <div
              aria-hidden
              className="pointer-events-none absolute right-6 top-1/2 grid -translate-y-1/2 grid-cols-6 gap-2 opacity-20"
            >
              {Array.from({ length: 36 }).map((_, i) => (
                <span
                  key={i}
                  className="block h-1.5 w-1.5 rounded-full bg-white"
                />
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="flex flex-col justify-center p-8 sm:p-10">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              {t("login.title")}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("login.hint")}
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
              <div className="space-y-1.5">
                <Label htmlFor="username">{t("login.username")}</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="username"
                    autoComplete="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password">{t("login.password")}</Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPwd ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="px-9"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((s) => !s)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
                    aria-label={showPwd ? "Hide password" : "Show password"}
                  >
                    {showPwd ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  role="alert"
                  className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
                >
                  {error}
                </motion.div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="h-11 w-full gap-2 bg-primary text-primary-foreground hover:bg-primary-hover"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {loading ? t("login.signingIn") : t("login.submit")}
              </Button>
            </form>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

// Tiny wrapper so the switchers render with foreground colors on light/dark card bg
function LangAndTheme() {
  return (
    <div className="flex items-center gap-1 [&_button]:!text-foreground [&_button:hover]:!bg-accent">
      <LanguageSwitcher />
      <ThemeToggle />
    </div>
  );
}
