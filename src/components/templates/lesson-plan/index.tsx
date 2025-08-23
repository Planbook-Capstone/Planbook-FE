"use client";

import { useCallback, useState, useEffect } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import PreviewModal from "@/components/PreviewModal";
import Sidebar from "@/components/demo/Sidebar";
import Toolbar from "@/components/demo/Toolbar";
import Canvas from "@/components/demo/Canvas";
import { StepFloatingPanel } from "@/components/molecules/step-floating-panel";
import LoadingAI from "@/components/molecules/loading";
import TokenConfirmModal from "@/components/modals/TokenConfirmModal";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import {
  useUpdateToolResultService,
  useToolResultByIdService,
} from "@/services/toolResultService";

// Custom hooks
import { useLessonPlanData } from "./hooks/useLessonPlanData";
import { useLessonPlanActions } from "./hooks/useLessonPlanActions";
import { useLessonPlanDragDrop } from "./hooks/useLessonPlanDragDrop";
import { useLessonPlanGeneration } from "./hooks/useLessonPlanGeneration";
import { useLessonPlanSelection } from "./hooks/useLessonPlanSelection";
import { useLessonPlanUndoRedo } from "./hooks/useLessonPlanUndoRedo";

// Types and constants
import { getComponentPalette } from "./constants";
import { DemoNode } from "./types";

interface LessonPlanTemplateProps {
  mode?: "create" | "edit";
  existingData?: any;
  editResultId?: string; // Result ID when in edit mode
}

