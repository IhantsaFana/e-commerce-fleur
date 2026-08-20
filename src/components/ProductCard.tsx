import { memo, useState } from "react";
import { Link } from "react-router-dom";
import { Product, getLocalized, formatAr } from "../data/products";
import { useLanguage } from "../context/LanguageContext";
import { useCart } from "../context/CartContext";
import PhotoSlot from "@/components/PhotoSlot";

function ProductCard({ product }: { product: Product }) {
  const { t, lang } = useLanguage();
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      name: getLocalized(product.name, lang),
      price: product.price,
      image: product.image,
      category: getLocalized(product.category, lang),
    });
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
              src={product.image}
              alt={getLocalized(product.name, lang)}
              className="absolute inset-0 transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            {product.freeGift && (
              <span className="absolute top-3 left-3 bg-gold text-white text-[10px] font-bold px-2 py-1 rounded-sm shadow">
                {t.products.freeGift}
              </span>
            )}
            {product.isNew && (
              <span className="absolute top-3 right-3 bg-coral text-white text-[10px] font-bold px-2 py-1 rounded-sm shadow">
                {t.products.new}
              </span>
            )}
          </div>
          <div className="p-4 flex flex-col flex-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-coral mb-1">
              {getLocalized(product.category, lang)}
            </p>
            <h3 className="font-semibold text-ink dark:text-white leading-snug line-clamp-2">
              {getLocalized(product.name, lang)}
            </h3>
            <div className="flex items-center gap-1 mt-2">
              <span className="text-gold text-xs tracking-tighter">
                {"★".repeat(product.rating)}
                {"☆".repeat(5 - product.rating)}
              </span>
              <span className="text-[10px] text-ink-soft dark:text-gray-400">
                ({product.reviews})
              </span>
            </div>
            <div className="mt-auto pt-3 flex items-end justify-between">
              <div>
                <span className="font-bold text-ink dark:text-white text-lg">
                  {formatAr(product.price)}
                </span>
                {product.oldPrice && (
                  <span className="block text-xs font-normal text-ink-soft dark:text-gray-500 line-through">
                    {formatAr(product.oldPrice)}
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
            {getLocalized(product.category, lang)}
          </span>
          <h3 className="font-display text-lg leading-snug mb-3">
            {getLocalized(product.name, lang)}
          </h3>
          <p className="text-xs text-gray-300 leading-relaxed flex-1 overflow-hidden">
            {getLocalized(product.description, lang)}
          </p>
          <div className="mb-4">
            <span className="text-2xl font-bold text-white">{formatAr(product.price)}</span>
            {product.oldPrice && (
              <span className="ml-2 text-sm text-gray-400 line-through">{formatAr(product.oldPrice)}</span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <button
              onClick={handleAdd}
              className={`w-full text-sm font-semibold px-4 py-2.5 rounded-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${
                justAdded
                  ? "bg-sage text-white"
                  : "bg-coral hover:bg-coral-dark text-white"
              }`}
            >
              {justAdded ? "✓ " + t.products.addedToCart : "🛒 " + t.products.addToCart}
            </button>
            <Link
              to={`/product/${product.id}`}
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
