"use client";

export const HeroSectionV2 = () => {
  return (
    <section className="text-center py-16 relative w-full h-screen flex justify-center items-center">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="w-[calc(100vw-150px)] h-[calc(100vh-150px)] object-cover"
      >
        <source src="/videos/hero.mp4" type="video/mp4" />
      </video>
      <div className="absolute top-0 left-[74px] w-[1px] h-screen bg-gradient-to-b from-neutral-200 to-neutral-900"></div>
      <div className="absolute top-0 right-[74px] w-[1px] h-screen bg-gradient-to-t from-neutral-200 to-neutral-900"></div>
      <div className="absolute right-0 top-[74px] h-[1px] w-screen bg-gradient-to-l from-neutral-200 to-neutral-900"></div>
      <div className="absolute right-0 bottom-[74px] h-[1px] w-screen bg-gradient-to-r from-neutral-200 to-neutral-900"></div>
      <div className="absolute top-[0px] w-screen h-[400px] bg-[url('/Planbook.svg')] bg-no-repeat bg-contain bg-center"></div>
    </section>
  );
};
