import { API_BASE_URL } from "../config/env";
import { Fleur } from "../data/products";

interface BackendProduct {
  id: number;
  name: string;
  description: string | null;
  price: number | string;
  stock: number;
  image: string | null;
  is_active: boolean;
  created_at: string;
}

const getToken = (): string | null => {
  return localStorage.getItem("fq_token");
};

const notifyProductsUpdated = () => {
  // Met à jour Home si la page Home est ouverte dans le même onglet.
  window.dispatchEvent(new Event("products-updated"));

  // Met à jour Home si elle est ouverte dans un autre onglet.
  localStorage.setItem(
    "fq_products_updated_at",
    Date.now().toString()
  );
};

const mapProduct = (product: BackendProduct): Fleur => ({
  id: product.id,
  nom: product.name,
  description: product.description || "",
  prix: Number(product.price),
  stock: product.stock,
  imageUrl: product.image || "",
  disponible: product.is_active && product.stock > 0,
  categorieId: 1,
  dateCreation: product.created_at,
});

const handle = async <T>(response: Response): Promise<T> => {
  const body = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      (typeof body?.detail === "string" && body.detail) ||
      (typeof body?.message === "string" && body.message) ||
      response.statusText ||
      "Une erreur est survenue";

    throw new Error(message);
  }

  return body as T;
};

export async function fetchProducts(): Promise<Fleur[]> {
  const response = await fetch(`${API_BASE_URL}/products`);

  const products = await handle<BackendProduct[]>(response);

  return products.map(mapProduct);
}

export async function fetchProduct(id: number): Promise<Fleur> {
  const response = await fetch(`${API_BASE_URL}/products/${id}`);

  const product = await handle<BackendProduct>(response);

  return mapProduct(product);
}

export async function createProduct(data: Fleur): Promise<Fleur> {
  const token = getToken();

  const response = await fetch(`${API_BASE_URL}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: data.nom,
      description: data.description || null,
      price: data.prix,
      stock: data.stock,
      image: data.imageUrl || null,
    }),
  });

  const product = await handle<BackendProduct>(response);

  notifyProductsUpdated();

  return mapProduct(product);
}

export async function updateProduct(data: Fleur): Promise<Fleur> {
  const token = getToken();

  const response = await fetch(`${API_BASE_URL}/products/${data.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: data.nom,
      description: data.description || null,
      price: data.prix,
      stock: data.stock,
      image: data.imageUrl || null,
      is_active: data.disponible,
    }),
  });

  const product = await handle<BackendProduct>(response);

  notifyProductsUpdated();

  return mapProduct(product);
}

export async function removeProduct(id: number): Promise<void> {
  const token = getToken();

  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  await handle(response);

  notifyProductsUpdated();
}