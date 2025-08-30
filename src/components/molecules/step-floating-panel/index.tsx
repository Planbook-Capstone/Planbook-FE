"use client";

import { Steps, StepsProps } from "antd";
import { CSSProperties, useEffect, useRef } from "react";
import clsx from "clsx";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { RotateCw, ChevronUp } from "lucide-react";

type StepFloatingPanelProps = Omit<StepsProps, "onChange"> & {
  layout?: "horizontal" | "vertical";
  visible?: boolean;
  className?: string;
  style?: CSSProperties;
  initialPosition: { x: number; y: number };
  onStepChange?: (index: number) => void;
  disable?: boolean;
  isDescriptionHidden?: boolean;
  onToggleCollapse?: () => void;
  isCollapsed?: boolean;
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
  isDescriptionHidden = false,
  onToggleCollapse,
  isCollapsed,
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
          ? { width: "fit-content", ...style }
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
        <div className="flex items-center gap-2">
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
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="p-1 rounded-full flex items-center text-blue-700 cursor-pointer pr-2 pl-3 bg-blue-100 hover:bg-gray-100 transition-colors"
              title={isCollapsed ? "Mở rộng" : "Thu gọn"}
            >
              Thu gọn
              <ChevronUp
                className={`w-4 h-4 text-blue-600 transition-transform duration-300 ${
                  isCollapsed ? "rotate-180" : ""
                }`}
              />
            </button>
          )}
        </div>
      </div>

      <div className="relative overflow-hidden">
        <Steps
          direction={disable ? "horizontal" : direction}
          current={activeStep}
          onChange={handleChange}
          {...stepsProps}
          items={stepsProps.items?.map(item => ({
            ...item,
            description: item.description ? (
              <div
                className={`transition-all duration-300 ease-in-out ${
                  isDescriptionHidden
                    ? 'opacity-0 max-h-0 transform -translate-y-2'
                    : 'opacity-100 max-h-10 transform translate-y-0'
                }`}
                style={{ overflow: 'hidden' }}
              >
                <span className="font-questrial text-xs text-gray-500 truncate block">
                  {item.description}
                </span>
              </div>
            ) : undefined
          }))}
        />
      </div>
    </div>
  );
};
