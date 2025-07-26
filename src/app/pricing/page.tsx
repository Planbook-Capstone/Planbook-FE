"use client";

import PricingCard from "@/components/organisms/pricing-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useSubscriptionsService } from "@/services/subscriptionServices";
import { useCreateOrderService } from "@/services/orderServices";
import { toast } from "sonner";
import { redirect, useRouter } from "next/navigation";

function PricingPage() {
  const { data: subscriptions, isLoading } = useSubscriptionsService();
  const { mutate } = useCreateOrderService();
  const router = useRouter();

  const handleOrder = (packageId: string) => {
    mutate(
      {
        packageId,
      },
      {
        onSuccess: (res) => {
          toast.success("Tạo đơn thành công");
          console.log(res?.data?.data, "ngoc");

          // Redirect to payment page with order data
          if (res?.data?.data?.id) {
            // router.push(`/payment/${res?.data?.data?.id}`);
            router.push(`${res?.data?.data?.checkoutUrl}`);
          }
        },
        onError: (response) => {
          toast.error(`${response?.response?.data}`);
        },
      }
    );
  };

  return (
    <div className="flex-1 justify-center items-center h-screen p-10">
      <div className="flex flex-col justify-center items-center gap-1.5 h-full">
        <h1 className="text-3xl font-calsans">Chọn gói phù hợp dành cho bạn</h1>
        <p className="text-xl text-slate-900">
          Tùy chỉnh theo nhu cầu – linh hoạt cho mọi quy mô
        </p>
        <div className="max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-5 mt-5 w-full">
          {isLoading ? (
            <>
              <Skeleton className="h-[550px] w-full rounded-xl bg-neutral-300" />
              <Skeleton className="h-[550px] w-full rounded-xl bg-neutral-300" />
              <Skeleton className="h-[550px] w-full rounded-xl bg-neutral-300" />
            </>
          ) : (
            subscriptions?.data
              ?.sort((a: any, b: any) => a.priority - b.priority)
              ?.map((subscription: any) => (
                <PricingCard
                  key={subscription.id}
                  title={subscription.name}
                  description={subscription.description}
                  price={subscription.price}
                  highlight={subscription.highlight}
                  tokenAmount={subscription.tokenAmount}
                  id={subscription.id}
                  features={subscription.features}
                  onOrder={handleOrder}
                />
              ))
          )}
        </div>
      </div>
    </div>
  );
}

export default PricingPage;
