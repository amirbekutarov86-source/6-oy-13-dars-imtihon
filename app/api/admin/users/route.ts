import { NextResponse } from "next/server";
import User from "@/models/User";
import { authorize } from "@/lib/guard";

const esc = (q: string) => q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export async function GET(req: Request) {
  try {
    const { res } = await authorize(req, "admin");
    if (res) return res;
    const q = new URL(req.url).searchParams.get("search")?.trim();
    const filter = q ? { $or: [{ name: { $regex: esc(q), $options: "i" } }, { email: { $regex: esc(q), $options: "i" } }] } : {};
    const users = await User.find(filter).select("-password").sort({ createdAt: -1 }).limit(500).lean();
    return NextResponse.json({ users });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Foydalanuvchilarni olib bo'lmadi" }, { status: 500 });
  }
}
