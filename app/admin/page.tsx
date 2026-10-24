"use client";
import Navbar from "@/components/navbar";
import RoleGuard from "@/components/role-guard";
import AdminPanel from "@/components/admin-panel";

export default function AdminPage() {
  return (
    <>
      <Navbar />
      <RoleGuard role="admin">
        <main className="container py-10">
          <AdminPanel />
        </main>
      </RoleGuard>
    </>
  );
}
