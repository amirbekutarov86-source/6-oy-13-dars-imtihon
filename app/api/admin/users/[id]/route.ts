import { NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "@/models/User";
import Product from "@/models/Product";
import { authorize } from "@/lib/guard";

const err = (error: string, status: number) => NextResponse.json({ error }, { status });

// Foydalanuvchini (va u sotuvchi bo'lsa, uning mahsulotlarini) o'chirish
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { res, user } = await authorize(req, "admin");
    if (res) return res;
    if (!mongoose.isValidObjectId(params.id)) return err("ID noto'g'ri", 400);
    if (params.id === user._id.toString()) return err("O'zingizni o'chira olmaysiz", 400);

    const target = await User.findById(params.id);
    if (!target) return err("Foydalanuvchi topilmadi", 404);
    if (target.role === "admin") return err("Adminni o'chirib bo'lmaydi", 403);

    await Product.deleteMany({ owner: target._id });
    await target.deleteOne();
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return err("O'chirib bo'lmadi", 500);
  }
}
