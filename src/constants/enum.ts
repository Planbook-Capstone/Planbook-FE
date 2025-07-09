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