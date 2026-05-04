import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import type { CartItem, Order, OrderStatus, Product, Client } from "@/lib/types";
import { SEED_ORDERS, SEED_PRODUCTS } from "@/lib/seed";

interface ShopContextValue {
  products: Product[];
  orders: Order[];
  cart: CartItem[];
  // products
  addProduct: (p: Omit<Product, "id">) => void;
  updateProduct: (id: string, p: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  // cart
  addToCart: (p: Product, qty?: number) => void;
  updateCartQty: (id: string, qty: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  // orders
  placeOrder: (client: Client) => Order;
  setOrderStatus: (id: string, status: OrderStatus) => void;
  bulkSetOrderStatus: (ids: string[], status: OrderStatus) => void;
}

const ShopContext = createContext<ShopContextValue | undefined>(undefined);

const LS = { products: "vtp.products", orders: "vtp.orders", cart: "vtp.cart" };

const load = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

export function ShopProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => load(LS.products, SEED_PRODUCTS));
  const [orders, setOrders] = useState<Order[]>(() => load(LS.orders, SEED_ORDERS));
  const [cart, setCart] = useState<CartItem[]>(() => load(LS.cart, []));

  useEffect(() => localStorage.setItem(LS.products, JSON.stringify(products)), [products]);
  useEffect(() => localStorage.setItem(LS.orders, JSON.stringify(orders)), [orders]);
  useEffect(() => localStorage.setItem(LS.cart, JSON.stringify(cart)), [cart]);

  const addProduct: ShopContextValue["addProduct"] = (p) => {
    const id = "p" + Date.now();
    setProducts((prev) => [{ ...p, id }, ...prev]);
  };
  const updateProduct: ShopContextValue["updateProduct"] = (id, p) =>
    setProducts((prev) => prev.map((x) => (x.id === id ? { ...x, ...p } : x)));
  const deleteProduct: ShopContextValue["deleteProduct"] = (id) =>
    setProducts((prev) => prev.filter((x) => x.id !== id));

  const addToCart: ShopContextValue["addToCart"] = (p, qty = 1) =>
    setCart((prev) => {
      const found = prev.find((c) => c.product.id === p.id);
      if (found) {
        return prev.map((c) =>
          c.product.id === p.id ? { ...c, quantite: c.quantite + qty } : c
        );
      }
      return [...prev, { product: p, quantite: qty }];
    });

  const updateCartQty: ShopContextValue["updateCartQty"] = (id, qty) =>
    setCart((prev) =>
      prev.map((c) => (c.product.id === id ? { ...c, quantite: Math.max(1, qty) } : c))
    );
  const removeFromCart: ShopContextValue["removeFromCart"] = (id) =>
    setCart((prev) => prev.filter((c) => c.product.id !== id));
  const clearCart = () => setCart([]);

  const cartTotal = useMemo(
    () => cart.reduce((s, c) => s + c.product.prix * c.quantite, 0),
    [cart]
  );
  const cartCount = useMemo(() => cart.reduce((s, c) => s + c.quantite, 0), [cart]);

  const placeOrder: ShopContextValue["placeOrder"] = (client) => {
    const order: Order = {
      id: "CMD-" + (1000 + Math.floor(Math.random() * 9000)),
      client,
      items: cart.map((c) => ({
        produit_id: c.product.id,
        nom: c.product.nom,
        quantite: c.quantite,
        prix: c.product.prix,
      })),
      total: cartTotal,
      status: "EN_ATTENTE",
      date: new Date().toISOString(),
    };
    setOrders((prev) => [order, ...prev]);
    clearCart();
    return order;
  };

  const setOrderStatus: ShopContextValue["setOrderStatus"] = (id, status) =>
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o;
        // Logique métier : pas de transition après terminal
        if (o.status === "CONFIRMEE" && status === "ANNULEE") return o;
        if (o.status === "ANNULEE" && status === "CONFIRMEE") return o;
        return { ...o, status };
      })
    );

  const bulkSetOrderStatus: ShopContextValue["bulkSetOrderStatus"] = (ids, status) =>
    setOrders((prev) =>
      prev.map((o) => {
        if (!ids.includes(o.id)) return o;
        if (o.status === "CONFIRMEE" && status === "ANNULEE") return o;
        if (o.status === "ANNULEE" && status === "CONFIRMEE") return o;
        return { ...o, status };
      })
    );

  return (
    <ShopContext.Provider
      value={{
        products,
        orders,
        cart,
        addProduct,
        updateProduct,
        deleteProduct,
        addToCart,
        updateCartQty,
        removeFromCart,
        clearCart,
        cartTotal,
        cartCount,
        placeOrder,
        setOrderStatus,
        bulkSetOrderStatus,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used within ShopProvider");
  return ctx;
}
