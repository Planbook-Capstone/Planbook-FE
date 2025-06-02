"use client";
import { Button } from "@/components/ui/Button";
import SelectAnswerSheetModal from "../select-answer-sheet-modal";
import { useState } from "react";

export default function TestInfoPanel() {
  const [open, setOpen] = useState(false);

  const options = [
    {
      label: "Phiếu TLTN 2025 mã đề 4 số màu",
      image: "/answer-sheets/mau-1.png",
    },
    {
      label: "Mẫu A4 - 2025 - Không tự luận - SBD 8 số - Mã đề 4 số",
      image: "/answer-sheets/mau-2.svg",
      isRecommend: true,
    },
    {
      label: "Mẫu Bộ GD 2025 - Mã đề 4 số - Chỉ hỗ trợ ảnh từ máy Scan",
      image: "/answer-sheets/mau-3.svg",
    },
    {
      label: "Phiếu TLTN 2025 mã đề 4 số đen trắng",
      image: "/answer-sheets/mau-1.png",
    },
  ];
  return (
    <aside className="w-1/4 px-6 py-4 space-y-3">
      <div>
        <div className="text-xs font-medium text-gray-500">Tên tài liệu</div>
        <div className="font-semibold">
          Kiểm tra hoá cuối kì - THPT Trần Phú
        </div>
      </div>
      <div>
        <div className="text-xs font-medium text-gray-500">Mô tả</div>
        <div className="text-sm">
          Nghiên cứu các yếu tố ảnh hưởng đến tốc độ phản ứng...
        </div>
      </div>
      <div>
        <div className="text-xs font-medium text-gray-500">Người tạo</div>
        <div className="text-sm">Nguyễn Văn A</div>
      </div>
      <div>
        <div className="text-xs font-medium text-gray-500">Ngày tạo</div>
        <div className="text-sm">15:23 14/5/2025</div>
      </div>
      <Button onClick={() => setOpen(true)}>
        In phiếu trả lời trắc nghiệm
      </Button>
      <SelectAnswerSheetModal
        open={open}
        onClose={() => setOpen(false)}
        options={options}
      />
    </aside>
  );
}
