'use client';

import React, { useState } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import AssetsPanel from '@/components/organisms/assets-panel';
import CanvasArea from '@/components/organisms/canvas-area';
import PreviewPanel from '@/components/organisms/preview-panel';
import { ExamProvider, useExamContext } from '@/contexts/ExamContext';

export interface CanvasElement {
  id: string;
  type: 'image' | 'text' | 'shape';
  content: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  style?: Record<string, any>;
}

function CanvaLayoutContent() {
  const [canvasElements, setCanvasElements] = useState<CanvasElement[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const { updateQuestionImage } = useExamContext();

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.data.current) {
      const assetData = active.data.current;

      if (over.id === 'canvas-drop-zone') {
        // Get the asset data from the dragged item
        if (assetData && !assetData.isCanvasElement) {
          // This is a new element being dragged from assets panel
          const newElement: CanvasElement = {
            id: `element-${Date.now()}`,
            type: assetData.type,
            content: assetData.content,
            position: { x: Math.random() * 200 + 50, y: Math.random() * 200 + 50 }, // Random position
            size: {
              width: assetData.type === 'text' ? 150 : 200,
              height: assetData.type === 'text' ? 50 : 150
            },
            style: assetData.style || {}
          };

          setCanvasElements(prev => [...prev, newElement]);
        }
      } else if (over.id && over.id.toString().includes('question-') && over.id.toString().includes('-image-drop')) {
        // Handle drop on question image area
        if (assetData.type === 'image') {
          // Extract question ID from drop zone ID
          const questionId = over.id.toString().replace('question-', '').replace('-image-drop', '');

          // Update question's illustration image using context
          updateQuestionImage(questionId, assetData.content);
        }
      }
    }

    setActiveId(null);
  };

  const updateElement = (id: string, updates: Partial<CanvasElement>) => {
    setCanvasElements(prev => 
      prev.map(element => 
        element.id === id ? { ...element, ...updates } : element
      )
    );
  };

  const deleteElement = (id: string) => {
    setCanvasElements(prev => prev.filter(element => element.id !== id));
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
          <div className="h-16 flex items-center px-4 border-b border-gray-200 bg-white sticky top-0 z-10">
            <h1 className="text-xl font-calsans text-gray-800">Tạo bài kiểm tra</h1>
            <div className="ml-auto flex space-x-2">
              <button className="sm:hidden p-2 hover:bg-gray-100 rounded-lg">
                Assets
              </button>
              <button className="lg:hidden p-2 hover:bg-gray-100 rounded-lg">
                Preview
              </button>
            </div>
          </div>
          <div className="flex-1 p-2 sm:p-4 overflow-y-auto">
            <CanvasArea
              elements={canvasElements}
              onUpdateElement={updateElement}
              onDeleteElement={deleteElement}
            />
          </div>
        </div>

        {/* Preview Panel - Sticky */}
        <div className="w-80 bg-white border-l border-gray-200 flex-shrink-0 sticky top-0 h-screen overflow-y-auto">
          <PreviewPanel elements={canvasElements} />
        </div>
      </div>

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
