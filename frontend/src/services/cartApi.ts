import { API_BASE_URL } from "../config/env";

export interface BackendCartItem {
  id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface BackendCart {
  id: number | null;
  items: BackendCartItem[];
  total: number;
}

const getToken = () => localStorage.getItem("fq_token");

const headers = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

const handle = async <T>(response: Response): Promise<T> => {
  const body = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      (typeof body?.detail === "string" && body.detail) ||
      response.statusText ||
      "Une erreur est survenue";

    throw new Error(message);
  }

  return body as T;
};

export async function fetchCart(): Promise<BackendCart> {
  const response = await fetch(`${API_BASE_URL}/cart`, {
    headers: headers(),
  });

  return handle<BackendCart>(response);
}

export async function addCartItem(
  productId: number,
  quantity: number
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/cart/items`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      product_id: productId,
      quantity,
    }),
  });

  await handle(response);
}

export async function updateCartItem(
  itemId: number,
  quantity: number
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/cart/items/${itemId}`, {
    method: "PUT",
    headers: headers(),
    body: JSON.stringify({
      quantity,
    }),
  });

  await handle(response);
}

export async function deleteCartItem(itemId: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/cart/items/${itemId}`, {
    method: "DELETE",
    headers: headers(),
  });

  await handle(response);
}