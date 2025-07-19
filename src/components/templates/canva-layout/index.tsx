"use client";

import React, { useState, useEffect } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import AssetsPanel from "@/components/organisms/assets-panel";
import CanvasArea from "@/components/organisms/canvas-area";
import ExamPreviewModal from "@/components/organisms/exam-preview-modal";
import { ExamProvider, useExamContext } from "@/contexts/ExamContext";
import { useSearchParams } from "next/navigation";

export interface CanvasElement {
  id: string;
  type: "image" | "text" | "shape";
  content: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  style?: Record<string, any>;
}

function CanvaLayoutContent() {
  const [canvasElements, setCanvasElements] = useState<CanvasElement[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const { updateQuestionImage } = useExamContext();

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.data.current) {
      const assetData = active.data.current;

      if (over.id === "canvas-drop-zone") {
        // Get the asset data from the dragged item
        if (assetData && !assetData.isCanvasElement) {
          // This is a new element being dragged from assets panel
          const newElement: CanvasElement = {
            id: `element-${Date.now()}`,
            type: assetData.type,
            content: assetData.content,
            position: {
              x: Math.random() * 200 + 50,
              y: Math.random() * 200 + 50,
            }, // Random position
            size: {
              width: assetData.type === "text" ? 150 : 200,
              height: assetData.type === "text" ? 50 : 150,
            },
            style: assetData.style || {},
          };

          setCanvasElements((prev) => [...prev, newElement]);
        }
      } else if (
        over.id &&
        over.id.toString().includes("question-") &&
        over.id.toString().includes("-image-drop")
      ) {
        // Handle drop on question image area
        if (assetData.type === "image") {
          // Extract question ID from drop zone ID
          const questionId = over.id
            .toString()
            .replace("question-", "")
            .replace("-image-drop", "");

          // Update question's illustration image using context
          updateQuestionImage(questionId, assetData.content);
        }
      }
    }

    setActiveId(null);
  };

  const updateElement = (id: string, updates: Partial<CanvasElement>) => {
    setCanvasElements((prev) =>
      prev.map((element) =>
        element.id === id ? { ...element, ...updates } : element
      )
    );
  };

  const deleteElement = (id: string) => {
    setCanvasElements((prev) => prev.filter((element) => element.id !== id));
  };

  const searchParams = useSearchParams();

  const isPreviewing = searchParams.get("preview") === "true";

  // Update modal state when URL parameter changes
  useEffect(() => {
    setIsPreviewModalOpen(isPreviewing);
  }, [isPreviewing]);

  const handleClosePreviewModal = () => {
    setIsPreviewModalOpen(false);
    // Optionally update URL to remove preview parameter
    const url = new URL(window.location.href);
    url.searchParams.delete("preview");
    window.history.replaceState({}, "", url.toString());
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex h-screen">
        {/* Assets Panel - Sticky */}
        <div className="bg-white border-r border-gray-200 flex-shrink-0 sticky top-0 h-screen overflow-y-auto">
          <AssetsPanel />
        </div>

        {/* Canvas Area - Scrollable */}
        <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
          <div className="flex-1 p-2 sm:p-4 overflow-y-auto">
            <CanvasArea
              elements={canvasElements}
              onUpdateElement={updateElement}
              onDeleteElement={deleteElement}
            />
          </div>
        </div>

      </div>

      {/* Preview Modal */}
      <ExamPreviewModal
        isOpen={isPreviewModalOpen}
        onClose={handleClosePreviewModal}
        elements={canvasElements}
      />

      {/* Drag Overlay */}
      <DragOverlay>
        {activeId ? (
          <div className="bg-blue-100 border-2 border-blue-300 rounded-lg p-2 opacity-80">
            Dragging...
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

export default function CanvaLayout() {
  return (
    <ExamProvider>
      <CanvaLayoutContent />
    </ExamProvider>
  );
}
