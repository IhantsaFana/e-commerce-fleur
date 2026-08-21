import { API_BASE_URL } from "../config/env";

const TOKEN_KEY = "fq_token";

function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> | undefined),
  };
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  if (res.status === 204) return undefined as T;

  const body = await res.json().catch(() => null);
  if (!res.ok) {
    const detail =
      (typeof body?.detail === "string" ? body.detail : null) ||
      body?.detail?.[0]?.msg ||
      res.statusText;
    throw new Error(detail);
  }
  return body as T;
}

// ---- Types alignés sur les schémas Pydantic du backend ----
export interface Categorie {
  id: number;
  nom: string;
  description: string | null;
}

export interface Fleur {
  id: number;
  nom: string;
  description: string | null;
  prix: number;
  stock: number;
  image_url: string | null;
  disponible: boolean;
  categorie_id: number;
  date_creation?: string;
}

export interface LignePanier {
  id: number;
  quantite: number;
  prix_unitaire: number;
  sous_total: number;
  fleur_id: number;
}

export interface Panier {
  id: number;
  total: number;
  user_id: number;
  lignes: LignePanier[];
}

export interface Adresse {
  id: number;
  rue: string;
  ville: string;
  code_postal: string;
  pays: string;
  user_id: number;
}

export interface LigneCommande {
  id: number;
  quantite: number;
  prix_unitaire: number;
  sous_total: number;
  fleur_id: number;
}

export interface Commande {
  id: number;
  numero_commande: string;
  date_commande: string;
  total: number;
  statut: string;
  user_id: number;
  adresse_id: number;
  lignes: LigneCommande[];
}

export interface Paiement {
  id: number;
  montant: number;
  methode: string;
  statut: string;
  date_paiement: string;
  reference: string | null;
  commande_id: number;
}

export interface Livraison {
  id: number;
  statut: string;
  date_livraison_prevue: string | null;
  date_livraison_effective: string | null;
  adresse_livraison: string | null;
  commande_id: number;
}

// ---- Fleurs / Catégories ----
export const fetchCategories = () => request<Categorie[]>("/categories/");

export const fetchFleurs = async (): Promise<Fleur[]> => {
  const data = await request<any[]>("/fleurs/");
  return data.map((f) => ({ ...f, prix: Number(f.prix) }));
};

export const fetchFleur = async (id: number): Promise<Fleur> => {
  const data = await request<any>(`/fleurs/${id}`);
  return { ...data, prix: Number(data.prix) };
};

// ---- Panier ----
export const fetchPanier = async (): Promise<Panier> => {
  const data = await request<any>("/panier/");
  return {
    ...data,
    total: Number(data.total),
    lignes: (data.lignes || []).map((l: any) => ({
      ...l,
      prix_unitaire: Number(l.prix_unitaire),
      sous_total: Number(l.sous_total),
    })),
  };
};

export const addLignePanier = (fleur_id: number, quantite: number) =>
  request<any>("/panier/lignes", {
    method: "POST",
    body: JSON.stringify({ fleur_id, quantite }),
  });

export const updateLignePanier = (ligne_id: number, fleur_id: number, quantite: number) =>
  request<any>(`/panier/lignes/${ligne_id}`, {
    method: "PUT",
    body: JSON.stringify({ fleur_id, quantite }),
  });

export const deleteLignePanier = (ligne_id: number) =>
  request<any>(`/panier/lignes/${ligne_id}`, { method: "DELETE" });

// ---- Adresses ----
export const createAdresse = (data: { rue: string; ville: string; code_postal: string; pays: string }) =>
  request<Adresse>("/adresses/", { method: "POST", body: JSON.stringify(data) });

// ---- Commandes ----
export const createCommande = (adresse_id: number) =>
  request<Commande>("/commandes/", { method: "POST", body: JSON.stringify({ adresse_id }) });

export const fetchCommande = async (id: number): Promise<Commande> => {
  const data = await request<any>(`/commandes/${id}`);
  return {
    ...data,
    total: Number(data.total),
    lignes: (data.lignes || []).map((l: any) => ({
      ...l,
      prix_unitaire: Number(l.prix_unitaire),
      sous_total: Number(l.sous_total),
    })),
  };
};

// ---- Paiements ----
export const createPaiement = (data: { montant: number; methode: string; commande_id: number }) =>
  request<Paiement>("/paiements/", { method: "POST", body: JSON.stringify(data) });

// ---- Livraisons ----
export const createLivraison = (data: {
  commande_id: number;
  date_livraison_prevue?: string;
  adresse_livraison?: string;
}) => request<Livraison>("/livraisons/", { method: "POST", body: JSON.stringify(data) });
