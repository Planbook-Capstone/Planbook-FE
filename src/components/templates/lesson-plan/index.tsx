"use client";

import { useCallback, useState, useEffect } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import PreviewModal from "@/components/PreviewModal";
import Sidebar from "@/components/demo/Sidebar";
import Toolbar from "@/components/demo/Toolbar";
import Canvas from "@/components/demo/Canvas";
import { StepFloatingPanel } from "@/components/molecules/step-floating-panel";
import LoadingAI from "@/components/molecules/loading";
import { toast } from "sonner";
import {
  useUpdateToolResultService,
  useToolResultByIdService,
} from "@/services/toolResultService";
import { useQuestionBanksWithParamsService } from "@/services/questionBankServices";

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

function LessonPlanTemplate() {
  // Loading state
  const [isLoading, setIsLoading] = useState(false);
  // Track which nodes are loading (Set of node IDs)
  const [loadingNodes, setLoadingNodes] = useState<Set<string>>(new Set());

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
  } = useLessonPlanData();

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
  }, [finalData, demoData, items, currentStep]);

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
    handleGenerationLessonPlan,
    handleDownloadDocx,
    resultId,
  } = useLessonPlanGeneration({
    demoData,

    lessonId,
    lessonById,
    getAllFinalData,
    convertLessonPlanToDemoNode,
    mergeAIDataToFinalData,
  });

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
      console.log("✅ Loading finished - isLoading:", false);
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

  // Use tool result service for saving results
  const { mutate: updateToolResult, isPending: isSavingResult } =
    useUpdateToolResultService();

  // Fetch current tool result data to get existing name and description
  const { data: currentToolResult } = useToolResultByIdService(resultId || "", {
    enabled: !!resultId, // Only fetch when resultId exists
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
        status: "ARCHIVED",
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
              error?.response?.data?.message || "Có lỗi xảy ra khi lưu kết quả"
            );
          },
        }
      );
    },
    [resultId, getAllFinalData, lessonId, lessonById?.data, updateToolResult]
  );

  // if (data?.status === "processing" && data?.tool_code === bookType?.code) {
  //   return (
  //     <div className="w-full px-10 flex flex-col items-center h-50 space-y-4">
  //       <LoadingAI
  //         message={data?.message || ""}
  //         progress={data?.progress || 0}
  //       />
  //     </div>
  //   );
  // }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <div
          className={`transition-all duration-300 ${
            sidebarCollapsed ? "w-0" : "w-80"
          } overflow-hidden`}
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
        <div className="flex-1 flex flex-col">
          {/* Toolbar */}
          <div className="absolute right-0 -top-16">
            <Toolbar
              showDeleteButtons={showDeleteButtons}
              onToggleDeleteButtons={() =>
                setShowDeleteButtons(!showDeleteButtons)
              }
              onShowPreview={() => setShowPreview(true)}
              onExportJSON={handleGenerationLessonPlan}
              sidebarCollapsed={sidebarCollapsed}
              onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
              canUndo={canUndo}
              canRedo={canRedo}
              onUndo={undo}
              onRedo={redo}
            />
          </div>

          <>
            <StepFloatingPanel
              items={items}
              current={currentStep}
              layout="horizontal"
              visible={true}
              onStepChange={handleChangeStep}
              style={{ width: 300 }}
              initialPosition={{ x: 500, y: 100 }}
            />
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
          </>
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
      </div>
    </DragDropContext>
  );
}

export default LessonPlanTemplate;
