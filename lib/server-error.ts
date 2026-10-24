// Login/register paytida chiqadigan xatoni tushunarli matnga aylantiradi
export function serverErrorMessage(e: unknown): string {
  const text = `${(e as Error)?.name || ""} ${(e as Error)?.message || ""}`;
  if (text.includes("JWT_SECRET")) return "JWT_SECRET .env.local faylida topilmadi";
  if (text.includes("MONGO_URI")) return "MONGO_URI .env.local faylida topilmadi";
  if (/bad auth|authentication failed/i.test(text))
    return "MongoDB login yoki paroli noto'g'ri. Atlas → Database Access da tekshiring";
  if (/ServerSelection|ENOTFOUND|ECONNREFUSED|ETIMEDOUT|querySrv|MongoNetwork/i.test(text))
    return "MongoDB ga ulanib bo'lmadi. Atlas → Network Access ga IP manzilingizni qo'shing (0.0.0.0/0)";
  return "Server xatosi. Terminaldagi xato matniga qarang";
}
