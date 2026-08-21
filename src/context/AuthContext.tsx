import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
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

interface RegisterData {
  nom: string;
  prenom: string;
  email: string;
  motDePasse: string;
  telephone: string;
}

interface AuthContextValue {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const TOKEN_KEY = "fq_token";

// Le backend renvoie lastname / firstname.
// On les transforme en nom / prenom côté application.
const mapUser = (u: authApi.UserResponse): User => ({
  id: u.id,
  nom: u.lastname,
  prenom: u.firstname,
  email: u.email,
  telephone: u.telephone || "",
  role: u.role,
  dateCreation: "",
});

/*
  Transforme une erreur backend en message affichable dans le front.

  Le backend peut par exemple renvoyer :
  - "Nom deja utiliser"
  - "lastname already exists"
  - "firstname already exists"
  - "nom et prenom deja utiliser"
  - "NOM_DEJA_UTILISE"
  - "PRENOM_DEJA_UTILISE"
  - "NOM_PRENOM_DEJA_UTILISE"
*/
const getRegisterErrorMessage = (error: unknown): string => {
  const err = error as {
    message?: string;
    response?: {
      data?: {
        message?: string;
        error?: string;
        detail?: string;
        code?: string;
      } | string;
    };
  };

  const responseData = err?.response?.data;

  const backendMessage =
    typeof responseData === "string"
      ? responseData
      : responseData?.message ||
        responseData?.error ||
        responseData?.detail ||
        responseData?.code ||
        err?.message ||
        "";

  const message = String(backendMessage).toLowerCase();

  const hasNom =
    message.includes("nom") ||
    message.includes("lastname") ||
    message.includes("last_name");

  const hasPrenom =
    message.includes("prenom") ||
    message.includes("prénom") ||
    message.includes("firstname") ||
    message.includes("first_name");

  const isBothDuplicate =
    message.includes("nom_prenom") ||
    message.includes("nom-prenom") ||
    message.includes("lastname_firstname") ||
    message.includes("lastname-firstname") ||
    message.includes("nom et prenom") ||
    message.includes("nom et prénom") ||
    message.includes("lastname and firstname") ||
    (hasNom && hasPrenom);

  if (isBothDuplicate) {
    return "Nom et Prenom deja utiliser";
  }

  if (hasNom) {
    return "Nom deja utiliser";
  }

  if (hasPrenom) {
    return "Prenom deja utiliser";
  }

  return backendMessage || "Une erreur est survenue lors de l'inscription";
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(TOKEN_KEY)
  );

  const [user, setUser] = useState<User | null>(null);

  const [loading, setLoading] = useState<boolean>(() =>
    Boolean(localStorage.getItem(TOKEN_KEY))
  );

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
    const mappedUser = mapUser(me);

    setUser(mappedUser);

    return mappedUser;
  };

  const register = async (data: RegisterData): Promise<void> => {
    try {
      await authApi.register({
        lastname: data.nom,
        firstname: data.prenom,
        email: data.email,
        password: data.motDePasse,
        telephone: data.telephone,
      });
    } catch (error) {
      throw new Error(getRegisterErrorMessage(error));
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return ctx;
}