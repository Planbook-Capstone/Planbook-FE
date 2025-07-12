import { Button } from "@/components/ui/Button";
import {
  FaBoxArchive,
  FaBriefcase,
  FaCalendar,
  FaCertificate,
  FaFile,
  FaFlask,
} from "react-icons/fa6";
import { IconType } from "react-icons";
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
  className?: string;
}

export default function HistoryCard({ className }: HistoryCardProps) {
  const [dropdownIcon, setDropdownIcon] = useState<string>("FaBookBookmark");
  const [dropdownIconColor, setDropdownIconColor] = useState("#9ca3af");

  const IconComponent = FaIcons[dropdownIcon as keyof typeof FaIcons];
  return (
    <div className="relative border rounded-md p-4 bg-white shadow-none cursor-pointer hover:shadow-md transition duration-200">
      {IconComponent && (
        <div
          className={cn(
            "absolute -top-3 h-6 w-6 text-neutral-800 text-shadow-md",
            className
          )}
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
          Tạo giáo án chi tiết theo chủ đề
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
        <span className="px-2 py-1.5 border rounded-md">15:00 20/03/2025</span>
        <span>4 nguồn</span>
      </div>
    </div>
  );
}
