import "./globals.css";
import { Toaster } from "sonner";
import { AuthProvider } from "@/components/auth-provider";
import { CartProvider } from "@/components/cart-provider";
import type { ReactNode } from "react";

export const metadata = {
  title: "Appliances — texnika do'koni",
  description: "Kompyuterlar, maishiy texnika va smartfonlar bir joyda.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="uz">
      <body>
        <AuthProvider>
          <CartProvider>{children}</CartProvider>
        </AuthProvider>
        <Toaster richColors theme="dark" position="top-right" />
      </body>
    </html>
  );
}
