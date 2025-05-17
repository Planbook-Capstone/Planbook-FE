# HƯỚNG DẪN CẤU TRÚC DỰ ÁN PLANBOOK

## Giới thiệu

Đây là hướng dẫn chi tiết về cấu trúc dự án PlanBook, được xây dựng trên nền tảng Next.js 15.3.2 với TypeScript. Tài liệu này sẽ giúp các thành viên trong team hiểu rõ về cấu trúc dự án và cách thức làm việc với nó.

## Công nghệ sử dụng

- **Framework**: Next.js 15.3.2
- **Ngôn ngữ**: TypeScript
- **UI Library**: React 19.0.0
- **Styling**: TailwindCSS 4.0
- **State Management**: Context API (có thể thay thế bằng Redux, Zustand, Jotai...)
- **Development Tools**: ESLint, TypeScript

## Cấu trúc thư mục

```
│
├── .env.local                  # Biến môi trường
├── next.config.ts              # Cấu hình Next.js
├── package.json                # Các dependency của dự án
├── tailwind.config.ts          # Cấu hình TailwindCSS
├── tsconfig.json               # Cấu hình TypeScript
├── postcss.config.ts           # Cấu hình PostCSS
│
├── public/                     # Tài nguyên tĩnh
│   ├── images/                 # Hình ảnh
│   │   ├── logo.png            # Logo trang web
│   │   └── products/           # Hình ảnh sản phẩm
│   │       └── banners/        # Banner sản phẩm
│   └── fonts/                  # Font chữ
│
├── src/
│   ├── app/                    # Các trang theo Next.js App Router
│   │   ├── layout.tsx          # Layout chính
│   │   └── page.tsx            # Trang chủ
│   ├── components/             # Các component React
│   │   ├── layout/             # Component layout
│   │   ├── ui/                 # Component UI cơ bản
│   │   ├── products/           # Component liên quan đến sản phẩm
│   │   ├── cart/               # Component liên quan đến giỏ hàng
│   │   ├── checkout/           # Component liên quan đến thanh toán
│   │   └── auth/               # Component liên quan đến xác thực
│   ├── hooks/                  # Custom React hooks
│   │   └── useLocalStorage.ts  # Hook để làm việc với localStorage
│   ├── lib/                    # Các hàm tiện ích
│   │   └── utils.ts            # Các hàm tiện ích chung
│   ├── services/               # Các service gọi API
│   │   └── api.ts              # Client gọi API
│   ├── store/                  # Quản lý state
│   │   └── index.tsx           # Context API setup
│   ├── types/                  # Định nghĩa kiểu dữ liệu TypeScript
│   │   └── index.ts            # Các kiểu dữ liệu chung
│   ├── constants/              # Các hằng số
│   │   └── index.ts            # Định nghĩa hằng số
│   ├── styles/                 # Style toàn cục
│   │   └── globals.css         # CSS toàn cục
│   ├── prisma/                 # Prisma ORM
│   │   └── schema.prisma       # Schema cơ sở dữ liệu
│   └── middleware.ts           # Next.js middleware
```

## Quy tắc quan trọng khi làm việc với Next.js 15 App Router

### 1. Server Components vs Client Components

Next.js 15 sử dụng React Server Components làm mặc định. Điều này có nghĩa là:

- **Server Components**: 
  - Mặc định, tất cả các component trong Next.js 15 đều là server components
  - Không thể sử dụng React hooks (useState, useEffect, useContext...)
  - Không thể sử dụng browser APIs
  - Không thể sử dụng event handlers (onClick, onChange...)
  - Ưu điểm: hiệu suất tốt hơn, SEO tốt hơn

- **Client Components**:
  - Phải được đánh dấu bằng directive `"use client"` ở đầu file
  - Có thể sử dụng tất cả các tính năng của React
  - Nên sử dụng khi cần tương tác người dùng, hooks, hoặc browser APIs

### 2. Cách sử dụng "use client" directive

```typescript
"use client";

import React, { useState } from 'react';

export default function MyComponent() {
  const [count, setCount] = useState(0);
  
  return (
    <button onClick={() => setCount(count + 1)}>
      Đã nhấn {count} lần
    </button>
  );
}
```

**Lưu ý quan trọng**: Khi một component được đánh dấu là client component, tất cả các component con của nó cũng sẽ được xem là client components, ngay cả khi chúng không có directive `"use client"`.

### 3. Khi nào sử dụng Server Components và Client Components

