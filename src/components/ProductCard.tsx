import { Link } from "react-router-dom";
import { useState } from "react";
import { Product, getLocalized } from "../data/products";
import { useLanguage } from "../context/LanguageContext";
import { useCart } from "../context/CartContext";
import PhotoSlot from "@/components/PhotoSlot";

export default function ProductCard({ product }: { product: Product }) {
  const { t, lang } = useLanguage();
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const handleAdd = () => {
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
    <div className="group bg-white dark:bg-dark-surface rounded-sm overflow-hidden border border-line dark:border-dark-line transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col">
      <Link to={`/product/${product.id}`} className="relative h-60 block overflow-hidden">
        <PhotoSlot
          src={product.image}
          alt={getLocalized(product.name, lang)}
          className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
        />
        {product.freeGift && (
          <span className="absolute top-3 left-3 bg-gold text-white text-[10px] font-bold px-2 py-1 rounded-sm">
            {t.products.freeGift}
          </span>
        )}
        {product.isNew && (
          <span className="absolute top-3 right-3 bg-coral text-white text-[10px] font-bold px-2 py-1 rounded-sm">
            {t.products.new}
          </span>
        )}
      </Link>
      <div className="p-4 flex flex-col flex-1">
        <Link to={`/product/${product.id}`} className="font-semibold text-ink dark:text-white hover:text-coral transition-colors duration-200">
          {getLocalized(product.name, lang)}
        </Link>
        <p className="text-xs text-coral mt-0.5">{getLocalized(product.category, lang)}</p>
        <div className="flex items-center gap-1 mt-2">
          <span className="text-gold text-xs tracking-tighter">{"★".repeat(product.rating)}{"☆".repeat(5 - product.rating)}</span>
          <span className="text-[10px] text-ink-soft dark:text-gray-400">
            ({product.reviews} {t.products.reviews})
          </span>
        </div>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-line dark:border-dark-line mt-auto">
          <span className="font-bold text-ink dark:text-white">
            €{product.price.toFixed(2)}
            {product.oldPrice && (
              <span className="ml-2 text-xs font-normal text-ink-soft dark:text-gray-500 line-through">
                €{product.oldPrice.toFixed(2)}
              </span>
            )}
          </span>
          <div className="flex items-center gap-2">
            <Link
              to={`/product/${product.id}`}
              className="text-[10px] font-semibold text-ink-soft dark:text-gray-300 hover:text-coral transition-colors duration-200"
            >
              {t.products.details}
            </Link>
            <button
              onClick={handleAdd}
              className={`text-xs font-semibold rounded-sm px-3 py-1.5 transition-all duration-200 ${
                justAdded
                  ? "bg-sage text-white"
                  : "bg-ink text-white dark:bg-white dark:text-ink hover:bg-coral hover:text-white dark:hover:bg-coral dark:hover:text-white"
              }`}
            >
              {justAdded ? "✓" : "+"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
