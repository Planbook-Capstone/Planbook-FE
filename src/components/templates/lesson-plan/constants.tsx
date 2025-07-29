import { Heading1, Heading2, Images, List, Table, Type } from "lucide-react";
import { ComponentPaletteItem } from "./types";

// Function to create component palette with fresh React elements
export const getComponentPalette = (): ComponentPaletteItem[] => [
  {
    id: "section",
    type: "SECTION",
    fieldType: "INPUT",
    title: "Section",
    icon: <Heading1 />,
    description: "Thêm tiêu đề chính",
  },
  {
    id: "subsection",
    type: "SUBSECTION",
    fieldType: "INPUT",
    title: "Subsection",
    icon: <Heading2 />,
    description: "Thêm tiêu đề phụ",
  },
  {
    id: "paragraph",
    type: "PARAGRAPH",
    fieldType: "INPUT",
    title: "Text/Paragraph",
    icon: <Type />,
    description: "Thêm đoạn văn bản",
  },
  {
    id: "table",
    type: "TABLE",
    fieldType: "TABLE",
    title: "Table",
    icon: <Table />,
    description: "Thêm bảng dữ liệu",
  },
  {
    id: "list-item",
    type: "LIST_ITEM",
    fieldType: "INPUT",
    title: "List Item",
    icon: <List />,
    description: "Thêm mục danh sách",
  },
  {
    id: "image",
    type: "IMAGE",
    fieldType: "IMAGE",
    title: "Image",
    icon: <Images />,
    description: "Thêm hình ảnh",
  },
];

// Keep the constant for backward compatibility but use function when possible
export const COMPONENT_PALETTE = getComponentPalette();

export const DEFAULT_TABLE_DATA = {
  rows: [
    {
      id: "header-row",
      cells: [
        {
          id: "h1",
          title: "HOẠT ĐỘNG CỦA GIÁO VIÊN",
          content: "<p>Mô tả các hoạt động của giáo viên trong tiết học</p>",
          isHeader: true,
        },
        {
          id: "h2",
          title: "HOẠT ĐỘNG CỦA HỌC SINH",
          content: "<p>Mô tả các hoạt động của học sinh trong tiết học</p>",
          isHeader: true,
        },
      ],
    },
    {
      id: "row-1",
      cells: [
        {
          id: "r1c1",
          title: "Bước 1: Chuyển giao nhiệm vụ học tập",
          content: "",
        },
        {
          id: "r1c2",
          title: "Học sinh thực hiện các hoạt động được giao",
          content: "",
        },
      ],
    },
    {
      id: "row-2",
      cells: [
        {
          id: "r2c1",
          title: "Bước 2: Thực hiện nhiệm vụ",
          content: "",
        },
        {
          id: "r2c2",
          title: "Học sinh phản hồi và thảo luận",
          content: "",
        },
      ],
    },
  ],
  columns: 2,
};

export const WEBSOCKET_CONFIG = {
  url: "http://localhost:8085/websocket",
  topic: "/user/queue/notifications",
};

export const LESSON_PLAN_CONFIG = {
  defaultLessonPlanId: "8",
  toolId: "6ef43906-1899-4cec-b969-48957ba574ba",
  toolType: "INTERNAL",
};
