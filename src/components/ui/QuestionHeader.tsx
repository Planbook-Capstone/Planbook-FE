"use client";

import React from "react";
import { X, BookOpen } from "lucide-react";
import Image from "next/image";

interface QuestionHeaderProps {
  onClose: () => void;
  title?: string;
  subtitle?: string;
}

export const QuestionHeader: React.FC<QuestionHeaderProps> = ({
  onClose,
  title = "Ngân hàng câu hỏi",
  subtitle = "THPT Quốc Gia 2025",
}) => {
  return (
    <div className="bg-blue-500 text-white p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div >
            <Image
              fetchPriority="high"
              priority
              src="/images/logoPlanbook.png"
              alt="PlanBook Logo"
              width={35}
              height={35}
              className="object-contain"
            />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-1">{title}</h2>
            <p className="text-blue-100 text-sm">{subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 ">
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};
