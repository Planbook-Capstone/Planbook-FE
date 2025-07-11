"use client";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-cover bg-center bg-no-repeat bg-[url('/images/background/404-bg.svg')]">
      {/* Main Content - Responsive container */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="mb-6 sm:mb-8 lg:mb-12">
          {/* 404 Title - Responsive text sizes */}
          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-calsans text-white mb-4 animate-pulse">
            404
          </h1>

          {/* Subtitle - Responsive text sizes */}
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-calsans text-white mb-4 sm:mb-6">
            Trang không tồn tại
          </h2>

          {/* Robot Image - Responsive sizing */}
          <div className="flex justify-center mb-4 sm:mb-6">
            <img
              src="/images/illustration/robot.svg"
              alt="Robot illustration"
              className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 xl:w-80 xl:h-80 object-contain"
            />
          </div>

          {/* Description - Responsive text and spacing */}
          <p className="text-sm sm:text-base md:text-lg text-white mb-6 sm:mb-8 max-w-xs sm:max-w-md md:max-w-lg mx-auto leading-relaxed">
            Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
          </p>
        </div>

        {/* Action Buttons - Responsive layout and sizing */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
          <Button
            asChild
            size="lg"
            className="w-full sm:w-auto bg-neutral-800 hover:bg-neutral-700 text-white font-questrial text-sm sm:text-base md:text-lg h-10 sm:h-12 px-6 sm:px-8"
          >
            <Link href="/">Về trang chủ</Link>
          </Button>
          <Button
            onClick={() => window.history.back()}
            size="lg"
            variant="secondary"
            className="w-full sm:w-auto bg-white hover:bg-gray-200 text-black font-questrial text-sm sm:text-base md:text-lg h-10 sm:h-12 px-6 sm:px-8"
          >
            Quay lại
          </Button>
        </div>
      </div>
    </div>
  );
}
