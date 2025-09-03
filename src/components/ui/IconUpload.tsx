"use client";

import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Upload, X } from "lucide-react";

interface IconUploadProps {
  value?: string;
  onChange: (value: string) => void;
  className?: string;
}

export function IconUpload({ value, onChange, className }: IconUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chọn file hình ảnh");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("File không được vượt quá 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onChange(result);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleRemoveIcon = () => {
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`${className} space-y-3`}>
      {/* Upload area - chiếm full hàng */}
      <div
        className={`
          relative border border-dashed rounded-lg px-3 py-2 text-center transition-colors cursor-pointer w-full
          ${dragOver ? "border-blue-400 bg-blue-50" : "border-gray-300"}
          ${value ? "border-green-400 bg-green-50" : "hover:border-gray-400"}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleButtonClick}
      >
        <div className="flex items-center justify-center space-x-2">
          <Upload className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600">
            {value ? "Thay đổi icon" : "Chọn tệp"}
          </span>
        </div>
        <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF (tối đa 2MB)</p>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
        />
      </div>

      {/* Preview icon - xuống dưới cùng và chiếm full hàng */}
      {value && (
        <div className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-lg border">
          <div className="flex items-center space-x-3">
            <img
              src={value}
              alt="Icon preview"
              className="w-12 h-12 object-contain rounded border bg-white"
            />
            <div>
              <p className="text-sm font-medium text-gray-700">Icon đã chọn</p>
              <p className="text-xs text-gray-500">Sẵn sàng sử dụng</p>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleRemoveIcon}
            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2"
          >
            <X size={16} />
          </Button>
        </div>
      )}
    </div>
  );
}
