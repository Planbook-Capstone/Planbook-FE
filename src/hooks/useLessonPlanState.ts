import { useState, useMemo } from "react";
import { useLessonPlanNodeTreeService } from "@/services/lessonPlanNodeServices";

export function useLessonPlanState(lessonPlanId?: string) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<
    Record<string, Record<string, string>>
  >({});
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get data from API
  const treeQuery = useLessonPlanNodeTreeService(lessonPlanId || "21")();
  const treeData = treeQuery?.data?.data;
  const isLoading = treeQuery?.isLoading;
  const error = treeQuery?.error;

  // Get sorted nodes (SECTION nodes act as steps) - memoized
  const sortedSteps = useMemo(() => {
    if (!treeData || !Array.isArray(treeData)) return [];

    return treeData
      .filter((node: any) => node.type === "SECTION")
      .sort((a: any, b: any) => a.orderIndex - b.orderIndex);
  }, [treeData]);

  const currentStepData = useMemo(
    () => sortedSteps[currentStep],
    [sortedSteps, currentStep]
  );

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
    console.log("updateStepFormData called:", {
      keywordId,
      value,
      stepId: currentStepData?.id,
    });
    setFormData((prev) => {
      const newFormData = {
        ...prev,
        [currentStepData?.id]: {
          ...prev[currentStepData?.id],
          [keywordId]: value,
        },
      };
      console.log("New formData:", newFormData);
      return newFormData;
    });
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
        templateName: `Lesson Plan ${lessonPlanId || "21"}`,
        templateId: lessonPlanId || "21",
        exportDate: new Date().toISOString(),
        totalSteps: sortedSteps.length,
        completedSteps: completedSteps.length + 1,
        steps: sortedSteps.map((step: any, index: number) => ({
          stepNumber: index + 1,
          stepId: step.id,
          stepTitle: step.title,
          stepType: step.type,
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
      link.download = `lesson-plan-${lessonPlanId || "21"}-${new Date().toISOString().split("T")[0]}.json`;
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
    if (!currentStepData?.children || currentStepData?.children?.length === 0) {
      return true; // Allow skipping steps without children
    }

    const currentStepFormData = formData[currentStepData?.id] || {};
    return Object.keys(currentStepFormData)?.length > 0;
  };

  return {
    currentStep,
    sortedSteps,
    currentStepData,
    formData: currentStepData ? formData[currentStepData?.id] || {} : {},
    allFormData: formData,
    completedSteps,
    isSubmitting,
    isLoading,
    error,
    goToStep,
    goToPrevious,
    goToNext,
    updateStepFormData,
    handleSubmit,
    canGoNext: canGoNext(),
  };
}
