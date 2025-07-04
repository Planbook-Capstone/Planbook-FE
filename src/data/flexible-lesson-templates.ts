import { v4 as uuidv4 } from "uuid";
import { LessonPlanKeyword } from "@/types";

// Helper function to create flexible keywords
function createFlexibleKeyword(
  title: string,
  content: string = "",
  order: number = 0,
  children: LessonPlanKeyword[] = [],
  nodeType:
    | "SECTION"
    | "SUBSECTION"
    | "CONTENT"
    | "INPUT"
    | "REFERENCES" = "INPUT"
): LessonPlanKeyword {
  return {
    id: uuidv4(),
    title,
    content,
    order,
    children: children.length > 0 ? children : undefined,
    nodeType,
  };
}

// Flexible Chemistry Lesson Plan Template
export const flexibleChemistryTemplate = {
  id: "flexible-chemistry-template",
  name: "Mẫu Giáo án Hóa học Linh hoạt",
  description:
    "Template linh hoạt cho giáo án Hóa học với các loại field đa dạng",
  version: "1.0",
  isDefault: false,
  createdBy: "system",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  metadata: {
    subject: "Hóa học",
    grade: "Lớp 10-12",
    educationLevel: "THPT",
    framework: "Flexible Template",
  },
  nodes: [
    // SECTION 1: Thông tin chung
    createFlexibleKeyword(
      "Thông tin chung",
      "Điền các thông tin cơ bản về giáo án",
      1,
      [
        createFlexibleKeyword(
          "Tên giáo viên",
          "Nhập họ tên đầy đủ của giáo viên",
          1,
          [],
          "INPUT"
        ),
        createFlexibleKeyword(
          "Môn học",
          "Chọn môn học giảng dạy",
          2,
          [],
          "INPUT"
        ),
        createFlexibleKeyword(
          "Lớp",
          "Nhập lớp giảng dạy (VD: 10A1, 11B2)",
          3,
          [],
          "INPUT"
        ),
        createFlexibleKeyword(
          "Thời gian",
          "Nhập thời gian thực hiện bài học",
          4,
          [],
          "INPUT"
        ),
        createFlexibleKeyword(
          "Địa điểm",
          "Nhập địa điểm thực hiện",
          5,
          [],
          "INPUT"
        ),
      ],
      "SECTION"
    ),

    // SECTION 2: Mục tiêu bài học
    createFlexibleKeyword(
      "Mục tiêu bài học",
      "Xác định các mục tiêu kiến thức, kỹ năng và thái độ",
      2,
      [
        createFlexibleKeyword(
          "Mục tiêu chung",
          "Mô tả mục tiêu tổng quát của bài học",
          1,
          [],
          "CONTENT"
        ),
        createFlexibleKeyword(
          "Mục tiêu cụ thể",
          "",
          2,
          [
            createFlexibleKeyword(
              "Kiến thức",
              "Học sinh hiểu được các khái niệm, định luật",
              1,
              [
                createFlexibleKeyword(
                  "Khái niệm cơ bản",
                  "Định nghĩa các thuật ngữ",
                  1,
                  [],
                  "CONTENT"
                ),
                createFlexibleKeyword(
                  "Định luật",
                  "Các định luật áp dụng",
                  2,
                  [],
                  "CONTENT"
                ),
              ],
              "SUBSECTION"
            ),
            createFlexibleKeyword(
              "Kỹ năng",
              "Học sinh thực hiện được các thao tác",
              2,
              [
                createFlexibleKeyword(
                  "Kỹ năng thí nghiệm",
                  "Thực hiện thí nghiệm an toàn",
                  1,
                  [],
                  "CONTENT"
                ),
                createFlexibleKeyword(
                  "Kỹ năng tính toán",
                  "Giải bài tập",
                  2,
                  [],
                  "CONTENT"
                ),
              ],
              "SUBSECTION"
            ),
            createFlexibleKeyword(
              "Thái độ",
              "Học sinh có thái độ tích cực",
              3,
              [],
              "CONTENT"
            ),
          ],
          "SUBSECTION"
        ),
        createFlexibleKeyword(
          "Tài liệu tham khảo",
          "Upload hoặc chọn tài liệu từ thư viện",
          3,
          [],
          "REFERENCES"
        ),
      ],
      "SECTION"
    ),

    // SECTION 3: Chuẩn bị
    createFlexibleKeyword(
      "Chuẩn bị",
      "Liệt kê các thiết bị, dụng cụ và tài liệu cần thiết",
      3,
      [
        createFlexibleKeyword(
          "Thiết bị dạy học",
          "",
          1,
          [
            createFlexibleKeyword(
              "Máy chiếu",
              "Kiểm tra máy chiếu hoạt động tốt",
              1,
              [],
              "INPUT"
            ),
            createFlexibleKeyword(
              "Máy tính",
              "Chuẩn bị laptop/máy tính cho bài giảng",
              2,
              [],
              "INPUT"
            ),
            createFlexibleKeyword(
              "Bảng viết",
              "Chuẩn bị bút viết bảng, tẩy bảng",
              3,
              [],
              "INPUT"
            ),
          ],
          "SUBSECTION"
        ),
        createFlexibleKeyword(
          "Hóa chất và dụng cụ",
          "",
          2,
          [
            createFlexibleKeyword(
              "Hóa chất",
              "Liệt kê các hóa chất cần sử dụng",
              1,
              [
                createFlexibleKeyword(
                  "Hóa chất chính",
                  "Hóa chất chính cho thí nghiệm",
                  1,
                  [],
                  "CONTENT"
                ),
                createFlexibleKeyword(
                  "Hóa chất phụ",
                  "Hóa chất hỗ trợ",
                  2,
                  [],
                  "CONTENT"
                ),
              ],
              "SUBSECTION"
            ),
            createFlexibleKeyword(
              "Dụng cụ thí nghiệm",
              "Liệt kê các dụng cụ thí nghiệm",
              2,
              [],
              "CONTENT"
            ),
            createFlexibleKeyword(
              "An toàn thí nghiệm",
              "Lưu ý về an toàn khi thí nghiệm",
              3,
              [],
              "CONTENT"
            ),
          ],
          "SUBSECTION"
        ),
        createFlexibleKeyword(
          "Tài liệu học tập",
          "Upload slide, handout, bài tập",
          3,
          [],
          "REFERENCES"
        ),
      ],
      "SECTION"
    ),

    // SECTION 4: Hoạt động dạy học
    createFlexibleKeyword(
      "Hoạt động dạy học",
      "Mô tả chi tiết các hoạt động trong tiết học",
      4,
      [
        createFlexibleKeyword(
          "Hoạt động mở đầu",
          "",
          1,
          [
            createFlexibleKeyword(
              "Kiểm tra bài cũ",
              "Câu hỏi ôn tập kiến thức đã học",
              1,
              [],
              "CONTENT"
            ),
            createFlexibleKeyword(
              "Tạo tình huống",
              "Đặt vấn đề để dẫn dắt vào bài mới",
              2,
              [],
              "CONTENT"
            ),
            createFlexibleKeyword(
              "Thời gian",
              "Thời gian dành cho hoạt động mở đầu",
              3,
              [],
              "INPUT"
            ),
          ],
          "SUBSECTION"
        ),
        createFlexibleKeyword(
          "Hoạt động hình thành kiến thức",
          "",
          2,
          [
            createFlexibleKeyword(
              "Thí nghiệm minh họa",
              "Mô tả thí nghiệm và hiện tượng quan sát",
              1,
              [],
              "CONTENT"
            ),
            createFlexibleKeyword(
              "Giải thích lý thuyết",
              "Trình bày các khái niệm, định luật",
              2,
              [],
              "CONTENT"
            ),
            createFlexibleKeyword(
              "Ví dụ minh họa",
              "Đưa ra các ví dụ cụ thể",
              3,
              [],
              "CONTENT"
            ),
            createFlexibleKeyword(
              "Thời gian",
              "Thời gian dành cho hoạt động này",
              4,
              [],
              "INPUT"
            ),
          ],
          "SUBSECTION"
        ),
        createFlexibleKeyword(
          "Hoạt động luyện tập",
          "",
          3,
          [
            createFlexibleKeyword(
              "Bài tập áp dụng",
              "Các bài tập củng cố kiến thức",
              1,
              [],
              "CONTENT"
            ),
            createFlexibleKeyword(
              "Thảo luận nhóm",
              "Tổ chức thảo luận giữa các nhóm học sinh",
              2,
              [],
              "CONTENT"
            ),
            createFlexibleKeyword(
              "Thời gian",
              "Thời gian dành cho luyện tập",
              3,
              [],
              "INPUT"
            ),
          ],
          "SUBSECTION"
        ),
        createFlexibleKeyword(
          "Video bài giảng",
          "Upload video minh họa hoặc chọn từ thư viện",
          4,
          [],
          "REFERENCES"
        ),
      ],
      "SECTION"
    ),

    // SECTION 5: Đánh giá
    createFlexibleKeyword(
      "Đánh giá",
      "Phương pháp đánh giá kết quả học tập",
      5,
      [
        createFlexibleKeyword(
          "Đánh giá quá trình",
          "Quan sát thái độ học tập của học sinh",
          1,
          [],
          "CONTENT"
        ),
        createFlexibleKeyword(
          "Đánh giá kết quả",
          "Kiểm tra kiến thức thông qua câu hỏi, bài tập",
          2,
          [],
          "CONTENT"
        ),
        createFlexibleKeyword(
          "Tiêu chí đánh giá",
          "",
          3,
          [
            createFlexibleKeyword(
              "Kiến thức",
              "Mức độ hiểu bài của học sinh",
              1,
              [],
              "INPUT"
            ),
            createFlexibleKeyword(
              "Kỹ năng",
              "Khả năng vận dụng kiến thức",
              2,
              [],
              "INPUT"
            ),
            createFlexibleKeyword(
              "Thái độ",
              "Sự tích cực trong học tập",
              3,
              [],
              "INPUT"
            ),
          ],
          "SUBSECTION"
        ),
        createFlexibleKeyword(
          "Đề kiểm tra",
          "Upload đề kiểm tra hoặc chọn từ ngân hàng đề",
          4,
          [],
          "REFERENCES"
        ),
      ],
      "SECTION"
    ),

    // SECTION 6: Dặn dò
    createFlexibleKeyword(
      "Dặn dò",
      "Hướng dẫn học sinh chuẩn bị cho bài học tiếp theo",
      6,
      [
        createFlexibleKeyword(
          "Bài tập về nhà",
          "Giao bài tập để học sinh làm ở nhà",
          1,
          [],
          "CONTENT"
        ),
        createFlexibleKeyword(
          "Chuẩn bị bài mới",
          "Hướng dẫn học sinh đọc trước bài mới",
          2,
          [],
          "CONTENT"
        ),
        createFlexibleKeyword(
          "Tài liệu tham khảo",
          "Gợi ý sách, tài liệu để học sinh tự học",
          3,
          [],
          "REFERENCES"
        ),
      ],
      "SECTION"
    ),
  ],
};

// Export default template
export const defaultFlexibleTemplate = flexibleChemistryTemplate;
