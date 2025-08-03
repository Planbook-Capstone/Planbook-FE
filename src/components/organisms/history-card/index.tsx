import { Button } from "@/components/ui/Button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconPicker } from "@/components/ui/IconPicker";
import * as Icons from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import * as FaIcons from "react-icons/fa6";

interface HistoryCardProps {
  data?: any;
  className?: string;
}

export default function HistoryCard({ data, className }: HistoryCardProps) {
  const [dropdownIcon, setDropdownIcon] = useState<string>("FaBookBookmark");
  const [dropdownIconColor, setDropdownIconColor] = useState("");

  const IconComponent = FaIcons[dropdownIcon as keyof typeof FaIcons];
  return (
    <div className="relative border rounded-md p-4 bg-white shadow-none cursor-pointer hover:shadow-md transition duration-200">
      {IconComponent && (
        <div
          className={cn("absolute -top-3 h-6 w-6 text-shadow-md", className)}
        >
          <IconComponent
            size={14}
            color={dropdownIconColor}
            className="h-6 w-6"
          />
        </div>
      )}

      <div className="flex items-center justify-between">
        <h3 className="mt-2 font-calsans text-sm text-black line-clamp-1">
          {data?.code}
        </h3>
        <DropdownMenu>
          <DropdownMenuTrigger className="rounded-full hover:bg-accent p-2 cursor-pointer">
            <Icons.MoreHorizontal className="text-gray-400" size={16} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={-10} className="w-80">
            <DropdownMenuLabel>
              <div className="flex justify-between items-center">
                <h6 className="font-calsans text-sm">Tùy chỉnh menu</h6>
                <div className="gap-3 flex justify-between items-center">
                  <Button className="p-0 bg-transparent shadow-none text-neutral-800 hover:shadow-none">
                    Chỉnh sửa
                  </Button>
                  <Button className="p-0 bg-transparent shadow-none text-neutral-800 hover:shadow-none">
                    xoá
                  </Button>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <div className="p-3">
              <IconPicker
                selectedIcon={dropdownIcon as any}
                selectedColor={dropdownIconColor}
                onIconChange={setDropdownIcon}
                onColorChange={setDropdownIconColor}
              />
            </div>

            {/* <DropdownMenuSeparator />
            <DropdownMenuItem>Chỉnh sửa tiêu đề</DropdownMenuItem>
            <DropdownMenuItem>Xóa</DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <p className="text-xs text-gray-600 mt-1 line-clamp-2">
        Soạn giáo án theo từng bài cụ thể. Soạn giáo án theo từng bài cụ thể.
        Soạn giáo án theo từng bài cụ thể. Soạn giáo án theo từng bài cụ thể.
      </p>
      <div className="flex justify-between items-center text-xs text-[#2B2B2B] mt-4">
        <span className="px-2 py-1.5 border rounded-full">
          {new Date(data?.updatedAt).toLocaleString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false, // để dùng định dạng 24h thay vì AM/PM
          })}
        </span>
        <span>{data?.tokenUsed} token</span>
      </div>
    </div>
  );
}
