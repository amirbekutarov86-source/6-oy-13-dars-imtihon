import { NextResponse } from "next/server";
import Product from "@/models/Product";
import "@/models/User";
import { authorize } from "@/lib/guard";

const esc = (q: string) => q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export async function GET(req: Request) {
  try {
    const { res } = await authorize(req, "admin");
    if (res) return res;
    const q = new URL(req.url).searchParams.get("search")?.trim();
    const filter = q ? { name: { $regex: esc(q), $options: "i" } } : {};
    const rows = await Product.find(filter).sort({ createdAt: -1 }).limit(500).populate<{ owner: { name: string; email: string } | null }>("owner", "name email").lean();
    const products = rows.map(({ owner, ...p }) => ({ ...p, sellerName: owner?.name || "", sellerEmail: owner?.email || "" }));
    return NextResponse.json({ products });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Mahsulotlarni olib bo'lmadi" }, { status: 500 });
  }
}
