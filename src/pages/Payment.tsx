import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { saveOrder } from "../services/orders";
import { formatAr, FREE_DELIVERY_THRESHOLD, DELIVERY_FEE } from "../data/products";
import CheckoutSteps from "../components/CheckoutSteps";

const METHODS = ["card", "mvola", "orange", "airtel", "paypal"] as const;

export default function Payment() {
  const { t } = useLanguage();
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    rue: "",
    ville: "",
    code_postal: "",
    pays: "Madagascar",
    telephone: "",
    deliveryDate: "",
    note: "",
  });
  const [method, setMethod] = useState<string>("card");
  const [card, setCard] = useState({ number: "", expiry: "", cvc: "", holder: "" });
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState("");

  const deliveryFee = total >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const grandTotal = total + deliveryFee;

  const update = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const inputClass =
    "w-full border border-line dark:border-dark-line bg-white dark:bg-dark-surface text-ink dark:text-white rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-coral/50 focus:border-coral transition-colors duration-200";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.rue.trim() || !form.ville.trim() || !form.code_postal.trim() || !form.pays.trim()) {
      setError(t.payment.error);
      return;
    }
    // Facture générée localement (aucun appel API) — cohérent avec le panier localStorage
    const numeroCommande = `CMD-${Date.now().toString(36).toUpperCase()}`;
    const commande = {
      id: numeroCommande,
      numeroCommande,
      dateCommande: new Date().toISOString(),
      items: items.map((i) => ({ ...i })),
      subtotal: total,
      deliveryFee,
      grandTotal,
      methode: method,
      statut: "payee",
      adresse: {
        rue: form.rue.trim(),
        ville: form.ville.trim(),
        code_postal: form.code_postal.trim(),
        pays: form.pays.trim(),
      },
      deliveryDate: form.deliveryDate,
      note: form.note.trim(),
    };
    // Sauvegarde dans l'historique des commandes (localStorage)
    saveOrder(commande);
    clearCart();
    navigate("/invoice", { state: { commande } });
  };

  if (items.length === 0) {
    return (
      <div className="max-w-[700px] mx-auto px-6 py-24 text-center">
        <div className="text-5xl mb-4">🛒</div>
        <p className="text-ink-soft dark:text-gray-400 mb-6">{t.cart.empty}</p>
        <Link to="/" className="inline-block bg-sage hover:bg-sage-dark text-white text-sm font-semibold px-6 py-3 rounded-sm">
          {t.cart.continue}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1100px] mx-auto px-6 py-12 animate-fade-up">
      <CheckoutSteps current={3} />
      <h1 className="font-display text-3xl text-ink dark:text-white mb-8">{t.payment.title}</h1>

      <div className="grid lg:grid-cols-[1fr_380px] gap-8">
        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Adresse de livraison */}
          <div className="border border-line dark:border-dark-line rounded-sm p-6 bg-white dark:bg-dark-surface">
            <h2 className="font-display text-lg text-ink dark:text-white mb-4">{t.payment.delivery}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-ink-soft dark:text-gray-400 mb-1">{t.payment.address}</label>
                <input value={form.rue} onChange={update("rue")} placeholder="Lot II B 12, Ankorondrano" className={inputClass} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-ink-soft dark:text-gray-400 mb-1">{t.payment.city}</label>
                  <input value={form.ville} onChange={update("ville")} placeholder="Antananarivo" className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink-soft dark:text-gray-400 mb-1">{t.payment.zip}</label>
                  <input value={form.code_postal} onChange={update("code_postal")} placeholder="101" className={inputClass} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-ink-soft dark:text-gray-400 mb-1">{t.payment.country}</label>
                  <input value={form.pays} onChange={update("pays")} className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink-soft dark:text-gray-400 mb-1">{t.payment.deliveryDate}</label>
                  <input value={form.deliveryDate} onChange={update("deliveryDate")} type="date" className={inputClass} />
                </div>
              </div>
            </div>
          </div>

          {/* Mode de paiement */}
          <div className="border border-line dark:border-dark-line rounded-sm p-6 bg-white dark:bg-dark-surface">
            <h2 className="font-display text-lg text-ink dark:text-white mb-4">{t.payment.paymentMethod}</h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {METHODS.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMethod(m)}
                  className={`text-xs font-semibold px-4 py-2 rounded-full border transition-colors duration-200 ${
                    method === m
                      ? "border-coral text-coral bg-coral/5"
                      : "border-line dark:border-dark-line text-ink-soft dark:text-gray-300 hover:border-coral hover:text-coral"
                  }`}
                >
                  {t.payment[m] ?? m}
                </button>
              ))}
            </div>

            {method === "card" && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-ink-soft dark:text-gray-400 mb-1">{t.payment.cardNumber}</label>
                  <input value={card.number} onChange={(e) => setCard((c) => ({ ...c, number: e.target.value }))} placeholder="4242 4242 4242 4242" className={inputClass} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-ink-soft dark:text-gray-400 mb-1">{t.payment.expiry}</label>
                    <input value={card.expiry} onChange={(e) => setCard((c) => ({ ...c, expiry: e.target.value }))} placeholder="12/26" className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-ink-soft dark:text-gray-400 mb-1">{t.payment.cvc}</label>
                    <input value={card.cvc} onChange={(e) => setCard((c) => ({ ...c, cvc: e.target.value }))} placeholder="123" className={inputClass} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink-soft dark:text-gray-400 mb-1">{t.payment.holder}</label>
                  <input value={card.holder} onChange={(e) => setCard((c) => ({ ...c, holder: e.target.value }))} className={inputClass} />
                </div>
              </div>
            )}

            {method !== "card" && (
              <div>
                <label className="block text-xs font-semibold text-ink-soft dark:text-gray-400 mb-1">{t.payment.mobileNumber}</label>
                <input value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="+261 34 00 000 00" className={inputClass} />
              </div>
            )}
          </div>

          {error && (
            <div className="flex items-center gap-2 text-xs text-red-500 bg-red-500/10 border border-red-500/20 rounded-md px-3 py-2.5">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-sage hover:bg-sage-dark text-white text-sm font-semibold py-3 rounded-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
          >
            {t.payment.pay} — {formatAr(grandTotal)}
          </button>
          <p className="text-xs text-ink-soft dark:text-gray-500 text-center">🔒 {t.payment.secure}</p>
        </form>

        {/* Récapitulatif */}
        <aside className="border border-line dark:border-dark-line rounded-sm p-6 bg-white dark:bg-dark-surface h-fit lg:sticky lg:top-24">
          <h2 className="font-display text-lg text-ink dark:text-white mb-4">{t.payment.summary}</h2>
          <div className="space-y-3 mb-4 max-h-64 overflow-auto">
            {items.map((i) => (
              <div key={i.id} className="flex justify-between text-sm">
                <span className="text-ink-soft dark:text-gray-400">
                  {i.name} <span className="text-xs">×{i.qty}</span>
                </span>
                <span className="font-semibold text-ink dark:text-white">{formatAr(i.price * i.qty)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-line dark:border-dark-line pt-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-ink-soft dark:text-gray-400">{t.payment.subtotal}</span>
              <span className="font-semibold text-ink dark:text-white">{formatAr(total)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-soft dark:text-gray-400">{t.payment.deliveryFee}</span>
              <span className={`font-semibold ${deliveryFee === 0 ? "text-sage" : "text-ink dark:text-white"}`}>
                {deliveryFee === 0 ? t.payment.free : formatAr(deliveryFee)}
              </span>
            </div>
            <div className="flex justify-between border-t border-line dark:border-dark-line pt-2">
              <span className="font-bold text-ink dark:text-white">{t.payment.total}</span>
              <span className="font-bold text-coral">{formatAr(grandTotal)}</span>
            </div>
          </div>
          <Link to="/cart" className="block text-center text-xs text-ink-soft dark:text-gray-400 hover:text-coral transition-colors duration-200 mt-4">
            ← {t.payment.backToCart}
          </Link>
        </aside>
      </div>
    </div>
  );
}
