import { useState, useRef, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { Lang } from "../data/translations";

const LANGS: { code: Lang; label: string }[] = [
  { code: "fr", label: "Français" },
  { code: "en", label: "English" },
  { code: "mg", label: "Malagasy" },
];

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 text-xs font-semibold tracking-wide uppercase text-ink dark:text-gray-200 hover:text-coral transition-colors duration-200"
      >
        {lang}
        <svg width="10" height="10" viewBox="0 0 10 10" className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
          <path d="M1 3l4 4 4-4" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-dark-surface border border-line dark:border-dark-line rounded-md shadow-lg overflow-hidden z-50 animate-fade-up">
          {LANGS.map((l) => (
            <button
              key={l.code}
              onClick={() => {
                setLang(l.code);
                setOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-graybg dark:hover:bg-dark-line transition-colors duration-150 ${
                lang === l.code ? "text-coral font-semibold" : "text-ink dark:text-gray-200"
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
