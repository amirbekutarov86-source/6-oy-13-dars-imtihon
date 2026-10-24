"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Check, Loader2, Minus, PackageOpen, Plus, ShoppingCart, Store } from "lucide-react";
import Navbar from "@/components/navbar";
import ProductImage from "@/components/product-image";
import { Button, buttonVariants } from "@/components/ui/button";
import { useAuth } from "@/components/auth-provider";
import { useCart } from "@/components/cart-provider";
import { categoryLabel, cn, formatPrice } from "@/lib/utils";
import type { ProductDTO } from "@/lib/types";

export default function ProductPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { items, add } = useCart();
  const [product, setProduct] = useState<ProductDTO | null>(null);
  const [state, setState] = useState<"loading" | "ok" | "missing">("loading");
  const [qty, setQty] = useState(1);

  useEffect(() => {
    setState("loading");
    fetch(`/api/public/products/${id}`)
      .then(async (r) => {
        if (!r.ok) return setState("missing");
        setProduct((await r.json()).product);
        setState("ok");
      })
      .catch(() => setState("missing"));
  }, [id]);

  const cannotBuy = user && user.role !== "user";
  const inCart = product && items.some((i) => i.id === product._id);

  function addToCart() {
    if (!product) return;
    add(product, qty);
    toast.success(`"${product.name}" savatga qo'shildi`);
  }

  return (
    <>
      <Navbar />
      <main className="container max-w-5xl py-10">
        <Link href="/#catalog" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Katalogga qaytish
        </Link>

        {state === "loading" ? (
          <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
        ) : state === "missing" || !product ? (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-20 text-center">
            <PackageOpen className="h-10 w-10 text-muted-foreground" />
            <p className="font-medium">Mahsulot topilmadi</p>
            <Link href="/#catalog" className={cn(buttonVariants({ variant: "dark" }))}>Katalogga o'tish</Link>
          </div>
        ) : (
          <div className="grid gap-10 md:grid-cols-2">
            <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
              <ProductImage src={product.image} category={product.category} alt={product.name} className="aspect-square w-full object-cover" />
            </div>
            <div className="space-y-5">
              <span className="inline-block rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
                {categoryLabel(product.category)}
              </span>
              <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
              <p className="text-3xl font-bold">{formatPrice(product.price)}</p>
              <p className={cn("text-sm font-medium", product.stock > 0 ? "text-emerald-400" : "text-destructive")}>
                {product.stock > 0 ? `${product.stock} ta mavjud` : "Tugagan"}
              </p>
              <p className="whitespace-pre-line text-muted-foreground">{product.description || "Tavsif kiritilmagan"}</p>
              {product.sellerName && (
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Store className="h-4 w-4" /> Sotuvchi: {product.sellerName}
                </p>
              )}

              {cannotBuy ? (
                <p className="text-sm text-muted-foreground">Bu hisob bilan xarid qilib bo'lmaydi.</p>
              ) : (
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1} aria-label="Kamaytirish"><Minus className="h-4 w-4" /></Button>
                    <span className="w-8 text-center font-medium">{qty}</span>
                    <Button variant="outline" size="icon" onClick={() => setQty((q) => Math.min(product.stock, q + 1))} disabled={qty >= product.stock} aria-label="Ko'paytirish"><Plus className="h-4 w-4" /></Button>
                  </div>
                  <Button size="lg" disabled={product.stock < 1} onClick={addToCart} variant={inCart ? "outline" : "default"}>
                    {inCart ? <Check className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
                    {product.stock < 1 ? "Tugagan" : inCart ? "Savatda — yana qo'shish" : "Savatga"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </>
  );
}
