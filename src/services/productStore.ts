import {
  Fleur,
  Categorie,
  fleurs as seedFleurs,
  categories as seedCategories,
} from "../data/products";

const FLEURS_KEY = "fq_fleurs";
const CATS_KEY = "fq_categories";

function read<T>(key: string, seed: T[]): T[] {
  try {
    const saved = localStorage.getItem(key);
    if (!saved) {
      localStorage.setItem(key, JSON.stringify(seed));
      return [...seed];
    }
    return JSON.parse(saved) as T[];
  } catch {
    return [...seed];
  }
}

function write<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

export function getFleurs(): Fleur[] {
  return read(FLEURS_KEY, seedFleurs);
}

export function getCategories(): Categorie[] {
  return read(CATS_KEY, seedCategories);
}

export function getFleur(id: number): Fleur | undefined {
  return getFleurs().find((f) => f.id === id);
}

export function getCategorie(id: number): Categorie | undefined {
  return getCategories().find((c) => c.id === id);
}

// Crée ou met à jour une fleur (selon qu'un id existe déjà)
export function saveFleur(fleur: Fleur): Fleur {
  const fleurs = getFleurs();
  const idx = fleurs.findIndex((f) => f.id === fleur.id);
  if (idx >= 0) {
    fleurs[idx] = fleur;
  } else {
    fleurs.push(fleur);
  }
  write(FLEURS_KEY, fleurs);
  return fleur;
}

export function deleteFleur(id: number): void {
  write(
    FLEURS_KEY,
    getFleurs().filter((f) => f.id !== id)
  );
}

export function nextFleurId(): number {
  const fleurs = getFleurs();
  return fleurs.length ? Math.max(...fleurs.map((f) => f.id)) + 1 : 1;
}

// Catégories
export function saveCategorie(categorie: Categorie): Categorie {
  const cats = getCategories();
  const idx = cats.findIndex((c) => c.id === categorie.id);
  if (idx >= 0) cats[idx] = categorie;
  else cats.push(categorie);
  write(CATS_KEY, cats);
  return categorie;
}

export function deleteCategorie(id: number): void {
  write(
    CATS_KEY,
    getCategories().filter((c) => c.id !== id)
  );
}

export function nextCategorieId(): number {
  const cats = getCategories();
  return cats.length ? Math.max(...cats.map((c) => c.id)) + 1 : 1;
}

// Réinitialise aux données d'origine
export function resetAll(): void {
  write(FLEURS_KEY, seedFleurs);
  write(CATS_KEY, seedCategories);
}
