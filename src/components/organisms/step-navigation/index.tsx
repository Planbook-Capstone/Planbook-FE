"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Circle } from "lucide-react";
import { useStepContext, StepId } from "@/contexts/StepContext";

interface StepNavigationProps {
  className?: string;
  layout?: "vertical" | "horizontal";
  showDescription?: boolean;
}

export default function StepNavigation({
  className,
  layout = "vertical",
  showDescription = true,
}: StepNavigationProps) {
  const {
    currentStep,
    steps,
    setCurrentStep,
    canNavigateToStep,
    getStepIndex,
  } = useStepContext();

  const handleStepClick = (stepId: StepId) => {
    if (canNavigateToStep(stepId)) {
      setCurrentStep(stepId);
    }
  };

  const getStepIcon = (stepId: StepId, isCurrent: boolean) => {
    if (isCurrent) {
      return <Circle className="w-4 h-4 text-white fill-current" />;
    }

    // Always show step number
    return (
      <span className="text-sm font-medium">{getStepIndex(stepId) + 1}</span>
    );
  };

  const getStepClasses = (isCurrent: boolean) => {
    const baseClasses =
      "flex items-center gap-3 p-3 rounded-full transition-all duration-200 border cursor-pointer";

    if (isCurrent) {
      return cn(baseClasses, "bg-indigo-50 border-indigo-300 ring-indigo-200");
    }

    // All sections are navigable
    return cn(
      baseClasses,
      "bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm"
    );
  };

  const getIconClasses = (isCurrent: boolean) => {
    const baseClasses =
      "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0";

    if (isCurrent) {
      return cn(baseClasses, "bg-indigo-700 text-white");
    }

    // All sections are navigable
    return cn(baseClasses, "bg-gray-200 text-gray-600");
  };

  const getTitleClasses = (isCurrent: boolean) => {
    if (isCurrent) {
      return "font-calsans text-neutral-900 text-sm";
    }

    // All sections are navigable
    return "font-calsans text-gray-900 text-sm";
  };

  const getDescriptionClasses = (isCurrent: boolean) => {
    if (isCurrent) {
      return "font-questrial text-indigo-700 text-xs";
    }

    // All sections are navigable
    return "font-questrial text-gray-600 text-xs";
  };

  if (layout === "horizontal") {
    return (
      <div className={cn("flex items-center gap-2 overflow-x-auto", className)}>
        {steps.map((step, index) => {
          const isCurrent = step.id === currentStep;
          const canNavigate = canNavigateToStep(step.id);

          return (
            <React.Fragment key={step.id}>
              <div
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 whitespace-nowrap cursor-pointer",
                  isCurrent && "bg-indigo-50 border border-indigo-200"
                )}
                onClick={() => handleStepClick(step.id)}
              >
                <div className={getIconClasses(isCurrent)}>
                  {getStepIcon(step.id, isCurrent)}
                </div>
                <span className={getTitleClasses(isCurrent)}>{step.title}</span>
              </div>

              {index < steps.length - 1 && (
                <div className="w-8 h-px bg-gray-300 flex-shrink-0" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      {steps.map((step) => {
        const isCurrent = step.id === currentStep;

        return (
          <div
            key={step.id}
            className={getStepClasses(isCurrent)}
            onClick={() => handleStepClick(step.id)}
          >
            <div className={getIconClasses(isCurrent)}>
              {getStepIcon(step.id, isCurrent)}
            </div>

            <div className="flex-1 min-w-0">
              <div className={getTitleClasses(isCurrent)}>{step.title}</div>
              {showDescription && step.description && (
                <div className={getDescriptionClasses(isCurrent)}>
                  {step.description}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
