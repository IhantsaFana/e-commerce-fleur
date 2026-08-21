import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  ReactNode,
  useCallback,
} from "react";
import { Fleur } from "../data/products";
import { useAuth } from "./AuthContext";
import {
  fetchCart,
  addCartItem,
  updateCartItem,
  deleteCartItem,
} from "../services/cartApi";
import { fetchProducts } from "../services/productApi";

export interface CartItem {
  id: number;
  cartItemId?: number;
  name: string;
  price: number;
  image: string;
  qty: number;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (fleur: Fleur, qty?: number) => Promise<void>;
  removeItem: (id: number) => Promise<void>;
  updateQty: (id: number, qty: number) => Promise<void>;
  clearCart: () => Promise<void>;
  total: number;
  count: number;
  loading: boolean;
}

const CartContext = createContext<CartContextValue | null>(null);

const LOCAL_CART_KEY = "fq_cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_CART_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [loading, setLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    if (!user) return;

    setLoading(true);

    try {
      const [cart, products] = await Promise.all([
        fetchCart(),
        fetchProducts(),
      ]);

      const imageMap = new Map(products.map((product) => [product.id, product.imageUrl]));

      setItems(
        cart.items.map((item) => ({
          id: item.product_id,
          cartItemId: item.id,
          name: item.product_name,
          price: Number(item.unit_price),
          image: imageMap.get(item.product_id) || "",
          qty: item.quantity,
        }))
      );
    } catch (error) {
      console.error("Erreur de chargement du panier :", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      refreshCart();
    } else {
      try {
        const saved = localStorage.getItem(LOCAL_CART_KEY);
        setItems(saved ? JSON.parse(saved) : []);
      } catch {
        setItems([]);
      }
    }
  }, [user, refreshCart]);

  useEffect(() => {
    if (!user) {
      localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(items));
    }
  }, [items, user]);

  const addItem = async (fleur: Fleur, qty = 1) => {
    if (!user) {
      setItems((previous) => {
        const existing = previous.find((item) => item.id === fleur.id);

        if (existing) {
          return previous.map((item) =>
            item.id === fleur.id
              ? { ...item, qty: item.qty + qty }
              : item
          );
        }

        return [
          ...previous,
          {
            id: fleur.id,
            name: fleur.nom,
            price: fleur.prix,
            image: fleur.imageUrl,
            qty,
          },
        ];
      });

      return;
    }

    await addCartItem(fleur.id, qty);
    await refreshCart();
  };

  const removeItem = async (productId: number) => {
    const item = items.find((current) => current.id === productId);

    if (!user || !item?.cartItemId) {
      setItems((previous) =>
        previous.filter((current) => current.id !== productId)
      );
      return;
    }

    await deleteCartItem(item.cartItemId);
    await refreshCart();
  };

  const updateQty = async (productId: number, qty: number) => {
    const safeQuantity = Math.max(1, qty);
    const item = items.find((current) => current.id === productId);

    if (!user || !item?.cartItemId) {
      setItems((previous) =>
        previous.map((current) =>
          current.id === productId
            ? { ...current, qty: safeQuantity }
            : current
        )
      );
      return;
    }

    await updateCartItem(item.cartItemId, safeQuantity);
    await refreshCart();
  };

  const clearCart = async () => {
    if (!user) {
      setItems([]);
      localStorage.removeItem(LOCAL_CART_KEY);
      return;
    }

    await Promise.all(
      items
        .filter((item) => item.cartItemId)
        .map((item) => deleteCartItem(item.cartItemId!))
    );

    setItems([]);
  };

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.qty, 0),
    [items]
  );

  const count = useMemo(
    () => items.reduce((sum, item) => sum + item.qty, 0),
    [items]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQty,
        clearCart,
        total,
        count,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  return context;
}