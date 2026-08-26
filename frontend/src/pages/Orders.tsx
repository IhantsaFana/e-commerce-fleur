import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { Link, useNavigate } from "react-router-dom";

import { useLanguage } from "../context/LanguageContext";
import { formatAr } from "../data/products";

import {
  BackendOrder,
  fetchOrders,
  cancelOrder,
} from "../services/orderApi";

const statusLabel = (status: string) => {
  const labels: Record<string, string> = {
    pending: "En attente",
    confirmed: "Confirmée",
    shipped: "Expédiée",
    delivered: "Livrée",
    cancelled: "Annulée",
  };

  return labels[status] || status;
};

const statusClass = (status: string) => {
  const classes: Record<string, string> = {
    pending: "bg-gold/15 text-gold",
    confirmed: "bg-sage/10 text-sage",
    shipped: "bg-coral/10 text-coral",
    delivered: "bg-sage/10 text-sage",
    cancelled: "bg-red-500/10 text-red-500",
  };

  return classes[status] || "bg-graybg text-ink-soft";
};

export default function Orders() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [orders, setOrders] = useState<BackendOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState<number | null>(
    null
  );

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await fetchOrders();

      setOrders(data);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Impossible de charger les commandes"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleCancel = async (orderId: number) => {
    const accepted = window.confirm(
      "Voulez-vous vraiment annuler cette commande ?"
    );

    if (!accepted) return;

    try {
      setCancellingId(orderId);

      const updatedOrder = await cancelOrder(orderId);

      setOrders((previous) =>
        previous.map((order) =>
          order.id === updatedOrder.id
            ? updatedOrder
            : order
        )
      );
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Impossible d'annuler cette commande"
      );
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) {
    return (
      <div className="max-w-[900px] mx-auto px-6 py-24 text-center">
        <p className="text-ink-soft dark:text-gray-400">
          Chargement des commandes...
        </p>
      </div>
    );
  }

  if (orders.length === 0 && !error) {
    return (
      <div className="max-w-[700px] mx-auto px-6 py-24 text-center animate-fade-up">
        <div className="text-5xl mb-4">📦</div>

        <h1 className="font-display text-2xl text-ink dark:text-white mb-4">
          {t.orders.title}
        </h1>

        <p className="text-ink-soft dark:text-gray-400 mb-6">
          {t.orders.empty}
        </p>

        <Link
          to="/"
          className="inline-block bg-sage hover:bg-sage-dark text-white text-sm font-semibold px-6 py-3 rounded-sm"
        >
          {t.orders.backToShop}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[900px] mx-auto px-6 py-12 animate-fade-up">
      <div className="flex items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl text-ink dark:text-white mb-2">
            {t.orders.title}
          </h1>

          <p className="text-sm text-ink-soft dark:text-gray-400">
            Historique réel venant de PostgreSQL.
          </p>
        </div>

        <button
          onClick={loadOrders}
          className="text-xs font-semibold border border-line dark:border-dark-line text-ink dark:text-white px-3 py-2 rounded-sm hover:text-coral hover:border-coral"
        >
          ↻ Actualiser
        </button>
      </div>

      {error && (
        <div className="mb-6 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-sm px-4 py-3">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="border border-line dark:border-dark-line rounded-sm p-5 bg-white dark:bg-dark-surface flex flex-col sm:flex-row items-start sm:items-center gap-4"
          >
            <div className="w-12 h-12 rounded-full bg-graybg dark:bg-dark-bg flex items-center justify-center text-xl flex-shrink-0">
              🧾
            </div>

            <div className="flex-1">
              <p className="font-semibold text-ink dark:text-white">
                Commande #{order.id}
              </p>

              <p className="text-xs text-ink-soft dark:text-gray-400 mt-1">
                {new Date(
                  order.created_at
                ).toLocaleDateString()}
              </p>

              <p className="text-xs text-ink-soft dark:text-gray-400">
                Livraison : {order.city || "-"},{" "}
                {order.country || "-"}
              </p>
            </div>

            <div className="text-right">
              <span
                className={`inline-block text-xs font-bold px-2 py-1 rounded-sm mb-1 ${statusClass(
                  order.status
                )}`}
              >
                {statusLabel(order.status)}
              </span>

              <p className="font-bold text-ink dark:text-white">
                {formatAr(Number(order.total))}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() =>
                  navigate(`/invoice/${order.id}`)
                }
                className="text-xs font-semibold text-coral hover:text-white hover:bg-coral border border-coral rounded-sm px-3 py-2 transition-colors"
              >
                Voir
              </button>

              {order.status === "pending" && (
                <button
                  disabled={cancellingId === order.id}
                  onClick={() => handleCancel(order.id)}
                  className="text-xs font-semibold text-red-500 hover:text-white hover:bg-red-500 border border-red-500/40 rounded-sm px-3 py-2 transition-colors disabled:opacity-60"
                >
                  {cancellingId === order.id
                    ? "Annulation..."
                    : "Annuler"}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <Link
        to="/"
        className="inline-block mt-8 text-xs text-ink-soft dark:text-gray-400 hover:text-coral"
      >
        ← {t.orders.backToShop}
      </Link>
    </div>
  );
}