"use client";

import {
  PricingCard,
  PricingCardProps,
} from "@/components/molecules/pricing-card";
import { PricingDescription } from "@/components/molecules/pricing-description";
import { Button } from "@/components/ui/Button";

const pricingPlans: PricingCardProps[] = [
  {
    name: "Gói Tiêu chuẩn",
    price: "480.000₫",
    features: [
      "Theo dõi và báo cáo tài chính nâng cao",
      "Công cụ quản lý chi tiêu và lập ngân sách",
      "Tích hợp mượt mà với các cổng thanh toán phổ biến",
      "Mã hóa dữ liệu an toàn, đảm bảo tuân thủ quy định",
    ],
    popular: false,
  },
  {
    name: "Gói Chuyên nghiệp",
    price: "4.320.000₫",
    features: [
      "Bao gồm toàn bộ tính năng từ Gói Tiêu chuẩn",
      "Dự báo và phân tích dòng tiền nâng cao",
      "Tùy chỉnh hoá đơn và phương thức thanh toán",
      "Hỗ trợ đa tiền tệ cho các giao dịch quốc tế",
    ],
    popular: true,
  },
  {
    name: "Gói Doanh nghiệp",
    price: "12.000.000₫",
    features: [
      "Bao gồm toàn bộ tính năng từ Gói Chuyên nghiệp",
      "Phân tích tài chính chuyên sâu và chi tiết",
      "Bảng điều khiển và trực quan hóa dữ liệu tuỳ biến",
      "Cung cấp API để tích hợp vào hệ thống khác",
    ],
    popular: false,
  },
];

export const PricingSection = () => {
  return (
    <section className="px-4 md:px-6 lg:px-8 py-20 max-w-[1340px] mx-auto">
      <span className="inline-block text-white bg-[#FF5812] text-sm px-4 py-1 rounded-full mb-3 font-medium">
        Bảng giá
      </span>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-14">
        <div>
          <h2 className="text-[40px] md:text-[56px] font-calsans leading-tight mb-3">
            Lựa chọn giá
            <br />
            linh hoạt
          </h2>
        </div>
        <p className="max-w-md lg:max-w-xl text-muted-foreground">
          Trải nghiệm sự chủ động và tiện lợi trong quản lý công việc giảng dạy
          với các gói dịch vụ đa dạng. Từ công cụ lập kế hoạch, soạn giáo án,
          đến hỗ trợ chấm điểm và phân tích học tập — tất cả đều được thiết kế
          để tiết kiệm thời gian và nâng cao hiệu quả cho giáo viên.
        </p>
        <Button variant="outline" className="rounded-full h-12 px-6 text-base">
          Xem thêm
        </Button>
      </div>
      <div className="flex flex-col lg:flex-row gap-10 justify-between">
        <PricingDescription />
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pricingPlans.map((plan, idx) => (
            <PricingCard key={idx} {...plan} />
          ))}
        </div>
      </div>
    </section>
  );
};
