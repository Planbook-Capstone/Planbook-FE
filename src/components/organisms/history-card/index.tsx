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
import { MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface HistoryCardProps {
  className?: string;
}

export default function HistoryCard({ className }: HistoryCardProps) {
  const icons: IconType[] = [
    FaBoxArchive,
    FaBriefcase,
    FaCalendar,
    FaCertificate,
    FaFile,
    FaFlask,
  ];
  const getRandomIcon = (): IconType => {
    const randomIndex = Math.floor(Math.random() * icons.length);
    return icons[randomIndex];
  };
  const RandomIcon = getRandomIcon();
  return (
    <div className="relative border rounded-md p-4 bg-white shadow-none cursor-pointer hover:shadow-md transition duration-200">
      <RandomIcon
        className={cn(
          "absolute -top-3 h-6 w-6 text-neutral-800 text-shadow-md",
          className
        )}
      />

      <div className="flex items-center justify-between">
        <h3 className="mt-2 font-calsans text-sm text-black line-clamp-1">
          Tạo giáo án chi tiết theo chủ đề
        </h3>
        <DropdownMenu>
          <DropdownMenuTrigger className="rounded-full hover:bg-accent p-2 cursor-pointer">
            <MoreHorizontal className="text-gray-400" size={16} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={-10}>
            <DropdownMenuItem>Chỉnh sửa tiêu đề</DropdownMenuItem>
            <DropdownMenuItem>Xóa</DropdownMenuItem>
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
