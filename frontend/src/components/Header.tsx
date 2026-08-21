import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const { count } = useCart();

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-dark-bg/95 backdrop-blur border-b border-line dark:border-dark-line transition-colors duration-300">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between px-6 py-3">
        <Link to="/" className="flex items-center gap-1 group">
          <span className="font-display text-2xl text-ink dark:text-white tracking-tight">Voninkazo'</span>
          <span className="font-display text-2xl text-coral relative">
            Nao
            <svg className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 text-coral" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2 18h20l-1.5-9-5 4-3.5-7-3.5 7-5-4L2 18z" />
            </svg>
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-4 text-xs text-ink-soft dark:text-gray-300">
          <span className="flex items-center gap-1">
            <span className="text-gold tracking-tighter">★★★★★</span>
            {t.topbar.rating}
          </span>
          <span className="w-px h-4 bg-line dark:bg-dark-line" />
          <span className="flex items-center gap-1">🌐 {t.topbar.delivery}</span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="hidden md:inline-block text-xs font-semibold tracking-wide border border-ink dark:border-gray-300 text-ink dark:text-gray-100 px-4 py-2 rounded-sm hover:bg-ink hover:text-white dark:hover:bg-white dark:hover:text-ink transition-colors duration-200"
          >
            {t.topbar.saveDate}
          </Link>
          <LanguageSwitcher />
          <ThemeToggle />

          {user && (
            <Link
              to="/orders"
              className="text-xs font-semibold text-ink-soft dark:text-gray-300 hover:text-coral transition-colors duration-200 hidden md:inline-flex items-center gap-1"
            >
              📦 {t.orders.title}
            </Link>
          )}

          <Link to="/cart" className="relative hover:text-coral transition-colors duration-200" aria-label="Cart">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="text-ink dark:text-gray-100">
              <path d="M6 6h15l-1.5 9h-12L6 3H3" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="9" cy="20" r="1.2" fill="currentColor" />
              <circle cx="17" cy="20" r="1.2" fill="currentColor" />
            </svg>
            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-coral text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center animate-fade-up">
                {count}
              </span>
            )}
          </Link>

          {user ? (
            <button
              onClick={logout}
              className="w-8 h-8 rounded-full border border-line dark:border-dark-line flex items-center justify-center text-xs font-semibold text-ink dark:text-gray-100 hover:border-coral hover:text-coral transition-colors duration-200"
              title={user.nom}
            >
              {(user.nom?.[0] || user.prenom?.[0] || "U").toUpperCase()}
            </button>
          ) : (
            <Link
              to="/auth"
              className="w-8 h-8 rounded-full border border-line dark:border-dark-line flex items-center justify-center hover:border-coral hover:text-coral transition-colors duration-200 text-ink dark:text-gray-100"
              aria-label="Account"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 4-6 8-6s8 2 8 6" strokeLinecap="round" />
              </svg>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}