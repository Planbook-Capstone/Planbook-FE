"use client";

import {
  PricingCard,
  PricingCardProps,
} from "@/components/molecules/pricing-card";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

const pricingPlans: PricingCardProps[] = [
  {
    id: "01",
    name: "GÓI TIÊU CHUẨN",
    description:
      "Phù hợp cho giáo viên cá nhân với các tính năng cơ bản để quản lý lớp học hiệu quả",
    price: "480.000",
    badge: "",
    buttonText: "Chọn gói ngay",
    buttonSubtext:
      "Bắt đầu số hóa công việc giảng dạy. Tiết kiệm thời gian và nâng cao hiệu quả",
    cardType: "purple",
    features: [
      "Lập kế hoạch bài học cơ bản",
      "Quản lý thông tin học sinh",
      "Tạo giáo án đơn giản",
      "Báo cáo tiến độ học tập",
      "Hỗ trợ kỹ thuật cơ bản",
    ],
  },
  {
    id: "02",
    name: "GÓI CHUYÊN NGHIỆP",
    description:
      "Tích hợp đầy đủ tính năng nâng cao cho giáo viên có nhiều lớp và yêu cầu chuyên sâu",
    price: "4.320.000",
    badge: "PHỔ BIẾN",
    buttonText: "Chọn gói ngay",
    buttonSubtext:
      "Quản lý chuyên nghiệp nhiều lớp học. Phân tích chi tiết và báo cáo toàn diện",
    cardType: "dark",
    features: [
      "Tất cả tính năng gói Tiêu chuẩn",
      "Quản lý nhiều lớp học đồng thời",
      "Phân tích học tập nâng cao",
      "Tùy chỉnh giáo án chuyên sâu",
      "Báo cáo chi tiết và thống kê",
      "Tích hợp với hệ thống trường học",
      "Hỗ trợ ưu tiên 24/7",
    ],
  },
  {
    id: "03",
    name: "GÓI DOANH NGHIỆP",
    description:
      "Giải pháp toàn diện cho trường học và tổ chức giáo dục với tùy chỉnh linh hoạt",
    price: "12.000.000",
    badge: "PREMIUM",
    buttonText: "Liên hệ tư vấn",
    buttonSubtext:
      "Giải pháp tổng thể cho tổ chức. API tích hợp và hỗ trợ chuyên biệt 24/7",
    cardType: "gradient",
    features: [
      "Tất cả tính năng gói Chuyên nghiệp",
      "Quản lý toàn trường/tổ chức",
      "API tích hợp hệ thống riêng",
      "Tùy chỉnh giao diện theo thương hiệu",
      "Phân quyền chi tiết theo vai trò",
      "Báo cáo tổng thể cấp lãnh đạo",
      "Đào tạo và triển khai chuyên biệt",
      "Hỗ trợ kỹ thuật chuyên biệt 24/7",
    ],
  },
];

export const PricingSection = () => {
  return (
    <section className="relative mb-30 mt-20 text-white px-4 md:px-6 lg:px-8 pt-20 pb-40 overflow-hidden rounded-4xl">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/background/abstract-bg.png')",
        }}
      ></div>

      <div className="relative z-10 xl:[200px] md:px-[75px] mx-auto">
        <AnimatedSection animation="fadeIn" delay={200}>
          <div className="mb-16">
            <h2 className="text-5xl md:text-7xl font-calsans mb-4 leading-tight">
              Bảng giá
            </h2>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pricingPlans.map((plan, idx) => (
            <AnimatedSection
              key={idx}
              animation="slideUp"
              delay={400 + idx * 200}
            >
              <PricingCard {...plan} />
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};
