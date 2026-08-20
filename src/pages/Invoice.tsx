import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { formatAr } from "../data/products";
import CheckoutSteps from "../components/CheckoutSteps";

interface CommandeLocale {
  numeroCommande: string;
  dateCommande: string;
  items: { id: number; name: string; price: number; qty: number }[];
  subtotal: number;
  deliveryFee: number;
  grandTotal: number;
  methode: string;
  adresse: { rue: string; ville: string; code_postal: string; pays: string };
  deliveryDate: string;
  note: string;
}

export default function Invoice() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const location = useLocation();
  const commande = (location.state as any)?.commande as CommandeLocale | undefined;

  if (!commande) {
    return (
      <div className="max-w-[700px] mx-auto px-6 py-24 text-center animate-fade-up">
        <div className="text-5xl mb-4">🧾</div>
        <h1 className="font-display text-2xl text-ink dark:text-white mb-4">{t.invoice.title}</h1>
        <p className="text-ink-soft dark:text-gray-400 mb-6">{t.invoice.empty}</p>
        <Link to="/" className="inline-block bg-sage hover:bg-sage-dark text-white text-sm font-semibold px-6 py-3 rounded-sm">
          {t.invoice.backToShop}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[900px] mx-auto px-6 py-12 animate-fade-up">
      <CheckoutSteps current={4} />

      <div className="flex items-start justify-between mb-8">
        <div>
          <span className="inline-block bg-sage text-white text-xs font-bold px-3 py-1 rounded-sm mb-3">
            ✓ {t.invoice.paid}
          </span>
          <h1 className="font-display text-3xl text-ink dark:text-white">{t.invoice.title}</h1>
          <p className="text-sm text-ink-soft dark:text-gray-400 mt-1">
            {t.invoice.number} : {commande.numeroCommande}
          </p>
        </div>
        <div className="text-right text-sm">
          <p className="text-ink-soft dark:text-gray-400">{t.invoice.date}</p>
          <p className="font-semibold text-ink dark:text-white">
            {new Date(commande.dateCommande).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="border border-line dark:border-dark-line rounded-sm p-6 bg-white dark:bg-dark-surface mb-6">
        <div className="grid sm:grid-cols-2 gap-6 text-sm">
          <div>
            <p className="font-semibold text-ink dark:text-white mb-2">{t.invoice.client}</p>
            <p className="text-ink-soft dark:text-gray-400">
              {user?.nom} {user?.prenom}
            </p>
            <p className="text-ink-soft dark:text-gray-400">{user?.email}</p>
            {user?.telephone && (
              <p className="text-ink-soft dark:text-gray-400">{user.telephone}</p>
            )}
          </div>
          <div>
            <p className="font-semibold text-ink dark:text-white mb-2">{t.invoice.shippingTo}</p>
            <p className="text-ink-soft dark:text-gray-400">
              {commande.adresse.rue}, {commande.adresse.ville} {commande.adresse.code_postal}, {commande.adresse.pays}
            </p>
          </div>
          <div>
            <p className="font-semibold text-ink dark:text-white mb-2">{t.invoice.paymentMethod}</p>
            <p className="text-ink-soft dark:text-gray-400">
              {t.payment[commande.methode] ?? commande.methode}
            </p>
          </div>
          {commande.deliveryDate && (
            <div>
              <p className="font-semibold text-ink dark:text-white mb-2">{t.invoice.deliveryDate}</p>
              <p className="text-ink-soft dark:text-gray-400">{commande.deliveryDate}</p>
            </div>
          )}
        </div>
      </div>

      <div className="border border-line dark:border-dark-line rounded-sm overflow-hidden mb-6">
        <table className="w-full text-sm">
          <thead className="bg-graybg dark:bg-dark-surface text-left">
            <tr>
              <th className="px-4 py-3 font-semibold text-ink dark:text-white">{t.invoice.item}</th>
              <th className="px-4 py-3 font-semibold text-ink dark:text-white text-center">{t.invoice.qty}</th>
              <th className="px-4 py-3 font-semibold text-ink dark:text-white text-right">{t.invoice.unitPrice}</th>
              <th className="px-4 py-3 font-semibold text-ink dark:text-white text-right">{t.invoice.total}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line dark:divide-dark-line">
            {commande.items.map((item) => (
              <tr key={item.id}>
                <td className="px-4 py-3 text-ink dark:text-white">{item.name}</td>
                <td className="px-4 py-3 text-center text-ink-soft dark:text-gray-400">{item.qty}</td>
                <td className="px-4 py-3 text-right text-ink-soft dark:text-gray-400">{formatAr(item.price)}</td>
                <td className="px-4 py-3 text-right font-semibold text-ink dark:text-white">{formatAr(item.price * item.qty)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end mb-8">
        <div className="w-full sm:w-72 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-ink-soft dark:text-gray-400">{t.invoice.subtotal}</span>
            <span className="font-semibold text-ink dark:text-white">{formatAr(commande.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-soft dark:text-gray-400">{t.invoice.delivery}</span>
            <span className={`font-semibold ${commande.deliveryFee === 0 ? "text-sage" : "text-ink dark:text-white"}`}>
              {commande.deliveryFee === 0 ? t.payment.free : formatAr(commande.deliveryFee)}
            </span>
          </div>
          <div className="flex justify-between border-t border-line dark:border-dark-line pt-2">
            <span className="font-bold text-ink dark:text-white">{t.invoice.grandTotal}</span>
            <span className="font-bold text-coral">{formatAr(commande.grandTotal)}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => window.print()}
          className="flex-1 bg-ink hover:bg-ink/90 text-white text-sm font-semibold py-3 rounded-sm transition-colors duration-200 dark:bg-white dark:text-ink dark:hover:bg-gray-200"
        >
          🖨 {t.invoice.print}
        </button>
        <Link
          to="/"
          className="flex-1 text-center bg-sage hover:bg-sage-dark text-white text-sm font-semibold py-3 rounded-sm transition-colors duration-200"
        >
          {t.invoice.backToShop}
        </Link>
      </div>
    </div>
  );
}
