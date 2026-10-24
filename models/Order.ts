import mongoose from "mongoose";
import type { Category, OrderStatus } from "@/lib/types";

export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  name: string;
  price: number;
  image?: string;
  category: Category;
  quantity: number;
}

export interface IOrder {
  buyer: mongoose.Types.ObjectId;
  buyerName: string;
  buyerEmail: string;
  seller: mongoose.Types.ObjectId;
  sellerName: string;
  items: IOrderItem[];
  total: number;
  phone: string;
  address: string;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

const ItemSchema = new mongoose.Schema<IOrderItem>(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    name: String,
    price: Number,
    image: String,
    category: String,
    quantity: { type: Number, min: 1, required: true },
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema<IOrder>(
  {
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    buyerName: String,
    buyerEmail: String,
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    sellerName: String,
    items: { type: [ItemSchema], required: true },
    total: { type: Number, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    status: { type: String, enum: ["pending", "confirmed", "delivered", "cancelled"], default: "pending" },
  },
  { timestamps: true }
);

export default (mongoose.models.Order as mongoose.Model<IOrder>) || mongoose.model<IOrder>("Order", OrderSchema);
