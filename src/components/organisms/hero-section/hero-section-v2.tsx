"use client";

export const HeroSectionV2 = () => {
  return (
    <section className="text-center py-16 relative w-full h-screen flex justify-center items-center overflow-hidden">
      {/* Desktop Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
        className="hidden md:block w-screen h-screen object-cover"
        onError={(e) => {
          // Chặn error mặc định
          e.preventDefault();
        }}
      >
        <source
          src="https://gdwgakooknyysyrltfmq.supabase.co/storage/v1/object/public/planbook/hero.mp4"
          type="video/mp4"
        />
      </video>

      {/* Mobile Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
        className="block md:hidden w-screen h-screen object-cover"
        onError={(e) => {
          // Chặn error mặc định
          e.preventDefault();
        }}
      >
        <source src="/videos/hero-vertical.mp4" type="video/mp4" />
      </video>

      {/* <div className="absolute top-[0px] w-screen h-[400px] bg-[url('/Planbook.svg')] bg-no-repeat bg-contain bg-center"></div> */}
    </section>
  );
};
