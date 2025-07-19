"use client";

import React, { useState, useEffect } from "react";
import { useDroppable, useDraggable } from "@dnd-kit/core";
import { CanvasElement } from "@/components/templates/canva-layout";
import { Trash2, Move, RotateCw, Image as ImageIcon } from "lucide-react";
import ExamContent from "@/components/organisms/exam-content";
import { useExamContext } from "@/contexts/ExamContext";

interface CanvasAreaProps {
  elements: CanvasElement[];
  onUpdateElement: (id: string, updates: Partial<CanvasElement>) => void;
  onDeleteElement: (id: string) => void;
}

interface DraggableElementProps {
  element: CanvasElement;
  onUpdate: (updates: Partial<CanvasElement>) => void;
  onDelete: () => void;
}

function DraggableElement({
  element,
  onUpdate,
  onDelete,
}: DraggableElementProps) {
  const [isSelected, setIsSelected] = useState(false);
  const [isDraggingElement, setIsDraggingElement] = useState(false);

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: element.id,
      data: { ...element, isCanvasElement: true },
    });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    left: element.position.x,
    top: element.position.y,
    width: element.size.width,
    height: element.size.height,
  };

  // Update position when dragging ends
  React.useEffect(() => {
    if (!isDragging && isDraggingElement && transform) {
      onUpdate({
        position: {
          x: element.position.x + transform.x,
          y: element.position.y + transform.y,
        },
      });
      setIsDraggingElement(false);
    } else if (isDragging && !isDraggingElement) {
      setIsDraggingElement(true);
    }
  }, [isDragging, transform, element.position, onUpdate, isDraggingElement]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSelected(!isSelected);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        absolute cursor-move border-2 transition-all duration-200
        ${
          isSelected
            ? "border-blue-500 shadow-lg"
            : "border-transparent hover:border-gray-300"
        }
        ${isDragging ? "opacity-50 z-50" : "z-10"}
      `}
      onClick={handleClick}
      {...listeners}
      {...attributes}
    >
      {/* Selection Controls */}
      {isSelected && (
        <div className="absolute -top-10 left-0 flex space-x-1 bg-white border border-gray-200 rounded-lg shadow-lg p-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Handle move - could open position input
            }}
            className="p-1 hover:bg-gray-100 rounded"
            title="Move"
          >
            <Move className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Handle rotate
            }}
            className="p-1 hover:bg-gray-100 rounded"
            title="Rotate"
          >
            <RotateCw className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1 hover:bg-red-100 rounded"
            title="Delete"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        </div>
      )}

      {/* Resize Handles */}
      {isSelected && (
        <>
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 border border-white rounded-full cursor-se-resize" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 border border-white rounded-full cursor-ne-resize" />
          <div className="absolute -top-1 -left-1 w-3 h-3 bg-blue-500 border border-white rounded-full cursor-nw-resize" />
          <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-500 border border-white rounded-full cursor-sw-resize" />
        </>
      )}
    </div>
  );
}

export default function CanvasArea({
  elements,
  onUpdateElement,
  onDeleteElement,
}: CanvasAreaProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: "canvas-drop-zone",
  });

  // Use exam context
  const {
    examQuestions,
    examYesNoQuestions,
    examShortQuestions,
    updateQuestion,
    updateYesNoQuestion,
    updateShortQuestion,
    deleteQuestion,
    deleteYesNoQuestion,
    deleteShortQuestion,
    addQuestion,
    addYesNoQuestion,
    addShortQuestion,
  } = useExamContext();

  const handleCanvasClick = () => {
    // Deselect all elements when clicking on empty canvas
  };

  return (
    <div className="w-full h-full relative">
      <div
        ref={setNodeRef}
        className="w-full h-full bg-white rounded-lg relative overflow-auto"
        onClick={handleCanvasClick}
      >
        {/* Exam Content */}
        <ExamContent
          questions={examQuestions}
          yesNoQuestions={examYesNoQuestions}
          shortQuestions={examShortQuestions}
          onQuestionUpdate={updateQuestion}
          onQuestionDelete={deleteQuestion}
          onYesNoQuestionUpdate={updateYesNoQuestion}
          onYesNoQuestionDelete={deleteYesNoQuestion}
          onShortQuestionUpdate={updateShortQuestion}
          onShortQuestionDelete={deleteShortQuestion}
          onAddQuestion={addQuestion}
          onAddYesNoQuestion={addYesNoQuestion}
          onAddShortQuestion={addShortQuestion}
        />
      </div>
    </div>
  );
}
