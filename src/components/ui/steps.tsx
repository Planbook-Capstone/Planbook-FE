import React from "react";
import { cn } from "@/lib/utils";
import { Check, ChevronRight } from "lucide-react";

export type StepStatus = "wait" | "process" | "finish" | "error";

export interface StepItem {
  title: string;
  description?: string;
  status?: StepStatus;
}

interface StepsProps {
  current: number;
  items: StepItem[];
  onChange?: (current: number) => void;
  className?: string;
}

export function Steps({ current, items, onChange, className }: StepsProps) {
  const getStepStatus = (index: number): StepStatus => {
    if (index < current) return "finish";
    if (index === current) return "process";
    return "wait";
  };

  const getStepClasses = (status: StepStatus, isClickable: boolean) => {
    let baseClasses =
      "flex items-center gap-2 px-3 py-2 rounded-lg transition-all";

    if (isClickable) {
      baseClasses += " cursor-pointer hover:bg-gray-50";
    }

    switch (status) {
      case "finish":
        return cn(baseClasses, "bg-green-50 text-green-700");
      case "process":
        return cn(baseClasses, "bg-blue-50 text-blue-700 ring-2 ring-blue-200");
      case "wait":
        return cn(baseClasses, "text-gray-500");
      case "error":
        return cn(baseClasses, "bg-red-50 text-red-700");
      default:
        return baseClasses;
    }
  };

  const getStepIcon = (index: number, status: StepStatus) => {
    switch (status) {
      case "finish":
        return (
          <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center">
            <Check className="w-4 h-4" />
          </div>
        );
      case "process":
        return (
          <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center font-calsans text-sm">
            {index + 1}
          </div>
        );
      case "wait":
        return (
          <div className="w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center font-calsans text-sm">
            {index + 1}
          </div>
        );
      case "error":
        return (
          <div className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center font-calsans text-sm">
            {index + 1}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col md:flex-row items-stretch md:items-center w-full",
        className
      )}
    >
      {items.map((item, index) => {
        const status = getStepStatus(index);
        const isClickable = !!onChange;

        return (
          <React.Fragment key={index}>
            <div
              className={cn(
                getStepClasses(status, isClickable),
                "flex-1 min-w-0"
              )}
              onClick={() => isClickable && onChange?.(index)}
            >
              {getStepIcon(index, status)}
              <div className="flex flex-col min-w-0 flex-1">
                <span className="font-calsans text-sm truncate">
                  {item.title}
                </span>
                {item.description && (
                  <span className="font-questrial text-xs text-gray-500 truncate">
                    {item.description}
                  </span>
                )}
              </div>
            </div>

            {index < items.length - 1 && (
              <>
                <ChevronRight className="w-4 h-4 hidden md:block text-gray-400 flex-shrink-0 mx-1" />
                <div className="w-px h-4 bg-gray-300 block md:hidden flex-shrink-0 ml-5 mt-1" />
              </>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
