"use client";

import { Steps, StepsProps } from "antd";
import { CSSProperties, useEffect, useRef } from "react";
import clsx from "clsx";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { RotateCw } from "lucide-react";

type StepFloatingPanelProps = Omit<StepsProps, "onChange"> & {
  layout?: "horizontal" | "vertical";
  visible?: boolean;
  className?: string;
  style?: CSSProperties;
  initialPosition: { x: number; y: number };
  onStepChange?: (index: number) => void;
  disable?: boolean;
};

export const StepFloatingPanel = ({
  layout = "vertical",
  visible = true,
  className,
  style,
  onStepChange,
  current = 0,
  initialPosition = { x: 100, y: 200 },
  disable = false,
  ...stepsProps
}: StepFloatingPanelProps) => {
  // Sử dụng localStorage để lưu trữ direction
  const [direction, setDirection] = useLocalStorage<"horizontal" | "vertical">(
    "step-floating-panel-direction",
    layout
  );

  // Sử dụng localStorage để lưu trữ activeStep
  const [activeStep, setActiveStep] = useLocalStorage<number>(
    "step-floating-panel-active-step",
    Number(current)
  );

  // Sử dụng localStorage để lưu trữ position
  const [savedPosition, setSavedPosition] = useLocalStorage<{ x: number; y: number }>(
    "step-floating-panel-position",
    initialPosition
  );

  // Custom draggable hook với localStorage support
  const dragRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = dragRef.current;
    if (!el || disable) return;

    let pos = { x: 0, y: 0 };
    let isDragging = false;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      pos = {
        x: e.clientX - el.offsetLeft,
        y: e.clientY - el.offsetTop,
      };
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const newLeft = e.clientX - pos.x;
      const newTop = e.clientY - pos.y;

      const maxX = window.innerWidth - el.offsetWidth;
      const maxY = window.innerHeight - el.offsetHeight;

      const finalLeft = Math.max(0, Math.min(newLeft, maxX));
      const finalTop = Math.max(0, Math.min(newTop, maxY));

      el.style.left = `${finalLeft}px`;
      el.style.top = `${finalTop}px`;
    };

    const onMouseUp = () => {
      if (isDragging) {
        // Lưu position mới vào localStorage khi kết thúc drag
        const finalPosition = {
          x: parseInt(el.style.left) || savedPosition.x,
          y: parseInt(el.style.top) || savedPosition.y,
        };
        setSavedPosition(finalPosition);
      }
      isDragging = false;
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    el.addEventListener("mousedown", onMouseDown);

    return () => {
      el.removeEventListener("mousedown", onMouseDown);
    };
  }, [savedPosition, setSavedPosition, disable]);

  // Đồng bộ activeStep với current prop khi có thay đổi từ bên ngoài
  useEffect(() => {
    if (current !== undefined && current !== activeStep) {
      setActiveStep(current);
    }
  }, [current, activeStep, setActiveStep]);

  if (!visible) return null;

  const handleChange = (newStep: number) => {
    setActiveStep(newStep);
    onStepChange?.(newStep);
  };

  return (
    <div
      ref={dragRef}
      className={clsx(
        disable
          ? "bg-white p-6 rounded-lg shadow-lg border border-gray-200 cursor-default"
          : "fixed z-50 bg-white p-6 rounded-lg shadow-lg border border-gray-200 cursor-move",
        direction === "vertical" ? "min-w-[220px]" : "min-w-fit max-w-[90vw]",
        className
      )}
      style={
        disable
          ? { ...style }
          : {
              top: savedPosition.y,
              left: savedPosition.x,
              position: "fixed",
              ...style,
            }
      }
      id="steps-floating-panel"
    >
      <div className="flex justify-between items-center mb-3 gap-2">
        <span className="font-calsans text-base text-gray-700">
          Danh sách các bước
        </span>
        {!disable && (
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
        )}
      </div>

      <Steps
        direction={disable ? "horizontal" : direction}
        current={activeStep}
        onChange={handleChange}
        {...stepsProps}
      />
    </div>
  );
};
