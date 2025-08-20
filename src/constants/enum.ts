export enum EnumStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export enum LESSON_PLAN_TYPE {
  SECTION = "SECTION",
  SUBSECTION = "SUBSECTION",
  LIST_ITEM = "LIST_ITEM",
  PARAGRAPH = "PARAGRAPH",
}

export enum LESSON_PLAN_FIELDTYPE {
  INPUT = "INPUT",
  TABLE = "TABLE",
  REFERENCES = "REFERENCES",
}

export const LessonPlanNodeTypeLabel: Record<LESSON_PLAN_TYPE, string> = {
  [LESSON_PLAN_TYPE.SUBSECTION]: "Phần phụ",
  [LESSON_PLAN_TYPE.LIST_ITEM]: "Danh sách nội dung",
  [LESSON_PLAN_TYPE.PARAGRAPH]: "Nội dung",
  [LESSON_PLAN_TYPE.SECTION]: "Phần chính",
};

export const LessonPlanFieldTypeLabel: Record<LESSON_PLAN_FIELDTYPE, string> = {
  [LESSON_PLAN_FIELDTYPE.INPUT]: "Ô nhập liệu",
  [LESSON_PLAN_FIELDTYPE.TABLE]: "Bảng",
  [LESSON_PLAN_FIELDTYPE.REFERENCES]: "Tài liệu tham khảo",
};

// Hàm convert node type từ tiếng Anh sang tiếng Việt
export const convertNodeTypeToVietnamese = (type: string): string => {
  const typeMap: Record<string, string> = {
    SECTION: "Phần chính",
    SUBSECTION: "Phần phụ",
    LIST_ITEM: "Danh sách nội dung",
    PARAGRAPH: "Nội dung",
    TABLE: "Bảng",
    INPUT: "Ô nhập liệu",
    REFERENCES: "Tài liệu tham khảo",
  };

  return typeMap[type] || type;
};

// Hàm convert field type từ tiếng Anh sang tiếng Việt
export const convertFieldTypeToVietnamese = (fieldType: string): string => {
  const fieldTypeMap: Record<string, string> = {
    INPUT: "Ô nhập liệu",
    TABLE: "Bảng",
    REFERENCES: "Tài liệu tham khảo",
  };

  return fieldTypeMap[fieldType] || fieldType;
};

// Hàm convert tổng hợp cho cả node type và field type
export const convertToVietnamese = (
  type?: string,
  fieldType?: string
): { nodeType: string; fieldType: string } => {
  return {
    nodeType: type ? convertNodeTypeToVietnamese(type) : "",
    fieldType: fieldType ? convertFieldTypeToVietnamese(fieldType) : "",
  };
};

export enum ORDER_STATUS {
  PENDING = "PENDING", // Đang chờ thanh toán
  PAID = "PAID", // Đã thanh toán thành công (thay cho SUCCESS)
  FAILED = "FAILED", // Thất bại
  CANCELLED = "CANCELLED", // Đã hủy
  EXPIRED = "EXPIRED", // Đã hết hạn
  RETRY = "RETRY", // Đã thử thanh toán lại (tùy chọn, để theo dõi)
}

export const OrderStatusLabel: Record<ORDER_STATUS, string> = {
  [ORDER_STATUS.PENDING]: "Đang chờ thanh toán",
  [ORDER_STATUS.PAID]: "Đã thanh toán thành công",
  [ORDER_STATUS.FAILED]: "Thất bại",
  [ORDER_STATUS.CANCELLED]: "Đã hủy",
  [ORDER_STATUS.EXPIRED]: "Đã hết hạn",
  [ORDER_STATUS.RETRY]: "Đã thử thanh toán lại",
};

export type OrderStatus =
  | "PENDING"
  | "PAID"
  | "COMPLETED"
  | "CANCELLED"
  | "FAILED"
  | "EXPIRED"
  | "RETRY";

export const getOrderStatusLabel = (status: OrderStatus): string => {
  const labels: Record<OrderStatus, string> = {
    PENDING: "Đang chờ xử lý",
    PAID: "Thanh toán thành công",
    COMPLETED: "Hoàn thành",
    CANCELLED: "Đã hủy",
    FAILED: "Thất bại",
    EXPIRED: "Hết hạn",
    RETRY: "Thanh toán lại",
  };
  return labels[status];
};

export enum ROLE {
  TEACHER = "TEACHER",
  ADMIN = "ADMIN",
  STAFF = "STAFF",
  PARTNER = "PARTNER",
}

export enum DIFFICULTY_LEVEL {
  KNOWLEDGE = "KNOWLEDGE",
  COMPREHENSION = "COMPREHENSION",
  APPLICATION = "APPLICATION",
}
