"use client";

import { userItems } from "@/constants/menuItem";
import { cn } from "@/lib/utils";
import { Avatar } from "antd";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import UserButton from "../user-button";
import { useState } from "react";
import { Menu, X } from "lucide-react";

type MainHeaderProps = {};

const MainHeader = (props: MainHeaderProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="w-full px-4 py-3 border-b bg-white">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Image
            src="/images/logoPlanbook.png"
            alt="PlanBook Logo"
            width={30}
            height={30}
            className="object-contain"
          />
          <h1 className="font-calsans text-xl sm:text-2xl">PlanBook</h1>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-6">
          {userItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link href={item.href} key={item.href}>
                <div
                  className={cn(
                    "text-sm font-medium transition hover:text-primary text-neutral-500",
                    isActive && "font-calsans text-primary"
                  )}
                >
                  {item.label}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* User Button (always visible) */}
        <div className="hidden sm:flex items-center gap-2">
          <UserButton />
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-4 px-2">
          {userItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link href={item.href} key={item.href} onClick={() => setMenuOpen(false)}>
                <div
                  className={cn(
                    "text-sm py-1 font-medium transition hover:text-primary text-neutral-600",
                    isActive && "text-primary"
                  )}
                >
                  {item.label}
                </div>
              </Link>
            );
          })}
          <div className="flex sm:hidden">
            <UserButton />
          </div>
        </div>
      )}
    </header>
  );
};

export default MainHeader;
