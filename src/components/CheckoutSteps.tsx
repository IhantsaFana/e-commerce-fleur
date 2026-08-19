import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";

export default function CheckoutSteps({ current }: { current: 1 | 2 | 3 | 4 }) {
  const { t } = useLanguage();
  const { user } = useAuth();

  const steps = [
    { n: 1, label: t.steps.cart, to: "/cart" },
    { n: 2, label: t.steps.login, to: user ? "/payment" : "/auth", done: !!user },
    { n: 3, label: t.steps.payment, to: "/payment" },
    { n: 4, label: t.steps.invoice, to: "/invoice" },
  ];

  return (
    <div className="flex items-center justify-center gap-2 md:gap-4 mb-10 flex-wrap">
      {steps.map((s, i) => {
        const isDone = current > s.n || s.done;
        const isCurrent = current === s.n;
        return (
          <div key={s.n} className="flex items-center gap-2 md:gap-4">
            {i > 0 && <span className="w-6 md:w-12 h-px bg-line dark:bg-dark-line" />}
            <Link
              to={s.to}
              className={`flex items-center gap-2 text-xs font-semibold transition-colors duration-200 ${
                isCurrent
                  ? "text-coral"
                  : isDone
                  ? "text-sage"
                  : "text-ink-soft dark:text-gray-500 hover:text-coral"
              }`}
            >
              <span
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs border transition-colors duration-200 ${
                  isCurrent
                    ? "border-coral bg-coral text-white"
                    : isDone
                    ? "border-sage bg-sage text-white"
                    : "border-line dark:border-dark-line"
                }`}
              >
                {isDone && !isCurrent ? "✓" : s.n}
              </span>
              <span className="hidden sm:inline">{s.label}</span>
            </Link>
          </div>
        );
      })}
    </div>
  );
}
