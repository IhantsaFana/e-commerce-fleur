export interface OrderItem {
  id: number;        // fleur.id
  name: string;
  price: number;     // prix unitaire
  qty: number;
}

export interface Order {
  id: string;
  numeroCommande: string;
  dateCommande: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  grandTotal: number;
  methode: string;
  statut: string;
  adresse: { rue: string; ville: string; code_postal: string; pays: string };
  deliveryDate: string;
  note: string;
}

const KEY = "fq_orders";

export function saveOrder(order: Order): void {
  const orders = getOrders();
  orders.unshift(order); // plus récent en premier
  localStorage.setItem(KEY, JSON.stringify(orders));
}

export function getOrders(): Order[] {
  const saved = localStorage.getItem(KEY);
  return saved ? JSON.parse(saved) : [];
}

export function getOrder(id: string): Order | undefined {
  return getOrders().find((o) => o.id === id);
}

export function clearOrders(): void {
  localStorage.removeItem(KEY);
}
