"use client";

import { useCallback, useState, useEffect, useRef } from "react";
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
import { ChevronUp } from "lucide-react";
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
import { GridSkeleton } from "@/components/molecules/grid-skeleton";

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

  // Scroll state for hiding/showing description and floating panel
  const [isDescriptionHidden, setIsDescriptionHidden] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [isStepPanelFloating, setIsStepPanelFloating] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const lastScrollTop = useRef(0);

  // Draggable compact button state
  const [compactButtonPosition, setCompactButtonPosition] = useState({ x: window.innerWidth / 2, y: 16, isInitial: true });
  const compactButtonRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  // Update editedName when existingData changes
  useEffect(() => {
    if (existingData?.name) {
      setEditedName(existingData.name);
    }
  }, [existingData?.name]);

  // Handle scroll events for hiding/showing description and scroll to top button
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      const scrollTop = scrollContainer.scrollTop;

      // Show scroll to top button when scrolled down more than 200px
      setShowScrollToTop(scrollTop > 200);

      lastScrollTop.current = scrollTop;
    };

    scrollContainer.addEventListener('scroll', handleScroll);
    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  // Toggle step panel collapse/expand
  const toggleStepPanel = () => {
    if (!isStepPanelFloating) {
      // Collapsing
      setIsStepPanelFloating(true);
      setIsDescriptionHidden(true);
    } else {
      // Expanding: reset to initial position when opening
      setIsStepPanelFloating(false);
      setIsDescriptionHidden(false);
      setCompactButtonPosition({ x: window.innerWidth / 2, y: 16, isInitial: true });
    }
  };

  // Draggable compact button logic
  useEffect(() => {
    const compactButton = compactButtonRef.current;
    if (!compactButton || !isStepPanelFloating) return;

    let startPos = { x: 0, y: 0 };
    let startButtonPos = { ...compactButtonPosition };

    const handleMouseDown = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('button')) return;

      isDraggingRef.current = true;
      startPos = { x: e.clientX, y: e.clientY };
      startButtonPos = { ...compactButtonPosition };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      e.preventDefault();
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || !compactButton) return;

      const deltaX = e.clientX - startPos.x;
      const deltaY = e.clientY - startPos.y;

      const newX = startButtonPos.x + deltaX;
      const newY = startButtonPos.y + deltaY;

      const buttonRect = compactButton.getBoundingClientRect();
      const buttonWidth = buttonRect.width;
      const buttonHeight = buttonRect.height;

      const maxX = window.innerWidth - buttonWidth;
      const maxY = window.innerHeight - buttonHeight;

      const constrainedX = Math.max(0, Math.min(newX, maxX));
      const constrainedY = Math.max(0, Math.min(newY, maxY));

      // Direct DOM manipulation for performance
      compactButton.style.left = `${constrainedX}px`;
      compactButton.style.top = `${constrainedY}px`;
      compactButton.style.transform = 'none';
    };

    const handleMouseUp = () => {
      if (!isDraggingRef.current || !compactButton) return;
      isDraggingRef.current = false;

      const finalX = parseInt(compactButton.style.left, 10);
      const finalY = parseInt(compactButton.style.top, 10);

      // Update React state once on mouse up
      setCompactButtonPosition({ x: finalX, y: finalY, isInitial: false });

      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    compactButton.addEventListener('mousedown', handleMouseDown);

    return () => {
      compactButton.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isStepPanelFloating, compactButtonPosition]);

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

    isLoadingChidren,
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
            {isLoadingChidren ||
              (!isLoading && loadingNodes.size === 0 && (
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
                    onToggleSidebar={() =>
                      setSidebarCollapsed(!sidebarCollapsed)
                    }
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
              ))}

            {isLoadingChidren && (
              <div className="p-5">
                <GridSkeleton
                  count={4}
                  height={180}
                  cols="grid-cols-1 lg:grid-cols-1"
                />
              </div>
            )}

            <div ref={scrollContainerRef} className="flex-1 overflow-auto relative">
              {/* Step Title - only show in create mode and when not floating */}
              {mode !== "edit" &&
                items &&
                items.length > 0 &&
                items[currentStep] &&
                !isStepPanelFloating && (
                  <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="flex justify-between items-start gap-6">
                      {/* Step Navigation Panel - Fixed position */}
                      <div className="flex-shrink-0 ">
                        <StepFloatingPanel
                          items={items}
                          current={currentStep}
                          layout="vertical"
                          visible={true}
                          onStepChange={handleChangeStep}
                          style={{ width: 800, position: "static" }}
                          initialPosition={{ x: 0, y: 0 }}
                          disable={true}
                          isDescriptionHidden={isDescriptionHidden}
                          onToggleCollapse={toggleStepPanel}
                          isCollapsed={isStepPanelFloating}
                        />
                      </div>
                    </div>
                  </div>
                )}

              {/* Compact Step Button - appears when scrolling */}
              {mode !== "edit" &&
                items &&
                items.length > 0 &&
                items[currentStep] &&
                isStepPanelFloating && (
                  <div
                    ref={compactButtonRef}
                    className="fixed z-50 cursor-grab"
                    style={{
                      left: compactButtonPosition.x,
                      top: compactButtonPosition.y,
                      transform: compactButtonPosition.isInitial ? 'translateX(-50%)' : 'none',
                    }}
                  >
                    <div className="bg-white rounded-full shadow-lg border border-gray-200 px-4 py-2 flex items-center gap-3 hover:shadow-xl transition-shadow">
                      {/* Current step indicator */}
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                          {currentStep + 1}
                        </div>
                        <span className="font-calsans text-sm text-gray-700 max-w-[200px] truncate">
                          {items[currentStep]?.title}
                        </span>
                      </div>

                      {/* Step navigation arrows */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleChangeStep(Math.max(0, currentStep - 1)); }}
                          disabled={currentStep === 0}
                          className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                          title="Previous step"
                        >
                          <ChevronUp className="w-3 h-3 transform -rotate-90" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleChangeStep(Math.min(items.length - 1, currentStep + 1)); }}
                          disabled={currentStep === items.length - 1}
                          className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                          title="Next step"
                        >
                          <ChevronUp className="w-3 h-3 transform rotate-90" />
                        </button>
                      </div>

                      {/* Progress indicator */}
                      <div className="text-xs text-gray-500 font-questrial">
                        {currentStep + 1}/{items.length}
                      </div>

                      {/* Expand Button */}
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleStepPanel(); }}
                        className="w-6 h-6 rounded-full bg-blue-100 hover:bg-blue-200 flex items-center justify-center transition-colors ml-2"
                        title="Mở rộng step panel"
                      >
                        <ChevronUp className="w-3 h-3 text-blue-600 transform rotate-180" />
                      </button>
                    </div>
                  </div>
                )}

              {/* Scroll to Top Button */}
              <button
                onClick={scrollToTop}
                className={`fixed bottom-6 right-6 z-50 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 ${
                  showScrollToTop
                    ? 'opacity-100 translate-y-0 pointer-events-auto'
                    : 'opacity-0 translate-y-4 pointer-events-none'
                }`}
                title="Scroll to top"
              >
                <ChevronUp className="w-5 h-5" />
              </button>

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
