import { useState } from "react";
import { flexibleChemistryTemplate } from "@/data/flexible-lesson-templates";

export function useLessonPlanState() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<
    Record<string, Record<string, string>>
  >({});
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get sorted nodes (SECTION nodes act as steps)
  const sortedSteps = flexibleChemistryTemplate.nodes
    .filter((node) => node.nodeType === "SECTION")
    .sort((a, b) => a.order - b.order);
  const currentStepData = sortedSteps[currentStep];

  // Navigation functions
  const goToStep = (stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < sortedSteps.length) {
      setCurrentStep(stepIndex);
    }
  };

  const goToPrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToNext = () => {
    if (currentStep < sortedSteps.length - 1) {
      // Mark current step as completed if it has content
      const currentStepFormData = formData[currentStepData.id] || {};
      const hasContent = Object.values(currentStepFormData).some(
        (value) => value.trim() !== ""
      );

      if (hasContent && !completedSteps.includes(currentStep)) {
        setCompletedSteps((prev) => [...prev, currentStep]);
      }

      setCurrentStep(currentStep + 1);
    }
  };

  // Form data management
  const updateStepFormData = (keywordId: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [currentStepData.id]: {
        ...prev[currentStepData.id],
        [keywordId]: value,
      },
    }));
  };

  // Submit function
  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Mark final step as completed
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps((prev) => [...prev, currentStep]);
      }

      // Prepare export data
      const exportData = {
        templateName: flexibleChemistryTemplate.name,
        templateId: flexibleChemistryTemplate.id,
        exportDate: new Date().toISOString(),
        totalSteps: sortedSteps.length,
        completedSteps: completedSteps.length + 1,
        steps: sortedSteps.map((step, index) => ({
          stepNumber: index + 1,
          stepId: step.id,
          stepTitle: step.title,
          stepType: step.nodeType,
          stepDescription: step.content,
          children: step.children,
          formData: formData[step.id] || {},
          isCompleted: completedSteps.includes(index) || index === currentStep,
        })),
        summary: {
          completionPercentage: Math.round(
            ((completedSteps.length + 1) / sortedSteps.length) * 100
          ),
          totalKeywords: sortedSteps.reduce(
            (total, step) => total + (step.children?.length || 0),
            0
          ),
          filledKeywords: Object.values(formData).reduce(
            (total, stepData) =>
              total +
              Object.values(stepData).filter((value) => value.trim() !== "")
                .length,
            0
          ),
        },
      };

      // Download JSON file
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `lesson-plan-${flexibleChemistryTemplate.name
        .toLowerCase()
        .replace(/\s+/g, "-")}-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      console.log("📥 Exported lesson plan data:", exportData);
      alert("Đã tải xuống file kết quả lesson plan!");
    } catch (error) {
      console.error("Export error:", error);
      alert("Có lỗi xảy ra khi xuất file!");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Validation
  const canGoNext = () => {
    if (!currentStepData.children || currentStepData.children.length === 0) {
      return true; // Allow skipping steps without children
    }

    const currentStepFormData = formData[currentStepData.id] || {};
    return Object.keys(currentStepFormData).length > 0;
  };

  return {
    currentStep,
    sortedSteps,
    currentStepData,
    formData: formData[currentStepData.id] || {},
    completedSteps,
    isSubmitting,
    goToStep,
    goToPrevious,
    goToNext,
    updateStepFormData,
    handleSubmit,
    canGoNext: canGoNext(),
  };
}
