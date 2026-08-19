import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import PhotoSlot from "../components/PhotoSlot";

export default function Auth() {
  const { t } = useLanguage();
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || "/products";

  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ 
    nom: "", 
    prenom: "", 
    email: "", 
    motDePasse: "", 
    confirm: "",
    telephone: ""
  });
  const [error, setError] = useState("");

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
  const phoneValid = form.telephone.length === 0 || /^[\d\s\-\+\(\)]{10,}$/.test(form.telephone);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (mode === "login") {
      if (!emailValid || form.motDePasse.length < 4) {
        setError(t.auth.error);
        return;
      }
      login({ email: form.email, motDePasse: form.motDePasse });
      navigate(redirectTo, { replace: true });
    } else {
      if (!form.nom.trim() || !form.prenom.trim() || !emailValid || form.motDePasse.length < 4 || form.motDePasse !== form.confirm || !phoneValid) {
        setError(t.auth.error);
        return;
      }
      register({ 
        nom: form.nom, 
        prenom: form.prenom,
        email: form.email, 
        motDePasse: form.motDePasse,
        telephone: form.telephone
      });
      navigate(redirectTo, { replace: true });
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] grid md:grid-cols-2">
      <div className="relative hidden md:block">
        <PhotoSlot src="/images/auth-side.jpg" label="auth-side.jpg — 700x100%" className="absolute inset-0" />
        <div className="absolute inset-0 bg-ink/30 flex items-end p-10">
          <p className="font-display text-3xl text-white max-w-xs">{t.hero.title}</p>
        </div>
      </div>

      <div className="flex items-center justify-center px-6 py-16 bg-cream dark:bg-dark-bg transition-colors duration-300">
        <div className="w-full max-w-sm animate-fade-up">
          <Link to="/" className="text-xs text-ink-soft dark:text-gray-400 hover:text-coral transition-colors duration-200 mb-6 inline-flex items-center gap-1">
            ← {t.auth.backHome}
          </Link>

          <h1 className="font-display text-3xl text-ink dark:text-white mb-1">{t.auth.welcome}</h1>
          <p className="text-sm text-ink-soft dark:text-gray-400 mb-6">{t.auth.subtitle}</p>

          <div className="flex mb-6 border border-line dark:border-dark-line rounded-sm overflow-hidden">
            <button
              onClick={() => setMode("login")}
              className={`flex-1 py-2.5 text-sm font-semibold transition-colors duration-200 ${
                mode === "login" ? "bg-ink text-white dark:bg-white dark:text-ink" : "text-ink-soft dark:text-gray-400 hover:bg-graybg dark:hover:bg-dark-surface"
              }`}
            >
              {t.auth.loginTab}
            </button>
            <button
              onClick={() => setMode("register")}
              className={`flex-1 py-2.5 text-sm font-semibold transition-colors duration-200 ${
                mode === "register" ? "bg-ink text-white dark:bg-white dark:text-ink" : "text-ink-soft dark:text-gray-400 hover:bg-graybg dark:hover:bg-dark-surface"
              }`}
            >
              {t.auth.registerTab}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-ink-soft dark:text-gray-400 mb-1">{t.auth.nom}</label>
                  <input
                    value={form.nom}
                    onChange={update("nom")}
                    type="text"
                    placeholder="Votre Nom"
                    className="w-full border border-line dark:border-dark-line bg-white dark:bg-dark-surface text-ink dark:text-white rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-coral/50 focus:border-coral transition-colors duration-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink-soft dark:text-gray-400 mb-1">{t.auth.prenom}</label>
                  <input
                    value={form.prenom}
                    onChange={update("prenom")}
                    type="text"
                    placeholder="Votre Prenom"
                    className="w-full border border-line dark:border-dark-line bg-white dark:bg-dark-surface text-ink dark:text-white rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-coral/50 focus:border-coral transition-colors duration-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink-soft dark:text-gray-400 mb-1">{t.auth.telephone}</label>
                  <input
                    value={form.telephone}
                    onChange={update("telephone")}
                    type="tel"
                    placeholder="Votre Numero de Telephone"
                    className="w-full border border-line dark:border-dark-line bg-white dark:bg-dark-surface text-ink dark:text-white rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-coral/50 focus:border-coral transition-colors duration-200"
                  />
                </div>
              </>
            )}
            <div>
              <label className="block text-xs font-semibold text-ink-soft dark:text-gray-400 mb-1">{t.auth.email}</label>
              <input
                value={form.email}
                onChange={update("email")}
                type="email"
                className="w-full border border-line dark:border-dark-line bg-white dark:bg-dark-surface text-ink dark:text-white rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-coral/50 focus:border-coral transition-colors duration-200"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-ink-soft dark:text-gray-400 mb-1">{t.auth.password}</label>
              <input
                value={form.motDePasse}
                onChange={update("motDePasse")}
                type="password"
                className="w-full border border-line dark:border-dark-line bg-white dark:bg-dark-surface text-ink dark:text-white rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-coral/50 focus:border-coral transition-colors duration-200"
              />
            </div>
            {mode === "register" && (
              <div>
                <label className="block text-xs font-semibold text-ink-soft dark:text-gray-400 mb-1">{t.auth.confirm}</label>
                <input
                  value={form.confirm}
                  onChange={update("confirm")}
                  type="password"
                  className="w-full border border-line dark:border-dark-line bg-white dark:bg-dark-surface text-ink dark:text-white rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-coral/50 focus:border-coral transition-colors duration-200"
                />
              </div>
            )}

            {error && <p className="text-xs text-red-500">{error}</p>}

            <button
              type="submit"
              className="w-full bg-sage hover:bg-sage-dark text-white text-sm font-semibold py-3 rounded-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
            >
              {mode === "login" ? t.auth.loginBtn : t.auth.registerBtn}
            </button>
          </form>

          <button
            onClick={() => {
              setMode(mode === "login" ? "register" : "login");
              setError("");
            }}
            className="mt-4 text-xs text-ink-soft dark:text-gray-400 hover:text-coral transition-colors duration-200"
          >
            {mode === "login" ? t.auth.switchToRegister : t.auth.switchToLogin}
          </button>
        </div>
      </div>
    </div>
  );
}
