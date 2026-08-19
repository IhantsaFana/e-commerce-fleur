import { useLanguage } from "../context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="bg-ink dark:bg-dark-surface text-gray-300 mt-16 transition-colors duration-300">
      <div className="max-w-[1400px] mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-center md:text-left">
          <div className="font-display text-xl text-white">
            Flora<span className="text-coral">Queen</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">{t.footer.tagline}</p>
        </div>
        <div className="flex flex-wrap gap-6 text-xs uppercase tracking-wide">
          <a href="#" className="hover:text-coral transition-colors duration-200">{t.footer.about}</a>
          <a href="#" className="hover:text-coral transition-colors duration-200">{t.footer.contact}</a>
          <a href="#" className="hover:text-coral transition-colors duration-200">{t.footer.terms}</a>
          <a href="#" className="hover:text-coral transition-colors duration-200">{t.footer.privacy}</a>
        </div>
        <p className="text-xs text-gray-500">© {new Date().getFullYear()} FloraQueen. {t.footer.rights}</p>
      </div>
    </footer>
  );
}
