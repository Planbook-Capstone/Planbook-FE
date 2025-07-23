"use client";
import MainLayout from "@/components/layout/MainLayout";
import PricingCard from "@/components/organisms/pricing-card";
import { useSubscriptionsService } from "@/services/subscriptionServices";

function PricingPage() {
  const { data: subscriptions } = useSubscriptionsService();

  return (
    <div className="flex-1 justify-center items-center h-screen p-10">
      <div className="flex flex-col justify-center items-center gap-1.5 h-full">
        <h1 className="text-3xl font-calsans">Chọn gói phù hợp dành cho bạn</h1>
        <p className="text-xl text-slate-900">
          Tùy chỉnh theo nhu cầu – linh hoạt cho mọi quy mô
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-5">
          {/* <PricingCard /> */}
          {subscriptions?.data?.map((subscription: any) => (
            <PricingCard
              key={subscription.id}
              title={subscription.name}
              description={subscription.description}
              price={subscription.price}
              highlight={subscription.highlight}
              tokenAmount={subscription.tokenAmount}
              id={subscription.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default PricingPage;
