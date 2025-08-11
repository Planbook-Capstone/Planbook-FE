"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { useLessonsByIdsService } from "@/services/lessonServices";

interface DocumentInfo {
  id?: string;
  name: string;
  title: string;
  description: string;
  creator: string;
  createdAt: string;
  updateAt: string;
  lessonIds?: string[];
  type?: string;
}

interface CustomButton {
  label: string;
  onClick: () => void;
  variant?:
    | "default"
    | "outline"
    | "secondary"
    | "destructive"
    | "ghost"
    | "link"
    | "custom";
  icon?: React.ReactNode;
  className?: string;
}

interface DocumentInfoPanelProps {
  documentInfo?: DocumentInfo;
  className?: string;
  variant?: "primary" | "secondary";
  customButtons?: CustomButton[];
}

export default function DocumentInfoPanel({
  documentInfo,
  className = "",
  variant = "primary",
  customButtons = [],
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
  const lessonQueries = useLessonsByIdsService(documentInfo?.lessonIds || []);

  // Get all lessons data
  const lessons = lessonQueries
    .filter((query: any) => query.data)
    .map((query: any) => query.data?.data)
    .filter(Boolean);
  if (variant === "secondary") {
    return (
      <aside
        className={`w-full px-6 py-6 space-y-6  sticky top-0 ${className}`}
      >
        {/* Lesson names at the top with font-calsans */}
        <div className="space-y-2">
          <div className="font-calsans text-lg text-gray-900">
            {lessons?.map((lesson: any) => (
              <div key={lesson?.id}>{lesson?.name}</div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <div className="grid grid-cols-[1fr_2fr] gap-1 text-base">
            <div className="font-calsans text-nowrap ">Tên tài liệu</div>
            <div className="font-questrial text-gray-900  leading-relaxed">
              {info?.name}
            </div>
          </div>

          <div className="grid grid-cols-[1fr_2fr] gap-1 text-base">
            <div className="font-calsans text-nowrap">Mô tả</div>
            <div className="font-questrial text-gray-900  leading-relaxed">
              {info?.description}
            </div>
          </div>

          <div className="grid grid-cols-[1fr_2fr] gap-1 text-base">
            <div className="font-calsans text-nowrap ">Ngày tạo</div>
            <div className="font-questrial text-gray-900  leading-relaxed">
              {formatDate(info?.createdAt)}
            </div>
          </div>
        </div>

        {/* Custom Buttons */}
        {customButtons.length > 0 && (
          <div className="space-y-2">
            {customButtons.map((button, index) => (
              <Button
                key={index}
                onClick={button.onClick}
                variant={button.variant || "default"}
                className={`w-full ${button.className || ""}`}
              >
                {button.icon && <span className="mr-2">{button.icon}</span>}
                {button.label}
              </Button>
            ))}
          </div>
        )}
      </aside>
    );
  }

  return (
    <aside className={`w-full px-6 py-6 space-y-6 ${className}`}>
      <div className="space-y-2">
        <div className="grid grid-cols-[1fr_2fr] gap-1 text-base">
          <div className="font-calsans text-nowrap ">Tên tài liệu</div>
          <div className="font-questrial text-gray-900  leading-relaxed">
            {info?.name}
          </div>
        </div>

        <div className="grid grid-cols-[1fr_2fr] gap-1 text-base">
          <div className="font-calsans text-nowrap">Mô tả</div>
          <div className="font-questrial text-gray-900  leading-relaxed">
            {info?.description}
          </div>
        </div>

        <div className="grid grid-cols-[1fr_2fr] gap-1 text-base">
          <div className="font-calsans text-nowrap ">Bài học đã chọn</div>
          <div className="font-questrial text-gray-900  leading-relaxed">
            {lessons?.map((lesson: any) => (
              <div key={lesson.id}>{lesson.name}</div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-[1fr_2fr] gap-1 text-base">
          <div className="font-calsans text-nowrap ">Ngày tạo</div>
          <div className="font-questrial text-gray-900  leading-relaxed">
            {formatDate(info?.createdAt)}
          </div>
        </div>
      </div>

      {/* Custom Buttons */}
      {customButtons.length > 0 && (
        <div className="space-y-2">
          {customButtons.map((button, index) => (
            <Button
              key={index}
              onClick={button.onClick}
              variant={button.variant || "default"}
              className={`w-full ${button.className || ""}`}
            >
              {button.icon && <span className="mr-2">{button.icon}</span>}
              {button.label}
            </Button>
          ))}
        </div>
      )}

      {/* <Button className="w-full bg-gray-800 hover:bg-gray-700 text-white text-xs py-3">
        <Download className="h-3 w-3 mr-2" />
        In phiếu trả lời trắc nghiệm
      </Button> */}
    </aside>
  );
}

export type { DocumentInfo, DocumentInfoPanelProps, CustomButton };
