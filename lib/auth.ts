import jwt from "jsonwebtoken";
import type { Role } from "@/lib/types";

export interface Session {
  id: string;
  name: string;
  email: string;
  role: Role;
}

function secret() {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET .env.local faylida topilmadi");
  return process.env.JWT_SECRET;
}

export function signToken(payload: Session) {
  return jwt.sign(payload, secret(), { expiresIn: "7d" });
}

// So'rovdagi "Authorization: Bearer <token>" sarlavhasidan foydalanuvchini aniqlaydi
export function getSession(req: Request): Session | null {
  const header = req.headers.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return null;
  try {
    return jwt.verify(token, secret()) as Session;
  } catch {
    return null;
  }
}
