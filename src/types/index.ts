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
  id: string | number;
  name: string;
  status: "ACTIVE" | "CANCELED" | "EXPIRED" | "TRIAL";
  duration_months: number;
  price: number;
  currency: "VND" | "USD";
  created_at: string;
  updated_at: string;
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

// Lesson Plan Template Types
export interface LessonPlanKeyword {
  id: string;
  title: string;
  content: string;
  prompt?: string;
  order: number;
  children?: LessonPlanKeyword[];
  nodeType?:
    | "SECTION"
    | "SUBSECTION"
    | "LIST_ITEM"
    | "PARAGRAPH"
    | "CONTENT"
    | "INPUT"
    | "REFERENCES"; // Map với backend NodeType
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
