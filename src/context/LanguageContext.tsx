import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { translations, Translation, Lang } from "../data/translations";

const LanguageContext = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: Translation } | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    const saved = localStorage.getItem("fq_lang");
    return saved === "en" || saved === "mg" || saved === "fr" ? saved : "fr";
  });

  useEffect(() => {
    localStorage.setItem("fq_lang", lang);
    document.documentElement.setAttribute("lang", lang);
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
