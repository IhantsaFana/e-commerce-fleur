import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { getOrders, Order } from "../services/orders";
import { formatAr } from "../data/products";

export default function Orders() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const orders = getOrders();

  if (orders.length === 0) {
    return (
      <div className="max-w-[700px] mx-auto px-6 py-24 text-center animate-fade-up">
        <div className="text-5xl mb-4">📦</div>
        <h1 className="font-display text-2xl text-ink dark:text-white mb-4">{t.orders.title}</h1>
        <p className="text-ink-soft dark:text-gray-400 mb-6">{t.orders.empty}</p>
        <Link
          to="/"
          className="inline-block bg-sage hover:bg-sage-dark text-white text-sm font-semibold px-6 py-3 rounded-sm transition-all duration-200 hover:-translate-y-0.5"
        >
          {t.orders.backToShop}
        </Link>
      </div>
    );
  }

  const openOrder = (order: Order) => {
    navigate("/invoice", { state: { commande: order } });
  };

  return (
    <div className="max-w-[900px] mx-auto px-6 py-12 animate-fade-up">
      <h1 className="font-display text-3xl text-ink dark:text-white mb-2">{t.orders.title}</h1>
      <p className="text-sm text-ink-soft dark:text-gray-400 mb-8">{t.orders.subtitle}</p>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="border border-line dark:border-dark-line rounded-sm p-5 bg-white dark:bg-dark-surface flex flex-col sm:flex-row items-start sm:items-center gap-4 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
          >
            <div className="w-12 h-12 rounded-full bg-graybg dark:bg-dark-bg flex items-center justify-center text-xl flex-shrink-0">
              🧾
            </div>

            <div className="flex-1">
              <p className="font-semibold text-ink dark:text-white">
                {t.orders.orderNumber} : {order.numeroCommande}
              </p>
              <p className="text-xs text-ink-soft dark:text-gray-400 mt-0.5">
                {t.orders.date} : {new Date(order.dateCommande).toLocaleDateString()}
              </p>
              <p className="text-xs text-ink-soft dark:text-gray-400">
                {order.items.reduce((sum, i) => sum + i.qty, 0)} {t.orders.articles}
              </p>
            </div>

            <div className="text-right">
              <span className="inline-block bg-sage/10 text-sage text-xs font-bold px-2 py-1 rounded-sm mb-1">
                ✓ {t.orders.paid}
              </span>
              <p className="font-bold text-ink dark:text-white">{formatAr(order.grandTotal)}</p>
            </div>

            <button
              onClick={() => openOrder(order)}
              className="text-xs font-semibold text-coral hover:text-coral-dark border border-coral rounded-sm px-4 py-2 transition-colors duration-200 hover:bg-coral hover:text-white"
            >
              {t.orders.view} →
            </button>
          </div>
        ))}
      </div>

      <Link
        to="/"
        className="inline-block mt-8 text-xs text-ink-soft dark:text-gray-400 hover:text-coral transition-colors duration-200"
      >
        ← {t.orders.backToShop}
      </Link>
    </div>
  );
}
