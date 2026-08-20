import { useState, useEffect, useMemo, useCallback } from "react";
import { useLanguage } from "../context/LanguageContext";
import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";

const SLIDE_IMAGES = [
  "https://images.pexels.com/photos/5894049/pexels-photo-5894049.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1600",
  "https://images.pexels.com/photos/931177/pexels-photo-931177.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1600",
  "https://images.pexels.com/photos/140831/pexels-photo-140831.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1600",
  "https://images.pexels.com/photos/1488315/pexels-photo-1488315.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1600",
];

const AUTOPLAY_MS = 5000;

export default function Home() {
  const { t } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [current, setCurrent] = useState(0);

  // Les diapositives viennent des traductions (t.hero.slides)
  const slides = t.hero.slides;

  const goTo = useCallback(
    (i: number) => setCurrent((i + slides.length) % slides.length),
    [slides.length]
  );
  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  // Défilement automatique (relancé à chaque changement, manuel ou auto)
  useEffect(() => {
    const id = setTimeout(() => {
      setCurrent((c) => (c + 1) % slides.length);
    }, AUTOPLAY_MS);
    return () => clearTimeout(id);
  }, [current, slides.length]);

  const filtered = useMemo(() => {
    if (!activeFilter) return products;
    return products.filter((p) => p.tag === activeFilter);
  }, [activeFilter]);

  return (
    <div className="animate-fade-up">
      {/* HERO — CARROUSEL */}
      <section className="relative h-[520px] overflow-hidden">
        {/* Images en fondu enchaîné */}
        {slides.map((_, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              i === current ? "opacity-100" : "opacity-0"
            }`}
            style={{
              backgroundImage: `url(${SLIDE_IMAGES[i]})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        ))}

        {/* Voile dégradé */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/40 to-transparent dark:from-dark-bg/90 dark:via-dark-bg/40" />

        {/* Contenu (réanimé à chaque slide) */}
        <div className="relative max-w-[1400px] mx-auto h-full flex flex-col justify-center px-16 md:px-24">
          <div key={current} className="animate-fade-up">
            <h1 className="font-display text-4xl md:text-5xl text-ink dark:text-white max-w-md leading-tight">
              {slides[current].title}
            </h1>
            <p className="font-display text-2xl md:text-3xl font-bold text-ink dark:text-white mt-2">
              {slides[current].text}
            </p>
            <a
              href="#products"
              className="mt-6 inline-block w-fit bg-sage hover:bg-sage-dark text-white text-sm font-semibold tracking-wide px-8 py-3 rounded-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
            >
              {t.hero.cta}
            </a>
          </div>
        </div>

        {/* Flèche gauche */}
        <button
          onClick={prev}
          aria-label="Précédent"
          className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center bg-white/70 dark:bg-dark-surface/70 text-ink dark:text-white backdrop-blur border border-line dark:border-dark-line hover:bg-coral hover:text-white hover:border-coral transition-all duration-200"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Flèche droite */}
        <button
          onClick={next}
          aria-label="Suivant"
          className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center bg-white/70 dark:bg-dark-surface/70 text-ink dark:text-white backdrop-blur border border-line dark:border-dark-line hover:bg-coral hover:text-white hover:border-coral transition-all duration-200"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Points de navigation */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Slide ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === current ? "w-8 bg-coral" : "w-2 bg-white/60 dark:bg-gray-400 hover:bg-coral"
              }`}
            />
          ))}
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
