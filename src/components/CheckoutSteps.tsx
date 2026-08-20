import { Fragment } from "react";
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
    <div className="flex items-center w-full mb-10">
      {steps.map((s, i) => {
        const isDone = current > s.n || s.done;
        const isCurrent = current === s.n;
        return (
          <Fragment key={s.n}>
            {/* Ligne de liaison entre les étapes */}
            {i > 0 && (
              <div
                className={`h-0.5 flex-1 mx-3 min-w-[12px] rounded transition-colors duration-300 ${
                  isDone ? "bg-sage" : "bg-line dark:bg-dark-line"
                }`}
              />
            )}

            <Link
              to={s.to}
              className={`flex items-center gap-1.5 text-[10px] sm:text-xs font-semibold whitespace-nowrap transition-colors duration-200 ${
                isCurrent
                  ? "text-coral"
                  : isDone
                  ? "text-sage"
                  : "text-ink-soft dark:text-gray-500 hover:text-coral"
              }`}
            >
              <span
                className={`w-7 h-7 flex-shrink-0 rounded-full flex items-center justify-center text-xs border transition-colors duration-200 ${
                  isCurrent
                    ? "border-coral bg-coral text-white"
                    : isDone
                    ? "border-sage bg-sage text-white"
                    : "border-line dark:border-dark-line"
                }`}
              >
                {isDone && !isCurrent ? "✓" : s.n}
              </span>
              <span>{s.label}</span>
            </Link>
          </Fragment>
        );
      })}
    </div>
  );
}
