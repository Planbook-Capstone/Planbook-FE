"use client";

import React, { useState, useCallback, useRef } from "react";
import { SlideElement } from "@/types";
import TextElement from "./TextElement";

const PPTX_SLIDE_WIDTH = 960; // 10 inches at 96 DPI
const PPTX_SLIDE_HEIGHT = 540; // 5.625 inches at 96 DPI

interface EditorCanvasProps {
  elements: SlideElement[];
  onUpdateElement: (id: string, updates: Partial<SlideElement>) => void;
  onDeleteElement: (id: string) => void;
  onAddElement: (element: SlideElement) => void;
  onSelectElement?: (id: string | null) => void;
  width?: number;
  height?: number;
  background?: string;
  slideFormat?: "16:9" | "4:3";
}

export default function EditorCanvas({
  elements,
  onUpdateElement,
  onDeleteElement,
  onAddElement,
  onSelectElement,
  width,
  height,
  background = "#ffffff",
  slideFormat = "16:9",
}: EditorCanvasProps) {
  // Calculate canvas dimensions based on slide format
  const getCanvasDimensions = () => {
    if (width && height) {
      return { width, height };
    }

    if (slideFormat === "4:3") {
      return { width: 960, height: 720 }; // 4:3 aspect ratio
    }

    return { width: PPTX_SLIDE_WIDTH, height: PPTX_SLIDE_HEIGHT }; // 16:9 default
  };

  const canvasDimensions = getCanvasDimensions();
  const [selectedElementId, setSelectedElementId] = useState<string | null>(
    null
  );
  const [editingElementId, setEditingElementId] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Handle canvas click to deselect elements
  const handleCanvasClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === canvasRef.current) {
        setSelectedElementId(null);
        setEditingElementId(null);
        onSelectElement?.(null);
      }
    },
    [onSelectElement]
  );

  // Handle element selection
  const handleSelectElement = useCallback(
    (id: string) => {
      setSelectedElementId(id);
      setEditingElementId(null);
      onSelectElement?.(id);
    },
    [onSelectElement]
  );

  // Handle element editing
  const handleEditElement = useCallback((id: string) => {
    setSelectedElementId(id);
    setEditingElementId(id);
  }, []);

  // Handle stop editing
  const handleStopEdit = useCallback(() => {
    setEditingElementId(null);
  }, []);

  // Render elements based on type
  const renderElement = (element: SlideElement) => {
    switch (element.type) {
      case "text":
        return (
          <TextElement
            key={element.id}
            element={element}
            isSelected={selectedElementId === element.id}
            isEditing={editingElementId === element.id}
            onSelect={handleSelectElement}
            onEdit={handleEditElement}
            onStopEdit={handleStopEdit}
            onUpdate={onUpdateElement}
            onDelete={onDeleteElement}
          />
        );
      case "image":
        // TODO: Implement ImageElement component
        return (
          <div
            key={element.id}
            style={{
              position: "absolute",
              left: element.x,
              top: element.y,
              width: element.width,
              height: element.height,
              border:
                selectedElementId === element.id
                  ? "2px solid #3b82f6"
                  : "1px solid #ccc",
              background: "#f0f0f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
            onClick={() => handleSelectElement(element.id)}
          >
            Image Placeholder
          </div>
        );
      case "shape":
        // TODO: Implement ShapeElement component
        return (
          <div
            key={element.id}
            style={{
              position: "absolute",
              left: element.x,
              top: element.y,
              width: element.width,
              height: element.height,
              border:
                selectedElementId === element.id
                  ? "2px solid #3b82f6"
                  : "1px solid #ccc",
              background: element.fill || "#e0e0e0",
              cursor: "pointer",
            }}
            onClick={() => handleSelectElement(element.id)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 flex flex-col p-6">
      {/* Canvas Container */}
      <div className="flex-1 flex items-center justify-center">
        <div
          ref={canvasRef}
          className="relative bg-white shadow-lg overflow-hidden"
          style={{
            width: `${canvasDimensions.width}px`,
            height: `${canvasDimensions.height}px`,
            background,
          }}
          onClick={handleCanvasClick}
        >
          {/* Grid background (optional) */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundSize: "20px 20px",
            }}
          />

          {/* Render all elements */}
          {elements.map(renderElement)}
        </div>
      </div>
    </div>
  );
}