function LessonPlanTemplate({
  mode = "create",
  existingData,
  editResultId,
}: LessonPlanTemplateProps = {}) {
  const router = useRouter();

  // Loading state
  const [isLoading, setIsLoading] = useState(false);
  // Track which nodes are loading (Set of node IDs)
  const [loadingNodes, setLoadingNodes] = useState<Set<string>>(new Set());

  // Edit name state
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(existingData?.name || "");

  // Update editedName when existingData changes
  useEffect(() => {
    if (existingData?.name) {
      setEditedName(existingData.name);
    }
  }, [existingData?.name]);

  // Get component palette (creates fresh React elements each time)
  const componentPalette = getComponentPalette();

  // Use custom hooks for data management
  const {
    demoData,
    setDemoData,
    trashData,
    setTrashData,
    showDeleteButtons,
    setShowDeleteButtons,
    activeTab,
    setActiveTab,
    showPreview,
    setShowPreview,
    sidebarCollapsed,
    setSidebarCollapsed,
    currentStep,
    setCurrentStep,
    finalData,
    setFinalData,
    items,
    lessonById,
    lessonId,
    updateFinalData,
    convertLessonPlanToDemoNode,
  } = useLessonPlanData({ mode, existingData });

  // Use custom hooks for actions
  const {
    handleInputChange,
    handleTitleChange,
    handleDescriptionChange,
    addChildToNode,
    findNodeById,
    removeNodeById,
    handleDeleteNode,
    handleRestoreNode,
    moveChildUp,
    moveChildDown,
  } = useLessonPlanActions({
    demoData,
    setDemoData,
    trashData,
    setTrashData,
    updateFinalData,
    mode,
  });

  // Use custom hooks for drag and drop
  const { handleDragEnd } = useLessonPlanDragDrop({
    demoData,
    setDemoData,
    updateFinalData,
    addChildToNode,
    findNodeById,
    removeNodeById,
    setTrashData,
    mode,
  });

  // Use custom hooks for selection and clipboard
  const {
    selectedNodeIds,
    clipboard,
    handleNodeSelect,
    handleCopy,
    handleCut,
    handlePaste,
    clearSelection,
  } = useLessonPlanSelection({
    demoData,
    setDemoData,
    updateFinalData,
    isEditMode: showDeleteButtons, // Use showDeleteButtons as edit mode indicator
    onDeleteNode: handleDeleteNode, // Pass delete function for keyboard shortcuts
  });

  // Use custom hooks for undo/redo
  const {
    undo,
    redo,
    canUndo,
    canRedo,
    saveToHistory,
    historyLength,
    currentIndex,
  } = useLessonPlanUndoRedo({
    demoData,
    setDemoData,
    updateFinalData,
  });

  // Handle step changes
  const handleChangeStep = (newStep: number) => {
    // Save current demoData to finalData before switching step
    if (items && items.length > currentStep) {
      const currentStepId = items[currentStep].id.toString();
      setFinalData((prev) => ({
        ...prev,
        [currentStepId]: demoData,
      }));
    }

    setCurrentStep(newStep);
  };

  // Get all final data with proper parent-child structure
  const getAllFinalData = useCallback(() => {
    // In edit mode, return demoData directly to avoid duplication
    if (mode === "edit") {
      console.log("🔄 Edit mode: Returning demoData directly:", demoData);
      return demoData;
    }

    // In create mode, use the original logic
    // Save current demoData to finalData first
    if (items && items.length > currentStep) {
      const currentStepId = items[currentStep].id.toString();
      const updatedFinalData = {
        ...finalData,
        [currentStepId]: demoData,
      };

      // Create proper parent-child structure from tree data and children data
      const allData: DemoNode[] = [];

      items.forEach((item: any) => {
        const stepId = item.id.toString();
        const stepChildrenData =
          (updatedFinalData as Record<string, DemoNode[]>)[stepId] || [];

        // Create parent node from tree data
        const parentNode: DemoNode = {
          id: item.id.toString(),
          lessonPlanId: 7, // Current lesson plan ID
          parentId: null,
          title: item.title || "",
          content: item.description || "",
          description: null, // Default description is null
          fieldType: "INPUT", // fieldType only has INPUT, TABLE, IMAGE
          type: "SECTION",
          orderIndex: items.indexOf(item),
          metadata: null,
          status: "ACTIVE",
          children: stepChildrenData, // Assign child nodes from finalData
        };

        allData.push(parentNode);
      });

      return allData;
    }
    return demoData;
  }, [mode, finalData, demoData, items, currentStep]);

  // Function to check if a node is loading
  const isNodeLoading = useCallback(
    (nodeId: string) => {
      return loadingNodes.has(nodeId);
    },
    [loadingNodes]
  );

  // Merge AI data into finalData
  const mergeAIDataToFinalData = useCallback(
    (aiData: DemoNode[]) => {
      console.log("🔄 mergeAIDataToFinalData called with:", aiData);
      console.log("📍 Current step:", currentStep, "Items:", items);

      if (!items || items.length <= currentStep) {
        console.log("❌ No items or invalid step");
        return undefined;
      }

      const currentStepId = items[currentStep].id.toString();

      // Get current step data from finalData or demoData
      const currentStepData = finalData[currentStepId] || demoData;

      // Merge logic: if same id then update, otherwise add new
      const mergedData = [...currentStepData];

      aiData.forEach((aiNode) => {
        const existingIndex = mergedData.findIndex(
          (node) => node.id === aiNode.id
        );
        if (existingIndex !== -1) {
          // Update existing node
          console.log("🔄 Updating existing node:", aiNode.id);
          mergedData[existingIndex] = aiNode;
        } else {
          // Add new node
          console.log("➕ Adding new node:", aiNode.id);
          mergedData.push(aiNode);
        }

        // Note: No need to manually remove from loading set
        // The render logic will check if node has content and hide skeleton automatically
      });

      console.log("✅ Final merged data:", mergedData);

      // Update finalData
      setFinalData((prev) => ({
        ...prev,
        [currentStepId]: mergedData,
      }));

      // Update demoData
      setDemoData(mergedData);

      return mergedData;
    },
    [currentStep, items, finalData, demoData, setFinalData, setDemoData]
  );

  // Use generation hook
  const {
    data,
    bookType,
    handleEstimateToken,
    handleGenerationLessonPlan,
    handleCloseTokenModal,
    handleDownloadDocx,
    resultId: generationResultId,
    isGenerating,
    isEstimating,
    showTokenConfirmModal,
    estimatedTokens,
  } = useLessonPlanGeneration({
    demoData,
    lessonId,
    lessonById,
    getAllFinalData,
    convertLessonPlanToDemoNode,
    mergeAIDataToFinalData,
  });

  // Use editResultId when in edit mode, otherwise use generationResultId
  const resultId = mode === "edit" ? editResultId : generationResultId;

  // Track loading state based on data processing status
  useEffect(() => {
    const isProcessing =
      data?.status === "processing" && data?.tool_code === bookType?.code;

    console.log("🔍 Loading state check:", {
      dataStatus: data?.status,
      dataToolCode: data?.tool_code,
      bookTypeCode: bookType?.code,
      isProcessing,
      currentIsLoading: isLoading,
    });

    if (isProcessing && !isLoading) {
      // Start loading
      setIsLoading(true);
      setAllNodesLoading(); // Set all current nodes as loading
      console.log("🔄 Loading started - isLoading:", true);
    } else if (!isProcessing && isLoading) {
      // Stop loading
      setIsLoading(false);
      setLoadingNodes(new Set()); // Clear all loading nodes
    }

    // Force reset loading if data status is not processing
    if (data && data.status !== "processing" && isLoading) {
      setIsLoading(false);
      setLoadingNodes(new Set()); // Clear all loading nodes
      console.log("🔄 Force reset loading - isLoading:", false);
    }
  }, [data?.status, data?.tool_code, bookType?.code, isLoading]);

  // Log initial loading state
  useEffect(() => {
    console.log("🚀 Initial isLoading state:", isLoading);
  }, []);

  // Log every time isLoading changes
  useEffect(() => {
    console.log("📊 isLoading state changed to:", isLoading);
  }, [isLoading]);

  // Log toolbar visibility state
  useEffect(() => {
    const shouldShowToolbar = !isLoading && loadingNodes.size === 0;
    console.log("🔧 Toolbar visibility:", {
      isLoading,
      loadingNodesCount: loadingNodes.size,
      shouldShowToolbar,
    });
  }, [isLoading, loadingNodes]);

  // Manual reset loading function for testing
  const resetLoading = () => {
    setIsLoading(false);
    setLoadingNodes(new Set());
    console.log("🔄 Manual reset loading - isLoading:", false);
  };

  // Function to set all current nodes as loading
  const setAllNodesLoading = useCallback(() => {
    const allNodeIds = new Set<string>();

    const collectNodeIds = (nodes: DemoNode[]) => {
      nodes.forEach((node) => {
        allNodeIds.add(node.id);
        if (node.children && node.children.length > 0) {
          collectNodeIds(node.children);
        }
      });
    };

    collectNodeIds(demoData);
    setLoadingNodes(allNodeIds);
    console.log("🔄 Set all nodes loading:", Array.from(allNodeIds));
  }, [demoData]);

  // Function to count total nodes recursively
  const countTotalNodes = useCallback((nodes: DemoNode[]): number => {
    let count = 0;
    nodes.forEach((node) => {
      count += 1; // Count the current node
      if (node.children && node.children.length > 0) {
        count += countTotalNodes(node.children); // Count children recursively
      }
    });
    return count;
  }, []);

  // Get current node count
  const currentNodeCount = countTotalNodes(demoData);

  // Use tool result service for saving results
  const { mutate: updateToolResult, isPending: isSavingResult } =
    useUpdateToolResultService();

  // Fetch current tool result data to get existing name and description
  const { data: currentToolResult } = useToolResultByIdService(resultId || "", {
    enabled: !!resultId, // Only fetch when resultId exists
    staleTime: 0, // Always refetch when component mounts
    refetchOnMount: true, // Force refetch on mount
    refetchOnWindowFocus: false, // Don't refetch on window focus to avoid unnecessary calls
  });

  // Handle save result function
  const handleSaveResult = useCallback(
    (formData: { name: string; description?: string }) => {
      if (!resultId) {
        toast.error("Không tìm thấy result ID để lưu kết quả");
        return;
      }

      const saveData = {
        name: formData.name,
        description: formData.description || "",
        data: getAllFinalData(),
        ...(mode === "create" && { status: "ARCHIVED" }),
      };

      updateToolResult(
        {
          id: resultId,
          data: saveData,
        },
        {
          onSuccess: () => {
            toast.success("Lưu kết quả thành công!");
          },
          onError: (error: any) => {
            console.error("Error saving result:", error);
            toast.error(
              error?.response?.data || "Có lỗi xảy ra khi lưu kết quả"
            );
          },
        }
      );
    },
    [resultId, getAllFinalData, lessonId, lessonById?.data, updateToolResult]
  );

  // Header component for edit mode
  const renderEditHeader = () => (
    <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div
          onClick={() => router.back()}
          className="flex items-center gap-2 cursor-pointer pr-1 border-r"
        >
          Quay lại
        </div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold text-gray-800">
            {editedName || existingData?.name || "Chỉnh sửa giáo án"}
          </h1>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {/* Undo/Redo buttons */}
        <div className="flex items-center gap-1 mr-2">
          <Button
            onClick={undo}
            disabled={!canUndo}
            variant="outline"
            size="sm"
            className="px-2"
            title={`Undo (${
              navigator.platform.includes("Mac") ? "⌘" : "Ctrl"
            }+Z)`}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
              />
            </svg>
          </Button>
          <Button
            onClick={redo}
            disabled={!canRedo}
            variant="outline"
            size="sm"
            className="px-2"
            title={`Redo (${
              navigator.platform.includes("Mac") ? "⌘⇧" : "Ctrl+Shift"
            }+Z)`}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 10H11a8 8 0 00-8 8v2m18-10l-6-6m6 6l-6 6"
              />
            </svg>
          </Button>
        </div>

        {/* <Button
          onClick={() => setShowDeleteButtons(!showDeleteButtons)}
          variant={showDeleteButtons ? "default" : "outline"}
        >
          {showDeleteButtons ? "Hoàn thành" : "Chỉnh sửa"}
        </Button>

        <Button
          variant="outline"
          onClick={() => setShowPreview(true)}
          className="flex items-center gap-2"
        >
          <Eye className="w-4 h-4" />
          Xem trước
        </Button> */}
      </div>
    </div>
  );

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div
        className={`${
          mode === "edit" ? "flex flex-col" : "flex"
        } h-screen bg-gray-50`}
      >
        {/* Header for edit mode */}
        {mode === "edit" && renderEditHeader()}

        <div className="flex-1 flex min-h-0">
          {/* Sidebar */}
          <div
            className={`transition-all duration-300 ${
              sidebarCollapsed ? "w-0" : "w-80"
            } overflow-hidden bg-white border-r border-gray-200`}
          >
            <Sidebar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              trashData={trashData}
              onRestoreNode={handleRestoreNode}
              componentPalette={componentPalette}
            />
          </div>

          {/* Main Canvas Area */}
          <div className="flex-1 flex flex-col min-h-0 relative">
            {/* Toolbar - Hide when nodes are loading (both create and edit mode) */}
            {!isLoading && loadingNodes.size === 0 && (
              <div
                className={`absolute ${
                  mode === "edit" ? "right-2 -top-17" : "right-0 -top-16"
                } z-10`}
              >
                <Toolbar
                  showDeleteButtons={showDeleteButtons}
                  onToggleDeleteButtons={() =>
                    setShowDeleteButtons(!showDeleteButtons)
                  }
                  onShowPreview={() => setShowPreview(true)}
                  onExportJSON={handleEstimateToken}
                  sidebarCollapsed={sidebarCollapsed}
                  onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
                  canUndo={canUndo}
                  canRedo={canRedo}
                  onUndo={undo}
                  onRedo={redo}
                  hideAIButton={mode === "edit"}
                  isGenerating={isGenerating || isEstimating}
                  currentNodeCount={currentNodeCount}
                  mode={mode}
                />
              </div>
            )}

            <div className="flex-1 overflow-auto">
              {/* Step Title - only show in create mode */}
              {mode !== "edit" &&
                items &&
                items.length > 0 &&
                items[currentStep] && (
                  <div className="bg-white border-b border-gray-200 px-6 py-4">
                    <h1 className="text-lg font-calsans text-gray-800">
                      {items[currentStep].title}
                    </h1>
                    {items[currentStep].description && (
                      <p className="text-gray-600 mt-2">
                        {items[currentStep].description}
                      </p>
                    )}
                  </div>
                )}

              {/* Only show StepFloatingPanel when NOT in edit mode */}
              {mode !== "edit" && items && items.length > 0 && (
                <StepFloatingPanel
                  items={items}
                  current={currentStep}
                  layout="vertical"
                  visible={true}
                  onStepChange={handleChangeStep}
                  style={{ width: 300 }}
                  initialPosition={{ x: 500, y: 100 }}
                />
              )}
              {/* Canvas */}

              <Canvas
                demoData={demoData}
                showDeleteButtons={showDeleteButtons}
                onDeleteNode={handleDeleteNode}
                onUpdateNodeTitle={handleTitleChange}
                onUpdateNodeContent={handleInputChange}
                onUpdateNodeDescription={handleDescriptionChange}
                onMoveChildUp={moveChildUp}
                onMoveChildDown={moveChildDown}
                isEditMode={showDeleteButtons}
                selectedNodeIds={selectedNodeIds}
                onNodeSelect={handleNodeSelect}
                onPaste={handlePaste}
                isNodeLoading={isNodeLoading}
              />
            </div>
          </div>
        </div>

        {/* Preview Modal */}
        <PreviewModal
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          data={getAllFinalData()}
          onDownload={handleDownloadDocx}
          lesson={lessonById?.data}
          onSaveResult={handleSaveResult}
          currentResultData={currentToolResult?.data}
        />

        {/* Token Confirmation Modal */}
        <TokenConfirmModal
          isOpen={showTokenConfirmModal}
          onClose={handleCloseTokenModal}
          onConfirm={handleGenerationLessonPlan}
          estimatedTokens={estimatedTokens || 0}
          isLoading={isGenerating}
        />
      </div>
    </DragDropContext>
  );
}

export default LessonPlanTemplate;
export { LessonPlanTemplate };
