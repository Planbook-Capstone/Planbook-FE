import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { ChevronLeft, ChevronRight, Check, Loader2 } from "lucide-react";

interface StepNavigationProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit?: () => void;
  canGoBack?: boolean;
  canGoNext?: boolean;
  isSubmitting?: boolean;
  className?: string;
}

export function StepNavigation({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onSubmit,
  canGoBack = true,
  canGoNext = true,
  isSubmitting = false,
  className,
}: StepNavigationProps) {
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  return (
    <div className={cn("flex items-center justify-between", className)}>
      <Button
        onClick={onPrevious}
        variant="outline"
        disabled={isFirstStep || !canGoBack}
        className="flex items-center gap-2 font-questrial"
      >
        <ChevronLeft className="w-4 h-4" />
        Quay lại
      </Button>

      <div className="flex items-center gap-2 text-sm text-gray-500">
        <span className="font-calsans">
          {currentStep + 1} / {totalSteps}
        </span>
      </div>

      {isLastStep ? (
        <Button
          onClick={onSubmit || onNext}
          variant="default"
          disabled={!canGoNext || isSubmitting}
          className="flex items-center gap-2 font-questrial bg-green-600 hover:bg-green-700"
        >
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {isSubmitting ? "Đang xử lý..." : "Hoàn thành"}
          {!isSubmitting && <Check className="w-4 h-4" />}
        </Button>
      ) : (
        <Button
          onClick={onNext}
          variant="default"
          disabled={!canGoNext}
          className="flex items-center gap-2 font-questrial"
        >
          Tiếp tục
          <ChevronRight className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}
