import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface User {
  id?: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  role: string;
  dateCreation: string;
}

interface AuthContextValue {
  user: User | null;
  login: (email: string, password: string) => boolean;
  register: (data: { nom: string; prenom: string; email: string; motDePasse: string; telephone: string }) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("fq_user");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) localStorage.setItem("fq_user", JSON.stringify(user));
    else localStorage.removeItem("fq_user");
  }, [user]);

  const login = (email: string, password: string) => {
    // En production, cela vérifierait avec le backend
    setUser({ email, nom: "", prenom: "", telephone: "", role: "client", dateCreation: new Date().toISOString() });
    void password;
    return true;
  };

  const register = ({ nom, prenom, email, telephone }: { nom: string; prenom: string; email: string; motDePasse: string; telephone: string }) => {
    setUser({ id: Date.now(), nom, prenom, email, telephone, role: "client", dateCreation: new Date().toISOString() });
    return true;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
