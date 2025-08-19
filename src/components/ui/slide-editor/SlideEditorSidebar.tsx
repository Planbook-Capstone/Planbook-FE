"use client";

import React from "react";
import { Type } from "lucide-react";
import { HiOutlineSparkles } from "react-icons/hi2";
import { PiCursorText } from "react-icons/pi";
import { Input } from "../input";

interface SlideEditorSidebarProps {
  onAddText: () => void;
  onAddHeading?: () => void;
  onAddSubheading?: () => void;
  onAddBodyText?: () => void;
}

export default function SlideEditorSidebar({
  onAddText,
  onAddHeading,
  onAddSubheading,
  onAddBodyText,
}: SlideEditorSidebarProps) {
  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Sidebar Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Search Section */}
        <div className="flex items-center px-3 border rounded-full">
          <HiOutlineSparkles className="text-neutral-500" />
          <Input
            placeholder="Tìm kiếm phông chữ"
            className="border-0 shadow-none text-base focus-visible:ring-0"
          />
        </div>
        {/* Text Tools Section */}
        <div className="mb-6">
          {/* Add Text Button */}
          <button
            onClick={onAddText}
            className="w-full p-3 text-white bg-neutral-800 border-0 rounded-sm transition-colors flex items-center gap-3"
          >
            <PiCursorText />
            <div className="text-sm">Thêm chữ</div>
          </button>

          {/* Text Presets */}
          <div className="mt-4 space-y-2">
            <div className="text-xs font-medium text-gray-600 mb-2">
              Kiểu chữ căn bản
            </div>

            <button
              onClick={onAddHeading || onAddText}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-sm hover:bg-gray-100 transition-colors text-left"
            >
              <div className="text-4xl font-calsans text-gray-900">Tiêu đề</div>
              <div className="text-xs text-gray-500">
                Chữ kích cỡ lớn (72px, in đậm)
              </div>
            </button>

            <button
              onClick={onAddSubheading || onAddText}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-sm hover:bg-gray-100 transition-colors text-left"
            >
              <div className="text-2xl font-calsans text-gray-900">
                Tiêu đề phụ
              </div>
              <div className="text-xs text-gray-500">
                Chữ kích cỡ trung bình (36px, in đậm)
              </div>
            </button>

            <button
              onClick={onAddBodyText || onAddText}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-sm hover:bg-gray-100 transition-colors text-left"
            >
              <div className="text-sm font-questrial text-gray-900">
                Chữ thường
              </div>
              <div className="text-xs text-gray-500">
                Chữ kich cỡ nhỏ (18px, thường)
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
