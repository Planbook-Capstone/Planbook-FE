"use client";

import { useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/input";
import { StepSection } from "@/components/organisms/step-section";
import { LessonPlanTemplate, LessonPlanStep } from "@/types";
import { Plus, Download } from "lucide-react";

interface LessonPlanTemplateBuilderProps {
  initialTemplate?: LessonPlanTemplate;
  onSave?: (template: LessonPlanTemplate) => void;
  onSaveDraft?: (template: LessonPlanTemplate) => void;
  onExit?: () => void;
  mode?: "admin" | "staff"; // admin: chỉ chỉnh sửa tiêu đề bước, staff: chỉ chỉnh sửa nội dung
}

export function LessonPlanTemplateBuilder({
  initialTemplate,
  onSave,
  onSaveDraft,
  onExit,
  mode = "admin", // default to admin mode
}: LessonPlanTemplateBuilderProps) {
  const [template, setTemplate] = useState<LessonPlanTemplate>(
    initialTemplate || {
      id: uuidv4(),
      name: "Template Giáo Án Hệ Thống",
      description: "Template duy nhất cho toàn bộ hệ thống",
      version: "1.0",
      isDefault: true,
      createdBy: "admin",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      steps: [],
      metadata: {},
    }
  );

  const updateTemplate = useCallback((updates: Partial<LessonPlanTemplate>) => {
    setTemplate((prev) => ({
      ...prev,
      ...updates,
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  // const updateTemplateMetadata = useCallback(
  //   (field: string, value: string) => {
  //     updateTemplate({
  //       [field]: value,
  //     });
  //   },
  //   [updateTemplate]
  // );

  const addStep = useCallback(() => {
    const newStep: LessonPlanStep = {
      id: uuidv4(),
      title: "",
      description: "",
      isRequired: false,
      order: template.steps.length,
      keywords: [],
      stepType: "custom",
    };

    updateTemplate({
      steps: [...template.steps, newStep],
    });
  }, [template.steps, updateTemplate]);

  const updateStep = useCallback(
    (stepId: string, updates: Partial<LessonPlanStep>) => {
      updateTemplate({
        steps: template.steps.map((step) =>
          step.id === stepId ? { ...step, ...updates } : step
        ),
      });
    },
    [template.steps, updateTemplate]
  );

  const deleteStep = useCallback(
    (stepId: string) => {
      updateTemplate({
        steps: template.steps.filter((step) => step.id !== stepId),
      });
    },
    [template.steps, updateTemplate]
  );

  // const onDragEnd = useCallback(
  //   (result: any) => {
  //     if (!result.destination) return;

  //     const { source, destination, type } = result;

  //     if (type === "STEPS") {
  //       const newSteps = Array.from(template.steps);
  //       const [reorderedStep] = newSteps.splice(source.index, 1);
  //       newSteps.splice(destination.index, 0, reorderedStep);

  //       // Update order property
  //       const updatedSteps = newSteps.map((step, index) => ({
  //         ...step,
  //         order: index,
  //       }));

  //       updateTemplate({ steps: updatedSteps });
  //     }
  //   },
  //   [template.steps, updateTemplate]
  // );

  const handleSave = useCallback(() => {
    if (onSave) {
      onSave(template);
    }
  }, [template, onSave]);
  const handleSaveDraft = useCallback(() => {
    if (onSaveDraft) {
      onSaveDraft(template);
    }
  }, [template, onSaveDraft]);

  const handleExit = useCallback(() => {
    if (onExit) {
      onExit();
    }
  }, [onExit]);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 py-4 space-y-6">
        {/* Template Info - Only for Staff */}
        {mode === "staff" && (
          <div className="bg-white rounded-lg space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Tên Mẫu" htmlFor="template-name">
                <Input
                  id="template-name"
                  value={template.name}
                  onChange={(e: any) =>
                    updateTemplate({ name: e.target.value })
                  }
                  placeholder="Nhập tên mẫu"
                  className="w-full"
                />
              </FormField>
              <FormField label="Mô tả Mẫu" htmlFor="template-description">
                <Input
                  id="template-description"
                  value={template.description}
                  onChange={(e: any) =>
                    updateTemplate({ description: e.target.value })
                  }
                  placeholder="Nhập mô tả mẫu"
                  className="w-full"
                />
              </FormField>
            </div>
          </div>
        )}

        {/* Action Buttons - Only for Staff */}

        {/* Main Content */}
        {/* <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="steps" type="STEPS">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-6"
              >
                {template.steps.map((step, index) => (
                  <Draggable key={step.id} draggableId={step.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`${snapshot.isDragging ? "opacity-50" : ""}`}
                      >
                        <StepSection
                          step={step}
                          dragHandleProps={provided.dragHandleProps}
                          onUpdate={(updates) => updateStep(step.id, updates)}
                          onDelete={() => deleteStep(step.id)}
                          mode={mode}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext> */}

        <>
          {template.steps.map((step, index) => (
            <StepSection
              key={step.id}
              step={step}
              // dragHandleProps={provided.dragHandleProps}
              onUpdate={(updates) => updateStep(step.id, updates)}
              onDelete={() => deleteStep(step.id)}
              mode={mode}
            />
          ))}
        </>
        {mode === "staff" && (
          <div className="flex justify-between items-center w-full">
            <div className="flex gap-2 w-full">
              <Button
                onClick={addStep}
                className="w-full bg-blue-50 border-dashed border text-sky-600 border-sky-400"
              >
                <Plus className="w-4 h-4 mr-2" />
                Thêm bước mới
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Action Bar - Only for Staff */}
      {mode === "staff" && (
        <div className="sticky bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-end gap-3 z-50">
          <Button variant="outline" onClick={onExit}>
            Thoát
          </Button>
          <Button onClick={handleSave}>
            <Download className="w-4 h-4 mr-2" />
            Lưu template
          </Button>
        </div>
      )}
    </div>
  );
}
