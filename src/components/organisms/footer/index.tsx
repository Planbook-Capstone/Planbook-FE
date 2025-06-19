// components/organisms/Footer.tsx
"use client";

import Image from "next/image";

export const Footer = () => {
  return (
    <footer className="py-12 px-4 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="flex flex-col justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/images/logoPlanbook.png"
              alt="PlanBook Logo"
              width={30}
              height={30}
              className="object-contain"
            />
            <h1 className="font-calsans text-xl sm:text-xl">PlanBook</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            2025 - All rights reserved
          </p>
        </div>

        <div>
          <h4 className="text-lg font-calsans mb-4">Chức năng</h4>
          <ul className="space-y-2 text-base">
            <li>Giáo án & Kế hoạch giảng dạy</li>
            <li>Điền biểu mẫu tự động</li>
            <li>Hỗ trợ chấm bài</li>
            <li>Tạo bài kiểm tra tự động</li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-calsans mb-4">Chính sách & điều khoản</h4>
          <ul className="space-y-2 text-base">
            <li>Chính sách bảo mật</li>
            <li>Điều khoản dịch vụ</li>
            <li>Liên hệ hỗ trợ</li>
          </ul>
        </div>
      </div>
    </footer>
  );
};
