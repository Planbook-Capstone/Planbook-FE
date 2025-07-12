"use client";
import { FAQsSection } from "@/components/organisms/faqs";
import { FeatureCardsSection } from "@/components/organisms/feature-card-section";
import { Footer } from "@/components/organisms/footer";
import { LandingPageHeader } from "@/components/organisms/header/LandingPageHeader";
import { HeroSection } from "@/components/organisms/hero-section";
import { PartnerSection } from "@/components/organisms/partner-section";
import { PricingSection } from "@/components/organisms/pricing-section";
import { ParallaxProvider } from "react-scroll-parallax";
import { useEffect, useState } from "react";

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen w-full flex flex-col justify-center relative overflow-hidden">
      <ParallaxProvider>
        {/* <InteractiveCursor
          size={32}
          color="#06b6d4"
          mixBlendMode="difference"
        /> */}
        <div className="relative z-20">
          <LandingPageHeader />
          <HeroSection />
          <FeatureCardsSection />
          <PricingSection />
          <FAQsSection />
          <PartnerSection />
          <Footer />
        </div>
      </ParallaxProvider>
    </div>
  );
}
