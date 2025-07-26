"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { SlideElement } from "@/types";
import TextElement from "./TextElement";
import ImageElement from "./ImageElement";
import AlignmentGuides from "./AlignmentGuides";
import AlignmentToolbar from "./AlignmentToolbar";
import ContextMenu from "./ContextMenu";
import { AlignmentGuide, useSnapAlignment } from "@/hooks/useSnapAlignment";

const PPTX_SLIDE_WIDTH = 960; // 10 inches at 96 DPI
const PPTX_SLIDE_HEIGHT = 540; // 5.625 inches at 96 DPI

interface EditorCanvasProps {
  elements: SlideElement[];
  onUpdateElement: (id: string, updates: Partial<SlideElement>) => void;
  onDeleteElement: (id: string) => void;
  onAddElement: (element: SlideElement) => void;
  onSelectElement?: (id: string | null) => void;
  onBringToFront?: (elementId: string) => void;
  onSendToBack?: (elementId: string) => void;
  onBringForward?: (elementId: string) => void;
  onSendBackward?: (elementId: string) => void;
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
  onBringToFront,
  onSendToBack,
  onBringForward,
  onSendBackward,
  width,
  height,
  background = "#ffffff",
  slideFormat = "16:9",
}: EditorCanvasProps) {
  // Debug logging
  console.log("🎨 EditorCanvas received elements:", elements);
  console.log("🎨 Elements count:", elements?.length || 0);
  // Calculate canvas dimensions based on slide format
  const getCanvasDimensions = () => {
    // Force standard dimensions regardless of props
    if (slideFormat === "4:3") {
      return { width: 960, height: 720 }; // 4:3 aspect ratio
    }

    return { width: 960, height: 540 }; // 16:9 default - FORCE STANDARD SIZE
  };

  const canvasDimensions = getCanvasDimensions();

  // Debug canvas dimensions
  console.log("🔍 Canvas Dimensions Debug:", {
    slideFormat,
    width: width,
    height: height,
    calculated: canvasDimensions,
    PPTX_SLIDE_WIDTH,
    PPTX_SLIDE_HEIGHT,
  });
  const [selectedElementId, setSelectedElementId] = useState<string | null>(
    null
  );
  const [editingElementId, setEditingElementId] = useState<string | null>(null);
  const [alignmentGuides, setAlignmentGuides] = useState<AlignmentGuide[]>([]);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    elementId: string;
  } | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Helper function to get background style
  const getBackgroundStyle = () => {
    if (!background || background === "#ffffff") {
      return { backgroundColor: "#ffffff" };
    }

    if (background.startsWith("#")) {
      return { backgroundColor: background };
    }

    if (background.startsWith("linear-gradient")) {
      return { background: background };
    }

    if (background.startsWith("url(")) {
      return {
        backgroundImage: background,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      };
    }

    return { backgroundColor: "#ffffff" };
  };

  // Snap alignment hook for manual alignment
  const {
    alignToCanvasCenter,
    alignToHorizontalCenter,
    alignToVerticalCenter,
  } = useSnapAlignment({
    canvasWidth: canvasDimensions.width,
    canvasHeight: canvasDimensions.height,
  });

  // Handle canvas click to deselect elements
  const handleCanvasClick = useCallback(() => {
    // Always deselect when clicking on canvas - elements will stopPropagation if clicked
    setSelectedElementId(null);
    setEditingElementId(null);
    onSelectElement?.(null);
  }, [onSelectElement]);

  // Handle escape key to deselect
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedElementId(null);
        setEditingElementId(null);
        onSelectElement?.(null);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onSelectElement]);

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

  // Alignment handlers
  const handleAlignToCenter = useCallback(
    (elementId: string) => {
      const element = elements.find((el) => el.id === elementId);
      if (element) {
        const newPosition = alignToCanvasCenter(element);
        onUpdateElement(elementId, newPosition);
      }
    },
    [elements, alignToCanvasCenter, onUpdateElement]
  );

  const handleAlignHorizontalCenter = useCallback(
    (elementId: string) => {
      const element = elements.find((el) => el.id === elementId);
      if (element) {
        const newPosition = alignToHorizontalCenter(element);
        onUpdateElement(elementId, newPosition);
      }
    },
    [elements, alignToHorizontalCenter, onUpdateElement]
  );

  const handleAlignVerticalCenter = useCallback(
    (elementId: string) => {
      const element = elements.find((el) => el.id === elementId);
      if (element) {
        const newPosition = alignToVerticalCenter(element);
        onUpdateElement(elementId, newPosition);
      }
    },
    [elements, alignToVerticalCenter, onUpdateElement]
  );

  // Edge alignment handlers
  const handleAlignLeft = useCallback(
    (elementId: string) => {
      onUpdateElement(elementId, { x: 0 });
    },
    [onUpdateElement]
  );

  const handleAlignRight = useCallback(
    (elementId: string) => {
      const element = elements.find((el) => el.id === elementId);
      if (element) {
        onUpdateElement(elementId, {
          x: canvasDimensions.width - element.width,
        });
      }
    },
    [elements, onUpdateElement, canvasDimensions.width]
  );

  const handleAlignTop = useCallback(
    (elementId: string) => {
      onUpdateElement(elementId, { y: 0 });
    },
    [onUpdateElement]
  );

  const handleAlignBottom = useCallback(
    (elementId: string) => {
      const element = elements.find((el) => el.id === elementId);
      if (element) {
        onUpdateElement(elementId, {
          y: canvasDimensions.height - element.height,
        });
      }
    },
    [elements, onUpdateElement, canvasDimensions.height]
  );

  // Context menu handlers
  const handleContextMenu = useCallback(
    (elementId: string, x: number, y: number) => {
      setContextMenu({ x, y, elementId });
    },
    []
  );

  const handleCloseContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  const handleCopyElement = useCallback((elementId: string) => {
    // TODO: Implement copy functionality
    console.log("Copy element:", elementId);
  }, []);

  const handleBringToFront = useCallback(
    (elementId: string) => {
      onBringToFront?.(elementId);
    },
    [onBringToFront]
  );

  const handleSendToBack = useCallback(
    (elementId: string) => {
      onSendToBack?.(elementId);
    },
    [onSendToBack]
  );

  const handleBringForward = useCallback(
    (elementId: string) => {
      onBringForward?.(elementId);
    },
    [onBringForward]
  );

  const handleSendBackward = useCallback(
    (elementId: string) => {
      onSendBackward?.(elementId);
    },
    [onSendBackward]
  );

  // Handle drag and drop for images
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);

      try {
        const data = e.dataTransfer.getData("application/json");
        if (data) {
          const dropData = JSON.parse(data);

          if (dropData.type === "image" && dropData.imageData) {
            const canvasRect = canvasRef.current?.getBoundingClientRect();
            if (canvasRect) {
              const x = e.clientX - canvasRect.left;
              const y = e.clientY - canvasRect.top;

              const imageElement = {
                id: `image-${Date.now()}`,
                type: "image" as const,
                x: Math.max(0, x - 100), // Center the image on drop point
                y: Math.max(0, y - 75),
                width: 200,
                height: 150,
                src: dropData.imageData.url,
                alt: dropData.imageData.name,
                zIndex: 0,
              };

              onAddElement(imageElement);
            }
          }
        }
      } catch (error) {
        console.error("Error handling drop:", error);
      }
    },
    [onAddElement]
  );

  // Render elements based on type
  const renderElement = (element: SlideElement) => {
    console.log("🎨 Rendering element:", element.type, element);

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
            otherElements={elements.filter((el) => el.id !== element.id)}
            onSnapUpdate={setAlignmentGuides}
            onContextMenu={handleContextMenu}
          />
        );
      case "image":
        return (
          <ImageElement
            key={element.id}
            element={element}
            isSelected={selectedElementId === element.id}
            onSelect={handleSelectElement}
            onUpdate={onUpdateElement}
            onDelete={onDeleteElement}
            otherElements={elements.filter((el) => el.id !== element.id)}
            onSnapUpdate={setAlignmentGuides}
            onContextMenu={handleContextMenu}
          />
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
              zIndex:
                selectedElementId === element.id ? 999 : element.zIndex ?? 0,
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
    <div
      className="flex-1 flex flex-col p-6 relative"
      style={{ maxWidth: "100%", width: "100%" }}
    >
      {/* Alignment toolbar */}
      <AlignmentToolbar
        selectedElementId={selectedElementId}
        onAlignToCenter={handleAlignToCenter}
        onAlignLeft={handleAlignLeft}
        onAlignRight={handleAlignRight}
        onAlignTop={handleAlignTop}
        onAlignBottom={handleAlignBottom}
      />
      {/* Canvas Container */}
      <div
        className="flex-1 flex items-center justify-center"
        style={{
          minHeight: 0,
          maxWidth: "100%",
          width: "100%",
        }}
      >
        <div
          ref={canvasRef}
          className={`relative bg-white shadow-lg overflow-hidden transition-colors ${
            dragOver ? "bg-blue-50 border-2 border-blue-300 border-dashed" : ""
          }`}
          style={{
            width: `${canvasDimensions.width}px`,
            height: `${canvasDimensions.height}px`,
            ...(dragOver
              ? { backgroundColor: "#eff6ff" }
              : getBackgroundStyle()),
          }}
          onClick={handleCanvasClick}
          onMouseDown={(e) => {
            // Additional handler for mousedown to ensure deselection
            if (e.target === e.currentTarget) {
              handleCanvasClick();
            }
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {/* Grid background (optional) */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundSize: "20px 20px",
            }}
          />

          {/* Render all elements sorted by zIndex */}
          {(() => {
            const sortedElements = elements
              .slice() // Create a copy to avoid mutating the original array
              .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));

            console.log("🎨 Rendering sorted elements:", sortedElements);

            return sortedElements.map((element, index) => {
              console.log(`🎨 Rendering element ${index}:`, element);
              return renderElement(element);
            });
          })()}

          {/* Alignment guides */}
          <AlignmentGuides
            guides={alignmentGuides}
            canvasWidth={canvasDimensions.width}
            canvasHeight={canvasDimensions.height}
          />

          {/* Context menu */}
          {contextMenu && (
            <ContextMenu
              x={contextMenu.x}
              y={contextMenu.y}
              elementId={contextMenu.elementId}
              onClose={handleCloseContextMenu}
              onCopy={handleCopyElement}
              onDelete={onDeleteElement}
              onBringToFront={handleBringToFront}
              onSendToBack={handleSendToBack}
              onBringForward={handleBringForward}
              onSendBackward={handleSendBackward}
            />
          )}
        </div>
      </div>
    </div>
  );
}
