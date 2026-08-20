import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import CheckoutSteps from "../components/CheckoutSteps";

const SIDE_IMG =
  "https://images.pexels.com/photos/5894056/pexels-photo-5894056.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=940";

type StrengthLevel = 0 | 1 | 2 | 3;

function getStrength(pw: string): StrengthLevel {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[a-z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return 0; // faible
  if (score <= 3) return 1; // moyen
  return 2; // fort
}

const STRENGTH_STYLES: Record<StrengthLevel, { bar: string; label: string }> = {
  0: { bar: "bg-red-500", label: "text-red-500" },
  1: { bar: "bg-gold", label: "text-gold" },
  2: { bar: "bg-sage", label: "text-sage" },
};

export default function Auth() {
  const { t } = useLanguage();
  const { login, register, loading } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || "/";

  const [mode, setMode] = useState<"login" | "register">("login");

  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    motDePasse: "",
    confirm: "",
    telephone: "",
  });

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Affichage / masquage des mots de passe
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (loading) return;
  }, [loading]);

  const update = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
  const phoneValid = form.telephone.length === 0 || /^[\d\s\-\+\(\)]{10,}$/.test(form.telephone);

  const strength = useMemo(() => getStrength(form.motDePasse), [form.motDePasse]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      if (mode === "login") {
        if (!emailValid || form.motDePasse.length < 4) {
          setError(t.auth.error);
          return;
        }
        await login(form.email, form.motDePasse);
        showToast(t.auth.loginSuccess, "success");
        navigate(redirectTo, { replace: true });
      } else {
        if (
          !form.nom.trim() ||
          !form.prenom.trim() ||
          !form.email.trim() ||
          !emailValid ||
          form.motDePasse.length < 4 ||
          form.motDePasse !== form.confirm ||
          !phoneValid
        ) {
          setError(t.auth.error);
          return;
        }
        await register({
          nom: form.nom.trim(),
          prenom: form.prenom.trim(),
          email: form.email.trim(),
          motDePasse: form.motDePasse,
          telephone: form.telephone.trim(),
        });
        showToast(t.auth.accountCreated, "success");
        setMode("login");
        setForm((f) => ({ ...f, motDePasse: "", confirm: "" }));
        setShowPwd(false);
        setShowConfirm(false);
      }
    } catch (err: any) {
      setError(err?.message || t.auth.error);
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full border border-line dark:border-dark-line bg-white dark:bg-dark-surface text-ink dark:text-white rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-coral/40 focus:border-coral transition-all duration-200";

  const EyeIcon = ({ show }: { show: boolean }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      {show ? (
        <>
          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="12" cy="12" r="3" />
        </>
      ) : (
        <>
          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="12" cy="12" r="3" />
          <path d="M3 3l18 18" strokeLinecap="round" />
        </>
      )}
    </svg>
  );

  return (
    <div className="min-h-[calc(100vh-61px)] grid md:grid-cols-2">
      {/* ===== Image ===== */}
      <div className="relative hidden md:block overflow-hidden h-screen sticky top-0">
        <img src={SIDE_IMG} alt="auth" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/30 to-transparent flex items-end justify-center p-10 pb-24">
          <div className="text-center max-w-sm">
            <p className="font-display text-3xl text-white drop-shadow-md leading-relaxed">
              {t.auth.side}
            </p>
            <div className="mt-6 flex items-center justify-center gap-2 text-white/80 text-xs">
              <span className="w-8 h-px bg-white/40" />
              <span>{t.topbar.delivery}</span>
              <span className="w-8 h-px bg-white/40" />
            </div>
          </div>
        </div>
      </div>

      {/* ===== Formulaire ===== */}
      <div className="flex items-center justify-center px-6 py-12 bg-cream dark:bg-dark-bg transition-colors duration-300">
        <div className="w-full max-w-sm animate-fade-up">
          <CheckoutSteps current={2} />
          <Link
            to="/"
            className="text-xs text-ink-soft dark:text-gray-400 hover:text-coral transition-colors duration-200 mb-6 inline-flex items-center gap-1"
          >
            ← {t.auth.backHome}
          </Link>
          <h1 className="font-display text-3xl text-ink dark:text-white mb-1">{t.auth.welcome}</h1>
          <p className="text-sm text-ink-soft dark:text-gray-400 mb-6">{t.auth.subtitle}</p>

          {/* Onglets Connexion / Inscription */}
          <div className="flex mb-8 bg-graybg dark:bg-dark-surface rounded-lg p-1 border border-line dark:border-dark-line">
            <button
              onClick={() => {
                setMode("login");
                setError("");
              }}
              className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all duration-200 ${
                mode === "login"
                  ? "bg-white dark:bg-dark-bg text-coral shadow-sm"
                  : "text-ink-soft dark:text-gray-400 hover:text-ink dark:hover:text-gray-200"
              }`}
            >
              {t.auth.loginTab}
            </button>
            <button
              onClick={() => {
                setMode("register");
                setError("");
              }}
              className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all duration-200 ${
                mode === "register"
                  ? "bg-white dark:bg-dark-bg text-coral shadow-sm"
                  : "text-ink-soft dark:text-gray-400 hover:text-ink dark:hover:text-gray-200"
              }`}
            >
              {t.auth.registerTab}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-ink-soft dark:text-gray-400 mb-1.5">{t.auth.nom}</label>
                    <input value={form.nom} onChange={update("nom")} type="text" placeholder="Rakoto" className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-ink-soft dark:text-gray-400 mb-1.5">{t.auth.prenom}</label>
                    <input value={form.prenom} onChange={update("prenom")} type="text" placeholder="Hery" className={inputClass} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink-soft dark:text-gray-400 mb-1.5">{t.auth.telephone}</label>
                  <input value={form.telephone} onChange={update("telephone")} type="tel" placeholder="+261 34 00 000 00" className={inputClass} />
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-semibold text-ink-soft dark:text-gray-400 mb-1.5">{t.auth.email}</label>
              <input value={form.email} onChange={update("email")} type="email" placeholder="vous@exemple.com" className={inputClass} />
            </div>

            {/* Mot de passe avec œil + force */}
            <div>
              <label className="block text-xs font-semibold text-ink-soft dark:text-gray-400 mb-1.5">{t.auth.password}</label>
              <div className="relative">
                <input
                  value={form.motDePasse}
                  onChange={update("motDePasse")}
                  type={showPwd ? "text" : "password"}
                  placeholder="••••••••"
                  className={`${inputClass} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((s) => !s)}
                  aria-label={showPwd ? t.auth.hidePassword : t.auth.showPassword}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft dark:text-gray-400 hover:text-coral transition-colors duration-200"
                >
                  <EyeIcon show={showPwd} />
                </button>
              </div>

              {/* Indicateur de force (inscription uniquement) */}
              {mode === "register" && form.motDePasse.length > 0 && (
                <div className="mt-2">
                  <div className="flex gap-1.5 mb-1.5">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                          strength >= i ? STRENGTH_STYLES[strength as StrengthLevel].bar : "bg-line dark:bg-dark-line"
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`text-[11px] font-semibold ${STRENGTH_STYLES[strength as StrengthLevel].label}`}>
                    {strength === 0 && t.auth.passwordStrength.weak}
                    {strength === 1 && t.auth.passwordStrength.medium}
                    {strength === 2 && t.auth.passwordStrength.strong}
                  </p>
                  {strength < 2 && (
                    <p className="text-[10px] text-ink-soft dark:text-gray-500 mt-0.5">
                      {t.auth.passwordStrength.hint}
                    </p>
                  )}
                </div>
              )}
            </div>

            {mode === "register" && (
              <div>
                <label className="block text-xs font-semibold text-ink-soft dark:text-gray-400 mb-1.5">{t.auth.confirm}</label>
                <div className="relative">
                  <input
                    value={form.confirm}
                    onChange={update("confirm")}
                    type={showConfirm ? "text" : "password"}
                    placeholder="••••••••"
                    className={`${inputClass} pr-11`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((s) => !s)}
                    aria-label={showConfirm ? t.auth.hidePassword : t.auth.showPassword}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft dark:text-gray-400 hover:text-coral transition-colors duration-200"
                  >
                    <EyeIcon show={showConfirm} />
                  </button>
                </div>
                {form.confirm.length > 0 && form.confirm !== form.motDePasse && (
                  <p className="text-[11px] text-red-500 mt-1.5">{t.auth.error}</p>
                )}
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 text-xs text-red-500 bg-red-500/10 border border-red-500/20 rounded-md px-3 py-2.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v4M12 16h.01" strokeLinecap="round" />
                </svg>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-sage hover:bg-sage-dark text-white text-sm font-semibold py-3 rounded-md transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? "…" : mode === "login" ? t.auth.loginBtn : t.auth.registerBtn}
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <span className="flex-1 h-px bg-line dark:bg-dark-line" />
            <span className="text-[10px] text-ink-soft dark:text-gray-500 uppercase tracking-widest">ou</span>
            <span className="flex-1 h-px bg-line dark:bg-dark-line" />
          </div>

          <button
            onClick={() => {
              setMode(mode === "login" ? "register" : "login");
              setError("");
            }}
            className="w-full text-center text-xs font-semibold text-ink-soft dark:text-gray-400 hover:text-coral transition-colors duration-200"
          >
            {mode === "login" ? t.auth.switchToRegister : t.auth.switchToLogin}
          </button>
        </div>
      </div>
    </div>
  );
}
