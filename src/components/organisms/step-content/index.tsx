import React, { useState, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { KeywordForm } from "@/components/molecules/keyword-form";
import { Steps, StepItem } from "@/components/ui/steps";
import { Button } from "@/components/ui/Button";
import { Droppable } from "@hello-pangea/dnd";
import { FileText, ChevronLeft, ChevronRight, Plus, Edit2 } from "lucide-react";
import { useComponentAdd } from "@/contexts/ComponentAddContext";

interface Step {
  id: string;
  title: string;
  content?: string;
  nodeType?: string;
  children?: any[];
}

interface StepContentProps {
  step: Step;
  currentStep: number;
  totalSteps: number;
  allSteps?: Step[];
  onStepChange?: (stepIndex: number) => void;
  onPrevious?: () => void;
  onNext?: () => void;
  canGoNext?: boolean;
  apiChildrenData?: any[];
  onDeleteComponent?: (componentId: string, staticComponent?: any) => void;
  isEditMode?: boolean;
  className?: string;
  onDataChange?: (stepId: string, updatedData: any[]) => void; // Callback để lưu data
}

export function StepContent({
  step,
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  canGoNext = true,
  apiChildrenData = [], // API children data from backend
  className,
  onDataChange,
}: StepContentProps) {
  // State để lưu trữ data có thể thay đổi
  const [localData, setLocalData] = useState<any[]>([]);

  // Get context để register function
  const { addComponentRef } = useComponentAdd();

  // Sync với apiChildrenData khi thay đổi
  useEffect(() => {
    if (apiChildrenData && apiChildrenData.length > 0) {
      setLocalData([...apiChildrenData]); // Clone để tránh mutate trực tiếp
    }
  }, [apiChildrenData]);

  // Function để update content và trigger re-render
  const updateChildContent = useCallback(
    (childId: number, newValue: string) => {
      setLocalData((prevData) => {
        const updateChildren = (children: any[]): any[] => {
          return children.map((child) => {
            if (child.id === childId) {
              return { ...child, content: newValue };
            }
            if (child.children && child.children.length > 0) {
              return { ...child, children: updateChildren(child.children) };
            }
            return child;
          });
        };
        const updatedData = updateChildren(prevData);

        // Notify parent component để lưu data
        if (onDataChange && step?.id) {
          onDataChange(step.id.toString(), updatedData);
        }

        return updatedData;
      });
    },
    [onDataChange, step?.id]
  );

  // Function để update title và trigger re-render
  const updateChildTitle = useCallback(
    (childId: number, newTitle: string) => {
      setLocalData((prevData) => {
        const updateChildren = (children: any[]): any[] => {
          return children.map((child) => {
            if (child.id === childId) {
              return { ...child, title: newTitle };
            }
            if (child.children && child.children.length > 0) {
              return { ...child, children: updateChildren(child.children) };
            }
            return child;
          });
        };
        const updatedData = updateChildren(prevData);

        // Notify parent component để lưu data
        if (onDataChange && step?.id) {
          onDataChange(step.id.toString(), updatedData);
        }

        return updatedData;
      });
    },
    [onDataChange, step?.id]
  );

  // Function to add component directly to localData without modal
  const addComponentToLocalData = useCallback(
    (componentType: string) => {
      const stepId = step?.id?.toString();
      if (!stepId) return;

      // Generate new component with unique ID
      const newComponent = {
        id: Date.now(), // Temporary ID for new components
        lessonPlanId: 1,
        parentId: step?.id || null,
        title: getDefaultTitle(componentType),
        content: "",
        fieldType:
          componentType === "INPUT"
            ? "INPUT"
            : componentType === "TABLE"
            ? "TABLE"
            : componentType === "REFERENCES"
            ? "REFERENCES"
            : null,
        type: componentType === "SUBSECTION" ? "SUBSECTION" : "LIST_ITEM",
        orderIndex: localData.length, // Add at the end
        metadata: null,
        status: "ACTIVE",
        children: [],
        nodeType: componentType === "SUBSECTION" ? "SUBSECTION" : "LIST_ITEM",
      };

      // Update localData by adding the new component
      setLocalData((prevData) => {
        const newData = [...prevData, newComponent];

        console.log("🎯 StepContent: Adding new component:", {
          componentType,
          newComponent,
          stepId,
          newDataLength: newData.length,
        });

        // Notify parent component to save data
        if (onDataChange && stepId) {
          onDataChange(stepId, newData);
        }

        // Auto-focus on the new component title after a short delay
        setTimeout(() => {
          const newComponentElement = document.querySelector(
            `[data-component-id="${newComponent.id}"]`
          );
          if (newComponentElement) {
            (newComponentElement as HTMLElement).click();
          }
        }, 100);

        return newData;
      });
    },
    [step?.id, localData.length, onDataChange]
  );

  // Register function với context
  useEffect(() => {
    addComponentRef.current = addComponentToLocalData;
  }, [addComponentToLocalData, addComponentRef]);

  // Helper function to get default title for component type
  const getDefaultTitle = (type: string) => {
    switch (type) {
      case "INPUT":
        return "Nội dung mới";
      case "CONTENT":
        return "Nội dung";
      case "REFERENCES":
        return "Tài liệu tham khảo";
      case "SUBSECTION":
        return "Phần mới";
      case "TABLE":
        return "Bảng";
      default:
        return "Component mới";
    }
  };

  // Component để edit title inline
  const EditableTitle = ({ child, level }: { child: any; level: number }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(child.title);

    // Update editValue when child.title changes
    React.useEffect(() => {
      setEditValue(child.title);
    }, [child.title]);

    const handleSave = () => {
      if (editValue.trim() !== child.title && editValue.trim() !== "") {
        console.log("🎯 Updating title:", {
          childId: child.id,
          oldTitle: child.title,
          newTitle: editValue.trim(),
        });
        updateChildTitle(child.id, editValue.trim());
      }
      setIsEditing(false);
    };

    const handleCancel = () => {
      setEditValue(child.title);
      setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSave();
      } else if (e.key === "Escape") {
        handleCancel();
      }
    };

    if (isEditing) {
      return (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="font-medium text-gray-900 bg-white border border-blue-500 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[200px]"
            autoFocus
            placeholder="Nhập tiêu đề..."
          />
          <span className="text-xs text-gray-500">
            Enter để lưu, Esc để hủy
          </span>
        </div>
      );
    }

    // Check if this is a newly added component
    const isNewComponent = child.id > 1000000000;

    return (
      <div
        className="flex items-center gap-2 group cursor-pointer hover:bg-gray-50 rounded px-2 py-1 -mx-2"
        onClick={() => setIsEditing(true)}
        title="Click để chỉnh sửa tiêu đề"
        data-component-id={child.id}
      >
        <span className="font-medium text-gray-900 select-none">
          {child.title}
        </span>
        {isNewComponent && (
          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded-full">
            Mới
          </span>
        )}
        <Edit2 className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
        <span className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
          Click để chỉnh sửa
        </span>
      </div>
    );
  };

  // Function to render API children data directly
  const renderApiChildren = (
    children: any[],
    level: number = 0
  ): React.ReactNode => {
    return children.map((child, index) => (
      <div
        key={child.id}
        className="space-y-4"
        style={{ marginLeft: `${level * 20}px` }}
      >
        {/* Render editable title */}
        <EditableTitle child={child} level={level} />

        {/* Render content based on fieldType */}
        {child.fieldType === "INPUT" && (
          <div className="ml-4">
            <textarea
              value={child.content || ""}
              onChange={(e) => {
                console.log("Input changed:", e.target.value);
                updateChildContent(child.id, e.target.value);
              }}
              placeholder="Nhập nội dung..."
              className="w-full p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
            />
          </div>
        )}

        {child.fieldType === "TABLE" && (
          <div className="ml-4">
            <div className="p-4 border border-gray-200 rounded-md bg-gray-50">
              <p className="text-sm text-gray-600">
                Table component - ID: {child.id}
              </p>
              <textarea
                value={child.content || ""}
                onChange={(e) => {
                  updateChildContent(child.id, e.target.value);
                }}
                placeholder="Nhập dữ liệu bảng (JSON format)..."
                className="w-full mt-2 p-2 border border-gray-300 rounded text-sm"
                rows={4}
              />
            </div>
          </div>
        )}

        {child.fieldType === "REFERENCES" && (
          <div className="ml-4">
            <div className="p-4 border border-gray-200 rounded-md bg-gray-50">
              <p className="text-sm text-gray-600">
                References component - ID: {child.id}
              </p>
              <textarea
                value={child.content || ""}
                onChange={(e) => {
                  updateChildContent(child.id, e.target.value);
                }}
                placeholder="Nhập tài liệu tham khảo..."
                className="w-full mt-2 p-2 border border-gray-300 rounded text-sm"
                rows={3}
              />
            </div>
          </div>
        )}

        {/* Render children recursively */}
        {child.children && child.children.length > 0 && (
          <div className="space-y-2">
            {renderApiChildren(child.children, level + 1)}
          </div>
        )}
      </div>
    ));
  };

  console.log("localData:", localData);

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

          {step?.content && (
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
              <Droppable droppableId={`form-${step?.id}`}>
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
                    {/* Render API children data directly */}
                    {localData.length > 0 ? (
                      <div className="space-y-6">
                        {renderApiChildren(localData)}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-gray-500">
                        <p>Không có dữ liệu để hiển thị</p>
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
