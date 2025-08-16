# 📚 PlanBook - Hệ thống Quản lý Giáo án Thông minh

<div align="center">

![PlanBook Logo](./public/Planbook.svg)

**Nền tảng tạo và quản lý các tool tự động với AI**

[![Next.js](https://img.shields.io/badge/Next.js-15.4.4-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.7-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.9.0-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)

</div>

## 🎯 Giới thiệu

PlanBook là một hệ thống quản lý giáo án thông minh được phát triển cho các giáo viên và cơ sở giáo dục. Ứng dụng cung cấp các công cụ AI mạnh mẽ để tạo giáo án, đề thi, và quản lý tài liệu giảng dạy một cách hiệu quả.

### ✨ Tính năng chính

- 🤖 **Tạo giáo án tự động** với AI
- 📝 **Tạo đề thi thông minh** từ ngân hàng câu hỏi
- 📚 **Quản lý tài liệu** và sách giáo khoa
- 🎯 **Chấm điểm tự động** với AI
- 💬 **Chat AI** hỗ trợ giảng dạy
- 📊 **Thống kê và báo cáo** chi tiết
- 🔐 **Phân quyền người dùng** (Admin, Staff, Teacher)
- 📱 **Giao diện responsive** trên mọi thiết bị

## 🛠️ Công nghệ sử dụng

### Frontend

- **Framework**: Next.js 15.4.4 (App Router)
- **UI Library**: React 19.0.0
- **Language**: TypeScript 5.0
- **Styling**: TailwindCSS 4.1.7
- **UI Components**: Radix UI, Ant Design
- **State Management**: Zustand 5.0.6
- **Data Fetching**: TanStack Query 5.80.6

### Backend Integration

- **Database ORM**: Prisma 6.9.0 (MySQL)
- **HTTP Client**: Axios 1.9.0
- **Real-time**: WebSocket với STOMP/SockJS
- **Authentication**: JWT với Google OAuth

### Development Tools

- **Linting**: ESLint 9
- **Package Manager**: npm/yarn/pnpm/bun
- **Containerization**: Docker & Docker Compose
- **Deployment**: Standalone build cho production

## 🚀 Cài đặt và Chạy dự án

### Yêu cầu hệ thống

- Node.js 18+
- npm/yarn/pnpm/bun
- MySQL 8.0+
- Docker (tùy chọn)

### 1. Clone repository

```bash
git clone <repository-url>
cd planbookfe
```

### 2. Cài đặt dependencies

```bash
npm install
# hoặc
yarn install
# hoặc
pnpm install
# hoặc
bun install
```

### 3. Cấu hình môi trường

Tạo file `.env.local` từ `.env.example`:

```bash
cp .env.example .env.local
```

Cập nhật các biến môi trường:

```env
# Database
NEXT_DATABASE_URL="mysql://username:password@localhost:3306/planbook"

# API Endpoints
NEXT_PUBLIC_API_URL="http://localhost:8080"
NEXT_PUBLIC_API_SECONDARY_URL="http://localhost:8000"
NEXT_PUBLIC_WEBSOCKET_URL="ws://localhost:8080/ws"

# Authentication
NEXT_PUBLIC_REDIRECT_URL="http://localhost:3000"

# Supabase (nếu sử dụng)
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
```

### 4. Thiết lập Database

```bash
# Generate Prisma Client
npm run prisma:generate

# Đồng bộ schema với database
npx prisma db push --schema=src/prisma/schema.prisma

# Mở Prisma Studio (tùy chọn)
npx prisma studio --schema=src/prisma/schema.prisma
```

### 5. Chạy ứng dụng

```bash
# Development mode
npm run dev

# Production build
npm run build
npm run start
```

Truy cập ứng dụng tại: [http://localhost:3000](http://localhost:3000)

## 🐳 Chạy với Docker

### Development

```bash
docker-compose up -d
```

### Production

```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 📁 Cấu trúc dự án

```
planbookfe/
├── 📁 src/
│   ├── 📁 app/                    # Next.js App Router
│   │   ├── 📁 (tools)/           # Nhóm route công cụ
│   │   ├── 📁 admin/             # Trang quản trị
│   │   ├── 📁 auth/              # Xác thực
│   │   ├── 📁 auto-grading/      # Chấm điểm tự động
│   │   ├── 📁 exam/              # Thi trực tuyến
│   │   ├── 📁 home/              # Trang chủ
│   │   ├── 📁 staff/             # Trang nhân viên
│   │   └── 📁 tool-manager/      # Quản lý công cụ
│   ├── 📁 components/            # React Components
│   │   ├── 📁 atoms/             # Component cơ bản
│   │   ├── 📁 molecules/         # Component trung bình
│   │   ├── 📁 organisms/         # Component phức tạp
│   │   ├── 📁 templates/         # Template layouts
│   │   └── 📁 ui/                # UI Components
│   ├── 📁 hooks/                 # Custom React Hooks
│   ├── 📁 services/              # API Services
│   ├── 📁 store/                 # Zustand Store
│   ├── 📁 types/                 # TypeScript Types
│   ├── 📁 utils/                 # Utility Functions
│   ├── 📁 constants/             # Hằng số
│   ├── 📁 config/                # Cấu hình
│   ├── 📁 prisma/                # Prisma Schema
│   └── 📁 styles/                # Global Styles
├── 📁 public/                    # Static Assets
├── 📁 docs/                      # Tài liệu
├── 📄 package.json               # Dependencies
├── 📄 next.config.ts             # Next.js Config
├── 📄 tailwind.config.js         # TailwindCSS Config
├── 📄 tsconfig.json              # TypeScript Config
├── 📄 docker-compose.yml         # Docker Compose
└── 📄 README.md                  # Tài liệu này
```

## 🔧 Scripts có sẵn

```bash
# Development
npm run dev              # Chạy development server với Turbopack
npm run build            # Build production
npm run start            # Chạy production server
npm run lint             # Kiểm tra linting

# Database
npm run prisma:generate  # Generate Prisma Client
npm run db:pull          # Pull schema từ database
npm run db:push          # Push schema lên database
npm run db:studio        # Mở Prisma Studio

# Docker
npm run build:docker     # Build với Prisma generate
```

## 🎨 Hướng dẫn phát triển

### Component Architecture

Dự án sử dụng **Atomic Design Pattern**:

- **Atoms**: Button, Input, Label...
- **Molecules**: SearchBox, FormField...
- **Organisms**: Header, Sidebar, DataTable...
- **Templates**: Layout structures
- **Pages**: Complete pages

### State Management

Sử dụng **Zustand** cho global state:

```typescript
import { useAppStore } from "@/store";

function MyComponent() {
  const { user, setUser, isAuthenticated } = useAppStore();

  if (!isAuthenticated()) {
    return <div>Chưa đăng nhập</div>;
  }

  return <div>Xin chào {user?.fullName}</div>;
}
```

### API Integration

```typescript
import { useQuery } from "@tanstack/react-query";
import { api } from "@/config/axios";

function useBooks() {
  return useQuery({
    queryKey: ["books"],
    queryFn: () => api.get("/books").then((res) => res.data),
  });
}
```

## 🔐 Authentication & Authorization

### Roles

- **ADMIN**: Quản trị hệ thống
- **STAFF**: Nhân viên quản lý
- **TEACHER**: Giáo viên sử dụng

### Protected Routes

```typescript
import { useAuth } from "@/hooks/useAuth";

function ProtectedPage() {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) {
    return <div>Vui lòng đăng nhập</div>;
  }

  if (!isAdmin) {
    return <div>Không có quyền truy cập</div>;
  }

  return <AdminDashboard />;
}
```

## 📊 Database Schema

Dự án sử dụng MySQL với Prisma ORM. Các bảng chính:

- `users`: Người dùng
- `academic_year`: Năm học
- `work_space`: Không gian làm việc
- `lesson_plan_template`: Template giáo án
- `question_bank`: Ngân hàng câu hỏi
- `exam_instance`: Phiên thi

## 🚀 Deployment

### Production Build

```bash
npm run build
npm run start
```

### Docker Deployment

```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Environment Variables

Đảm bảo cấu hình đúng các biến môi trường production trong `.env.production`.

## 🤝 Đóng góp

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Liên hệ

- **Team**: PlanBook Development Team
- **Email**: contact@planbook.edu.vn
- **Website**: [https://planbook.edu.vn](https://planbook.edu.vn)

---

<div align="center">
  <p>Made with ❤️ by PlanBook Team</p>
</div>
