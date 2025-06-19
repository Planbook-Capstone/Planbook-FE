"use client";

import { FeatureHighlights } from "@/components/molecules/feature-highlights";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import { ParallaxProvider, useParallax } from "react-scroll-parallax";

export const HeroSection = () => {
  const mage = useParallax<HTMLDivElement>({
    translateY: [10, -20],
  });
  const resize = useParallax<HTMLDivElement>({
    scale: [1, 1.2],
    translateX: [0, 10],
  });
  return (
    <ParallaxProvider>
      <section className="text-center py-16 relative">
        <p className="text-base md:text-lg mb-6 md:mb-8">
          Cung cấp công cụ hỗ trợ
        </p>

        <h1 className="text-[50px] md:text-[75px] lg:text-[80px] font-calsans leading-tight mb-6 md:mb-12">
          Trợ lí dạy học <br /> thế hệ mới
        </h1>

        <p className="text-xl md:text-2xl mb-6 md:mb-12">
          dành cho giáo viên Trung học phổ thông
        </p>

        <div className="flex justify-center gap-4">
          <Button
            variant="outline"
            className="h-12 px-3 text-base border-black rounded-full"
          >
            Bắt đầu ngay
          </Button>
          <Button className="h-12 text-base bg-black rounded-full border">
            Liên hệ với chúng tôi
          </Button>
        </div>
        <div ref={mage.ref} className="relative xl:block hidden">
          <Image
            src="/images/banner/bannerLandingPage.svg"
            alt="product-illustration"
            width={1920}
            height={1080}
            style={{ width: "100%", height: "auto" }}
            quality={100}
          />
          <div ref={resize.ref}>
            <Image
              src="/images/illustration/bookRequestCard.svg"
              alt="product-illustration"
              width={300}
              height={480}
              style={{ width: "400px", height: "auto" }}
              className="absolute bottom-70 left-20"
              quality={100}
            />
          </div>
        </div>
        <div ref={mage.ref} className="relative xl:hidden block mt-10">
          <Image
            src="/images/banner/bannerLandingPageMobile.svg"
            alt="product-illustration"
            width={1920}
            height={1080}
            style={{ width: "100%", height: "auto" }}
            quality={100}
          />
        </div>
        <FeatureHighlights className="xl:-translate-y-50" />
      </section>
    </ParallaxProvider>
  );
};
