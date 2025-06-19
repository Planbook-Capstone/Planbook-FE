"use client";

import { Button } from "@/components/ui/Button";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { X, Menu } from "lucide-react";

export const LandingPageHeader = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="relative z-50">
      <div className="flex justify-between items-center py-4 px-4 md:px-6">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Image
            src="/images/logoPlanbook.png"
            alt="PlanBook Logo"
            width={30}
            height={30}
            className="object-contain"
          />
          <h1 className="font-calsans text-xl">PlanBook</h1>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6 text-sm text-muted-foreground">
          <a href="#" className="font-semibold text-black">
            Trang chủ
          </a>
          <a href="#">Trợ giúp</a>
          <a href="#">Liên hệ</a>
        </nav>

        {/* Desktop Buttons */}
        <div className="hidden md:flex gap-2">
          <Button variant="outline">
            <Link href="/login">Đăng nhập</Link>
          </Button>
          <Button>
            <Link href="/login">Đăng ký</Link>
          </Button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="md:hidden"
          onClick={() => setMobileOpen(true)}
          aria-label="Mở menu"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="absolute top-0 left-0 w-full h-screen bg-white flex flex-col p-6 space-y-6 shadow-lg md:hidden">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Image
                src="/images/logoPlanbook.png"
                alt="PlanBook Logo"
                width={30}
                height={30}
                className="object-contain"
              />
              <h1 className="font-calsans text-xl">PlanBook</h1>
            </div>
            <button onClick={() => setMobileOpen(false)} aria-label="Đóng menu">
              <X className="h-6 w-6" />
            </button>
          </div>

          <nav className="flex flex-col gap-4 text-base text-muted-foreground">
            <a href="#" className="font-semibold text-black">
              Trang chủ
            </a>
            <a href="#">Trợ giúp</a>
            <a href="#">Liên hệ</a>
          </nav>

          <div className="flex flex-col gap-3 mt-auto">
            <Button variant="outline">
              <Link href="/login">Đăng nhập</Link>
            </Button>
            <Button>
              <Link href="/login">Đăng ký</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};
