import mongoose from "mongoose";
import type { Category } from "@/lib/types";

export interface IProduct {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: Category;
  image: string;
  owner: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new mongoose.Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, default: 0, min: 0 },
    category: { type: String, enum: ["computers", "appliances", "smartphones"], required: true },
    image: { type: String, default: "" },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  },
  { timestamps: true }
);

export default (mongoose.models.Product as mongoose.Model<IProduct>) || mongoose.model<IProduct>("Product", ProductSchema);
