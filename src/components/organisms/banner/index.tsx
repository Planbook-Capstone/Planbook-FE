import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface BannerProps {
  backgroundImage?: string;
  sideImage?: string;
  title?: string;
  subtitle?: string;
  width?: "w-full" | "w-2/5";
  heightBanner?: string;
}

const Banner = ({
  backgroundImage,
  sideImage,
  title,
  subtitle,
  width = "w-2/5",
  heightBanner = "h-[340px]",
}: BannerProps) => {
  return (
    <>
      <div
        style={{
          backgroundImage: `url(${
            backgroundImage || "/images/background/bgHome.svg"
          })`,
        }}
        className="relative bg-cover bg-center bg-no-repeat text-black rounded-2xl border border-[#DFDFDF]"
      >
        <div
          className={cn(
            "relative z-10 flex items-center justify-between text-justify px-12",
            heightBanner
          )}
        >
          <div className="py-7">
            <h1 className="text-3xl md:text-3xl sm:text-xl mb-3 font-calsans">
              {title || "Trợ lý dạy học thế hệ mới"}
            </h1>
            <p className="text-lg md:text-lg sm:text-sm mb-7">
              {subtitle || (
                <>
                  Cung cấp công cụ hỗ trợ dạy học tiết kiệm thời gian cho <br />
                  giáo viên Trung học phổ thông
                </>
              )}
            </p>
            {/* <Button>+ Đóng góp tài liệu</Button> */}
          </div>
        </div>
        <div className={cn("absolute right-0 bottom-0", width, heightBanner)}>
          <Image
            src={sideImage || "/images/banner/bannerHome.svg"}
            alt="banner"
            fill
            quality={100}
            className="pr-6"
          />
        </div>
      </div>
    </>
  );
};

export default Banner;
