import React from "react";
import { cn } from "@/lib/utils";
import { StepIndicator, StepStatus } from "@/components/ui/step-indicator";
import { Clock } from "lucide-react";

interface StepCardProps {
  stepNumber: number;
  title: string;
  description?: string;
  status: StepStatus;
  isActive?: boolean;
  onClick: () => void;
  timeAllocation?: number;
  isRequired?: boolean;
  className?: string;
}

export function StepCard({
  stepNumber,
  title,
  description,
  status,
  isActive = false,
  onClick,
  timeAllocation,
  isRequired = false,
  className,
}: StepCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left p-4 rounded-lg border transition-all",
        "hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500",
        isActive
          ? "border-blue-500 bg-blue-50 shadow-sm"
          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <StepIndicator
          stepNumber={stepNumber}
          status={status}
          className="mt-1 flex-shrink-0"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3
              className={cn(
                "font-calsans text-sm truncate",
                isActive ? "text-blue-900" : "text-gray-900"
              )}
            >
              {title}
            </h3>

            {isRequired && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-calsans bg-orange-100 text-orange-800 flex-shrink-0">
                Bắt buộc
              </span>
            )}
          </div>

          {description && (
            <p
              className={cn(
                "text-xs font-questrial mt-1 line-clamp-2",
                isActive ? "text-blue-700" : "text-gray-500"
              )}
            >
              {description}
            </p>
          )}

          {timeAllocation && (
            <div
              className={cn(
                "text-xs font-questrial mt-2 flex items-center gap-1",
                isActive ? "text-blue-600" : "text-gray-400"
              )}
            >
              <Clock className="w-3 h-3" />
              {timeAllocation} phút
            </div>
          )}
        </div>
      </div>
    </button>
  );
}
