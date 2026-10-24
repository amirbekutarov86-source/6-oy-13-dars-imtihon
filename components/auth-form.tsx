"use client";
import { errMsg } from "@/lib/utils";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import type { SessionUser } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Logo from "@/components/logo";

export default function AuthForm({ mode }: { mode: "sign-in" | "sign-up" }) {
  const isSignUp = mode === "sign-up";
  const router = useRouter();
  const { user, login } = useAuth();
  const [loading, setLoading] = useState(false);

  const target = (u: SessionUser) => {
    const next = new URLSearchParams(window.location.search).get("next");
    if (u.role === "seller") return "/seller";
    if (u.role === "admin") return "/admin";
    return next && next.startsWith("/") ? next : "/";
  };
  useEffect(() => {
    if (user) router.replace(target(user));
  }, [user, router]);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const set = (k: keyof typeof form) => (e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value });

  async function submit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/auth/${isSignUp ? "register" : "login"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Xatolik yuz berdi");
      toast.success(isSignUp ? "Hisob yaratildi!" : "Xush kelibsiz!");
      login(data.token, data.user);
      router.push(target(data.user));
    } catch (err) {
      toast.error(errMsg(err));
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="mb-6 rounded-xl border bg-card/80 px-4 py-2 backdrop-blur"><Logo /></div>
      <Card className="w-full max-w-md shadow-2xl shadow-violet-950/50">
        <CardHeader>
          <CardTitle>{isSignUp ? "Hisob yaratish" : "Hisobingizga kiring"}</CardTitle>
          <CardDescription>
            {isSignUp ? "Ma'lumotlaringizni kiriting va mahsulotlarni boshqarishni boshlang." : "Email va parolingizni kiriting."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="name">Ism</Label>
                <Input id="name" placeholder="Rustam" value={form.name} onChange={set("name")} required />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="m@example.com" value={form.email} onChange={set("email")} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Parol</Label>
              <Input id="password" type="password" minLength={6} placeholder="Kamida 6 ta belgi" value={form.password} onChange={set("password")} required />
            </div>
            <Button type="submit" variant="dark" className="w-full" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSignUp ? "Ro'yxatdan o'tish" : "Kirish"}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            {isSignUp ? "Hisobingiz bormi? " : "Hisobingiz yo'qmi? "}
            <Link href={isSignUp ? "/sign-in" : "/sign-up"} className="font-medium text-primary hover:underline">
              {isSignUp ? "Kirish" : "Ro'yxatdan o'tish"}
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
