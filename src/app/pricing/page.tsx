"use client";
import MainLayout from "@/components/layout/MainLayout";
import PricingCard from "@/components/organisms/pricing-card";

function PricingPage() {
  return (
    <MainLayout>
      <div className="flex flex-col justify-center items-center gap-1.5 h-full">
        <h1 className="text-3xl font-calsans">Chọn gói phù hợp dành cho bạn</h1>
        <p className="text-xl text-slate-900">
          Tùy chỉnh theo nhu cầu – linh hoạt cho mọi quy mô
        </p>
        <div className="flex justify-center gap-2.5 px-10">
          <PricingCard />
          <PricingCard />
          <PricingCard />
        </div>
      </div>
    </MainLayout>
  );
}

export default PricingPage;
