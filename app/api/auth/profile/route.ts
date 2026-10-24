import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import { authorize } from "@/lib/guard";
import { signToken } from "@/lib/auth";

const err = (error: string, status: number) => NextResponse.json({ error }, { status });

// Profilni yangilash: ism va/yoki parol
export async function PATCH(req: Request) {
  try {
    const { res, user } = await authorize(req);
    if (res) return res;
    const { name, currentPassword, newPassword } = await req.json();
    const doc = await User.findById(user._id);
    if (!doc) return err("Foydalanuvchi topilmadi", 404);

    if (typeof name === "string") {
      if (!name.trim()) return err("Ismni kiriting", 400);
      doc.name = name.trim();
    }
    if (newPassword) {
      if (newPassword.length < 6) return err("Yangi parol kamida 6 ta belgidan iborat bo'lsin", 400);
      if (!currentPassword || !(await bcrypt.compare(currentPassword, doc.password)))
        return err("Joriy parol noto'g'ri", 400);
      doc.password = await bcrypt.hash(newPassword, 10);
    }
    await doc.save();

    const payload = { id: doc._id.toString(), name: doc.name, email: doc.email, role: doc.role };
    return NextResponse.json({ token: signToken(payload), user: { ...payload, createdAt: doc.createdAt } });
  } catch (e) {
    console.error(e);
    return err("Profilni yangilab bo'lmadi", 500);
  }
}
