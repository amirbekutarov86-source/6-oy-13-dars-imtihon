"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { SessionUser } from "@/lib/types";

const KEY = "token";
interface AuthValue {
  user: SessionUser | null;
  loading: boolean;
  login: (token: string, user: SessionUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthValue | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth faqat AuthProvider ichida ishlaydi");
  return ctx;
};
export const getToken = () => (typeof window !== "undefined" ? localStorage.getItem(KEY) : null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Sahifa yuklanganda localStorage'dagi token serverda tekshiriladi
  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    fetch("/api/auth/me", { headers: { Authorization: `Bearer ${token}` } })
      .then(async (res) => {
        if (res.status === 401) localStorage.removeItem(KEY);
        if (res.ok) setUser((await res.json()).user);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const login = (token: string, user: SessionUser) => {
    localStorage.setItem(KEY, token);
    setUser(user);
  };
  const logout = () => {
    localStorage.removeItem(KEY);
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>;
}
