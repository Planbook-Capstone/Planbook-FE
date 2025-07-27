"use client";

import React from "react";
import { ArrowRight } from "lucide-react";

export interface ExamTemplate {
  id: string;
  name: string;
  subject: string;
  grade: number;
  durationMinutes: number;
  totalScore: number;
  createdAt: string;
  updatedAt: string;
}

interface ExamTemplateCardProps {
  template: ExamTemplate;
  onView: (templateId: string) => void;
}

export default function ExamTemplateCard({
  template,
  onView,
}: ExamTemplateCardProps) {
  return (
    <div className="group relative overflow-hidden aspect-[5/3] rounded-xl border p-4 bg-white shadow-sm transition-shadow hover:shadow-md">
      {/* Hiệu ứng nền đen lan toàn thẻ */}
      <span
        style={{
          background:
            "linear-gradient(to bottom, #28E1E4 0%, #30C7EF 65%, #3AA7FC 75%, #407BE9 90%, #3714A2 100%)",
        }}
        className="absolute inset-0 scale-0 origin-bottom-left transition-transform duration-500 ease-out group-hover:scale-[2] -translate-x-20 translate-y-20 z-0 rounded-full"
      />

      {/* Nội dung chính */}
      <div className="relative z-10 flex flex-col justify-between h-full text-black group-hover:text-white transition-colors duration-300">
        <div className="mb-4">
          {/* Tiêu đề */}
          <h3 className="text-2xl font-calsans mb-4">{template.name}</h3>
        </div>

        {/* Footer: thời gian + xem chi tiết */}
        <div className="flex justify-between items-center">
          {/* Nút xem chi tiết */}
          <button
            onClick={() => onView(template.id)}
            className="flex items-center gap-2 text-sm font-medium"
          >
            <div className="p-2 -rotate-45 bg-black text-white rounded-full group-hover:bg-white group-hover:text-black transition-colors duration-300">
              <ArrowRight className="h-4 w-4" />
            </div>
            <span className="text-base">Xem chi tiết</span>
          </button>

          {/* Thẻ thời gian với hiệu ứng contrast */}
          <div className="text-sm font-medium px-3 py-1 rounded-full transition-colors duration-300 bg-black text-white group-hover:bg-white group-hover:text-black">
            {new Date(template.createdAt)
              .toLocaleString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })
              .replace(",", " -")}
          </div>
        </div>
      </div>
    </div>
  );
}
