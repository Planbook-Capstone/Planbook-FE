"use client";

import { Button } from "@/components/ui/Button";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { X, Menu } from "lucide-react";
import clsx from "clsx";
import { useRouter } from "next/navigation";

interface LandingPageHeaderProps {
  className?: string;
  onClickLogo?: () => void;
  isHiddenLoginBtn?: boolean;
  isPricingPage?: boolean;
}

export const LandingPageHeader = ({
  className,
  onClickLogo,
  isHiddenLoginBtn = false,
  isPricingPage = false,
}: LandingPageHeaderProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  return (
    <header
      className={clsx([className, "fixed z-50 w-full"])}
      style={{
        backdropFilter: "blur(5px)",
        WebkitBackdropFilter: "blur(8px)",
        background:
          "linear-gradient(to bottom, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0))",
      }}
    >
      <div className="flex justify-between items-center py-4 px-4 md:px-6">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Image
            src="/images/planbook.svg"
            alt="PlanBook Logo"
            width={130}
            height={35}
            className="object-contain cursor-pointer"
            onClick={onClickLogo}
            priority
          />
        </div>

        <div className="flex items-center gap-12">
          {/* Desktop Navigation */}
          {!isPricingPage && (
            <nav className="hidden md:flex gap-6 text-md text-muted-foreground">
              <a href="#" className="font-calsans text-neutral-800">
                Trang chủ
              </a>
              <a href="#" className="text-neutral-600">
                Trợ giúp
              </a>
              <a href="#" className="text-neutral-600">
                Liên hệ
              </a>
            </nav>
          )}

          {isPricingPage && (
            <nav className="hidden md:flex gap-6 text-md text-muted-foreground">
              <a
                onClick={onClickLogo}
                className="text-neutral-800 cursor-pointer"
              >
                Trợ lý
              </a>
              <a href="/my-library" className="text-neutral-600 cursor-pointer">
                Kho tài liệu
              </a>
              <a
                href="/my-library"
                className="font-calsans text-neutral-600 cursor-pointer"
              >
                Gói dịch vụ
              </a>
            </nav>
          )}

          {/* Desktop Buttons */}
          <div
            className={
              "hidden md:flex gap-2 " + (isHiddenLoginBtn && "md:hidden")
            }
          >
            <Button
              onClick={() => router.push("/auth")}
              className={"rounded-full bg-lime-300 text-black"}
            >
              Đăng ký
            </Button>
          </div>
        </div>
        {/* Mobile Hamburger/Close Button */}
        <button
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Đóng menu" : "Mở menu"}
        >
          {mobileOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div
          className="fixed z-50 w-full p-5"
          style={{
            backdropFilter: "blur(12px)",
            backgroundColor: "rgba(255, 255, 255)",
            WebkitBackdropFilter: "blur(12px)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <nav className="bg-white px-3 pb-3 flex flex-col gap-4 text-base text-muted-foreground">
            <a href="#" className="font-calsans text-black">
              Trang chủ
            </a>
            <a href="#">Trợ giúp</a>
            <a href="#">Liên hệ</a>
          </nav>

          <div className="flex flex-col gap-3 mt-auto">
            <Button onClick={() => router.push("/auth")} variant="outline">
              Đăng nhập
            </Button>
            <Button onClick={() => router.push("/auth")}>Đăng ký</Button>
          </div>
        </div>
      )}
    </header>
  );
};
