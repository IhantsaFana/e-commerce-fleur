import { useState, useMemo } from "react";
import { useLanguage } from "../context/LanguageContext";
import { products } from "../data/products";
import ProductCard from "../components/ProductCard";

const HERO_IMG =
  "https://images.pexels.com/photos/5894049/pexels-photo-5894049.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200";

export default function Home() {
  const { t } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!activeFilter) return products;
    return products.filter((p) => p.tag === activeFilter);
  }, [activeFilter]);

  return (
    <div className="animate-fade-up">
      {/* HERO */}
      <section
        className="relative h-[520px] overflow-hidden"
        style={{
          backgroundImage: `url(${HERO_IMG})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/40 to-transparent dark:from-dark-bg/90 dark:via-dark-bg/40" />
        <div className="relative max-w-[1400px] mx-auto h-full flex flex-col justify-center px-6">
          <h1 className="font-display text-4xl md:text-5xl text-ink dark:text-white max-w-md leading-tight">
            {t.hero.title1}
          </h1>
          <p className="font-display text-2xl md:text-3xl font-bold text-ink dark:text-white mt-2">
            {t.hero.title2}
          </p>
          <a
            href="#products"
            className="mt-6 inline-block w-fit bg-sage hover:bg-sage-dark text-white text-sm font-semibold tracking-wide px-8 py-3 rounded-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
          >
            {t.hero.cta}
          </a>
        </div>
      </section>

      {/* ALL PRODUCTS */}
      <section id="products" className="max-w-[1400px] mx-auto px-6 py-14">
        <div className="text-center mb-8">
          <h2 className="font-display text-3xl text-ink dark:text-white mb-2">{t.home.productsTitle}</h2>
          <p className="text-sm text-ink-soft dark:text-gray-400">{t.home.productsSubtitle}</p>
        </div>

        {/* Filter pills */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 -mx-1 px-1 justify-start md:justify-center">
          <button
            onClick={() => setActiveFilter(null)}
            className={`whitespace-nowrap text-xs font-semibold px-4 py-2 rounded-full border transition-colors duration-200 ${
              activeFilter === null
                ? "border-coral text-coral"
                : "border-line dark:border-dark-line text-ink-soft dark:text-gray-300 hover:border-coral hover:text-coral"
            }`}
          >
            {t.home.all}
          </button>
          {t.products.filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`whitespace-nowrap text-xs font-semibold px-4 py-2 rounded-full border transition-colors duration-200 ${
                activeFilter === f
                  ? "border-coral text-coral"
                  : "border-line dark:border-dark-line text-ink-soft dark:text-gray-300 hover:border-coral hover:text-coral"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Product grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* How it works */}
        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: "🛒", label: "1. Choisissez & ajoutez au panier" },
            { icon: "👤", label: "2. Connectez-vous pour confirmer" },
            { icon: "💳", label: "3. Payez en toute sécurité" },
            { icon: "🧾", label: "4. Recevez votre facture" },
          ].map((s, i) => (
            <div
              key={i}
              className="bg-graybg dark:bg-dark-surface rounded-sm p-5 text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
            >
              <span className="text-2xl block mb-2">{s.icon}</span>
              <span className="text-xs font-semibold text-ink dark:text-gray-200">{s.label}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
