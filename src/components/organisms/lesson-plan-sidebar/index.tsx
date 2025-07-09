import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { StepCard } from "@/components/molecules/step-card";
import { StepNavigation } from "@/components/molecules/step-navigation";
import { ProgressBar } from "@/components/ui/progress-bar";
import { StepStatus } from "@/components/ui/step-indicator";
import { Tabs } from "@/components/ui/simple-tabs";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import { Type, FileText, Upload, Trash2, RotateCcw, Table } from "lucide-react";

interface Step {
  id: string;
  title: string;
  content?: string;
  nodeType?: string;
  order: number;
  children?: any[];
}

interface ComponentItem {
  id: string;
  type: "INPUT" | "CONTENT" | "REFERENCES" | "SUBSECTION" | "TABLE";
  label: string;
  icon: React.ReactNode;
  description: string;
}

interface LessonPlanSidebarProps {
  steps: Step[];
  currentStep: number;
  onStepChange: (stepIndex: number) => void;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit?: () => void;
  completedSteps?: number[];
  canGoBack?: boolean;
  canGoNext?: boolean;
  isSubmitting?: boolean;
  trashedItems?: any[];
  onRestoreFromTrash?: (itemId: string) => void;
  className?: string;
}

const COMPONENT_PALETTE: ComponentItem[] = [
  {
    id: "input",
    type: "INPUT",
    label: "Ô nhập",
    icon: <Type className="w-4 h-4" />,
    description: "Trường nhập liệu cho người dùng",
  },
  {
    id: "content",
    type: "CONTENT",
    label: "Nội dung",
    icon: <FileText className="w-4 h-4" />,
    description: "Khối nội dung với prompt AI",
  },
  {
    id: "references",
    type: "REFERENCES",
    label: "Học liệu",
    icon: <Upload className="w-4 h-4" />,
    description: "Upload file hoặc thêm link",
  },
  {
    id: "subsection",
    type: "SUBSECTION",
    label: "Phần con",
    icon: <FileText className="w-4 h-4" />,
    description: "Nhóm các trường con",
  },
  {
    id: "table",
    type: "TABLE",
    label: "Bảng",
    icon: <Table className="w-4 h-4" />,
    description: "Editor văn bản với hình ảnh",
  },
];

export function LessonPlanSidebar({
  steps,
  currentStep,
  onStepChange,
  onPrevious,
  onNext,
  onSubmit,
  completedSteps = [],
  canGoBack = true,
  canGoNext = true,
  isSubmitting = false,
  trashedItems = [],
  onRestoreFromTrash,
  className,
}: LessonPlanSidebarProps) {
  const getStepStatus = (stepIndex: number): StepStatus => {
    if (completedSteps.includes(stepIndex)) return "completed";
    if (stepIndex === currentStep) return "active";
    return "pending";
  };

  const completedCount = completedSteps.length;

  return (
    <div
      className={cn(
        "w-80 bg-white border-r border-gray-200 flex flex-col min-h-0",
        className
      )}
    >
      {/* Tabs Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <Tabs
          tabs={[
            {
              id: "components",
              label: "Học liệu",
              content: (
                <div className="space-y-3">
                  <h3 className="text-sm font-calsans text-gray-700 mb-3">
                    Kéo thả để thêm
                  </h3>
                  <Droppable droppableId="component-palette" isDropDisabled>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="space-y-3"
                      >
                        {COMPONENT_PALETTE.map((item, index) => (
                          <Draggable
                            key={item.id}
                            draggableId={item.type}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={cn(
                                  "p-3 border border-gray-200 rounded-lg cursor-move transition-colors",
                                  snapshot.isDragging
                                    ? "border-blue-500 bg-blue-100 shadow-lg"
                                    : "hover:border-blue-300 hover:bg-blue-50"
                                )}
                              >
                                <div className="flex items-center gap-3">
                                  <div className="text-gray-500">
                                    {item.icon}
                                  </div>
                                  <div className="flex-1">
                                    <div className="text-sm font-calsans text-gray-900">
                                      {item.label}
                                    </div>
                                    <div className="text-xs font-questrial text-gray-500">
                                      {item.description}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              ),
            },
            {
              id: "trash",
              label: "Thùng rác",
              content: (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-3">
                    <Trash2 className="w-4 h-4 text-gray-500" />
                    <h3 className="text-sm font-calsans text-gray-700">
                      Đã xóa ({trashedItems.length})
                    </h3>
                  </div>

                  <Droppable droppableId="trash">
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={cn(
                          "min-h-[100px] border-2 border-dashed rounded-lg p-4 transition-colors",
                          snapshot.isDraggingOver
                            ? "border-red-400 bg-red-50"
                            : "border-gray-300"
                        )}
                      >
                        {trashedItems.length === 0 ? (
                          <div className="text-center py-4">
                            <Trash2 className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                            <p className="text-sm font-questrial text-gray-500">
                              {snapshot.isDraggingOver
                                ? "Thả vào đây để xóa"
                                : "Thùng rác trống"}
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {trashedItems.map((item, index) => (
                              <div
                                key={item.id}
                                className="p-3 border border-red-200 rounded-lg bg-red-50"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex-1">
                                    <div className="text-sm font-calsans text-red-800">
                                      {item.component.title}
                                    </div>
                                    <div className="text-xs font-questrial text-red-600">
                                      {item.component?.fieldType
                                        ? `${item.component?.fieldType} của`
                                        : null}{" "}
                                      {item.component.type} • Xóa lúc{" "}
                                      {new Date(
                                        item.deletedAt
                                      ).toLocaleTimeString()}
                                    </div>
                                    {item.component.content && (
                                      <div className="text-xs font-questrial text-red-500 mt-1 truncate">
                                        "{item.component.content}"
                                      </div>
                                    )}
                                  </div>
                                  <button
                                    className="p-2 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-md transition-colors"
                                    onClick={() =>
                                      onRestoreFromTrash?.(item.id)
                                    }
                                    title="Khôi phục component này"
                                  >
                                    <RotateCcw className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              ),
            },
          ]}
          defaultTab="components"
        />
      </div>
    </div>
  );
}
