import { API_BASE_URL } from "../config/env";

const TOKEN_KEY = "fq_token";

const getHeaders = () => {
  const token = localStorage.getItem(TOKEN_KEY);

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

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

export interface OrderAddressData {
  delivery_address: string;
  city: string;
  postal_code: string;
  country: string;
  delivery_date?: string | null;
  note?: string | null;
}

export interface BackendOrderItem {
  id: number;
  product_id: number;
  quantity: number;
  unit_price: number | string;
  subtotal: number | string;
}

export interface BackendOrder {
  id: number;
  status: string;
  total: number | string;

  delivery_address?: string | null;
  city?: string | null;
  postal_code?: string | null;
  country?: string | null;
  delivery_date?: string | null;
  note?: string | null;

  created_at: string;
  items?: BackendOrderItem[];
}

export interface BackendPayment {
  id: number;
  order_id: number;
  amount: number | string;
  payment_method: string;
  status: string;
  created_at: string;
}

export interface PaymentResult {
  payment: BackendPayment;
  invoice: string;
}

export async function createOrder(
  data: OrderAddressData
): Promise<BackendOrder> {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

  return handle<BackendOrder>(response);
}

export async function payOrder(
  orderId: number,
  paymentMethod: string
): Promise<PaymentResult> {
  const response = await fetch(
    `${API_BASE_URL}/orders/${orderId}/pay`,
    {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        payment_method: paymentMethod,
      }),
    }
  );

  return handle<PaymentResult>(response);
}

export async function fetchOrders(): Promise<BackendOrder[]> {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    headers: getHeaders(),
  });

  return handle<BackendOrder[]>(response);
}

export async function fetchOrder(
  orderId: number
): Promise<BackendOrder> {
  const response = await fetch(
    `${API_BASE_URL}/orders/${orderId}`,
    {
      headers: getHeaders(),
    }
  );

  return handle<BackendOrder>(response);
}

export async function cancelOrder(
  orderId: number
): Promise<BackendOrder> {
  const response = await fetch(
    `${API_BASE_URL}/orders/${orderId}/cancel`,
    {
      method: "POST",
      headers: getHeaders(),
    }
  );

  return handle<BackendOrder>(response);
}

export async function downloadInvoice(
  orderId: number
): Promise<Blob> {
  const token = localStorage.getItem(TOKEN_KEY);

  const response = await fetch(
    `${API_BASE_URL}/orders/${orderId}/invoice`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const body = await response.json().catch(() => null);

    throw new Error(
      body?.detail ||
        "Impossible de télécharger la facture"
    );
  }

  return response.blob();
}