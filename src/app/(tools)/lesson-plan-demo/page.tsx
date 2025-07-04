"use client";

import React from "react";
import { LessonPlanSidebar } from "@/components/organisms/lesson-plan-sidebar";
import { StepContent } from "@/components/organisms/step-content";
import { Steps } from "@/components/ui/steps";
import { DragDropProvider } from "@/components/providers/DragDropProvider";
import { ConfigModal } from "@/components/molecules/config-modal";
import { useDragDrop } from "@/components/providers/DragDropProvider";
import { useLessonPlanState } from "@/hooks/useLessonPlanState";
import { useDynamicForm } from "@/hooks/useDynamicForm";

function LessonPlanContent() {
  const {
    currentStep,
    sortedSteps,
    currentStepData,
    formData,
    completedSteps,
    isSubmitting,
    goToStep,
    goToPrevious,
    goToNext,
    updateStepFormData,
    handleSubmit,
    canGoNext,
  } = useLessonPlanState();

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
    currentStepData.id,
    currentStepData.children || []
  );

  return (
    <>
      <div className="h-screen flex flex-col bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          {/* Steps Progress */}
          <Steps
            current={currentStep}
            items={sortedSteps.map((s) => ({
              title: s.title,
              description: s.content,
            }))}
            onChange={goToStep}
          />
        </div>

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
          />
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
