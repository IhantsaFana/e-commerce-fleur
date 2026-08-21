import { useState, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useCart } from "../context/CartContext";
import { formatAr } from "../data/products";
import { getFleur, getCategorie, getFleurs } from "../services/productStore";
import PhotoSlot from "../components/PhotoSlot";
import ProductCard from "../components/ProductCard";

export default function ProductDetail() {
  const { t } = useLanguage();
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const fleur = getFleur(Number(id));
  const categorieNom = fleur ? getCategorie(fleur.categorieId)?.nom ?? "" : "";

  const related = useMemo(() => {
    if (!fleur) return [];
    return getFleurs()
      .filter((f) => f.id !== fleur.id && f.categorieId === fleur.categorieId)
      .slice(0, 4);
  }, [fleur]);

  if (!fleur) {
    return (
      <div className="max-w-[600px] mx-auto px-6 py-24 text-center animate-fade-up">
        <p className="text-ink-soft dark:text-gray-400 mb-6">Produit introuvable.</p>
        <Link
          to="/"
          className="inline-block bg-sage hover:bg-sage-dark text-white text-sm font-semibold px-6 py-3 rounded-sm transition-all duration-200"
        >
          ← {t.detail.back}
        </Link>
      </div>
    );
  }

  const handleAdd = () => {
    addItem(fleur, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-10 animate-fade-up">
      <Link
        to="/"
        className="text-xs text-ink-soft dark:text-gray-400 hover:text-coral transition-colors duration-200 mb-6 inline-flex items-center gap-1"
      >
        ← {t.detail.back}
      </Link>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Image */}
        <div className="relative h-[320px] md:h-[480px] rounded-sm overflow-hidden bg-graybg dark:bg-dark-surface">
          <PhotoSlot src={fleur.imageUrl} alt={fleur.nom} className="absolute inset-0" />
          {fleur.freeGift && (
            <span className="absolute top-3 left-3 bg-gold text-white text-[11px] font-bold px-3 py-1.5 rounded-sm">
              {t.detail.freeGift}
            </span>
          )}
          {fleur.isNew && (
            <span className="absolute top-3 right-3 bg-coral text-white text-[11px] font-bold px-3 py-1.5 rounded-sm">
              {t.products.new}
            </span>
          )}
          {!fleur.disponible && (
            <span className="absolute top-3 right-3 bg-red-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-sm">
              Rupture
            </span>
          )}
        </div>

        {/* Infos */}
        <div>
          <p className="text-sm font-semibold text-coral uppercase tracking-widest mb-2">
            {categorieNom}
          </p>
          <h1 className="font-display text-3xl md:text-4xl text-ink dark:text-white mb-3">
            {fleur.nom}
          </h1>
          {fleur.rating && (
            <div className="flex items-center gap-2 mb-4">
              <span className="text-gold tracking-tighter">
                {"★".repeat(fleur.rating)}
                {"☆".repeat(5 - fleur.rating)}
              </span>
              <span className="text-xs text-ink-soft dark:text-gray-400">
                {fleur.rating}/5 — {fleur.reviews} {t.detail.reviews}
              </span>
            </div>
          )}

          <p className="text-3xl font-bold text-ink dark:text-white mb-1">
            {formatAr(fleur.prix)}
            {fleur.oldPrice && (
              <span className="ml-3 text-lg font-normal text-ink-soft dark:text-gray-500 line-through">
                {formatAr(fleur.oldPrice)}
              </span>
            )}
          </p>

          <p className="text-sm text-ink-soft dark:text-gray-300 leading-relaxed my-5">
            {fleur.description}
          </p>

          {/* Qty + Add */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center border border-line dark:border-dark-line rounded-sm">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="px-3 py-2.5 text-ink dark:text-gray-200 hover:text-coral transition-colors"
              >
                −
              </button>
              <span className="w-10 text-center text-sm font-semibold text-ink dark:text-white">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="px-3 py-2.5 text-ink dark:text-gray-200 hover:text-coral transition-colors"
              >
                +
              </button>
            </div>
            <button
              onClick={handleAdd}
              disabled={!fleur.disponible}
              className={`flex-1 text-sm font-semibold py-3 rounded-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed ${
                added ? "bg-sage text-white" : "bg-coral hover:bg-coral-dark text-white"
              }`}
            >
              {added ? t.detail.added : t.detail.addToCart}
            </button>
          </div>

          <button
            onClick={() => {
              handleAdd();
              navigate("/cart");
            }}
            className="w-full text-sm font-semibold border border-ink dark:border-gray-300 text-ink dark:text-gray-100 py-3 rounded-sm hover:bg-ink hover:text-white dark:hover:bg-white dark:hover:text-ink transition-colors duration-200 mb-8"
          >
            {t.detail.addToCart} — {t.detail.viewCart} →
          </button>

          {/* Réassurance */}
          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              { icon: "🚚", label: t.detail.delivery },
              { icon: "🔒", label: t.detail.secure },
              { icon: "🌷", label: t.detail.fresh },
            ].map((r, i) => (
              <div key={i} className="bg-graybg dark:bg-dark-surface rounded-sm p-3">
                <span className="text-lg block mb-1">{r.icon}</span>
                <span className="text-[10px] leading-snug text-ink-soft dark:text-gray-300">{r.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Produits liés */}
      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="font-display text-2xl text-ink dark:text-white mb-6">{t.detail.related}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {related.map((f) => (
              <ProductCard key={f.id} fleur={f} categorieNom={categorieNom} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
