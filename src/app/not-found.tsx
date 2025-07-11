"use client";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-cover bg-center bg-no-repeat bg-[url('/images/background/404-bg.svg')]">
      <div className="relative z-10 text-center px-6">
        <div className="mb-8">
          <h1 className="text-9xl font-calsans text-white mb-4 animate-pulse">
            404
          </h1>
          <h2 className="text-2xl font-calsans text-white mb-6">
            Trang không tồn tại
          </h2>
          <img src={"/images/illustration/robot.svg"} />
          <p className="text-lg text-white mb-8 max-w-md mx-auto">
            Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            asChild
            size="lg"
            className="bg-neutral-800 text-white font-questrial text-lg h-12"
          >
            <Link href="/">Về trang chủ</Link>
          </Button>
          <Button
            onClick={() => window.history.back()}
            size="lg"
            variant="secondary"
            className="bg-white hover:bg-gray-200 text-black font-questrial text-lg h-12"
          >
            Quay lại
          </Button>
        </div>
      </div>
    </div>
  );
}
