import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import * as authApi from "../services/authApi";

export interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  role: string;
  dateCreation: string;
}

interface AuthContextValue {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (data: { nom: string; prenom: string; email: string; motDePasse: string; telephone: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const TOKEN_KEY = "fq_token";

// Le backend de l'ami renvoie "lastname"/"firstname" → on mappe vers nom/prenom
const mapUser = (u: authApi.UserResponse): User => ({
  id: u.id,
  nom: u.lastname,
  prenom: u.firstname,
  email: u.email,
  telephone: u.telephone || "",
  role: u.role,
  dateCreation: "",
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(!!localStorage.getItem(TOKEN_KEY));

  const refreshUser = useCallback(async (accessToken: string) => {
    try {
      const me = await authApi.fetchCurrentUser(accessToken);
      setUser(mapUser(me));
    } catch {
      localStorage.removeItem(TOKEN_KEY);
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
      refreshUser(token);
    } else {
      setLoading(false);
      setUser(null);
    }
  }, [token, refreshUser]);

  const login = async (email: string, password: string): Promise<User> => {
    const { access_token } = await authApi.login(email, password);
    localStorage.setItem(TOKEN_KEY, access_token);
    setToken(access_token);
    const me = await authApi.fetchCurrentUser(access_token);
    const mapped = mapUser(me);
    setUser(mapped);
    return mapped;
  };

  const register = async (data: {
    nom: string;
    prenom: string;
    email: string;
    motDePasse: string;
    telephone: string;
  }) => {
    // Envoie les champs attendus par le backend de l'ami
    await authApi.register({
      lastname: data.nom,
      firstname: data.prenom,
      email: data.email,
      password: data.motDePasse,
      telephone: data.telephone,
    });
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}