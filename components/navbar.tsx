"use client";
import Link from "next/link";
import { ArrowRight, ClipboardList, LayoutDashboard, ShieldCheck, ShoppingCart, User } from "lucide-react";
import Logo from "./logo";
import LogoutButton from "./logout-button";
import { buttonVariants } from "./ui/button";
import { useAuth } from "./auth-provider";
import { useCart } from "./cart-provider";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const { user, loading } = useAuth();
  const { count } = useCart();
  const isSeller = user?.role === "seller";
  const isAdmin = user?.role === "admin";

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Logo />
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <Link href="/#catalog" className="hover:text-foreground">Katalog</Link>
          <Link href="/#why" className="hover:text-foreground">Afzalliklar</Link>
        </nav>
        <div className="flex min-h-[36px] items-center justify-end gap-2">
          {!isSeller && !isAdmin && (
            <Link href="/cart" aria-label="Savat" className={cn(buttonVariants({ variant: "outline", size: "icon" }), "relative")}>
              <ShoppingCart className="h-4 w-4" />
              {count > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1 text-[11px] font-bold text-primary-foreground">
                  {count}
                </span>
              )}
            </Link>
          )}
          {loading ? null : user ? (
            <>
              <Link href="/profile" aria-label="Profil" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
                <User className="h-4 w-4" /> <span className="hidden lg:inline">{user.name}</span>
              </Link>
              {isAdmin ? (
                <Link href="/admin" className={cn(buttonVariants({ variant: "dark", size: "sm" }))}>
                  <ShieldCheck className="h-4 w-4" /> Admin panel
                </Link>
              ) : isSeller ? (
                <Link href="/seller" className={cn(buttonVariants({ variant: "dark", size: "sm" }))}>
                  <LayoutDashboard className="h-4 w-4" /> Sotuvchi paneli
                </Link>
              ) : (
                <Link href="/orders" className={cn(buttonVariants({ variant: "dark", size: "sm" }))}>
                  <ClipboardList className="h-4 w-4" /> Buyurtmalarim
                </Link>
              )}
              <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/sign-in" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>Kirish</Link>
              <Link href="/sign-up" className={cn(buttonVariants({ variant: "dark", size: "sm" }))}>
                Boshlash <ArrowRight className="h-4 w-4" />
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
