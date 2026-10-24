import mongoose from "mongoose";

type Cache = { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
const g = global as typeof globalThis & { _mongoose?: Cache };
const cached: Cache = g._mongoose || (g._mongoose = { conn: null, promise: null });

export async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error("MONGO_URI .env.local faylida topilmadi");
  if (cached.conn) return cached.conn;
  if (!cached.promise) cached.promise = mongoose.connect(uri, { bufferCommands: false });
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }
  return cached.conn;
}
