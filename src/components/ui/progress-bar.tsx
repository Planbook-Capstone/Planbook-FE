import React from "react";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  current: number;
  total: number;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  color?: "blue" | "green" | "orange" | "purple";
  className?: string;
}

export function ProgressBar({
  current,
  total,
  showLabel = true,
  size = "md",
  color = "blue",
  className,
}: ProgressBarProps) {
  const percentage = Math.round((current / total) * 100);

  const sizeClasses = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3",
  };

  const colorClasses = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    orange: "bg-orange-500",
    purple: "bg-purple-500",
  };

  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-calsans text-gray-700">Tiến độ</span>
          <span className="text-sm font-questrial text-gray-500">
            {current}/{total} ({percentage}%)
          </span>
        </div>
      )}

      <div
        className={cn(
          "w-full bg-gray-200 rounded-full overflow-hidden",
          sizeClasses[size]
        )}
      >
        <div
          className={cn(
            "h-full transition-all duration-300 ease-out",
            colorClasses[color]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
