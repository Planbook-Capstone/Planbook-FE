"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { SlideElement } from "@/types";
import TextElement from "./TextElement";
import ImageElement from "./ImageElement";
import VideoElement from "./VideoElement";
import AlignmentGuides from "./AlignmentGuides";
import AlignmentToolbar from "./AlignmentToolbar";
import ContextMenu from "./ContextMenu";
import { AlignmentGuide, useSnapAlignment } from "@/hooks/useSnapAlignment";

// Canvas dimensions are calculated dynamically based on slide format

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
  onCopyElement?: (id: string) => void;
  onPasteElement?: () => void;
  width?: number;
  height?: number;
  background?: string;
  slideFormat?: "16:9" | "4:3";
  selectedElementId?: string | null;
  hasCopiedElement?: boolean;
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
  onCopyElement,
  onPasteElement,
  width: _width,
  height: _height,
  background = "#ffffff",
  slideFormat = "16:9",
  selectedElementId,
  hasCopiedElement,
}: EditorCanvasProps) {
  // Canvas setup
  // Calculate canvas dimensions based on slide format
  const getCanvasDimensions = () => {
    // Force standard dimensions regardless of props
    if (slideFormat === "4:3") {
      return { width: 960, height: 720 }; // 4:3 aspect ratio
    }

    return { width: 960, height: 540 }; // 16:9 default - FORCE STANDARD SIZE
  };

  const canvasDimensions = getCanvasDimensions();

  // Canvas dimensions calculated
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
  const { alignToCanvasCenter } = useSnapAlignment({
    canvasWidth: canvasDimensions.width,
    canvasHeight: canvasDimensions.height,
  });

  // Handle canvas click to deselect elements
  const handleCanvasClick = useCallback(() => {
    // Always deselect when clicking on canvas - elements will stopPropagation if clicked
    setEditingElementId(null);
    onSelectElement?.(null);
  }, [onSelectElement]);

  // Handle escape key to deselect
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
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
      setEditingElementId(null);
      onSelectElement?.(id);
    },
    [onSelectElement]
  );

  // Handle element editing
  const handleEditElement = useCallback(
    (id: string) => {
      onSelectElement?.(id);
      setEditingElementId(id);
    },
    [onSelectElement]
  );

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

  // const handleAlignHorizontalCenter = useCallback(
  //   (elementId: string) => {
  //     const element = elements.find((el) => el.id === elementId);
  //     if (element) {
  //       const newPosition = alignToHorizontalCenter(element);
  //       onUpdateElement(elementId, newPosition);
  //     }
  //   },
  //   [elements, alignToHorizontalCenter, onUpdateElement]
  // );

  // const handleAlignVerticalCenter = useCallback(
  //   (elementId: string) => {
  //     const element = elements.find((el) => el.id === elementId);
  //     if (element) {
  //       const newPosition = alignToVerticalCenter(element);
  //       onUpdateElement(elementId, newPosition);
  //     }
  //   },
  //   [elements, alignToVerticalCenter, onUpdateElement]
  // );

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

  const handleCopyElement = useCallback(
    (elementId: string) => {
      onCopyElement?.(elementId);
    },
    [onCopyElement]
  );

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
            onSelect={() => handleSelectElement(element.id)}
            onUpdate={onUpdateElement}
            onDelete={onDeleteElement}
            otherElements={elements.filter((el) => el.id !== element.id)}
            onSnapUpdate={setAlignmentGuides}
            onContextMenu={handleContextMenu}
          />
        );
      case "video":
        return (
          <VideoElement
            key={element.id}
            element={element}
            isSelected={selectedElementId === element.id}
            isEditing={editingElementId === element.id}
            onSelect={() => handleSelectElement(element.id)}
            onStartEditing={() => handleEditElement(element.id)}
            onStopEditing={() => handleStopEdit()}
            onUpdate={(updates) => onUpdateElement(element.id, updates)}
            onDelete={() => onDeleteElement(element.id)}
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
        selectedElementId={selectedElementId || null}
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

            return sortedElements.map((element) => {
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
              onPaste={onPasteElement}
              onDelete={onDeleteElement}
              onBringToFront={handleBringToFront}
              onSendToBack={handleSendToBack}
              onBringForward={handleBringForward}
              onSendBackward={handleSendBackward}
              hasCopiedElement={hasCopiedElement}
            />
          )}
        </div>
      </div>
    </div>
  );
}
