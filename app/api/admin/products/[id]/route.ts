import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Product from "@/models/Product";
import { authorize } from "@/lib/guard";

const err = (error: string, status: number) => NextResponse.json({ error }, { status });

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { res } = await authorize(req, "admin");
    if (res) return res;
    if (!mongoose.isValidObjectId(params.id)) return err("ID noto'g'ri", 400);
    const product = await Product.findByIdAndDelete(params.id);
    if (!product) return err("Mahsulot topilmadi", 404);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return err("O'chirib bo'lmadi", 500);
  }
}
