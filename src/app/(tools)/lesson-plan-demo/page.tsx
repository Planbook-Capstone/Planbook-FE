"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { LessonPlanSidebar } from "@/components/organisms/lesson-plan-sidebar";
import { StepContent } from "@/components/organisms/step-content";
import { Steps } from "@/components/ui/steps";
import { DragDropProvider } from "@/components/providers/DragDropProvider";
import { ConfigModal } from "@/components/molecules/config-modal";
import { useDragDrop } from "@/components/providers/DragDropProvider";
import { useLessonPlanState } from "@/hooks/useLessonPlanState";
import { useDynamicForm } from "@/hooks/useDynamicForm";
import { useHeader } from "@/contexts/HeaderContext";
import { LessonPlanPreviewSidebar } from "@/components/organisms/lesson-plan-preview-sidebar";
import { ChevronLeft, Edit, Footprints, FileText } from "lucide-react";
import { useLessonPlanNodeTreeService } from "@/services/lessonPlanNodeServices";

function LessonPlanContent() {
  const [showSteps, setShowSteps] = useState(true);
  const [showPreviewSidebar, setShowPreviewSidebar] = useState(false);
  const [previewSidebarWidth, setPreviewSidebarWidth] = useState(384); // 384px = w-96
  const [isEditMode, setIsEditMode] = useState(false);
  const { setBreadcrumbs, setActions, setHideDefaultHeader } = useHeader();

  // Debug re-renders
  // console.log("LessonPlanContent re-rendered", {
  //   showSteps,
  //   showPreviewSidebar,
  // });

  const {
    currentStep,
    sortedSteps,
    currentStepData,
    formData,
    allFormData,
    completedSteps,
    isSubmitting,
    goToStep,
    goToPrevious,
    goToNext,
    updateStepFormData,
    handleSubmit,
    canGoNext,
  } = useLessonPlanState();

  // Debug: Log allFormData changes
  React.useEffect(() => {
    console.log("Page - allFormData updated:", allFormData);
  }, [allFormData]);

  // Memoize breadcrumbs to prevent re-creation
  const breadcrumbs = useMemo(
    () => [
      {
        label: "Quay lại",
        href: "/home",
        onClick: () => console.log("Back"),
        beforeIcon: <ChevronLeft className="w-4 h-4" />,
      },
      {
        label: "Lesson plan-demo",
        active: true,
      },
    ],
    []
  );

  // Memoize action handlers
  const handleToggleSteps = useCallback(() => {
    setShowSteps(!showSteps);
  }, [showSteps]);

  const handleTogglePreview = useCallback(() => {
    setShowPreviewSidebar(!showPreviewSidebar);
  }, [showPreviewSidebar]);

  const handleToggleEditMode = useCallback(() => {
    setIsEditMode(!isEditMode);
  }, [isEditMode]);

  // Memoize actions to prevent re-creation
  const actions = useMemo(
    () => [
      {
        label: isEditMode ? "Hoàn thành" : "Chỉnh sửa",
        icon: <Edit className="w-4 h-4" />,
        onClick: handleToggleEditMode,
        variant: isEditMode ? ("default" as const) : ("outline" as const),
      },
      {
        label: showSteps ? "Ẩn bước" : "Hiện bước",
        icon: <Footprints className="w-4 h-4" />,
        onClick: handleToggleSteps,
        variant: "outline" as const,
      },
      {
        label: showPreviewSidebar ? "Ẩn xem trước" : "Xem trước",
        icon: <FileText className="w-4 h-4" />,
        onClick: handleTogglePreview,
        variant: "outline" as const,
      },
    ],
    [
      isEditMode,
      showSteps,
      showPreviewSidebar,
      handleToggleEditMode,
      handleToggleSteps,
      handleTogglePreview,
    ]
  );

  // Set up header using context - only run once
  useEffect(() => {
    setBreadcrumbs(breadcrumbs);
    setHideDefaultHeader(false);
  }, [setBreadcrumbs, setHideDefaultHeader, breadcrumbs]);

  // Update actions when they change
  useEffect(() => {
    setActions(actions);
  }, [setActions, actions]);

  const {
    trashedItems,
    addComponent,
    moveToTrash,
    restoreFromTrash,
    getMergedComponentsForStep,
  } = useDynamicForm();

  const { configModal, closeConfigModal } = useDragDrop();

  const handleConfigConfirm = (config: any) => {
    if (configModal.position) {
      addComponent(config, configModal.position);
    }
    closeConfigModal();
  };

  // Get merged components for current step
  const mergedComponents = getMergedComponentsForStep(
    currentStepData?.id,
    currentStepData?.children || []
  );

  const treeQuery = useLessonPlanNodeTreeService("21")();
  const treeData = treeQuery?.data?.data?.sort(
    (a: any, b: any) => a.orderIndex - b.orderIndex
  ) || [];

  console.log(treeData,"tran")

  return (
    <>
      <div className="h-full flex flex-col bg-gray-50 ">
        {/* Steps Progress - Conditionally rendered */}
        {showSteps && (
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <Steps
              current={currentStep}
              items={treeData?.map((s:any) => ({
                title: s.title,
                description: s.content,
              }))}
              onChange={goToStep}
            />
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex min-h-0">
          <LessonPlanSidebar
            steps={sortedSteps}
            currentStep={currentStep}
            onStepChange={goToStep}
            onPrevious={goToPrevious}
            onNext={goToNext}
            onSubmit={handleSubmit}
            completedSteps={completedSteps}
            canGoNext={canGoNext}
            isSubmitting={isSubmitting}
            trashedItems={trashedItems}
            onRestoreFromTrash={restoreFromTrash}
          />

          <StepContent
            step={currentStepData}
            formData={formData}
            onFormDataChange={updateStepFormData}
            currentStep={currentStep}
            totalSteps={sortedSteps.length}
            onPrevious={goToPrevious}
            onNext={goToNext}
            canGoNext={canGoNext}
            mergedComponents={mergedComponents}
            onDeleteComponent={moveToTrash}
            isEditMode={isEditMode}
          />

          {/* Doc Preview Sidebar */}
          {showPreviewSidebar && (
            <div className="relative flex">
              {/* Resize Handle */}
              <div
                className="w-[1px] bg-gray-200 hover:bg-blue-500 cursor-col-resize transition-colors"
                onMouseDown={(e) => {
                  e.preventDefault();
                  const startX = e.clientX;
                  const startWidth = previewSidebarWidth;

                  const handleMouseMove = (e: MouseEvent) => {
                    const deltaX = startX - e.clientX; // Reverse direction for right sidebar
                    const newWidth = Math.max(
                      300,
                      Math.min(800, startWidth + deltaX)
                    );
                    setPreviewSidebarWidth(newWidth);
                  };

                  const handleMouseUp = () => {
                    document.removeEventListener("mousemove", handleMouseMove);
                    document.removeEventListener("mouseup", handleMouseUp);
                  };

                  document.addEventListener("mousemove", handleMouseMove);
                  document.addEventListener("mouseup", handleMouseUp);
                }}
              />

              <LessonPlanPreviewSidebar
                steps={sortedSteps}
                formData={allFormData}
                getMergedComponentsForStep={getMergedComponentsForStep}
                isVisible={showPreviewSidebar}
                onToggleVisibility={() =>
                  setShowPreviewSidebar(!showPreviewSidebar)
                }
                style={{ width: `${previewSidebarWidth}px` }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Config Modal */}
      <ConfigModal
        isOpen={configModal.isOpen}
        onClose={closeConfigModal}
        item={configModal.item}
        onConfirm={handleConfigConfirm}
      />
    </>
  );
}

export default function LessonPlanDemoPage() {
  const handleAddItem = (item: any, position: any) => {
    console.log("Add item:", item, "at position:", position);
  };

  const handleMoveToTrash = (itemId: string) => {
    console.log("Move to trash:", itemId);
  };

  return (
    <DragDropProvider
      onAddItem={handleAddItem}
      onMoveToTrash={handleMoveToTrash}
    >
      <LessonPlanContent />
    </DragDropProvider>
  );
}
