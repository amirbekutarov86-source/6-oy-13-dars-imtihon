"use client";
import Link from "next/link";
import { ArrowRight, Laptop, Smartphone, Refrigerator, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { useAuth } from "@/components/auth-provider";
import { cn } from "@/lib/utils";
import type { Role } from "@/lib/types";

const PROFILE_LINK: Record<Role, { href: string; label: string }> = {
  user: { href: "/orders", label: "Buyurtmalarim" },
  seller: { href: "/seller", label: "Sotuvchi paneli" },
  admin: { href: "/admin", label: "Admin panel" },
};

const chips = [
  { icon: Laptop, label: "Kompyuterlar" },
  { icon: Refrigerator, label: "Maishiy texnika" },
  { icon: Smartphone, label: "Smartfonlar" },
];

export default function Hero() {
  const { user, loading } = useAuth();
  const firstName = user?.name?.split(" ")[0];

  return (
    <section className="relative overflow-hidden border-b">
      {/* bezak: xira rangli doiralar */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-indigo-500/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-fuchsia-500/20 blur-3xl" />

      <div className="container relative flex min-h-[560px] flex-col items-center justify-center py-24 text-center">
        <div className="fade-up inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium text-violet-300 shadow-[0_0_30px_-5px] shadow-violet-500/40 backdrop-blur">
          <Sparkles className="h-4 w-4" />
          {loading ? "Xush kelibsiz!" : user ? `Xush kelibsiz, ${firstName}! 👋` : "Appliances do'koniga xush kelibsiz! 👋"}
        </div>

        <h1 className="fade-up mt-6 max-w-3xl text-4xl font-extrabold tracking-tight [animation-delay:100ms] sm:text-6xl">
          Uyingiz uchun{" "}
          <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">eng yaxshi texnika.</span>
        </h1>
        <p className="fade-up mt-5 max-w-xl text-lg text-muted-foreground [animation-delay:200ms]">
          Noutbuklar, smartfonlar va maishiy texnika — original, kafolatli va qulay narxlarda.
        </p>

        <div className="fade-up mt-8 flex flex-wrap justify-center gap-3 [animation-delay:300ms]">
          <a href="#catalog" className={cn(buttonVariants({ variant: "dark", size: "lg" }), "shadow-lg shadow-white/10")}>
            Katalogni ko'rish <ArrowRight className="h-4 w-4" />
          </a>
          {loading ? null : user ? (
            <Link href={PROFILE_LINK[user.role].href} className={cn(buttonVariants({ variant: "outline", size: "lg" }), "border-white/15 bg-white/5 backdrop-blur")}>
              {PROFILE_LINK[user.role].label}
            </Link>
          ) : (
            <Link href="/sign-up" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "border-white/15 bg-white/5 backdrop-blur")}>
              Ro'yxatdan o'tish
            </Link>
          )}
        </div>

        <div className="fade-up mt-12 flex flex-wrap justify-center gap-3 [animation-delay:400ms]">
          {chips.map((c) => (
            <span key={c.label} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 backdrop-blur">
              <c.icon className="h-4 w-4 text-violet-400" /> {c.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
