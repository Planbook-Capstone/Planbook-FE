import React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export type StepStatus = "pending" | "active" | "completed";

interface StepIndicatorProps {
  stepNumber: number;
  status: StepStatus;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function StepIndicator({
  stepNumber,
  status,
  size = "md",
  className,
}: StepIndicatorProps) {
  const sizeClasses = {
    sm: "w-6 h-6 text-xs",
    md: "w-8 h-8 text-sm",
    lg: "w-10 h-10 text-base",
  };

  const statusClasses = {
    pending: "bg-gray-200 text-gray-600",
    active: "bg-blue-500 text-white",
    completed: "bg-green-500 text-white",
  };

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center font-calsans transition-colors",
        sizeClasses[size],
        statusClasses[status],
        className
      )}
    >
      {status === "completed" ? <Check className="w-4 h-4" /> : stepNumber}
    </div>
  );
}
