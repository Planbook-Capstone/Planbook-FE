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

export enum ORDER_STATUS {
  PENDING = "PENDING",        // Đang chờ thanh toán
  PAID = "PAID",             // Đã thanh toán thành công (thay cho SUCCESS)
  FAILED = "FAILED",         // Thất bại
  CANCELLED = "CANCELLED",   // Đã hủy
  EXPIRED = "EXPIRED",       // Đã hết hạn
  RETRY = "RETRY"           // Đã thử thanh toán lại (tùy chọn, để theo dõi)
}

export const OrderStatusLabel: Record<ORDER_STATUS, string> = {
  [ORDER_STATUS.PENDING]: "Đang chờ thanh toán",
  [ORDER_STATUS.PAID]: "Đã thanh toán thành công",
  [ORDER_STATUS.FAILED]: "Thất bại",
  [ORDER_STATUS.CANCELLED]: "Đã hủy",
  [ORDER_STATUS.EXPIRED]: "Đã hết hạn",
  [ORDER_STATUS.RETRY]: "Đã thử thanh toán lại",
};

export type OrderStatus = "PENDING" | "PAID" | "COMPLETED" | "CANCELLED" | "FAILED" | "EXPIRED";

export const getOrderStatusLabel = (status: OrderStatus): string => {
  const labels: Record<OrderStatus, string> = {
    PENDING: "Đang chờ xử lý",
    PAID: "Thanh toán thành công",
    COMPLETED: "Hoàn thành",
    CANCELLED: "Đã hủy",
    FAILED: "Thất bại",
    EXPIRED: "Hết hạn",
  };
  return labels[status];
};

export enum ROLE {
  TEACHER = "TEACHER",
  ADMIN = "ADMIN",
  STAFF = "STAFF",
  PARTNER = "PARTNER",
}

