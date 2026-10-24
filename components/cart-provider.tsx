"use client";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { CartItem, ProductDTO } from "@/lib/types";

const KEY = "cart";
interface CartValue {
  items: CartItem[];
  ready: boolean;
  add: (p: ProductDTO, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  count: number;
  total: number;
}

const CartContext = createContext<CartValue | null>(null);
export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart faqat CartProvider ichida ishlaydi");
  return ctx;
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      setItems(JSON.parse(localStorage.getItem(KEY) || "[]"));
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(KEY, JSON.stringify(items));
  }, [items, ready]);

  const add = (p: ProductDTO, qty = 1) =>
    setItems((prev) => {
      const found = prev.find((i) => i.id === p._id);
      if (found)
        return prev.map((i) => (i.id === p._id ? { ...i, stock: p.stock, qty: Math.min(i.qty + qty, p.stock) } : i));
      return [
        ...prev,
        { id: p._id, name: p.name, price: p.price, image: p.image, category: p.category, stock: p.stock, qty: Math.min(qty, p.stock) },
      ];
    });
  const setQty = (id: string, qty: number) =>
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty: Math.max(1, Math.min(qty, i.stock)) } : i)));
  const remove = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));
  const clear = () => setItems([]);

  const value = useMemo(
    () => ({
      items,
      ready,
      add,
      setQty,
      remove,
      clear,
      count: items.reduce((s, i) => s + i.qty, 0),
      total: items.reduce((s, i) => s + i.qty * i.price, 0),
    }),
    [items, ready]
  );
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
