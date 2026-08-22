import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useLanguage } from "../context/LanguageContext";
import { useCart } from "../context/CartContext";

import {
  createOrder,
  payOrder,
} from "../services/orderApi";

import {
  formatAr,
  FREE_DELIVERY_THRESHOLD,
  DELIVERY_FEE,
} from "../data/products";

import CheckoutSteps from "../components/CheckoutSteps";

const METHODS = [
  "card",
  "mvola",
  "orange",
  "airtel",
  "paypal",
] as const;

export default function Payment() {
  const { t } = useLanguage();

  const {
    items,
    total,
    loading,
    refreshCart,
  } = useCart();

  const navigate = useNavigate();

  const [form, setForm] = useState({
    rue: "",
    ville: "",
    code_postal: "",
    pays: "Madagascar",
    deliveryDate: "",
    note: "",
  });

  const [method, setMethod] = useState("card");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const deliveryFee =
    total >= FREE_DELIVERY_THRESHOLD
      ? 0
      : DELIVERY_FEE;

  const grandTotal = total + deliveryFee;

  const update =
    (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((current) => ({
        ...current,
        [field]: e.target.value,
      }));
    };

  const inputClass =
    "w-full border border-line dark:border-dark-line bg-white dark:bg-dark-surface text-ink dark:text-white rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-coral/50 focus:border-coral transition-colors";

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError("");

    if (
      !form.rue.trim() ||
      !form.ville.trim() ||
      !form.code_postal.trim() ||
      !form.pays.trim()
    ) {
      setError(
        "Veuillez remplir toutes les informations de livraison."
      );

      return;
    }

    try {
      setSubmitting(true);

      // 1. Création commande depuis cart_items PostgreSQL.
      const order = await createOrder({
        delivery_address: form.rue.trim(),
        city: form.ville.trim(),
        postal_code: form.code_postal.trim(),
        country: form.pays.trim(),
        delivery_date: form.deliveryDate || null,
        note: form.note.trim() || null,
      });

      // 2. Paiement backend simulé.
      await payOrder(order.id, method);

      // 3. Le backend vide cart_items après création de commande.
      // On recharge donc le panier depuis PostgreSQL.
      await refreshCart();

      // 4. Aller vers la facture backend.
      navigate(`/invoice/${order.id}`, {
        replace: true,
      });
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Erreur lors du paiement"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-[700px] mx-auto px-6 py-24 text-center">
        <p className="text-ink-soft dark:text-gray-400">
          Chargement du panier...
        </p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-[700px] mx-auto px-6 py-24 text-center">
        <div className="text-5xl mb-4">🛒</div>

        <p className="text-ink-soft dark:text-gray-400 mb-6">
          {t.cart.empty}
        </p>

        <Link
          to="/"
          className="inline-block bg-sage hover:bg-sage-dark text-white text-sm font-semibold px-6 py-3 rounded-sm"
        >
          {t.cart.continue}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1100px] mx-auto px-6 py-12 animate-fade-up">
      <CheckoutSteps current={3} />

      <h1 className="font-display text-3xl text-ink dark:text-white mb-8">
        {t.payment.title}
      </h1>

      <div className="grid lg:grid-cols-[1fr_380px] gap-8">
        <form
          onSubmit={handleSubmit}
          className="space-y-8"
        >
          {/* Livraison */}
          <div className="border border-line dark:border-dark-line rounded-sm p-6 bg-white dark:bg-dark-surface">
            <h2 className="font-display text-lg text-ink dark:text-white mb-4">
              {t.payment.delivery}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-ink-soft dark:text-gray-400 mb-1">
                  {t.payment.address}
                </label>

                <input
                  value={form.rue}
                  onChange={update("rue")}
                  placeholder="Lot II B 12, Ankorondrano"
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-ink-soft dark:text-gray-400 mb-1">
                    {t.payment.city}
                  </label>

                  <input
                    value={form.ville}
                    onChange={update("ville")}
                    placeholder="Antananarivo"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink-soft dark:text-gray-400 mb-1">
                    {t.payment.zip}
                  </label>

                  <input
                    value={form.code_postal}
                    onChange={update("code_postal")}
                    placeholder="101"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-ink-soft dark:text-gray-400 mb-1">
                    {t.payment.country}
                  </label>

                  <input
                    value={form.pays}
                    onChange={update("pays")}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink-soft dark:text-gray-400 mb-1">
                    {t.payment.deliveryDate}
                  </label>

                  <input
                    value={form.deliveryDate}
                    onChange={update("deliveryDate")}
                    type="date"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-soft dark:text-gray-400 mb-1">
                  Note de livraison
                </label>

                <input
                  value={form.note}
                  onChange={update("note")}
                  placeholder="Exemple : appeler avant la livraison"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Paiement */}
          <div className="border border-line dark:border-dark-line rounded-sm p-6 bg-white dark:bg-dark-surface">
            <h2 className="font-display text-lg text-ink dark:text-white mb-4">
              {t.payment.paymentMethod}
            </h2>

            <div className="flex flex-wrap gap-2">
              {METHODS.map((currentMethod) => (
                <button
                  key={currentMethod}
                  type="button"
                  onClick={() => setMethod(currentMethod)}
                  className={`text-xs font-semibold px-4 py-2 rounded-full border transition-colors duration-200 ${
                    method === currentMethod
                      ? "border-coral text-coral bg-coral/5"
                      : "border-line dark:border-dark-line text-ink-soft dark:text-gray-300 hover:border-coral hover:text-coral"
                  }`}
                >
                  {t.payment[currentMethod] ?? currentMethod}
                </button>
              ))}
            </div>

            <p className="text-xs text-ink-soft dark:text-gray-400 mt-4">
              🔒 Le paiement est actuellement simulé et enregistré
              dans PostgreSQL.
            </p>
          </div>

          {error && (
            <div className="text-xs text-red-500 bg-red-500/10 border border-red-500/20 rounded-md px-3 py-2.5">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-sage hover:bg-sage-dark text-white text-sm font-semibold py-3 rounded-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting
              ? "Paiement..."
              : `${t.payment.pay} — ${formatAr(grandTotal)}`}
          </button>

          <p className="text-xs text-ink-soft dark:text-gray-500 text-center">
            🔒 {t.payment.secure}
          </p>
        </form>

        {/* Récapitulatif */}
        <aside className="border border-line dark:border-dark-line rounded-sm p-6 bg-white dark:bg-dark-surface h-fit lg:sticky lg:top-24">
          <h2 className="font-display text-lg text-ink dark:text-white mb-4">
            {t.payment.summary}
          </h2>

          <div className="space-y-3 mb-4 max-h-64 overflow-auto">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between text-sm"
              >
                <span className="text-ink-soft dark:text-gray-400">
                  {item.name}{" "}
                  <span className="text-xs">
                    ×{item.qty}
                  </span>
                </span>

                <span className="font-semibold text-ink dark:text-white">
                  {formatAr(item.price * item.qty)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-line dark:border-dark-line pt-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-ink-soft dark:text-gray-400">
                {t.payment.subtotal}
              </span>

              <span className="font-semibold text-ink dark:text-white">
                {formatAr(total)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-ink-soft dark:text-gray-400">
                {t.payment.deliveryFee}
              </span>

              <span
                className={`font-semibold ${
                  deliveryFee === 0
                    ? "text-sage"
                    : "text-ink dark:text-white"
                }`}
              >
                {deliveryFee === 0
                  ? t.payment.free
                  : formatAr(deliveryFee)}
              </span>
            </div>

            <div className="flex justify-between border-t border-line dark:border-dark-line pt-2">
              <span className="font-bold text-ink dark:text-white">
                {t.payment.total}
              </span>

              <span className="font-bold text-coral">
                {formatAr(grandTotal)}
              </span>
            </div>
          </div>

          <Link
            to="/cart"
            className="block text-center text-xs text-ink-soft dark:text-gray-400 hover:text-coral transition-colors duration-200 mt-4"
          >
            ← {t.payment.backToCart}
          </Link>
        </aside>
      </div>
    </div>
  );
}