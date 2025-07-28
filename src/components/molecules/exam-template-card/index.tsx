"use client";

import React, { useState, useEffect, useRef } from "react";
import { ArrowRight, MoreVertical, Edit, Copy, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
  onEdit?: (templateId: string) => void;
  onDuplicate?: (templateId: string) => void;
  onDelete?: (templateId: string) => void;
  isCloning?: boolean;
  isDeleting?: boolean;
}

export default function ExamTemplateCard({
  template,
  onView,
  onEdit,
  onDuplicate,
  onDelete,
  isCloning = false,
  isDeleting = false,
}: ExamTemplateCardProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get grade badge color
  const getGradeBadgeColor = (grade: number) => {
    switch (grade) {
      case 10:
        return "bg-cyan-500 group-hover:bg-white text-white group-hover:text-black";
      case 11:
        return "bg-sky-500 group-hover:bg-white text-white group-hover:text-black";
      case 12:
        return "bg-indigo-500 group-hover:bg-white text-white group-hover:text-black";
      default:
        return "bg-black group-hover:bg-white text-white group-hover:text-black";
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showDropdown]);
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
          {/* Template Info - Trên cùng */}
          <div className="flex items-center justify-between gap-2 text-sm mb-3">
            <div className="flex items-center gap-2">
              <span className="text-base font-medium text-black group-hover:text-white transition-colors duration-300">
                {template.subject}
              </span>
            </div>
            <div className="flex gap-2 items-center">
              <Badge
                variant="secondary"
                className={`${getGradeBadgeColor(
                  template.grade
                )} text-xs px-2 py-1 rounded-full transition-colors duration-300`}
              >
                Lớp {template.grade}
              </Badge>
              <Badge
                variant="outline"
                className="border-black group-hover:border-white text-black group-hover:text-white text-xs px-2 py-1 rounded-full transition-colors duration-300"
              >
                {template.durationMinutes} phút
              </Badge>

              {/* Dropdown Menu */}
              {(onEdit || onDuplicate || onDelete) && (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDropdown(!showDropdown);
                    }}
                    className="p-1 rounded-full hover:bg-black/10 group-hover:hover:bg-white/20 transition-colors"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {showDropdown && (
                    <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-20 min-w-[120px]">
                      {onEdit && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(template.id);
                            setShowDropdown(false);
                          }}
                          className="w-full px-3 py-2 text-left hover:bg-gray-100 flex items-center gap-2 text-gray-700"
                        >
                          <Edit className="w-4 h-4" />
                          Chỉnh sửa
                        </button>
                      )}
                      {onDuplicate && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDuplicate(template.id);
                            setShowDropdown(false);
                          }}
                          disabled={isCloning}
                          className="w-full px-3 py-2 text-left hover:bg-gray-100 flex items-center gap-2 text-gray-700 disabled:opacity-50"
                        >
                          <Copy className="w-4 h-4" />
                          {isCloning ? "Đang sao chép..." : "Sao chép"}
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(template.id);
                            setShowDropdown(false);
                          }}
                          disabled={isDeleting}
                          className="w-full px-3 py-2 text-left hover:bg-gray-100 flex items-center gap-2 text-red-600 disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" />
                          {isDeleting ? "Đang xóa..." : "Xóa"}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Header với tiêu đề */}
          <div>
            <h3 className="text-2xl font-calsans">{template.name}</h3>
          </div>
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
