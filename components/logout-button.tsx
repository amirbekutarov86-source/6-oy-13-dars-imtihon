"use client";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth-provider";

export default function LogoutButton() {
  const router = useRouter();
  const { logout } = useAuth();
  function handle() {
    logout();
    router.push("/");
  }
  return (
    <Button variant="outline" size="sm" onClick={handle}>
      <LogOut className="h-4 w-4" /> Chiqish
    </Button>
  );
}
