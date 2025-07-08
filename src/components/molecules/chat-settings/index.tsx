"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type ChatPosition =
  | "bottom-left"
  | "bottom-right"
  | "top-left"
  | "top-right";

export interface ChatSettingsProps {
  position: ChatPosition;
  onPositionChange: (position: ChatPosition) => void;
  className?: string;
  isVisible: boolean;
}

const positionOptions: {
  value: ChatPosition;
  id: number;
  icon: string;
  label: string;
}[] = [
  { id: 4, value: "bottom-right", icon: "⬊", label: "Phải dưới" },
  { id: 1, value: "top-left", icon: "⬉", label: "Trái trên" },
  { id: 3, value: "bottom-left", icon: "⬋", label: "Trái dưới" },
  { id: 2, value: "top-right", icon: "⬈", label: "Phải trên" },
];

export default function ChatSettings({
  position,
  onPositionChange,
  className,
  isVisible,
}: ChatSettingsProps) {
  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "bg-white rounded-lg shadow-lg border border-gray-200 p-3",
        "transition-all duration-200 ease-out",
        "animate-in fade-in-0 slide-in-from-bottom-2",
        "min-w-[140px]",
        className
      )}
    >
      <div className="text-xs text-gray-600 mb-3 px-1 font-questrial font-medium">
        Chọn vị trí
      </div>
      <div className="grid grid-cols-2 gap-2">
        {positionOptions
          .sort((a, b) => a.id - b.id)
          .map((option) => (
            <button
              key={option.value}
              onClick={() => onPositionChange(option.value)}
              className={cn(
                "px-3 py-2 rounded-md flex flex-col items-center justify-center text-xs transition-all",
                "hover:bg-gray-100 hover:scale-105",
                "border border-transparent",
                position === option.value
                  ? "bg-blue-100 text-blue-600 border-blue-200 shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              )}
            >
              <span className="text-sm mb-1">{option.icon}</span>
              <span className="font-questrial leading-tight">
                {option.label}
              </span>
            </button>
          ))}
      </div>
    </div>
  );
}
