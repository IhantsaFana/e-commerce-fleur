import { createContext, useContext, useState, useEffect, useMemo, ReactNode } from "react";
import { Fleur } from "../data/products";

export interface CartItem {
  id: number;      // = fleur.id
  name: string;
  price: number;
  image: string;
  qty: number;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (fleur: Fleur, qty?: number) => void;
  removeItem: (id: number) => void;
  updateQty: (id: number, qty: number) => void;
  clearCart: () => void;
  total: number;
  count: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("fq_cart");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("fq_cart", JSON.stringify(items));
  }, [items]);

  const addItem = (fleur: Fleur, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === fleur.id);
      if (existing) {
        return prev.map((i) => (i.id === fleur.id ? { ...i, qty: i.qty + qty } : i));
      }
      return [
        ...prev,
        { id: fleur.id, name: fleur.nom, price: fleur.prix, image: fleur.imageUrl, qty },
      ];
    });
  };

  const removeItem = (id: number) => setItems((prev) => prev.filter((i) => i.id !== id));

  const updateQty = (id: number, qty: number) =>
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i)));

  const clearCart = () => setItems([]);

  const total = useMemo(() => items.reduce((sum, i) => sum + i.price * i.qty, 0), [items]);
  const count = useMemo(() => items.reduce((sum, i) => sum + i.qty, 0), [items]);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