- **Sử dụng Server Components cho**:
  - Các component chỉ hiển thị dữ liệu tĩnh
  - Các component không cần tương tác người dùng
  - Các component không cần sử dụng React hooks
  - Các component cần fetch dữ liệu từ server

- **Sử dụng Client Components cho**:
  - Các component cần tương tác người dùng (form, button...)
  - Các component sử dụng React hooks (useState, useEffect...)
  - Các component sử dụng browser APIs
  - Các component cần sử dụng context providers

## Hướng dẫn làm việc với các thư mục chính

### 1. Thư mục `app`

Đây là nơi chứa các trang của ứng dụng theo cấu trúc App Router của Next.js 15:

- Mỗi thư mục đại diện cho một route
- File `page.tsx` trong mỗi thư mục sẽ là component được render cho route đó
- File `layout.tsx` định nghĩa layout chung cho các trang con
- File `loading.tsx` hiển thị trạng thái loading
- File `error.tsx` hiển thị trạng thái lỗi
- File `not-found.tsx` hiển thị trang 404

Ví dụ cấu trúc route:
```
app/
├── layout.tsx         # Layout chính (/)
├── page.tsx           # Trang chủ (/)
├── products/
│   ├── layout.tsx     # Layout cho /products
│   ├── page.tsx       # Trang danh sách sản phẩm (/products)
│   └── [id]/
│       └── page.tsx   # Trang chi tiết sản phẩm (/products/[id])
└── checkout/
    └── page.tsx       # Trang thanh toán (/checkout)
```

### 2. Thư mục `components`

Chứa các component có thể tái sử dụng, được tổ chức theo chức năng:

- `layout/`: Các component layout (Header, Footer, Sidebar...)
- `ui/`: Các component UI cơ bản (Button, Input, Card...)
- `products/`: Các component liên quan đến sản phẩm
- `cart/`: Các component liên quan đến giỏ hàng
- `checkout/`: Các component liên quan đến thanh toán
- `auth/`: Các component liên quan đến xác thực

**Lưu ý**: Các component có tương tác người dùng cần được đánh dấu là client components bằng directive `"use client"`.

### 3. Thư mục `hooks`

Chứa các custom React hooks có thể tái sử dụng:

- `useLocalStorage.ts`: Hook để làm việc với localStorage
- `useAuth.ts`: Hook để quản lý xác thực
- `useCart.ts`: Hook để quản lý giỏ hàng
- ...

**Lưu ý**: Tất cả các hooks đều phải được sử dụng trong client components.

### 4. Thư mục `services`

Chứa các service để gọi API:

- `api.ts`: Client gọi API chung
- `auth.ts`: Service xác thực
- `products.ts`: Service sản phẩm
- ...

### 5. Thư mục `store`

Chứa logic quản lý state toàn cục:

- `index.tsx`: Setup Context API
- Có thể thay thế bằng Redux, Zustand, Jotai...

**Lưu ý**: Context providers phải được đánh dấu là client components.

## Quy tắc code

### 1. TypeScript

- Luôn định nghĩa kiểu dữ liệu cho props, state, và các hàm
- Sử dụng interface thay vì type khi có thể
- Đặt các kiểu dữ liệu chung trong thư mục `types`

### 2. Component

- Sử dụng function component thay vì class component
- Đặt tên component theo PascalCase (VD: ProductCard)
- Đặt tên file trùng với tên component (VD: ProductCard.tsx)

### 3. CSS

- Sử dụng TailwindCSS cho styling
- Có thể sử dụng CSS modules cho các component phức tạp

### 4. Import

- Sử dụng alias `@/` để import từ thư mục `src`
- Sắp xếp các import theo thứ tự: React, Next.js, thư viện bên ngoài, components, hooks, utils

## Các lỗi thường gặp và cách khắc phục

### 1. Lỗi "You're importing a component that needs X. This React hook only works in a client component"

**Nguyên nhân**: Bạn đang sử dụng React hooks trong server component.

**Cách khắc phục**: Thêm directive `"use client"` ở đầu file.

### 2. Lỗi "Parsing ecmascript source code failed"

**Nguyên nhân**: Bạn đang sử dụng JSX trong file `.ts` thay vì `.tsx`.

**Cách khắc phục**: Đổi đuôi file từ `.ts` sang `.tsx`.

### 3. Lỗi "Cannot find module '@/components/...'"

**Nguyên nhân**: Path alias không được cấu hình đúng.

**Cách khắc phục**: Kiểm tra lại cấu hình trong `tsconfig.json`.

## Tài liệu tham khảo

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
