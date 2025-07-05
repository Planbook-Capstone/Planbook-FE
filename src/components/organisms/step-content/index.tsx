import React from "react";
import { cn } from "@/lib/utils";
import { KeywordForm } from "@/components/molecules/keyword-form";
import { Steps, StepItem } from "@/components/ui/steps";
import { Button } from "@/components/ui/Button";
import { Droppable } from "@hello-pangea/dnd";
import { FileText, ChevronLeft, ChevronRight, Plus } from "lucide-react";

interface Step {
  id: string;
  title: string;
  content?: string;
  nodeType?: string;
  children?: any[];
}

interface StepContentProps {
  step: Step;
  formData: Record<string, string>;
  onFormDataChange: (keywordId: string, value: string) => void;
  currentStep: number;
  totalSteps: number;
  allSteps?: Step[];
  onStepChange?: (stepIndex: number) => void;
  onPrevious?: () => void;
  onNext?: () => void;
  canGoNext?: boolean;
  mergedComponents?: any[];
  onDeleteComponent?: (componentId: string, staticComponent?: any) => void;
  isEditMode?: boolean;
  className?: string;
}

export function StepContent({
  step,
  formData,
  onFormDataChange,
  currentStep,
  totalSteps,
  allSteps = [],
  onStepChange,
  onPrevious,
  onNext,
  canGoNext = true,
  mergedComponents = [],
  onDeleteComponent,
  isEditMode = false,
  className,
}: StepContentProps) {
  return (
    <div className={cn("flex-1 flex flex-col min-h-0", className)}>
      {/* Step Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-4 flex-shrink-0">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="text-sm text-gray-500 font-calsans">
                  Bước {currentStep + 1} / {totalSteps}
                </div>
                <div className="h-4 w-px bg-gray-300" />
                <h1 className="text-xl font-calsans text-gray-900">
                  {step?.title}
                </h1>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center gap-3">
              <Button
                onClick={onPrevious}
                variant="outline"
                disabled={currentStep === 0}
                className="flex items-center gap-2 font-questrial"
              >
                <ChevronLeft className="w-4 h-4" />
                Quay lại
              </Button>

              <Button
                onClick={onNext}
                variant="default"
                disabled={!canGoNext}
                className="flex items-center gap-2 font-questrial"
              >
                {currentStep === totalSteps - 1 ? "Hoàn thành" : "Tiếp tục"}
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {step.content && (
            <p className="text-gray-600 font-questrial mt-2">{step.content}</p>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto bg-gray-50 min-h-0">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            {/* Content */}
            <div className="p-8">
              <Droppable droppableId={`form-${step.id}`}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={cn(
                      "min-h-[200px] transition-colors",
                      snapshot.isDraggingOver &&
                        "bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg p-4"
                    )}
                  >
                    {mergedComponents.length > 0 ? (
                      <div className="space-y-8">
                        {mergedComponents.map((keyword, index) => (
                          <div key={keyword.id} className="relative group">
                            <KeywordForm
                              keyword={keyword}
                              value={formData[keyword.id] || ""}
                              onChange={(value) =>
                                onFormDataChange(keyword.id, value)
                              }
                              index={index}
                              isEditMode={isEditMode}
                              onDelete={onDeleteComponent}
                            />
                            {(keyword.isDynamic || isEditMode) && (
                              <div className={cn(
                                "absolute top-2 right-2 transition-opacity",
                                isEditMode
                                  ? "opacity-100"
                                  : "opacity-0 group-hover:opacity-100"
                              )}>
                                <button
                                  onClick={() => {
                                    if (keyword.isDynamic) {
                                      onDeleteComponent?.(keyword.id);
                                    } else {
                                      // For static components, pass the component data
                                      onDeleteComponent?.(keyword.id, keyword);
                                    }
                                  }}
                                  className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200 text-xs"
                                  title="Xóa component này"
                                >
                                  ✕
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        {snapshot.isDraggingOver ? (
                          <div className="text-blue-600">
                            <Plus className="w-16 h-16 mx-auto mb-4" />
                            <h3 className="text-lg font-calsans mb-2">
                              Thả component vào đây
                            </h3>
                            <p className="font-questrial">
                              Component sẽ được thêm vào step này
                            </p>
                          </div>
                        ) : (
                          <div className="text-gray-400">
                            <FileText className="w-16 h-16 mx-auto mb-4" />
                            <h3 className="text-lg font-calsans text-gray-900 mb-2">
                              Chưa có nội dung
                            </h3>
                            <p className="text-gray-500 font-questrial">
                              Kéo component từ sidebar để thêm vào step này
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
