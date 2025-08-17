"use client";

import {
  PricingCard,
  PricingCardProps,
} from "@/components/molecules/pricing-card";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { useSubscriptionsService } from "@/services/subscriptionServices";
import { sub } from "date-fns";

export const PricingSection = () => {
  const { data: subscriptions, isLoading } = useSubscriptionsService();

  // Convert subscriptions to pricingPlans format, take first 3 items
  const dynamicPricingPlans: PricingCardProps[] =
    subscriptions?.data
      ?.sort((a: any, b: any) => a.priority - b.priority)
      ?.slice(0, 3)
      ?.map((subscription: any, index: number) => ({
        id: index + 1,
        name: subscription.name,
        description: subscription.description,
        price: subscription.price.toLocaleString("vi-VN"),
        badge: subscription.highlight ? "PHỔ BIẾN" : "",
        buttonText: "Chọn gói ngay",
        buttonSubtext: `${subscription.tokenAmount} tokens - ${subscription.description}`,
        cardType: index === 0 ? "purple" : index === 1 ? "dark" : "gradient",
        features: Object.values(subscription.features || {}),
      })) || [];

  // Use dynamic plans if available, otherwise fallback to static plans
  const plansToRender =
    dynamicPricingPlans.length > 0 ? dynamicPricingPlans : [];

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
          {plansToRender?.map((plan: any, idx: number) => (
            <AnimatedSection
              key={plan.id || idx}
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
