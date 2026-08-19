import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import PhotoSlot from "../components/PhotoSlot";

export default function Home() {
  const { t } = useLanguage();
  const { user } = useAuth();

  return (
    <div className="animate-fade-up">
      {/* HERO */}
      <section className="relative h-[520px] overflow-hidden">
        <PhotoSlot src="/images/hero-birthday.jpg" label="hero-birthday.jpg — 1600x520" className="absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/40 to-transparent dark:from-dark-bg/90 dark:via-dark-bg/40" />
        <div className="relative max-w-[1400px] mx-auto h-full flex flex-col justify-center px-6">
          <h1 className="font-display text-4xl md:text-5xl text-ink dark:text-white max-w-md leading-tight">
            {t.hero.title}
          </h1>
          <p className="font-display text-2xl md:text-3xl font-bold text-ink dark:text-white mt-2">
            {t.hero.subtitle}
          </p>
          <Link
            to={user ? "/products" : "/auth"}
            className="mt-6 inline-block w-fit bg-sage hover:bg-sage-dark text-white text-sm font-semibold tracking-wide px-8 py-3 rounded-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
          >
            {t.hero.cta}
          </Link>
        </div>
      </section>

      {/* WE KNOW ROSES */}
      <section className="bg-mint dark:bg-dark-surface transition-colors duration-300">
        <div className="max-w-[1400px] mx-auto grid md:grid-cols-2 items-center">
          <div className="px-6 py-16 md:px-16">
            <h2 className="font-display text-3xl md:text-4xl text-ink dark:text-white mb-4">{t.roses.title}</h2>
            <p className="text-ink-soft dark:text-gray-300 max-w-sm mb-6">{t.roses.text}</p>
            <Link
              to="/products"
              className="inline-block border border-ink dark:border-white text-ink dark:text-white text-sm font-semibold px-6 py-3 rounded-sm hover:bg-ink hover:text-white dark:hover:bg-white dark:hover:text-ink transition-colors duration-200"
            >
              {t.roses.cta}
            </Link>
          </div>
          <div className="relative h-[340px] md:h-[420px]">
            <PhotoSlot src="/images/roses-buckets.jpg" label="roses-buckets.jpg — 700x420" className="absolute inset-0" />
            <div className="absolute bottom-6 left-6 w-24 h-24 rounded-full bg-white dark:bg-dark-bg border border-ink dark:border-white flex items-center justify-center text-center text-[8px] font-semibold text-ink dark:text-white uppercase leading-tight p-2 shadow-md">
              {t.roses.badge}
            </div>
          </div>
        </div>
      </section>

      {/* DEALS */}
      <section className="max-w-[1400px] mx-auto px-6 py-16">
        <h2 className="font-display text-2xl md:text-3xl text-ink dark:text-white mb-8">{t.deals.title}</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: t.deals.d1label, value: t.deals.d1value, img: "deal-1.jpg" },
            { label: t.deals.d2label, value: t.deals.d2value, badge: t.deals.d2badge, img: "deal-2.jpg" },
            { label: t.deals.d3label, value: t.deals.d3value, img: "deal-3.jpg" },
            { label: t.deals.d4label, value: t.deals.d4value, badge: t.deals.d4badge, img: "deal-4.jpg" },
          ].map((deal, i) => (
            <Link
              to="/products"
              key={i}
              className="group block bg-graybg dark:bg-dark-surface rounded-sm overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="px-4 pt-4 text-center">
                <p className="text-[10px] font-bold tracking-widest text-ink dark:text-gray-300 mb-1">{deal.label}</p>
                <p className="font-display text-xl text-ink dark:text-white">{deal.value}</p>
              </div>
              <div className="relative h-40 mt-4">
                <PhotoSlot src={`/images/${deal.img}`} label={deal.img} className="absolute inset-0" />
                {deal.badge && (
                  <span className="absolute bottom-3 right-3 bg-mint text-ink text-[10px] font-semibold rounded-full w-16 h-16 flex items-center justify-center text-center leading-tight shadow">
                    {deal.badge}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* SPLIT BANNER */}
      <section className="grid md:grid-cols-2">
        <Link to="/products" className="relative h-[300px] group overflow-hidden">
          <PhotoSlot src="/images/berries.jpg" label="berries.jpg — 700x300" className="absolute inset-0 transition-transform duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 flex flex-col justify-center px-10">
            <h3 className="font-display text-2xl text-ink dark:text-white max-w-[220px]">{t.split.berriesTitle}</h3>
            <span className="mt-4 inline-block w-fit bg-white dark:bg-dark-bg text-ink dark:text-white text-xs font-semibold px-5 py-2.5 rounded-sm group-hover:bg-ink group-hover:text-white transition-colors duration-200">
              {t.split.berriesCta}
            </span>
          </div>
        </Link>
        <Link to="/products" className="relative h-[300px] group overflow-hidden">
          <PhotoSlot src="/images/hgtv-plants.jpg" label="hgtv-plants.jpg — 700x300" className="absolute inset-0 transition-transform duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 flex flex-col justify-center px-10">
            <h3 className="font-display text-2xl text-ink dark:text-white max-w-[220px]">{t.split.hgtvTitle}</h3>
            <span className="mt-4 inline-block w-fit bg-ink dark:bg-white text-white dark:text-ink text-xs font-semibold px-5 py-2.5 rounded-sm group-hover:bg-coral group-hover:text-white transition-colors duration-200">
              {t.split.hgtvCta}
            </span>
          </div>
        </Link>
      </section>

      {/* INSTAGRAM */}
      <section className="max-w-[1400px] mx-auto px-6 py-16 text-center">
        <h2 className="font-display italic text-xl text-ink dark:text-white mb-8 flex items-center justify-center gap-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <rect x="3" y="3" width="18" height="18" rx="4" />
            <circle cx="12" cy="12" r="4" />
          </svg>
          {t.instagram.title}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="relative h-56 overflow-hidden group">
              <PhotoSlot src={`/images/instagram-${n}.jpg`} label={`instagram-${n}.jpg`} className="absolute inset-0 transition-transform duration-500 group-hover:scale-110" />
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-graybg dark:bg-dark-surface py-16 transition-colors duration-300">
        <div className="max-w-[1400px] mx-auto px-6">
          <h2 className="font-display text-2xl md:text-3xl text-center text-ink dark:text-white mb-10">
            {t.testimonials.title}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-line dark:divide-dark-line">
            {[t.testimonials.t1, t.testimonials.t2, t.testimonials.t3, t.testimonials.t4].map((rev, i) => (
              <div key={i} className="px-6 py-6 text-center flex flex-col items-center">
                <div className="w-16 h-16 rounded-full overflow-hidden mb-3">
                  <PhotoSlot src={`/images/review-${i + 1}.jpg`} label="" className="w-full h-full" />
                </div>
                <p className="text-gold text-sm tracking-tighter mb-2">★★★★★</p>
                <p className="font-semibold text-ink dark:text-white mb-1">{rev.title}</p>
                <p className="text-sm text-ink-soft dark:text-gray-300 mb-2">"{rev.text}"</p>
                <p className="text-xs text-ink-soft dark:text-gray-400">— {rev.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
