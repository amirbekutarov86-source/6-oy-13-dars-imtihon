"use client";
import { errMsg } from "@/lib/utils";
import { useEffect, useState, type FormEvent } from "react";
import type { SessionUser } from "@/lib/types";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Mail, ShieldCheck, CalendarDays } from "lucide-react";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/components/auth-provider";
import { api } from "@/lib/api";

const ROLE_LABEL = { user: "Xaridor", seller: "Sotuvchi", admin: "Admin" };

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading, login } = useAuth();
  const [name, setName] = useState("");
  const [pw, setPw] = useState({ currentPassword: "", newPassword: "" });
  const [savingName, setSavingName] = useState(false);
  const [savingPw, setSavingPw] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace("/sign-in?next=/profile");
  }, [loading, user, router]);
  useEffect(() => {
    if (user) setName(user.name);
  }, [user]);

  async function patch(body: { name?: string; currentPassword?: string; newPassword?: string }) {
    const { token, user: u } = await api<{ token: string; user: SessionUser }>("/api/auth/profile", { method: "PATCH", body: JSON.stringify(body) });
    login(token, u);
  }

  async function saveName(e: FormEvent) {
    e.preventDefault();
    setSavingName(true);
    try {
      await patch({ name });
      toast.success("Ism yangilandi");
    } catch (err) {
      toast.error(errMsg(err));
    } finally {
      setSavingName(false);
    }
  }

  async function savePassword(e: FormEvent) {
    e.preventDefault();
    setSavingPw(true);
    try {
      await patch(pw);
      setPw({ currentPassword: "", newPassword: "" });
      toast.success("Parol yangilandi");
    } catch (err) {
      toast.error(errMsg(err));
    } finally {
      setSavingPw(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className="container max-w-2xl py-10">
        {!user ? (
          <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
        ) : (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Profil</h1>
              <p className="mt-1 text-muted-foreground">Hisobingiz ma'lumotlari.</p>
            </div>

            <Card className="space-y-3 p-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                {user.name?.[0]?.toUpperCase()}
              </div>
              <p className="text-xl font-semibold">{user.name}</p>
              <div className="grid gap-2 text-sm text-muted-foreground">
                <p className="flex items-center gap-2"><Mail className="h-4 w-4" /> {user.email}</p>
                <p className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Rol: {ROLE_LABEL[user.role] || user.role}</p>
                {user.createdAt && (
                  <p className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" /> Ro'yxatdan o'tgan sana: {new Date(user.createdAt).toLocaleDateString("en-GB")}
                  </p>
                )}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="mb-4 text-lg font-semibold">Ismni o'zgartirish</h2>
              <form onSubmit={saveName} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Ism</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <Button type="submit" disabled={savingName || name.trim() === user.name}>
                  {savingName && <Loader2 className="h-4 w-4 animate-spin" />} Saqlash
                </Button>
              </form>
            </Card>

            <Card className="p-6">
              <h2 className="mb-4 text-lg font-semibold">Parolni o'zgartirish</h2>
              <form onSubmit={savePassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cur">Joriy parol</Label>
                  <Input id="cur" type="password" value={pw.currentPassword} onChange={(e) => setPw({ ...pw, currentPassword: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new">Yangi parol</Label>
                  <Input id="new" type="password" minLength={6} placeholder="Kamida 6 ta belgi" value={pw.newPassword} onChange={(e) => setPw({ ...pw, newPassword: e.target.value })} required />
                </div>
                <Button type="submit" disabled={savingPw}>
                  {savingPw && <Loader2 className="h-4 w-4 animate-spin" />} Parolni yangilash
                </Button>
              </form>
            </Card>
          </div>
        )}
      </main>
    </>
  );
}
