import { FileMinus, MoreHorizontal } from "lucide-react";
import React from "react";

interface HistoryCardProps {}

export default function HistoryCard({}: HistoryCardProps) {
  return (
    <div className="relative border rounded-md p-4 bg-white shadow-sm cursor-pointer hover:shadow-md transition duration-200">
      <FileMinus className="absolute -top-3" />

      <div className="flex items-center justify-between">
        <h3 className="mt-2 font-calsans text-sm text-black">
          Tạo giáo án chi tiết theo chủ đề
        </h3>
        <MoreHorizontal className="text-gray-400" size={16} />
      </div>

      <p className="text-xs text-gray-600 mt-1">
        Soạn giáo án theo từng bài cụ thể.
      </p>
      <div className="flex justify-between items-center text-xs text-[#2B2B2B] mt-4">
        <span className="px-2 py-1.5 border rounded-md">15:00 20/03/2025</span>
        <span>4 nguồn</span>
      </div>
    </div>
  );
}
