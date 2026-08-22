import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { formatAr } from "../data/products";

import {
  BackendOrder,
  downloadInvoice,
  fetchOrder,
} from "../services/orderApi";

import { fetchProduct } from "../services/productApi";

import CheckoutSteps from "../components/CheckoutSteps";

export default function Invoice() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState<BackendOrder | null>(
    null
  );

  const [productNames, setProductNames] = useState<
    Record<number, string>
  >({});

  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState("");

  const numericOrderId = Number(orderId);

  const loadOrder = useCallback(async () => {
    if (!numericOrderId || Number.isNaN(numericOrderId)) {
      setError("Commande introuvable");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await fetchOrder(numericOrderId);

      setOrder(data);

      // Récupère les noms produits depuis le backend.
      if (data.items?.length) {
        const names: Record<number, string> = {};

        await Promise.all(
          data.items.map(async (item) => {
            try {
              const product = await fetchProduct(
                item.product_id
              );

              names[item.product_id] = product.nom;
            } catch {
              names[item.product_id] =
                `Produit #${item.product_id}`;
            }
          })
        );

        setProductNames(names);
      }
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Impossible de charger la commande"
      );
    } finally {
      setLoading(false);
    }
  }, [numericOrderId]);

  useEffect(() => {
    loadOrder();
  }, [loadOrder]);

  const handleDownloadInvoice = async () => {
    if (!order) return;

    try {
      setDownloading(true);
      setError("");

      const blob = await downloadInvoice(order.id);

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;
      link.download = `facture_${order.id}.pdf`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Impossible de télécharger la facture"
      );
    } finally {
      setDownloading(false);
    }
  };

  const statusLabel = useMemo(() => {
    if (!order) return "";

    const labels: Record<string, string> = {
      pending: "En attente de paiement",
      confirmed: "Payée / Confirmée",
      shipped: "Expédiée",
      delivered: "Livrée",
      cancelled: "Annulée",
    };

    return labels[order.status] || order.status;
  }, [order]);

  if (loading) {
    return (
      <div className="max-w-[900px] mx-auto px-6 py-24 text-center">
        <p className="text-ink-soft dark:text-gray-400">
          Chargement de la facture...
        </p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-[700px] mx-auto px-6 py-24 text-center">
        <div className="text-5xl mb-4">🧾</div>

        <h1 className="font-display text-2xl text-ink dark:text-white mb-4">
          {t.invoice.title}
        </h1>

        <p className="text-ink-soft dark:text-gray-400 mb-6">
          {error || t.invoice.empty}
        </p>

        <Link
          to="/orders"
          className="inline-block bg-sage hover:bg-sage-dark text-white text-sm font-semibold px-6 py-3 rounded-sm"
        >
          Voir mes commandes
        </Link>
      </div>
    );
  }

  const isPaid = order.status !== "pending";

  return (
    <div className="max-w-[900px] mx-auto px-6 py-12 animate-fade-up">
      <CheckoutSteps current={4} />

      <div className="flex items-start justify-between mb-8">
        <div>
          <span
            className={`inline-block text-xs font-bold px-3 py-1 rounded-sm mb-3 ${
              isPaid
                ? "bg-sage text-white"
                : "bg-gold text-white"
            }`}
          >
            {isPaid ? "✓ Payée" : "⌛ En attente"}
          </span>

          <h1 className="font-display text-3xl text-ink dark:text-white">
            {t.invoice.title}
          </h1>

          <p className="text-sm text-ink-soft dark:text-gray-400 mt-1">
            Commande #{order.id}
          </p>
        </div>

        <div className="text-right text-sm">
          <p className="text-ink-soft dark:text-gray-400">
            {t.invoice.date}
          </p>

          <p className="font-semibold text-ink dark:text-white">
            {new Date(
              order.created_at
            ).toLocaleDateString()}
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-6 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-sm px-4 py-3">
          {error}
        </div>
      )}

      <div className="border border-line dark:border-dark-line rounded-sm p-6 bg-white dark:bg-dark-surface mb-6">
        <div className="grid sm:grid-cols-2 gap-6 text-sm">
          <div>
            <p className="font-semibold text-ink dark:text-white mb-2">
              {t.invoice.client}
            </p>

            <p className="text-ink-soft dark:text-gray-400">
              {user?.nom} {user?.prenom}
            </p>

            <p className="text-ink-soft dark:text-gray-400">
              {user?.email}
            </p>

            {user?.telephone && (
              <p className="text-ink-soft dark:text-gray-400">
                {user.telephone}
              </p>
            )}
          </div>

          <div>
            <p className="font-semibold text-ink dark:text-white mb-2">
              {t.invoice.shippingTo}
            </p>

            <p className="text-ink-soft dark:text-gray-400">
              {order.delivery_address}
            </p>

            <p className="text-ink-soft dark:text-gray-400">
              {order.city} {order.postal_code}
            </p>

            <p className="text-ink-soft dark:text-gray-400">
              {order.country}
            </p>
          </div>

          <div>
            <p className="font-semibold text-ink dark:text-white mb-2">
              Statut
            </p>

            <p className="text-ink-soft dark:text-gray-400">
              {statusLabel}
            </p>
          </div>

          {order.delivery_date && (
            <div>
              <p className="font-semibold text-ink dark:text-white mb-2">
                {t.invoice.deliveryDate}
              </p>

              <p className="text-ink-soft dark:text-gray-400">
                {order.delivery_date}
              </p>
            </div>
          )}

          {order.note && (
            <div className="sm:col-span-2">
              <p className="font-semibold text-ink dark:text-white mb-2">
                Note
              </p>

              <p className="text-ink-soft dark:text-gray-400">
                {order.note}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="border border-line dark:border-dark-line rounded-sm overflow-hidden mb-6">
        <table className="w-full text-sm">
          <thead className="bg-graybg dark:bg-dark-surface text-left">
            <tr>
              <th className="px-4 py-3 font-semibold text-ink dark:text-white">
                {t.invoice.item}
              </th>

              <th className="px-4 py-3 font-semibold text-ink dark:text-white text-center">
                {t.invoice.qty}
              </th>

              <th className="px-4 py-3 font-semibold text-ink dark:text-white text-right">
                {t.invoice.unitPrice}
              </th>

              <th className="px-4 py-3 font-semibold text-ink dark:text-white text-right">
                {t.invoice.total}
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-line dark:divide-dark-line">
            {order.items?.map((item) => (
              <tr key={item.id}>
                <td className="px-4 py-3 text-ink dark:text-white">
                  {productNames[item.product_id] ||
                    `Produit #${item.product_id}`}
                </td>

                <td className="px-4 py-3 text-center text-ink-soft dark:text-gray-400">
                  {item.quantity}
                </td>

                <td className="px-4 py-3 text-right text-ink-soft dark:text-gray-400">
                  {formatAr(Number(item.unit_price))}
                </td>

                <td className="px-4 py-3 text-right font-semibold text-ink dark:text-white">
                  {formatAr(Number(item.subtotal))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end mb-8">
        <div className="w-full sm:w-72 space-y-2 text-sm">
          <div className="flex justify-between border-t border-line dark:border-dark-line pt-2">
            <span className="font-bold text-ink dark:text-white">
              {t.invoice.grandTotal}
            </span>

            <span className="font-bold text-coral">
              {formatAr(Number(order.total))}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        {isPaid && (
          <button
            onClick={handleDownloadInvoice}
            disabled={downloading}
            className="flex-1 bg-ink hover:bg-ink/90 text-white text-sm font-semibold py-3 rounded-sm transition-colors duration-200 dark:bg-white dark:text-ink disabled:opacity-60"
          >
            {downloading
              ? "Téléchargement..."
              : "📄 Télécharger la facture PDF"}
          </button>
        )}

        <button
          onClick={() => navigate("/orders")}
          className="flex-1 bg-sage hover:bg-sage-dark text-white text-sm font-semibold py-3 rounded-sm transition-colors duration-200"
        >
          Voir mes commandes
        </button>
      </div>
    </div>
  );
}