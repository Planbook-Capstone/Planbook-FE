"use client";

import { FeatureCard } from "@/components/molecules/feature-card";

export const FeatureCardsSection = () => {
  return (
    <section className="px-4 md:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:justify-between gap-6 max-w-[1340px] mx-auto">
        <FeatureCard
          title={["Cá nhân hoá", "không gian làm việc"]}
          description="Thiết kế không gian làm việc theo cách riêng của bạn."
          image="/images/illustration/folders.svg"
          imageStyleClassName="-bottom-12"
          className="w-full md:w-[48%]"
        />
        <FeatureCard
          title={["Nhận kết quả ngay", "trong tích tắc"]}
          description="Tự động hoá với trí tuệ nhân tạo (AI) mọi tác vụ hành chính của giáo viên."
          image="/images/illustration/interaction.svg"
          className="w-full md:w-[48%]"
        />
      </div>
    </section>
  );
};
