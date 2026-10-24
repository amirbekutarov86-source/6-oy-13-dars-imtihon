"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2, PackageOpen, Search, Trash2, Users } from "lucide-react";
import ProductImage from "@/components/product-image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { useAuth } from "@/components/auth-provider";
import { categoryLabel, cn, formatPrice, errMsg } from "@/lib/utils";
import type { AdminUserDTO, ProductDTO, Role } from "@/lib/types";

const ROLE: Record<Role, { label: string; cls: string }> = {
  user: { label: "Xaridor", cls: "bg-slate-500/20 text-slate-300" },
  seller: { label: "Sotuvchi", cls: "bg-blue-500/15 text-blue-300" },
  admin: { label: "Admin", cls: "bg-violet-500/15 text-violet-300" },
};

export default function AdminPanel() {
  const [tab, setTab] = useState("users");
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<AdminUserDTO[]>([]);
  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const { user: me } = useAuth();
  const rows = tab === "users" ? users : products;
  const [toDelete, setToDelete] = useState<AdminUserDTO | ProductDTO | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function remove() {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await api(`/api/admin/${tab}/${toDelete._id}`, { method: "DELETE" });
      if (tab === "users") setUsers((prev) => prev.filter((r) => r._id !== toDelete._id));
      else setProducts((prev) => prev.filter((r) => r._id !== toDelete._id));
      toast.success(tab === "users" ? "Foydalanuvchi o'chirildi" : "Mahsulot o'chirildi");
      setToDelete(null);
    } catch (e) {
      toast.error(errMsg(e));
    } finally {
      setDeleting(false);
    }
  }

  // Bo'lim almashganda qidiruv tozalanadi
  useEffect(() => setSearch(""), [tab]);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const q = encodeURIComponent(search);
        if (tab === "users") {
          const data = await api<{ users: AdminUserDTO[] }>(`/api/admin/users?search=${q}`);
          if (alive) setUsers(data.users);
        } else {
          const data = await api<{ products: ProductDTO[] }>(`/api/admin/products?search=${q}`);
          if (alive) setProducts(data.products);
        }
      } catch (e) {
        if (alive) {
          setUsers([]);
          setProducts([]);
          toast.error(errMsg(e));
        }
      } finally {
        if (alive) setLoading(false);
      }
    }, 250);
    return () => {
      alive = false;
      clearTimeout(t);
    };
  }, [tab, search]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin panel</h1>
        <p className="mt-1 text-muted-foreground">Platformadagi barcha foydalanuvchilar va mahsulotlar.</p>
      </div>

      <div className="inline-flex rounded-xl bg-muted p-1">
        {[["users", "Barcha userlar"], ["products", "Barcha productlar"]].map(([k, label]) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={cn("rounded-lg px-5 py-2 text-sm font-medium", tab === k ? "bg-foreground text-background shadow" : "text-muted-foreground hover:text-foreground")}
          >
            {label}
          </button>
        ))}
      </div>

      <Card className="overflow-hidden">
        <div className="flex items-center justify-between gap-4 border-b p-4">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input className="pl-9" placeholder={tab === "users" ? "Ism yoki email..." : "Mahsulot nomi..."} value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          {!loading && <p className="text-sm text-muted-foreground">Jami: {rows.length}</p>}
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
        ) : rows.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-16 text-center">
            {tab === "users" ? <Users className="h-9 w-9 text-muted-foreground" /> : <PackageOpen className="h-9 w-9 text-muted-foreground" />}
            <p className="font-medium">Hech narsa topilmadi</p>
          </div>
        ) : tab === "users" ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/60 text-left text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Ism</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Rol</th>
                  <th className="px-4 py-3 text-right font-medium">Ro'yxatdan o'tgan</th>
                  <th className="px-4 py-3 text-right font-medium">Amal</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {users.map((u) => {
                  const r = ROLE[u.role] || ROLE.user;
                  return (
                    <tr key={u._id} className="hover:bg-muted/40">
                      <td className="px-4 py-3 font-medium">{u.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                      <td className="px-4 py-3"><span className={cn("rounded-full px-2.5 py-1 text-xs font-medium", r.cls)}>{r.label}</span></td>
                      <td className="px-4 py-3 text-right text-muted-foreground">{new Date(u.createdAt).toLocaleDateString("en-GB")}</td>
                      <td className="px-4 py-3 text-right">
                        {u.role !== "admin" && u._id !== me?.id && (
                          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => setToDelete(u)} aria-label="O'chirish">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/60 text-left text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Mahsulot</th>
                  <th className="px-4 py-3 font-medium">Kategoriya</th>
                  <th className="px-4 py-3 font-medium">Sotuvchi</th>
                  <th className="px-4 py-3 text-right font-medium">Narxi</th>
                  <th className="px-4 py-3 text-right font-medium">Soni</th>
                  <th className="px-4 py-3 text-right font-medium">Amal</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {products.map((p) => (
                  <tr key={p._id} className="hover:bg-muted/40">
                    <td className="px-4 py-3">
                      <Link href={`/product/${p._id}`} className="flex items-center gap-3 hover:underline">
                        <ProductImage src={p.image} category={p.category} alt="" className="h-11 w-11 rounded-lg object-cover" />
                        <span className="truncate font-medium">{p.name}</span>
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground">{categoryLabel(p.category)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium">{p.sellerName || "—"}</p>
                      <p className="text-xs text-muted-foreground">{p.sellerEmail}</p>
                    </td>
                    <td className="px-4 py-3 text-right font-medium">{formatPrice(p.price)}</td>
                    <td className="px-4 py-3 text-right">{p.stock}</td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => setToDelete(p)} aria-label="O'chirish">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Dialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        title={tab === "users" ? "Foydalanuvchini o'chirish" : "Mahsulotni o'chirish"}
        description={
          toDelete
            ? tab === "users"
              ? `"${toDelete.name}" (${"email" in toDelete ? toDelete.email : ""}) o'chiriladi${"role" in toDelete && toDelete.role === "seller" ? " va uning barcha mahsulotlari ham o'chadi" : ""}. Bu amalni qaytarib bo'lmaydi.`
              : `"${toDelete.name}" butunlay o'chiriladi. Bu amalni qaytarib bo'lmaydi.`
            : ""
        }
      >
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setToDelete(null)}>Bekor qilish</Button>
          <Button variant="destructive" onClick={remove} disabled={deleting}>
            {deleting && <Loader2 className="h-4 w-4 animate-spin" />} O'chirish
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
