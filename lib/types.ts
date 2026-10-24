export type Role = "user" | "seller" | "admin";
export type Category = "computers" | "appliances" | "smartphones";
export type OrderStatus = "pending" | "confirmed" | "delivered" | "cancelled";

// Brauzerdagi (JSON) ko'rinishdagi ma'lumotlar
export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt?: string;
}

export interface ProductDTO {
  _id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  category: Category;
  image?: string;
  sellerName?: string;
  sellerEmail?: string;
  createdAt?: string;
}

export interface OrderItemDTO {
  product: string;
  name: string;
  price: number;
  image?: string;
  category: Category;
  quantity: number;
}

export interface OrderDTO {
  _id: string;
  buyerName: string;
  buyerEmail: string;
  sellerName: string;
  items: OrderItemDTO[];
  total: number;
  phone: string;
  address: string;
  status: OrderStatus;
  createdAt: string;
}

export interface AdminUserDTO {
  _id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image?: string;
  category: Category;
  stock: number;
  qty: number;
}
