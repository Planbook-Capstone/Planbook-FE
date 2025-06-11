import { grade, subject, user } from "@/generated/client";

export type User = user;
export type Grade = grade;
export type Subject = subject;

export type BookResponse = {
  name: string;
  id: bigint;
  createdAt: string | null;
  status: string | null;
  updatedAt: string | null;
  subject: SubjectResponse | null;
};

export type SubjectResponse = {
  name: string;
  id: bigint;
  createdAt: string | null;
  status: string | null;
  updatedAt: string | null;
  grade: Grade | null;
};
// // User types
// export interface User {
//   id: string;
//   name: string;
//   email: string;
//   avatar?: string;
//   role: 'user' | 'admin';
//   createdAt: string;
//   updatedAt: string;
// }

// // Product types
// export interface Product {
//   id: string;
//   name: string;
//   description: string;
//   price: number;
//   images: string[];
//   category: string;
//   tags: string[];
//   inStock: boolean;
//   quantity: number;
//   createdAt: string;
//   updatedAt: string;
// }

// // Cart types
// export interface CartItem {
//   id: string;
//   productId: string;
//   name: string;
//   price: number;
//   quantity: number;
//   image: string;
// }

// export interface Cart {
//   items: CartItem[];
//   total: number;
// }

// // Order types
// export interface Order {
//   id: string;
//   userId: string;
//   items: CartItem[];
//   total: number;
//   status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
//   shippingAddress: Address;
//   billingAddress: Address;
//   paymentMethod: string;
//   createdAt: string;
//   updatedAt: string;
// }

// // Address types
// export interface Address {
//   fullName: string;
//   addressLine1: string;
//   addressLine2?: string;
//   city: string;
//   state: string;
//   postalCode: string;
//   country: string;
//   phone: string;
// }

// // API response types
// export interface ApiResponse<T> {
//   data: T;
//   message?: string;
//   success: boolean;
// }

// export interface PaginatedResponse<T> {
//   data: T[];
//   total: number;
//   page: number;
//   limit: number;
//   totalPages: number;
// }
