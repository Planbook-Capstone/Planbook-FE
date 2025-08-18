"use client";

import React from "react";

interface ColorOption {
  value: string;
  color: string;
  label: string;
}

interface ColorPickerProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
  className?: string;
}

const COLOR_OPTIONS: ColorOption[] = [
  { value: "bg-amber-50", color: "bg-amber-200", label: "Vàng nhạt" },
  { value: "bg-green-50", color: "bg-green-200", label: "Xanh lá nhạt" },
  { value: "bg-sky-50", color: "bg-sky-200", label: "Xanh dương nhạt" },
  { value: "bg-purple-50", color: "bg-purple-200", label: "Tím nhạt" },
  { value: "bg-pink-50", color: "bg-pink-200", label: "Hồng nhạt" },
  { value: "bg-orange-50", color: "bg-orange-200", label: "Cam nhạt" },
  { value: "bg-emerald-50", color: "bg-emerald-200", label: "Xanh ngọc" },
  { value: "bg-indigo-50", color: "bg-indigo-200", label: "Chàm nhạt" },
  { value: "bg-gray-50", color: "bg-gray-200", label: "Xám nhạt" },
];

export function ColorPicker({
  selectedColor,
  onColorChange,
  className = "",
}: ColorPickerProps) {
  return (
    <div className={`flex gap-2 flex-wrap ${className}`}>
      {COLOR_OPTIONS.map((colorOption) => (
        <button
          key={colorOption.value}
          type="button"
          onClick={() => onColorChange(colorOption.value)}
          className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
            selectedColor === colorOption.value
              ? "border-blue-500 ring-2 ring-blue-200"
              : "border-gray-300 hover:border-gray-400"
          } ${colorOption.color}`}
          title={colorOption.label}
        />
      ))}
    </div>
  );
}

export default ColorPicker;
