import { fleurs as seedFleurs } from "../data/products";
import { createProduct, fetchProducts } from "./productApi";

export interface SeedResult {
  added: number;
  skipped: number;
}

export async function seedAllProducts(
  onProgress?: (current: number, total: number, productName: string) => void
): Promise<SeedResult> {
  const existingProducts = await fetchProducts();

  const existingNames = new Set(
    existingProducts.map((product) => product.nom.trim().toLowerCase())
  );

  let added = 0;
  let skipped = 0;

  for (let index = 0; index < seedFleurs.length; index++) {
    const fleur = seedFleurs[index];

    onProgress?.(index + 1, seedFleurs.length, fleur.nom);

    const name = fleur.nom.trim().toLowerCase();

    if (existingNames.has(name)) {
      skipped++;
      continue;
    }

    await createProduct(fleur);

    existingNames.add(name);
    added++;
  }

  return {
    added,
    skipped,
  };
}