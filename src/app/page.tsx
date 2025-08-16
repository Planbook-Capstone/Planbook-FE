"use client";
import { FAQsSection } from "@/components/organisms/faqs";
import { FeatureCardsSection } from "@/components/organisms/feature-card-section";
import { Footer } from "@/components/organisms/footer";
import { LandingPageFooter } from "@/components/organisms/footer/LandingPageFooter";
import { LandingPageHeader } from "@/components/organisms/header/LandingPageHeader";
import { HeroSection } from "@/components/organisms/hero-section";
import { PartnerSection } from "@/components/organisms/partner-section";
import { PricingSection } from "@/components/organisms/pricing-section";
import { ParallaxProvider } from "react-scroll-parallax";
import { useEffect, useState } from "react";
import { HeroSectionV2 } from "@/components/organisms/hero-section/hero-section-v2";
import { FeaturedProjectsSection } from "@/components/organisms/featured-projects-section";
import { Marquee } from "@/components/atoms/marquee";
import { OAuthCallbackHandler } from "@/components/auth/OAuthCallbackHandler";

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
      <OAuthCallbackHandler />
      <ParallaxProvider>
        <div className="relative z-20">
          <LandingPageHeader />
          <HeroSectionV2 />
          <Marquee speed={30} />
          <FeaturedProjectsSection />
          <PricingSection />
          <LandingPageFooter />

          {/* <FeatureCardsSection />
          <PricingSection />
          <FAQsSection />
          <PartnerSection />
          <Footer /> */}
        </div>
      </ParallaxProvider>
    </div>
  );
}
