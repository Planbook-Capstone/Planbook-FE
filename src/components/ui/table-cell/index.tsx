"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Input } from "../input";

interface TableCellProps {
  value: string;
  onChange: (value: string) => void;
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
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

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
    onChange(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  const handleBlur = () => {
    handleSave();
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
        "border border-gray-300 p-2 min-w-[120px] cursor-pointer hover:bg-gray-50 transition-colors font-questrial",
        isHeader && "bg-gray-100 font-calsans",
        disabled && "cursor-not-allowed opacity-60",
        className
      )}
      onDoubleClick={handleDoubleClick}
      title={disabled ? "" : "Double-click để chỉnh sửa"}
    >
      <div className="text-sm text-gray-900">
        {value || <span className="text-gray-400 italic">{placeholder}</span>}
      </div>
    </td>
  );
}
