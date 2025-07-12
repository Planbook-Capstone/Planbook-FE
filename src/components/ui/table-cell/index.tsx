"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Input } from "../input";
import { TableCellEditor } from "../table-cell-editor";
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
    console.log("🔍 TableCell object value:", value);
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
    // For Tiptap editor, we'll handle save/cancel differently
    if (e.key === "Escape") {
      handleCancel();
    }
    // Note: Enter key should work normally in Tiptap for line breaks
    // We'll use Ctrl+Enter or blur to save
  };

  const handleSave = () => {
    // Save HTML content from Tiptap editor
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
    // Add a small delay to allow toolbar clicks to complete
    setTimeout(() => {
      handleSave();
    }, 150);
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
    const imageFile = files.find((file) => file.type.startsWith("image/"));

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
    if (file && file.type.startsWith("image/")) {
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
          "border-2 border-blue-400 p-0 w-auto bg-white shadow-lg",
          isHeader && "bg-blue-50",
          className
        )}
        style={{ zIndex: 10 }}
      >
        <TableCellEditor
          content={editValue}
          onChange={(content) => setEditValue(content)}
          onBlur={handleSave}
          onSave={handleSave}
          onCancel={handleCancel}
          autoFocus={true}
          placeholder={placeholder}
          className="w-full bg-white border-none shadow-none"
        />
      </td>
    );
  }

  return (
    <td
      className={cn(
        "border border-gray-300 p-2 w-auto cursor-pointer hover:bg-gray-50 transition-colors font-questrial relative",
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
        {/* Rich text content from Tiptap editor */}
        {parsedValue.text && (
          <div
            className="text-sm text-gray-900 prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: parsedValue.text }}
          />
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
      </div>
    </td>
  );
}
