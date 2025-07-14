"use client";

import { Steps, StepsProps } from "antd";
import { CSSProperties, useState } from "react";
import clsx from "clsx";
import { useDraggable } from "@/hooks/useDraggable";
import { RotateCw } from "lucide-react";

type StepFloatingPanelProps = Omit<StepsProps, "onChange"> & {
  layout?: "horizontal" | "vertical";
  visible?: boolean;
  className?: string;
  style?: CSSProperties;
  initialPosition: { x: number; y: number };
  onStepChange?: (index: number) => void;
};

export const StepFloatingPanel = ({
  layout = "vertical",
  visible = true,
  className,
  style,
  onStepChange,
  current = 0,
  initialPosition = { x: 100, y: 200 },
  ...stepsProps
}: StepFloatingPanelProps) => {
  const dragRef = useDraggable();
  const [direction, setDirection] = useState<"horizontal" | "vertical">(layout);
  const [activeStep, setActiveStep] = useState<number>(Number(current));

  if (!visible) return null;

  const handleChange = (newStep: number) => {
    setActiveStep(newStep);
    onStepChange?.(newStep);
  };

  return (
    <div
      ref={dragRef}
      className={clsx(
        "fixed z-50 bg-white p-6 rounded-lg shadow-lg border border-gray-200 cursor-move",
        direction === "vertical" ? "min-w-[220px]" : "min-w-fit max-w-[90vw]",
        className
      )}
      style={{
        top: initialPosition.y,
        left: initialPosition.x,
        position: "fixed",
        ...style,
      }}
      id="steps-floating-panel"
    >
      <div className="flex justify-between items-center mb-3 gap-2">
        <span className="font-calsans text-base text-gray-700">
          Danh sách các bước
        </span>
        <button
          onClick={() =>
            setDirection((prev) =>
              prev === "horizontal" ? "vertical" : "horizontal"
            )
          }
          className="text-xs flex items-center gap-1 text-gray-600 hover:text-black"
          title="Toggle layout"
        >
          <RotateCw className="w-4 h-4" />
          {direction === "horizontal" ? "Dọc" : "Ngang"}
        </button>
      </div>

      <Steps
        direction={direction}
        current={activeStep}
        onChange={handleChange}
        {...stepsProps}
      />
    </div>
  );
};
