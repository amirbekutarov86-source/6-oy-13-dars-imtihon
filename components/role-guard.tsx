"use client";
import { useEffect, type ReactNode } from "react";
import type { Role } from "@/lib/types";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/components/auth-provider";

// Sahifani faqat kerakli rol uchun ochadi
export default function RoleGuard({ role, children }: { role: Role; children: ReactNode }) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const allowed = !!user && user.role === role;

  useEffect(() => {
    if (loading) return;
    if (!user) router.replace("/sign-in");
    else if (user.role !== role) router.replace(user.role === "seller" ? "/seller" : user.role === "admin" ? "/admin" : "/");
  }, [loading, user, role, router]);

  if (!allowed) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
  return children;
}
