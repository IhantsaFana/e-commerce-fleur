import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("fq_user");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) localStorage.setItem("fq_user", JSON.stringify(user));
    else localStorage.removeItem("fq_user");
  }, [user]);

  const login = ({ email, motDePasse }) => {
    setUser({ 
      email, 
      motDePasse,
      nom: "",
      prenom: "",
      telephone: "",
      role: "client",
      dateCreation: new Date().toISOString()
    });
    return true;
  };

  const register = ({ nom, prenom, email, motDePasse, telephone }) => {
    
    setUser({ 
      id: Date.now(), 
      nom,
      prenom,
      email,
      motDePasse,
      telephone,
      role: "client",
      dateCreation: new Date().toISOString()
    });
    return true;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}