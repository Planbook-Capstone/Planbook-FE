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
  code?: string;
  href?: string;
};

export type TagResponse = {
  id: bigint;
  name: string;
  description: string | null;
};

export type ChapterResponse = {
  id: bigint;
  name: string;
  createdAt: string | null;
  status: string | null;
  updatedAt: string | null;
  bookId: bigint | null;
};

export type LessonResponse = {
  id: bigint;
  name: string;
  createdAt: string | null;
  status: string | null;
  updatedAt: string | null;
  chapterId: bigint | null;
};

// Types for slide template API
export type SlideTemplateStatus = "ACTIVE" | "INACTIVE";

export interface CreateSlideTemplateRequest {
  name: string;
  description?: string;
  textBlocks?: Record<string, any>;
  imageBlocks?: Record<string, string>;
}

export interface UpdateSlideTemplateRequest {
  name?: string;
  description?: string;
  textBlocks?: Record<string, any>;
  imageBlocks?: Record<string, string>;
}

export interface SlideTemplateResponse {
  id: any;
  name: string;
  status: SlideTemplateStatus;
  description?: string;
  textBlocks?: Record<string, any>;
  imageBlocks?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

// Helper types for form handling
export interface TextBlockItem {
  key: string;
  value: any;
}

export interface ImageBlockItem {
  key: string;
  value: string;
}

// Types for process JSON template API
export interface ProcessJsonTemplateRequest {
  lesson_id: string;
  template: Record<string, any>;
  config_prompt: string;
}

export interface SlideTemplate {
  id: string;
  name: string;
  description?: string;
  thumbnail?: string;
  category: "education" | "business" | "presentation" | "other";
  slides: SlideTemplateSlide[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  isPublic: boolean;
  tags: string[];
}

export interface SlideTemplateSlide {
  id: string;
  title: string;
  elements: SlideElement[];
  background?: string;
  isVisible: boolean;
}

export interface SlideTemplateFormData {
  name: string;
  description?: string;
  status: SlideTemplateStatus;
  imageBlocks: Record<string, string>;
}

// Export order types from separate file
export * from "./order";

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
  type: "DEPOSIT" | "WITHDRAWAL" | "PAYMENT" | "REFUND";
  description?: string;
  status: "PENDING" | "COMPLETED" | "FAILED" | "CANCELLED";
  createdAt: string;
  updatedAt: string;
}

// Wallet Transaction types (for token transactions)
export interface WalletTransaction {
  id: string;
  orderId: string;
  tokenBefore: number;
  tokenChange: number;
  type: "RECHARGE" | "TOOL_USAGE";
  description: string;
  createdAt: string;
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
  role: "PARTNER" | "STAFF" | "USER" | "ADMIN";
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

// Tool Result Response Type
export interface ToolResultResponse {
  id: number;
  name: string;
  description: string;
  type: string;
  status: "ACTIVE" | "DELETED" | "ARCHIVED" | "DRAFT";
  data: any[]; // Array of any data structure
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  userId: string;
  academicYearId: number;
  templateId: number | null;
  lessonIds: number[];
}

// Slide Editor Types
export interface TextStyle {
  fontSize: number;
  fontFamily: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  color?: string;
  textAlign?: "left" | "center" | "right";
  verticalAlign?: "top" | "middle" | "bottom";
}

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface TextElement {
  id: string;
  type: "text";
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  style: TextStyle;
  zIndex?: number;
  rotation?: number; // in degrees
}

export interface ImageElement {
  id: string;
  type: "image";
  x: number;
  y: number;
  width: number;
  height: number;
  src: string;
  alt?: string;
  zIndex?: number;
}

export interface VideoElement {
  id: string;
  type: "video";
  x: number;
  y: number;
  width: number;
  height: number;
  src: string;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
  zIndex?: number;
}

export interface ShapeElement {
  id: string;
  type: "shape";
  x: number;
  y: number;
  width: number;
  height: number;
  shapeType: "rectangle" | "circle" | "triangle" | "star";
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number; // 0 to 1
  zIndex?: number;
  rotation?: number; // in degrees
}

export interface TableElement {
  id: string;
  type: "table";
  x: number;
  y: number;
  width: number;
  height: number;
  headers: string[];
  rows: string[][];
  columnWidths?: number[]; // Width for each column
  rowHeights?: number[]; // Height for each row
  style?: {
    borderColor?: string;
    borderWidth?: number;
    headerBackgroundColor?: string;
    cellBackgroundColor?: string;
    textColor?: string;
    fontSize?: number;
    fontFamily?: string;
    textAlign?: "left" | "center" | "right";
  };
  cellStyles?: {
    // Individual cell styling
    [key: string]: {
      // key format: "row-col" e.g., "0-1"
      backgroundColor?: string;
      textColor?: string;
      fontSize?: number;
      fontWeight?: "normal" | "bold";
      textAlign?: "left" | "center" | "right";
    };
  };
  rowStyles?: {
    // Individual row styling
    [key: number]: {
      backgroundColor?: string;
      textColor?: string;
      fontSize?: number;
      fontWeight?: "normal" | "bold";
    };
  };
  zIndex?: number;
}

export type SlideElement =
  | TextElement
  | ImageElement
  | VideoElement
  | ShapeElement
  | TableElement;

export interface SlideData {
  id: string;
  elements: SlideElement[];
  background?: string;
}

// Interface for tool log data (matching API response)
export interface ToolLog {
  id: number;
  userId: string;
  toolId: string;
  lessonIds: string[];
  academicYearId: number;
  resultId: string | null;
  templateId: string | null;
  code: string;
  status: "SUCCESS" | "FAILED" | "PENDING";
  toolType: "EXTERNAL" | "INTERNAL";
  tokenUsed: number;
  input: any;
  output: any;
  createdAt: string;
  updatedAt: string;
}
