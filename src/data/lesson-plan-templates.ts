import { v4 as uuidv4 } from "uuid";
import { LessonPlanTemplate, LessonPlanStep, LessonPlanKeyword } from "@/types";

// Helper function to create keywords with children
function createKeyword(
  title: string,
  content: string = "",
  order: number = 0,
  children: LessonPlanKeyword[] = [],
  nodeType: "SECTION" | "SUBSECTION" | "LIST_ITEM" | "PARAGRAPH" = "LIST_ITEM",
  fieldType: "INPUT" | "REFERENCES" | "TABLE" | null
): LessonPlanKeyword {
  return {
    id: uuidv4(),
    title,
    content,
    order,
    children: children.length > 0 ? children : undefined,
    nodeType,
    fieldType,
  };
}

// Helper function to create steps
function createStep(
  title: string,
  stepType: LessonPlanStep["stepType"],
  isRequired: boolean = true,
  order: number = 0,
  keywords: LessonPlanKeyword[] = [],
  description?: string,
  timeAllocation?: number
): LessonPlanStep {
  return {
    id: uuidv4(),
    title,
    description,
    isRequired,
    order,
    keywords,
    stepType,
    timeAllocation,
  };
}

// Standard Chemistry Lesson Plan Template
export const standardChemistryTemplate: LessonPlanTemplate = {
  id: uuidv4(),
  name: "Template Giáo Án Hóa Học Chuẩn",
  description:
    "Template chuẩn cho giáo án môn Hóa học theo chương trình GDPT 2018",
  version: "1.0",
  isDefault: true,
  createdBy: "system",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  metadata: {
    subject: "Hóa học",
    educationLevel: "THPT",
    framework: "GDPT 2018",
  },
  steps: [
    // Thông tin chung
    createStep(
      "Thông tin chung",
      "general_info",
      true,
      0,
      [
        createKeyword("Tên GV", "", 0),
        createKeyword("Tên Trường", "", 1),
        createKeyword("Bài", "", 2),
        createKeyword("Thời Gian", "", 3),
        createKeyword("Lớp", "", 4),
      ],
      "Thông tin cơ bản về bài giảng"
    ),

    // Mục tiêu
    createStep(
      "I. Mục tiêu",
      "objectives",
      true,
      1,
      [
        createKeyword(
          "1. Kiến thức",
          "",
          0,
          [
            createKeyword(
              "Nhận biết và trình bày được khái niệm…",
              "",
              0,
              [],
              "PARAGRAPH"
            ),
            createKeyword(
              "Hiểu được bản chất của hiện tượng/sự vật…",
              "",
              1,
              [],
              "PARAGRAPH"
            ),
            createKeyword("Phân biệt được các loại…", "", 2, [], "LIST_ITEM"),
            createKeyword(
              "Vận dụng kiến thức để giải thích…",
              "",
              3,
              [],
              "PARAGRAPH"
            ),
            createKeyword(
              "Phân tích được ưu điểm/nhược điểm của…",
              "",
              4,
              [],
              "LIST_ITEM"
            ),
            createKeyword("So sánh được đặc điểm của…", "", 5, [], "LIST_ITEM"),
            createKeyword(
              "Ứng dụng kiến thức đã học vào thực tiễn…",
              "",
              6,
              [],
              "PARAGRAPH"
            ),
          ],
          "SECTION"
        ),
        createKeyword("2. Năng lực", "", 1, [
          createKeyword("2.1. Năng lực chung", "", 0, [
            createKeyword("Năng lực tự chủ và tự học: ...", "", 0),
            createKeyword("Năng lực giao tiếp và hợp tác: ...", "", 1),
            createKeyword("Giải quyết vấn đề và sáng tạo: ...", "", 2),
          ]),
          createKeyword("2.2. Năng lực hóa học", "", 1, [
            createKeyword("a. Nhận thức hóa học", "", 0, [
              createKeyword("Nhận biết, mô tả hiện tượng hóa học", "", 0),
              createKeyword("Hiểu được các khái niệm chuyên ngành", "", 1),
            ]),
            createKeyword("b. Tìm hiểu tự nhiên dưới góc độ hóa học", "", 1),
            createKeyword(
              "c. Vận dụng kiến thức, kĩ năng đã học để giải thích được",
              "",
              2
            ),
          ]),
        ]),
        createKeyword("3. Phẩm chất", "", 2, [
          createKeyword("Trách nhiệm:", "", 0),
          createKeyword("Trung thực:", "", 1),
          createKeyword("Chăm chỉ:", "", 2),
          createKeyword("Nhân ái:", "", 3),
        ]),
      ],
      "Mục tiêu kiến thức, năng lực và phẩm chất"
    ),

    // Thiết bị dạy học
    createStep(
      "II. Thiết bị dạy học và học liệu",
      "equipment",
      true,
      2,
      [
        createKeyword("1. Giáo viên", "", 0, [
          createKeyword("Một số hình ảnh:", "", 0),
          createKeyword("Video mô hình nguyên tử", "", 1),
          createKeyword("Công cụ dạy học ..", "", 2),
          createKeyword("SGK nào", "", 3),
        ]),
        createKeyword("2. Học sinh", "", 1, [
          createKeyword("SGK", "", 0),
          createKeyword("Đồ dùng học tập", "", 1),
          createKeyword("Bảng tuần hoàn nguyên tố hóa học", "", 2),
        ]),
      ],
      "Thiết bị và tài liệu cần thiết cho bài học"
    ),

    // Tiến trình dạy học
    createStep(
      "III. TIẾN TRÌNH DẠY HỌC",
      "activities",
      true,
      3,
      [
        createKeyword("1. Hoạt động 1: Khởi động", "X phút", 0, [
          createKeyword(
            "a. Mục tiêu",
            "Tạo hứng thú và kích thích sự tò mò của học sinh",
            0
          ),
          createKeyword("b. Nội dung", "", 1, [
            createKeyword("CÂU HỎI KHỞI ĐỘNG:", "", 0),
            createKeyword("Hình ảnh, video", "", 1),
            createKeyword("Mô hình", "", 2),
            createKeyword("Câu đố", "", 3),
          ]),
          createKeyword("c. Sản phẩm", "DỰ KIẾN TRẢ LỜI CÂU HỎI KHỞI ĐỘNG", 2),
          createKeyword("d. Tổ chức thực hiện", "", 3, [
            createKeyword("HOẠT ĐỘNG CỦA GIÁO VIÊN", "", 0, [
              createKeyword("Bước 1: Chuyển giao nhiệm vụ học tập", "", 0),
              createKeyword("Bước 2: Thực hiện nhiệm vụ", "", 1),
              createKeyword("Bước 3: Báo cáo kết quả và thảo luận", "", 2),
              createKeyword("Bước 4: Kết luận và nhận định", "", 3),
            ]),
            createKeyword("HOẠT ĐỘNG CỦA HỌC SINH", "", 1, [
              createKeyword("Lắng nghe, nhận nhiệm vụ", "", 0),
              createKeyword("Thảo luận, nghiên cứu, quan sát", "", 1),
              createKeyword("Trình bày kết quả thảo luận", "", 2),
              createKeyword("Lắng nghe, tiếp thu nhận xét", "", 3),
            ]),
          ]),
        ]),
        createKeyword("2. Hoạt động 2: Hình thành kiến thức mới", "X phút", 1),
        createKeyword("3. Hoạt động 3: Luyện tập", "X phút", 2),
        createKeyword("4. Hoạt động 4: Vận dụng", "X phút", 3),
      ],
      "Các hoạt động trong tiến trình dạy học",
      45
    ),
  ],
};

// Basic Template
export const basicTemplate: LessonPlanTemplate = {
  id: uuidv4(),
  name: "Template Cơ Bản",
  description: "Template đơn giản cho mọi môn học",
  version: "1.0",
  isDefault: false,
  createdBy: "system",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  metadata: {},
  steps: [
    createStep("Thông tin chung", "general_info", true, 0),
    createStep("Mục tiêu bài học", "objectives", true, 1),
    createStep("Nội dung bài học", "custom", true, 2),
    createStep("Hoạt động học tập", "activities", true, 3),
  ],
};

// All available templates
export const predefinedTemplates: LessonPlanTemplate[] = [
  standardChemistryTemplate,
  basicTemplate,
];

// Function to get template by ID
export function getTemplateById(id: string): LessonPlanTemplate | undefined {
  return predefinedTemplates.find((template) => template.id === id);
}

// Function to get default template
export function getDefaultTemplate(): LessonPlanTemplate {
  return (
    predefinedTemplates.find((template) => template.isDefault) || basicTemplate
  );
}
