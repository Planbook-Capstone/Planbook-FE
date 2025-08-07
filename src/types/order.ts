// Order related types

// Union types for status values
export type OrderStatus =
  | "PENDING"
  | "PAID"
  | "COMPLETED"
  | "CANCELLED"
  | "FAILED"
  | "RETRY";
export type TransactionType = "DEPOSIT" | "WITHDRAWAL" | "PAYMENT" | "REFUND";
export type TransactionStatus =
  | "PENDING"
  | "COMPLETED"
  | "FAILED"
  | "CANCELLED"
  | "RETRY";
export type PackageStatus = "ACTIVE" | "INACTIVE";
export type SortDirection = "ASC" | "DESC";
export type NullHandling = "NATIVE" | "NULLS_FIRST" | "NULLS_LAST";

// Interface for object structures
export interface OrderTransaction {
  id: string;
  orderId: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  description?: string;
  failureReason?: string;
  checkoutUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderHistory {
  id: string;
  orderId: string;
  fromStatus: string | null;
  toStatus: string;
  note: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionPackage {
  id: string;
  name: string;
  tokenAmount: number;
  price: number;
  description: string;
  highlight: boolean;
  priority: number;
  status: PackageStatus;
  createdAt: string;
  updatedAt: string;
  features: Record<string, string>;
}

export interface Order {
  id: string;
  userId: string;
  amount: number;
  status: OrderStatus;
  checkoutUrl: string | null;
  qrCode: string | null;
  createdAt: string;
  updatedAt: string;
  subscriptionPackage: SubscriptionPackage;
  orderHistories: OrderHistory[];
  transactions: OrderTransaction[];
}

// Pagination types
export interface SortInfo {
  direction: "ASC" | "DESC";
  property: string;
  ignoreCase: boolean;
  nullHandling: "NATIVE" | "NULLS_FIRST" | "NULLS_LAST";
  ascending: boolean;
  descending: boolean;
}

export interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: SortInfo[];
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

export interface OrderPageResponse {
  content: Order[];
  pageable: Pageable;
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  sort: SortInfo[];
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

// API Response wrapper
export interface OrderListResponse {
  statusCode: number;
  message: string;
  data: OrderPageResponse;
}

// Single order response
export interface OrderResponse {
  statusCode: number;
  message: string;
  data: Order;
}

// Create order request
export interface CreateOrderRequest {
  subscriptionPackageId: string;
  amount?: number;
}

// Update order request
export interface UpdateOrderRequest {
  status?: OrderStatus;
  checkoutUrl?: string;
  qrCode?: string;
  note?: string;
}

// Order filter parameters for API queries
export interface OrderFilterParams {
  status?: OrderStatus;
  userId?: string;
  packageId?: string;
  sortBy?: "createdAt" | "updatedAt";
  sortDirection?: "asc" | "desc";
  offset?: string;
  pageSize?: string;
}
