import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { formatAr } from "../data/products";
import PhotoSlot from "../components/PhotoSlot";
import CheckoutSteps from "../components/CheckoutSteps";

export default function Cart() {
  const { t } = useLanguage();
  const { items, removeItem, updateQty, total } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      navigate("/auth", { state: { from: "/payment" } });
      return;
    }
    navigate("/payment");
  };

  if (items.length === 0) {
    return (
      <div className="max-w-[700px] mx-auto px-6 py-24 text-center animate-fade-up">
        <div className="text-5xl mb-4">🛒</div>
        <h1 className="font-display text-2xl text-ink dark:text-white mb-4">{t.cart.title}</h1>
        <p className="text-ink-soft dark:text-gray-400 mb-6">{t.cart.empty}</p>
        <Link
          to="/"
          className="inline-block bg-sage hover:bg-sage-dark text-white text-sm font-semibold px-6 py-3 rounded-sm transition-all duration-200 hover:-translate-y-0.5"
        >
          {t.cart.continue}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[900px] mx-auto px-6 py-12 animate-fade-up">
      <CheckoutSteps current={1} />
      <h1 className="font-display text-3xl text-ink dark:text-white mb-8">{t.cart.title}</h1>

      <div className="space-y-4 mb-8">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 border border-line dark:border-dark-line rounded-sm p-4 bg-white dark:bg-dark-surface transition-colors duration-300"
          >
            <Link to={`/product/${item.id}`} className="w-20 h-20 flex-shrink-0 block">
              <PhotoSlot src={item.image} alt={item.name} className="w-full h-full" />
            </Link>
            <div className="flex-1">
              <Link to={`/product/${item.id}`} className="font-semibold text-ink dark:text-white hover:text-coral transition-colors duration-200">
                {item.name}
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-ink-soft dark:text-gray-400 hidden sm:inline">{t.cart.qty}</label>
              <input
                type="number"
                min={1}
                value={item.qty}
                onChange={(e) => updateQty(item.id, parseInt(e.target.value) || 1)}
                className="w-14 border border-line dark:border-dark-line bg-white dark:bg-dark-bg text-ink dark:text-white rounded-sm px-2 py-1 text-sm text-center focus:outline-none focus:ring-2 focus:ring-coral/50"
              />
            </div>
            <span className="font-semibold text-ink dark:text-white w-28 text-right">
              {formatAr(item.price * item.qty)}
            </span>
            <button
              onClick={() => removeItem(item.id)}
              className="text-xs text-ink-soft dark:text-gray-400 hover:text-coral transition-colors duration-200"
              aria-label={t.cart.remove}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="border border-line dark:border-dark-line rounded-sm p-6 bg-white dark:bg-dark-surface mb-6">
        <h2 className="font-display text-lg text-ink dark:text-white mb-4">{t.cart.summary}</h2>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-ink-soft dark:text-gray-400">{t.cart.total}</span>
          <span className="font-bold text-xl text-ink dark:text-white">{formatAr(total)}</span>
        </div>
        <p className="text-xs text-ink-soft dark:text-gray-500 mb-4">{t.cart.note}</p>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Link
            to="/"
            className="text-sm text-ink-soft dark:text-gray-300 hover:text-coral transition-colors duration-200 sm:mr-auto text-center py-2"
          >
            ← {t.cart.continue}
          </Link>
          <button
            onClick={handleCheckout}
            className="bg-coral hover:bg-coral-dark text-white text-sm font-semibold px-8 py-3 rounded-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
          >
            {t.cart.checkout} →
          </button>
        </div>
      </div>
    </div>
  );
}
