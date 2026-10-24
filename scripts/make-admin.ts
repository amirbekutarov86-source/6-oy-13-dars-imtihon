// Ishlatish: npm run make-admin -- user@example.com
// Ro'yxatdan o'tgan foydalanuvchini admin qiladi.
import mongoose from "mongoose";

async function main() {
  const email = (process.argv[2] || "").toLowerCase().trim();
  if (!email) {
    console.error("Email kiriting: npm run make-admin -- user@example.com");
    process.exit(1);
  }
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI topilmadi (.env.local ni tekshiring)");
    process.exit(1);
  }
  await mongoose.connect(process.env.MONGO_URI);
  const r = await mongoose.connection.collection("users").updateOne({ email }, { $set: { role: "admin" } });
  console.log(r.matchedCount ? `${email} endi admin.` : `${email} topilmadi. Avval ro'yxatdan o'ting.`);
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
