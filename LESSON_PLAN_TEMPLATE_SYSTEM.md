# Hệ Thống Template Giáo Án Động

## Tổng Quan

Hệ thống Template Giáo Án Động là một giải pháp toàn diện cho việc tạo và quản lý các template giáo án với khả năng tùy chỉnh cao. Hệ thống hỗ trợ cấu trúc phân cấp, drag & drop, và preview realtime.

## Tính Năng Chính

### 🎯 Cấu Trúc Động
- **Steps (Bước)**: Các mục chính trong giáo án (I. Mục tiêu, II. Thiết bị, III. Tiến trình, etc.)
- **Keywords (Từ khóa)**: Các mục con trong từng step với khả năng nested tối đa 3 cấp
- **Drag & Drop**: Sắp xếp steps và keywords bằng kéo thả

### 👥 Phân Quyền Rõ Ràng
- **Admin**: Định nghĩa các steps chính và cấu trúc template
- **Academic Staff**: Tạo keywords và nội dung chi tiết cho từng step

### 📋 Template Mẫu
- Template Hóa học chuẩn theo GDPT 2018
- Template cơ bản cho mọi môn học
- Khả năng import/export template dạng JSON

### 🔄 Preview Realtime
- Xem trước template theo định dạng giáo án chuẩn
- Chuyển đổi giữa chế độ chỉnh sửa và preview

## Cấu Trúc Dữ Liệu

### LessonPlanTemplate
```typescript
interface LessonPlanTemplate {
  id: string;
  name: string;
  description: string;
  version: string;
  isDefault: boolean;
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
```

### LessonPlanStep
```typescript
interface LessonPlanStep {
  id: string;
  title: string;
  description?: string;
  isRequired: boolean;
  order: number;
  keywords: LessonPlanKeyword[];
  stepType: 'general_info' | 'objectives' | 'equipment' | 'activities' | 'custom';
  timeAllocation?: number;
  children?: LessonPlanStep[];
}
```

### LessonPlanKeyword
```typescript
interface LessonPlanKeyword {
  id: string;
  title: string;
  content: string;
  prompt?: string;
  order: number;
  children?: LessonPlanKeyword[];
}
```

## Hướng Dẫn Sử Dụng

### 1. Truy Cập Hệ Thống
```
http://localhost:3001/admin/lesson-plan-template
```

### 2. Tạo Template Mới
1. Nhấn nút "Tạo Template Mới"
2. Nhập tên và mô tả template
3. Thêm các steps (bước) cần thiết
4. Tạo keywords cho từng step
5. Sử dụng drag & drop để sắp xếp
6. Preview và lưu template

### 3. Sử Dụng Template Có Sẵn
1. Chọn template từ danh sách "Template Có Sẵn"
2. Nhấn "Sử dụng Template"
3. Tùy chỉnh theo nhu cầu
4. Lưu với tên mới

### 4. Import/Export Template
- **Export**: Template được lưu dưới dạng JSON
- **Import**: Upload file JSON để import template

## Cấu Trúc Template Mẫu

### Template Hóa Học Chuẩn

```
📋 Thông tin chung
├── Tên GV
├── Tên Trường  
├── Bài
├── Thời Gian
└── Lớp

📋 I. Mục tiêu
├── 1. Kiến thức
│   ├── Nhận biết và trình bày được khái niệm
│   ├── Hiểu được bản chất của hiện tượng
│   └── Phân biệt được các loại
├── 2. Năng lực
│   ├── 2.1. Năng lực chung
│   └── 2.2. Năng lực hóa học
└── 3. Phẩm chất
    ├── Trách nhiệm
    ├── Trung thực
    └── Chăm chỉ

📋 II. Thiết bị dạy học và học liệu
├── 1. Giáo viên
│   ├── Hình ảnh, video
│   ├── Công cụ dạy học
│   └── SGK
└── 2. Học sinh
    ├── SGK
    └── Đồ dùng học tập

📋 III. TIẾN TRÌNH DẠY HỌC
├── 1. Hoạt động 1: Khởi động
├── 2. Hoạt động 2: Hình thành kiến thức mới
├── 3. Hoạt động 3: Luyện tập
└── 4. Hoạt động 4: Vận dụng
```

## Các Component Chính

### 1. LessonPlanTemplateBuilder
- Component chính quản lý toàn bộ quá trình tạo template
- Tích hợp drag & drop context
- Quản lý state và metadata

### 2. StepSection
- Quản lý từng step trong template
- Hỗ trợ expand/collapse
- Tích hợp với KeywordManager

### 3. KeywordManager
- Quản lý keywords với cấu trúc nested
- Drag & drop cho keywords
- Editor cho content và AI prompt

### 4. LessonPlanTemplatePreview
- Preview template theo định dạng chuẩn
- Hiển thị cấu trúc phân cấp
- Thông tin metadata và thống kê

## Công Nghệ Sử Dụng

- **Framework**: Next.js 15.3.2 với TypeScript
- **UI Library**: Radix UI + Tailwind CSS
- **Drag & Drop**: @hello-pangea/dnd
- **State Management**: React Context API
- **Icons**: Lucide React

## Tính Năng Nâng Cao

### 1. AI Integration
- Prompt field cho mỗi keyword
- Hỗ trợ AI tạo nội dung tự động

### 2. Validation
- Kiểm tra các step bắt buộc
- Validation cấu trúc template

### 3. Responsive Design
- Tối ưu cho desktop và mobile
- Adaptive layout

### 4. Performance
- Lazy loading components
- Optimized re-renders
- Efficient drag & drop

## Mở Rộng Tương Lai

### 1. Collaboration
- Real-time editing
- Comment system
- Version control

### 2. Advanced Features
- Template marketplace
- Advanced search & filter
- Bulk operations

### 3. Integration
- LMS integration
- Export to Word/PDF
- Calendar integration

## Troubleshooting

### Lỗi Thường Gặp

1. **Drag & Drop không hoạt động**
   - Kiểm tra @hello-pangea/dnd đã được cài đặt
   - Đảm bảo DragDropContext được wrap đúng

2. **Template không lưu**
   - Kiểm tra validation
   - Đảm bảo có ít nhất 1 step

3. **Preview không hiển thị**
   - Kiểm tra cấu trúc dữ liệu
   - Đảm bảo keywords có title

## Liên Hệ & Hỗ Trợ

Để được hỗ trợ hoặc đóng góp ý kiến, vui lòng liên hệ team phát triển.
