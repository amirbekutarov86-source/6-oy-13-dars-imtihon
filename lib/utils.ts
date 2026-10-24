import { clsx, type ClassValue } from "clsx";
import type { Category, OrderStatus } from "@/lib/types";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const CATEGORIES: { value: Category; label: string; image: string }[] = [
  { value: "computers", label: "Computers", image: "/images/computers.png" },
  { value: "appliances", label: "Appliances", image: "/images/appliances.png" },
  { value: "smartphones", label: "Smartphones", image: "/images/smartphones.png" },
];

export const categoryImage = (c?: string) => CATEGORIES.find((x) => x.value === c)?.image;
export const categoryLabel = (c: string) => CATEGORIES.find((x) => x.value === c)?.label || c;

export const formatPrice = (n?: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n || 0);

export const ORDER_STATUS: Record<OrderStatus, { label: string; cls: string }> = {
  pending: { label: "Kutilmoqda", cls: "bg-amber-500/15 text-amber-300" },
  confirmed: { label: "Tasdiqlandi", cls: "bg-blue-500/15 text-blue-300" },
  delivered: { label: "Yetkazildi", cls: "bg-emerald-500/15 text-emerald-300" },
  cancelled: { label: "Bekor qilindi", cls: "bg-red-500/15 text-red-300" },
};

// catch (e) ichidagi xato matnini xavfsiz olish
export const errMsg = (e: unknown) => (e instanceof Error ? e.message : "Xatolik yuz berdi");
