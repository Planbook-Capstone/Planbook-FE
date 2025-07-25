import {
  academic_year,
  book_type,
  grade,
  subject,
  user,
} from "@/generated/client";

export type User = user;
export type Grade = grade;
export type Subject = subject;
export type AcademicYear = academic_year;
export type BookType = book_type;

export type AcademicYearResponse = {
  id: bigint;
  yearLabel: string;
  startDate: Date | null;
  endDate: Date | null;
  status: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
};
export type GradeResponse = {
  name: string;
  id: bigint;
  createdAt: string | null;
  status: string | null;
  updatedAt: string | null;
};

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

export type LessonPlanResponse = {
  id: string;
  name: string;
  description?: string;
  createdAt: string | null;
  updatedAt: string | null;
  formData?: JSON;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
};

export type SubscriptionResponse = {
  id: string;
  name: string;
  tokenAmount: number;
  price: number;
  description: string;
  highlight: boolean;
  features: Record<string, string>;
  priority: number;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt: string;
};
export type BookTypeResponse = {
  id: bigint;
  name: string;
  icon: string | null;
  description: string | null;
  createdAt: string | null;
  status: string | null;
  updatedAt: string | null;
  priority: number | null;
  tokenCostPerQuery: number | null;
};

export type TagResponse = {
  id: bigint;
  name: string;
  description: string | null;
};

export type OrderHistoryResponse = {
  id: string;
  orderId: string;
  fromStatus: string | null;
  toStatus: string;
  note: string;
  createdAt: string;
  updatedAt: string;
};

// User types
// export interface UserResponse {
//   id: string;
//   name: string;
//   email: string;
//   avatar?: string;
//   role: 'user' | 'admin';
//   createdAt: string;
//   updatedAt: string;
// }

// Transaction types
export interface Transaction {
  id: string;
  amount: number;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'PAYMENT' | 'REFUND';
  description?: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
}

// Wallet types
export interface Wallet {
  id: string;
  balance: number;
  createdAt: string;
  updatedAt: string;
  transactions: Transaction[];
}

// Enhanced User Response with wallet
export interface UserWithWalletResponse {
  id: string;
  fullName: string | null;
  username: string;
  email: string;
  role: 'PARTNER' | 'STAFF' | 'USER' | 'ADMIN';
  phone: string | null;
  avatar: string | null;
  gender: string | null;
  birthday: string | null;
  status: string | null;
  createdAt: string;
  updatedAt: string;
  wallet: Wallet | null;
}

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

// Lesson Plan Template Types
export interface LessonPlanKeyword {
  id: string;
  title: string;
  content: string;
  prompt?: string;
  order: number;
  children?: LessonPlanKeyword[];
  nodeType?: "SECTION" | "SUBSECTION" | "LIST_ITEM" | "PARAGRAPH"; // Map với backend NodeType
  fieldType?: "INPUT" | "REFERENCES" | "TABLE" | null; // Map với backend FieldType
}

export interface LessonPlanStep {
  id: string;
  title: string;
  description?: string;
  isRequired: boolean;
  order: number;
  keywords: LessonPlanKeyword[];
  stepType:
    | "general_info"
    | "objectives"
    | "equipment"
    | "activities"
    | "custom";
  timeAllocation?: number; // in minutes
  children?: LessonPlanStep[];
}

export interface LessonPlanActivity {
  id: string;
  title: string;
  description?: string;
  timeAllocation: number;
  objectives: string[];
  content: string;
  expectedProducts: string[];
  teacherActivities: string[];
  studentActivities: string[];
  order: number;
}

export interface LessonPlanTemplate {
  id: string;
  name: string;
  description: string;
  version: string;
  isDefault: boolean;
  isActive?: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  steps: LessonPlanStep[];
  metadata: {
    subject?: string;
    grade?: string;
    educationLevel?: string;
    framework?: string;
  };
}

export interface LessonPlanInstance {
  id: string;
  templateId: string;
  title: string;
  subject: string;
  grade: string;
  duration: number;
  teacherName: string;
  schoolName: string;
  createdAt: string;
  updatedAt: string;
  content: LessonPlanStepContent[];
  status: "draft" | "completed" | "published";
}

export interface LessonPlanStepContent {
  stepId: string;
  keywordContents: {
    keywordId: string;
    value: string;
  }[];
}
