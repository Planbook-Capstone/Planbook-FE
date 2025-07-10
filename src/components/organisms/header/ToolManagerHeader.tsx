"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ToolManagerHeader() {
  const router = useRouter();

  const handleLogout = () => {
    router.push("/login");
  };

  return (
    <header className="w-full py-5 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
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

        {/* User Account - Right Side */}
        <div className="flex items-center gap-2">
          {/* User Dropdown */}
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger className="outline-none relative">
              <Avatar className="size-9 rounded-md hover:opacity-75 transition border border-neutral-300">
                <AvatarImage
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3fA0BO-KVbrQRmZeAiRwHHDrllxLWuPK4HCKmjnKcTnc82OBcd_8iYKPHIS2doiXbq2A_&s"
                  className="object-cover"
                />
                <AvatarFallback className="rounded-md bg-neutral-200 font-medium text-neutral-500 flex items-center justify-center">
                  TM
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              side="bottom"
              className="w-64"
              sideOffset={5}
            >
              <div className="flex items-center justify-start gap-2 px-2.5 py-4">
                <Avatar className="size-9 hover:opacity-75 transition border border-neutral-300">
                  <AvatarFallback className="bg-neutral-200 font-medium text-neutral-500 flex items-center justify-center">
                    TM
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start justify-center">
                  <p className="text-sm font-medium text-neutral-900">
                    Tool Manager
                  </p>
                  <p className="text-xs text-neutral-500">
                    toolmanager@planbook.edu.vn
                  </p>
                </div>
              </div>

              <DropdownMenuItem
                onClick={handleLogout}
                className="h-10 flex items-center justify-center text-amber-700 font-medium cursor-pointer"
              >
                <LogOut className="size-4 mr-2" /> Đăng xuất
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
