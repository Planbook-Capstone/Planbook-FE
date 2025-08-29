"use client";

import { Marquee } from "@/components/atoms/marquee";

export const HeroSectionV2 = () => {
  return (
    <section className="text-center py-16 relative w-full h-screen flex justify-center items-center overflow-hidden">
      {/* Desktop Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="hidden md:block w-screen h-screen object-cover"
      >
        <source src="/videos/hero.mp4" type="video/mp4" />
        <track
          kind="captions"
          srcLang="en"
          label="English"
          src="/videos/captions.vtt"
        />
      </video>

      {/* Mobile Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="block md:hidden w-screen h-screen object-cover"
      >
        <source src="/videos/hero-vertical.mp4" type="video/mp4" />
        <track
          kind="captions"
          srcLang="en"
          label="English"
          src="/videos/captions.vtt"
        />
      </video>

      {/* <div className="absolute top-[0px] w-screen h-[400px] bg-[url('/Planbook.svg')] bg-no-repeat bg-contain bg-center"></div> */}
    </section>
  );
};
