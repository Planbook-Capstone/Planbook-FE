"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Input } from "../input";
import { ImageIcon, X } from "lucide-react";

interface CellContent {
  text?: string;
  image?: {
    url: string;
    name?: string;
  };
}

interface TableCellProps {
  value: string | CellContent;
  onChange: (value: string | CellContent) => void;
  isHeader?: boolean;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
}

export function TableCell({
  value,
  onChange,
  isHeader = false,
  className,
  placeholder = "Nhập nội dung...",
  disabled = false,
}: TableCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Parse value to get text and image
  const parsedValue = React.useMemo(() => {
    if (typeof value === "string") {
      return { text: value, image: null };
    }
    return { text: value?.text || "", image: value?.image || null };
  }, [value]);

  useEffect(() => {
    setEditValue(parsedValue.text);
  }, [parsedValue.text]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    if (!disabled) {
      setIsEditing(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  const handleSave = () => {
    // If there's no image, just return the text string for simplicity
    if (!parsedValue.image) {
      onChange(editValue);
    } else {
      const newValue: CellContent = {
        text: editValue,
        image: parsedValue.image,
      };
      onChange(newValue);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(parsedValue.text);
    setIsEditing(false);
  };

  const handleBlur = () => {
    handleSave();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));

    if (imageFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        const newValue: CellContent = {
          text: parsedValue.text,
          image: {
            url: imageUrl,
            name: imageFile.name,
          },
        };
        onChange(newValue);
      };
      reader.readAsDataURL(imageFile);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        const newValue: CellContent = {
          text: parsedValue.text,
          image: {
            url: imageUrl,
            name: file.name,
          },
        };
        onChange(newValue);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    // If removing image and only text remains, return just the text string
    if (parsedValue.text) {
      onChange(parsedValue.text);
    } else {
      onChange("");
    }
  };

  if (isEditing) {
    return (
      <td
        className={cn(
          "border border-gray-300 p-2 min-w-[120px]",
          isHeader && "bg-gray-50 font-semibold",
          className
        )}
      >
        <Input
          ref={inputRef}
          asTextarea
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className="w-full bg-transparent border-none outline-none font-questrial text-sm"
          placeholder={placeholder}
        />
      </td>
    );
  }

  return (
    <td
      className={cn(
        "border border-gray-300 p-2 min-w-[120px] cursor-pointer hover:bg-gray-50 transition-colors font-questrial relative",
        isHeader && "bg-gray-100 font-calsans",
        disabled && "cursor-not-allowed opacity-60",
        isDragOver && "bg-blue-50 border-blue-300",
        className
      )}
      onDoubleClick={handleDoubleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      title={disabled ? "" : "Double-click để chỉnh sửa hoặc kéo hình ảnh vào"}
    >
      <div className="space-y-2">
        {/* Text content with markdown support for title/content format */}
        {parsedValue.text && (
          <div className="text-sm text-gray-900">
            {parsedValue.text.includes('**') && parsedValue.text.includes('\n') ? (
              // Handle title + content format: **title**\n  content
              parsedValue.text.split('\n').map((line, index) => {
                if (line.startsWith('**') && line.endsWith('**')) {
                  // Title line - bold
                  const titleText = line.replace(/\*\*/g, '');
                  return (
                    <div key={index} className="font-bold">
                      {titleText}
                    </div>
                  );
                } else if (line.startsWith('  ')) {
                  // Content line with padding
                  return (
                    <div key={index} className="pl-2 mt-1">
                      {line.trim()}
                    </div>
                  );
                } else {
                  // Regular line
                  return (
                    <div key={index}>
                      {line}
                    </div>
                  );
                }
              })
            ) : parsedValue.text.startsWith('**') && parsedValue.text.endsWith('**') ? (
              // Handle title only format: **title**
              <div className="font-bold">
                {parsedValue.text.replace(/\*\*/g, '')}
              </div>
            ) : (
              // Regular text
              parsedValue.text
            )}
          </div>
        )}

        {/* Image content */}
        {parsedValue.image && (
          <div className="relative group">
            <img
              src={parsedValue.image.url}
              alt={parsedValue.image.name || "Cell image"}
              className="max-w-full h-auto max-h-20 object-contain rounded"
            />
            {!disabled && (
              <button
                onClick={handleRemoveImage}
                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                title="Xóa hình ảnh"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        )}

        {/* Empty state */}
        {!parsedValue.text && !parsedValue.image && (
          <div className="flex items-center justify-between">
            <span className="text-gray-400 italic text-sm">{placeholder}</span>
            {!disabled && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-gray-400 hover:text-blue-500 transition-colors"
                title="Thêm hình ảnh"
              >
                <ImageIcon className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </td>
  );
}
