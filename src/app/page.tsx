"use client";

import { FeatureCardsSection } from "@/components/organisms/feature-card-section";
import { Footer } from "@/components/organisms/footer";
import { LandingPageHeader } from "@/components/organisms/header/LandingPageHeader";
import { HeroSection } from "@/components/organisms/hero-section";
import { PartnerSection } from "@/components/organisms/partner-section";
import { PricingSection } from "@/components/organisms/pricing-section";
import { ParallaxProvider } from "react-scroll-parallax";

export default function LandingPage() {
  return (
    <div className="min-h-screen w-full flex flex-col justify-center">
      <ParallaxProvider>
        <LandingPageHeader />
        <HeroSection />
        <FeatureCardsSection />
        <PricingSection />
        <PartnerSection />
        <Footer />
      </ParallaxProvider>
    </div>
  );
}
