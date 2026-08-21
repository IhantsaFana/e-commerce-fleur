import { memo, useState } from "react";
import { Link } from "react-router-dom";
import { Fleur, formatAr } from "../data/products";
import { useLanguage } from "../context/LanguageContext";
import { useCart } from "../context/CartContext";
import PhotoSlot from "@/components/PhotoSlot";

function ProductCard({ fleur, categorieNom }: { fleur: Fleur; categorieNom: string }) {
  const { t } = useLanguage();
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(fleur, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <div className="group [perspective:1400px] h-[440px]">
      <div className="relative w-full h-full transition-transform duration-700 ease-in-out [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
        {/* ===== FACE AVANT ===== */}
        <div className="absolute inset-0 [backface-visibility:hidden] bg-white dark:bg-dark-surface rounded-sm overflow-hidden border border-line dark:border-dark-line flex flex-col shadow-sm group-hover:shadow-2xl transition-shadow duration-500">
          <div className="relative h-64 overflow-hidden">
            <PhotoSlot
              src={fleur.imageUrl}
              alt={fleur.nom}
              className="absolute inset-0 transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            {fleur.freeGift && (
              <span className="absolute top-3 left-3 bg-gold text-white text-[10px] font-bold px-2 py-1 rounded-sm shadow">
                {t.products.freeGift}
              </span>
            )}
            {fleur.isNew && (
              <span className="absolute top-3 right-3 bg-coral text-white text-[10px] font-bold px-2 py-1 rounded-sm shadow">
                {t.products.new}
              </span>
            )}
            {!fleur.disponible && (
              <span className="absolute bottom-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-sm shadow">
                Rupture
              </span>
            )}
          </div>
          <div className="p-4 flex flex-col flex-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-coral mb-1">
              {categorieNom}
            </p>
            <h3 className="font-semibold text-ink dark:text-white leading-snug line-clamp-2">
              {fleur.nom}
            </h3>
            {fleur.rating && (
              <div className="flex items-center gap-1 mt-2">
                <span className="text-gold text-xs tracking-tighter">
                  {"★".repeat(fleur.rating)}
                  {"☆".repeat(5 - fleur.rating)}
                </span>
                <span className="text-[10px] text-ink-soft dark:text-gray-400">
                  ({fleur.reviews})
                </span>
              </div>
            )}
            <div className="mt-auto pt-3 flex items-end justify-between">
              <div>
                <span className="font-bold text-ink dark:text-white text-lg">
                  {formatAr(fleur.prix)}
                </span>
                {fleur.oldPrice && (
                  <span className="block text-xs font-normal text-ink-soft dark:text-gray-500 line-through">
                    {formatAr(fleur.oldPrice)}
                  </span>
                )}
              </div>
              <span className="text-[10px] text-ink-soft dark:text-gray-400 group-hover:text-coral transition-colors">
                ⟳ {t.products.details}
              </span>
            </div>
          </div>
        </div>

        {/* ===== FACE ARRIÈRE (détails au survol) ===== */}
        <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-sm overflow-hidden bg-ink dark:bg-dark-surface text-white flex flex-col p-6 border border-ink dark:border-dark-line">
          <span className="text-[10px] font-bold uppercase tracking-widest text-coral mb-2">
            {categorieNom}
          </span>
          <h3 className="font-display text-lg leading-snug mb-3">{fleur.nom}</h3>
          <p className="text-xs text-gray-300 leading-relaxed flex-1 overflow-hidden">
            {fleur.description}
          </p>
          <div className="mb-4">
            <span className="text-2xl font-bold text-white">{formatAr(fleur.prix)}</span>
            {fleur.oldPrice && (
              <span className="ml-2 text-sm text-gray-400 line-through">{formatAr(fleur.oldPrice)}</span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <button
              onClick={handleAdd}
              disabled={!fleur.disponible}
              className={`w-full text-sm font-semibold px-4 py-2.5 rounded-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${
                justAdded ? "bg-sage text-white" : "bg-coral hover:bg-coral-dark text-white"
              }`}
            >
              {justAdded ? "✓ " + t.products.addedToCart : "🛒 " + t.products.addToCart}
            </button>
            <Link
              to={`/product/${fleur.id}`}
              className="w-full text-center text-xs font-semibold border border-white/30 text-white px-4 py-2 rounded-sm hover:bg-white hover:text-ink transition-colors duration-200"
            >
              {t.products.details} →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(ProductCard);
