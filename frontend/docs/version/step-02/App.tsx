import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import { AuthProvider } from "./context/AuthContext";
import Auth from "./pages/Auth";

const HERO_IMG =
  "https://images.pexels.com/photos/5894049/pexels-photo-5894049.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1600";

function PlaceholderHome() {
  return (
    <section
      className="relative h-[72vh] overflow-hidden"
      style={{ backgroundImage: `url(${HERO_IMG})`, backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/50 to-transparent dark:from-dark-bg/90 dark:via-dark-bg/50" />
      <div className="relative h-full flex flex-col justify-center px-6 max-w-[1200px] mx-auto">
        <h1 className="font-display text-4xl md:text-5xl text-ink dark:text-white max-w-md leading-tight">
          Célébrez les anniversaires d'été
        </h1>
        <p className="font-display text-2xl md:text-3xl font-bold text-ink dark:text-white mt-2">
          Envoyez des cadeaux partout dans le monde
        </p>
        <a
          href="#/auth"
          className="mt-6 inline-block w-fit bg-sage hover:bg-sage-dark text-white text-sm font-semibold tracking-wide px-8 py-3 rounded-sm transition-all duration-200"
        >
          Se connecter pour commander
        </a>
      </div>
    </section>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<PlaceholderHome />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </HashRouter>
      </AuthProvider>
    </LanguageProvider>
  );
}
