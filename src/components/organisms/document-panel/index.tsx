"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { Download } from "lucide-react";

interface DocumentInfo {
  name: string;
  title: string;
  description: string;
  creator: string;
  createdAt: string;
  updateAt: string;
}

interface DocumentInfoPanelProps {
  documentInfo?: DocumentInfo;
}

export default function DocumentInfoPanel({
  documentInfo,
}: DocumentInfoPanelProps) {
  const defaultInfo = {
    name: "",
    title: "Kiểm tra hoá cuối kì - THPT Trần Phú",
    description:
      "Nghiên cứu các yếu tố ảnh hưởng đến tốc độ phản ứng, cơ chế phản ứng và biểu diễn cân bằng động.",
    creator: "Nguyễn Văn A",
    createdAt: "15:23 14/5/2025",
  };
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  const info = documentInfo || defaultInfo;

  return (
    <aside className="w-full px-6 py-6 space-y-6 ">
      <div className="space-y-2">
        <div className="grid grid-cols-[1fr_2fr] gap-1 text-sm">
          <div className="font-calsans text-nowrap ">Tên tài liệu</div>
          <div className="font-questrial text-gray-900  leading-relaxed">
            {info?.name}
          </div>
        </div>

        <div className="grid grid-cols-[1fr_2fr] gap-1 text-sm">
          <div className="font-calsans text-nowrap">Mô tả</div>
          <div className="font-questrial text-gray-900  leading-relaxed">
            {info.description}
          </div>
        </div>

        {/* <div className="grid grid-cols-[1fr_2fr] gap-1 text-sm">
          <div className="font-calsans text-nowrap ">Người tạo</div>
          <div className="font-questrial text-gray-900  leading-relaxed">
            {info.creator}
          </div>
        </div> */}

        <div className="grid grid-cols-[1fr_2fr] gap-1 text-sm">
          <div className="font-calsans text-nowrap ">Ngày tạo</div>
          <div className="font-questrial text-gray-900  leading-relaxed">
            {formatDate(info.createdAt)}
          </div>
        </div>
      </div>

      {/* <Button className="w-full bg-gray-800 hover:bg-gray-700 text-white text-xs py-3">
        <Download className="h-3 w-3 mr-2" />
        In phiếu trả lời trắc nghiệm
      </Button> */}
    </aside>
  );
}

export type { DocumentInfo, DocumentInfoPanelProps };
