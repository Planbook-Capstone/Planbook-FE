import { useState, useMemo, useEffect } from "react";
import {
  useLessonPlanNodeTreeService,
  useLessonPlanNodeChildrenService,
} from "@/services/lessonPlanNodeServices";

export function useLessonPlanState() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<
    Record<string, Record<string, string>>
  >({});
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cache for children data of all visited steps
  const [stepChildrenCache, setStepChildrenCache] = useState<
    Record<string, any[]>
  >({});

  const treeData = useLessonPlanNodeTreeService("1")();

  // Debug tree data
  console.log("🌳 Tree Data Debug:", {
    isLoading: treeData?.isLoading,
    isError: treeData?.isError,
    rawTreeData: treeData?.data?.data,
  });

  const sortedSteps = useMemo(() => {
    const steps =
      treeData?.data?.data?.sort(
        (a: any, b: any) => a?.orderIndex - b?.orderIndex
      ) || [];
    console.log("📋 Sorted Steps:", steps);
    return steps;
  }, [treeData]);

  // // Get sorted nodes (SECTION nodes act as steps) - memoized
  // const sortedSteps = useMemo(
  //   () =>
  //     flexibleChemistryTemplate.nodes
  //       .filter((node) => node.nodeType === "SECTION")
  //       .sort((a, b) => a.order - b.order),
  //   []
  // );

  // Get current step basic info from tree
  const currentStepBasic = useMemo(
    () => sortedSteps[currentStep],
    [sortedSteps, currentStep]
  );

  // Get children data for current step from API
  const currentStepId = currentStepBasic?.id;
  const childrenQuery = useLessonPlanNodeChildrenService(currentStepId || "")();

  // Keep hierarchical structure instead of flattening
  const processChildren = (children: any[]): any[] => {
    return children.map((child) => ({
      ...child,
      nodeType: child.type, // Map API fields
      children:
        child.children && child.children.length > 0
          ? processChildren(child.children)
          : [],
    }));
  };

  const childrenData = childrenQuery?.data?.data
    ? processChildren(childrenQuery.data.data)
    : [];

  // Debug API response
  console.log("🔍 API Response Debug:", {
    currentStepId,
    isLoading: childrenQuery?.isLoading,
    isError: childrenQuery?.isError,
    rawApiData: childrenQuery?.data?.data,
    processedChildrenData: childrenData,
  });

  // Update cache when children data is loaded for current step
  useEffect(() => {
    if (
      currentStepId &&
      childrenData.length > 0 &&
      // Only update cache if data is actually different
      (stepChildrenCache[currentStepId]?.length !== childrenData.length ||
        JSON.stringify(stepChildrenCache[currentStepId]) !==
          JSON.stringify(childrenData))
    ) {
      setStepChildrenCache((prev) => ({
        ...prev,
        [currentStepId]: childrenData,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStepId, childrenData]);

  // Create enhanced currentStepData with API children
  const currentStepData = useMemo(() => {
    if (!currentStepBasic) return null;

    return {
      ...currentStepBasic,
      children: childrenData,
    };
  }, [currentStepBasic, childrenData]);

  // Function to get children data for any step (from cache or current)
  const getChildrenForStep = (stepId: string) => {
    if (stepId === currentStepId) {
      console.log(
        `📋 Getting current step children for ${stepId}:`,
        childrenData,
        "items"
      );
      return childrenData || [];
    }
    const cachedData = stepChildrenCache[stepId] || [];
    return cachedData;
  };

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
      if (currentStepData?.id) {
        const currentStepFormData = formData[currentStepData.id] || {};
        const hasContent = Object.values(currentStepFormData).some((value) => {
          // Handle both object and string values
          if (typeof value === "object" && value !== null) {
            // For object values, check content, value, or any string property
            const objectValue = value as any;
            const contentToCheck =
              objectValue.content ||
              objectValue.value ||
              objectValue.title ||
              "";
            return (
              typeof contentToCheck === "string" && contentToCheck.trim() !== ""
            );
          }
          // For string values, use original logic
          return typeof value === "string" && value.trim() !== "";
        });

        if (hasContent && !completedSteps.includes(currentStep)) {
          setCompletedSteps((prev) => [...prev, currentStep]);
        }
      }

      setCurrentStep(currentStep + 1);
    }
  };

  // Form data management - Simplified to just trigger re-render
  const updateStepFormData = (
    fieldId: string, // Backend field ID (e.g., "3", "4", "5")
    fieldTitle: string, // Field title from backend
    value: string
  ) => {
    console.log("updateStepFormData called:", {
      fieldId,
      fieldTitle,
      value,
      stepId: currentStepData?.id,
    });

    // Trigger re-render by updating a dummy state
    // The actual value is already saved in child.content by StepContent
    setFormData((prev) => ({
      ...prev,
      _lastUpdate: { value: Date.now().toString() }, // Dummy field to trigger re-render
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
        templateName: "flexibleChemistryTemplate.name",
        templateId: "flexibleChemistryTemplate.id",
        exportDate: new Date().toISOString(),
        totalSteps: sortedSteps.length,
        completedSteps: completedSteps.length + 1,
        steps: sortedSteps.map((step: any, index: any) => ({
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
            ((completedSteps.length + 1) / sortedSteps?.length) * 100
          ),
          totalKeywords: sortedSteps.reduce(
            (total: any, step: any) => total + (step.children?.length || 0),
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
      link.download = "lesson-plan";
      // link.download = `lesson-plan-${flexibleChemistryTemplate.name
      //   .toLowerCase()
      //   .replace(/\s+/g, "-")}-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

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
    if (
      !currentStepData?.id ||
      !currentStepData?.children ||
      currentStepData?.children?.length === 0
    ) {
      return true; // Allow skipping steps without children or when data is loading
    }

    const currentStepFormData = formData[currentStepData.id] || {};
    return Object.keys(currentStepFormData).length > 0;
  };

  return {
    currentStep,
    sortedSteps,
    currentStepData,
    formData: {}, // Không cần nữa vì dữ liệu lưu trong apiChildren
    allFormData: formData, // Giữ lại cho preview sidebar
    completedSteps,
    isSubmitting,
    goToStep,
    goToPrevious,
    goToNext,
    updateStepFormData,
    handleSubmit,
    canGoNext: canGoNext(),
    // Add loading states for debugging
    isLoadingChildren: childrenQuery?.isLoading || false,
    childrenError: childrenQuery?.isError || false,
    childrenData,
    // Function to get children for any step
    getChildrenForStep,
  };
}
