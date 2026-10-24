import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import "@/models/User";

export const dynamic = "force-dynamic";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    if (!mongoose.isValidObjectId(params.id)) return NextResponse.json({ error: "ID noto'g'ri" }, { status: 400 });
    await connectDB();
    const row = await Product.findById(params.id).populate<{ owner: { name: string } | null }>("owner", "name").lean();
    if (!row) return NextResponse.json({ error: "Mahsulot topilmadi" }, { status: 404 });
    const { owner, ...p } = row;
    return NextResponse.json({ product: { ...p, sellerName: owner?.name || "" } });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Mahsulotni olib bo'lmadi" }, { status: 500 });
  }
}
