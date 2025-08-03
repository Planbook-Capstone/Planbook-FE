"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { ShapeElement as ShapeElementType } from "@/types";

interface ShapeElementProps {
  element: ShapeElementType;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onUpdate: (id: string, updates: Partial<ShapeElementType>) => void;
  onDelete: (id: string) => void;
  otherElements: ShapeElementType[];
  onSnapUpdate?: (guides: any[]) => void;
  onContextMenu?: (elementId: string, x: number, y: number) => void;
}

export default function ShapeElement({
  element,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  otherElements,
  onSnapUpdate,
  onContextMenu,
}: ShapeElementProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hasMoved, setHasMoved] = useState(false);
  const [resizeStart, setResizeStart] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    elementX: 0,
    elementY: 0,
    direction: "",
  });
  const elementRef = useRef<HTMLDivElement>(null);

  // Handle click for selection
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onSelect(element.id);
    },
    [element.id, onSelect]
  );

  // Handle mouse down for dragging
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      // Don't start drag if clicking on resize handles
      if ((e.target as HTMLElement).classList.contains("resize-handle")) {
        return;
      }

      // Prepare for potential dragging
      setHasMoved(false);
      setDragStart({
        x: e.clientX - element.x,
        y: e.clientY - element.y,
      });
    },
    [element.x, element.y]
  );

  // Handle resize handle mouse down
  const handleResizeMouseDown = useCallback(
    (e: React.MouseEvent, direction: string) => {
      e.preventDefault();
      e.stopPropagation();

      setIsResizing(true);
      setResizeStart({
        x: e.clientX,
        y: e.clientY,
        width: element.width,
        height: element.height,
        elementX: element.x,
        elementY: element.y,
        direction,
      });
    },
    [element.width, element.height, element.x, element.y]
  );

  // Handle mouse move for dragging and resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Check if we should start dragging
      if (
        !isDragging &&
        !isResizing &&
        dragStart.x !== 0 &&
        dragStart.y !== 0
      ) {
        const startX = element.x + dragStart.x;
        const startY = element.y + dragStart.y;
        const deltaX = Math.abs(e.clientX - startX);
        const deltaY = Math.abs(e.clientY - startY);

        if (deltaX > 5 || deltaY > 5) {
          // Start dragging after 5px movement
          setIsDragging(true);
          setHasMoved(true);
        }
      }

      if (isDragging) {
        const newX = e.clientX - dragStart.x;
        const newY = e.clientY - dragStart.y;
        onUpdate(element.id, { x: Math.max(0, newX), y: Math.max(0, newY) });
      } else if (isResizing) {
        const deltaX = e.clientX - resizeStart.x;
        const deltaY = e.clientY - resizeStart.y;

        let newWidth = resizeStart.width;
        let newHeight = resizeStart.height;
        let newX = resizeStart.elementX;
        let newY = resizeStart.elementY;

        switch (resizeStart.direction) {
          case "se": // Southeast - bottom right corner
            newWidth = Math.max(30, resizeStart.width + deltaX);
            newHeight = Math.max(30, resizeStart.height + deltaY);
            break;
          case "sw": // Southwest - bottom left corner
            newWidth = Math.max(30, resizeStart.width - deltaX);
            newHeight = Math.max(30, resizeStart.height + deltaY);
            newX = resizeStart.elementX + (resizeStart.width - newWidth);
            break;
          case "ne": // Northeast - top right corner
            newWidth = Math.max(30, resizeStart.width + deltaX);
            newHeight = Math.max(30, resizeStart.height - deltaY);
            newY = resizeStart.elementY + (resizeStart.height - newHeight);
            break;
          case "nw": // Northwest - top left corner
            newWidth = Math.max(30, resizeStart.width - deltaX);
            newHeight = Math.max(30, resizeStart.height - deltaY);
            newX = resizeStart.elementX + (resizeStart.width - newWidth);
            newY = resizeStart.elementY + (resizeStart.height - newHeight);
            break;
          case "e": // East - right edge
            newWidth = Math.max(30, resizeStart.width + deltaX);
            break;
          case "w": // West - left edge
            newWidth = Math.max(30, resizeStart.width - deltaX);
            newX = resizeStart.elementX + (resizeStart.width - newWidth);
            break;
          case "n": // North - top edge
            newHeight = Math.max(30, resizeStart.height - deltaY);
            newY = resizeStart.elementY + (resizeStart.height - newHeight);
            break;
          case "s": // South - bottom edge
            newHeight = Math.max(30, resizeStart.height + deltaY);
            break;
        }

        onUpdate(element.id, {
          width: newWidth,
          height: newHeight,
          x: Math.max(0, newX),
          y: Math.max(0, newY),
        });
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      // If we didn't move much, treat it as a click for selection
      if (!hasMoved && !isDragging && !isResizing) {
        onSelect(element.id);
      }

      setIsDragging(false);
      setIsResizing(false);
      setDragStart({ x: 0, y: 0 }); // Reset drag start
      setHasMoved(false);

      if (onSnapUpdate) {
        onSnapUpdate([]);
      }
    };

    // Always listen for mouse events when we have a drag start position or are actively dragging/resizing
    if (isDragging || isResizing || (dragStart.x !== 0 && dragStart.y !== 0)) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [
    isDragging,
    isResizing,
    dragStart,
    resizeStart,
    element.id,
    element.x,
    element.y,
    hasMoved,
    onUpdate,
    onSnapUpdate,
    onSelect,
  ]);

  // Handle context menu
  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      console.log(
        "Context menu triggered for shape:",
        element.id,
        "at position:",
        e.clientX,
        e.clientY
      );
      if (onContextMenu) {
        onContextMenu(element.id, e.clientX, e.clientY);
      }
    },
    [element.id, onContextMenu]
  );

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isSelected) return;

      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        onDelete(element.id);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSelected, element.id, onDelete]);

  // Render shape based on type
  const renderShape = () => {
    const { shapeType, fill, stroke, strokeWidth, width, height, opacity } =
      element;

    const svgStyle = {
      width: "100%",
      height: "100%",
      display: "block",
      opacity: opacity !== undefined ? opacity : 1,
    };

    const shapeStyle = {
      fill: fill || "#3b82f6",
      stroke: stroke || "#1e40af",
      strokeWidth: strokeWidth || 2,
    };

    // Use actual width/height ratio for viewBox to allow flexible shapes
    const viewBoxWidth = Math.max(width, 100);
    const viewBoxHeight = Math.max(height, 100);
    const strokeOffset = (strokeWidth || 2) / 2;

    switch (shapeType) {
      case "rectangle":
        return (
          <svg
            style={svgStyle}
            viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
          >
            <rect
              x={strokeOffset}
              y={strokeOffset}
              width={viewBoxWidth - strokeOffset * 2}
              height={viewBoxHeight - strokeOffset * 2}
              rx="4"
              {...shapeStyle}
            />
          </svg>
        );
      case "circle":
        // For circle, use the smaller dimension to keep it circular
        const radius = Math.min(viewBoxWidth, viewBoxHeight) / 2 - strokeOffset;
        const centerX = viewBoxWidth / 2;
        const centerY = viewBoxHeight / 2;
        return (
          <svg
            style={svgStyle}
            viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
          >
            <circle cx={centerX} cy={centerY} r={radius} {...shapeStyle} />
          </svg>
        );
      case "triangle":
        return (
          <svg
            style={svgStyle}
            viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
          >
            <polygon
              points={`${viewBoxWidth / 2},${strokeOffset} ${
                viewBoxWidth - strokeOffset
              },${viewBoxHeight - strokeOffset} ${strokeOffset},${
                viewBoxHeight - strokeOffset
              }`}
              {...shapeStyle}
            />
          </svg>
        );
      case "star":
        // Star points adjusted for flexible dimensions
        const cx = viewBoxWidth / 2;
        const cy = viewBoxHeight / 2;
        const outerRadius =
          Math.min(viewBoxWidth, viewBoxHeight) / 2 - strokeOffset;
        const innerRadius = outerRadius * 0.4;

        const starPoints = [];
        for (let i = 0; i < 10; i++) {
          const angle = (i * Math.PI) / 5 - Math.PI / 2;
          const radius = i % 2 === 0 ? outerRadius : innerRadius;
          const x = cx + radius * Math.cos(angle);
          const y = cy + radius * Math.sin(angle);
          starPoints.push(`${x},${y}`);
        }

        return (
          <svg
            style={svgStyle}
            viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
          >
            <polygon points={starPoints.join(" ")} {...shapeStyle} />
          </svg>
        );
      default:
        return (
          <svg
            style={svgStyle}
            viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
          >
            <rect
              x={strokeOffset}
              y={strokeOffset}
              width={viewBoxWidth - strokeOffset * 2}
              height={viewBoxHeight - strokeOffset * 2}
              {...shapeStyle}
            />
          </svg>
        );
    }
  };

  return (
    <div
      ref={elementRef}
      className={`absolute select-none ${
        isDragging ? "cursor-grabbing" : "cursor-grab"
      }`}
      style={{
        left: element.x,
        top: element.y,
        width: element.width,
        height: element.height,
        zIndex: isSelected ? 999 : element.zIndex ?? 0,
        outline: isSelected ? "2px solid #3b82f6" : "none",
        outlineOffset: "2px",
        transform: element.rotation
          ? `rotate(${element.rotation}deg)`
          : undefined,
        transformOrigin: "center center",
      }}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
    >
      {renderShape()}

      {/* Resize handles */}
      {isSelected && (
        <>
          {/* Corner handles */}
          <div
            className="resize-handle absolute w-3 h-3 bg-blue-500 border-2 border-white rounded-full cursor-nw-resize shadow-sm"
            style={{ top: -6, left: -6 }}
            onMouseDown={(e) => handleResizeMouseDown(e, "nw")}
          />
          <div
            className="resize-handle absolute w-3 h-3 bg-blue-500 border-2 border-white rounded-full cursor-ne-resize shadow-sm"
            style={{ top: -6, right: -6 }}
            onMouseDown={(e) => handleResizeMouseDown(e, "ne")}
          />
          <div
            className="resize-handle absolute w-3 h-3 bg-blue-500 border-2 border-white rounded-full cursor-sw-resize shadow-sm"
            style={{ bottom: -6, left: -6 }}
            onMouseDown={(e) => handleResizeMouseDown(e, "sw")}
          />
          <div
            className="resize-handle absolute w-3 h-3 bg-blue-500 border-2 border-white rounded-full cursor-se-resize shadow-sm"
            style={{ bottom: -6, right: -6 }}
            onMouseDown={(e) => handleResizeMouseDown(e, "se")}
          />

          {/* Edge handles for flexible resizing */}
          <div
            className="resize-handle absolute w-2 h-3 bg-blue-500 border border-white rounded cursor-n-resize shadow-sm"
            style={{ top: -6, left: "50%", transform: "translateX(-50%)" }}
            onMouseDown={(e) => handleResizeMouseDown(e, "n")}
          />
          <div
            className="resize-handle absolute w-2 h-3 bg-blue-500 border border-white rounded cursor-s-resize shadow-sm"
            style={{ bottom: -6, left: "50%", transform: "translateX(-50%)" }}
            onMouseDown={(e) => handleResizeMouseDown(e, "s")}
          />
          <div
            className="resize-handle absolute w-3 h-2 bg-blue-500 border border-white rounded cursor-w-resize shadow-sm"
            style={{ left: -6, top: "50%", transform: "translateY(-50%)" }}
            onMouseDown={(e) => handleResizeMouseDown(e, "w")}
          />
          <div
            className="resize-handle absolute w-3 h-2 bg-blue-500 border border-white rounded cursor-e-resize shadow-sm"
            style={{ right: -6, top: "50%", transform: "translateY(-50%)" }}
            onMouseDown={(e) => handleResizeMouseDown(e, "e")}
          />
        </>
      )}
    </div>
  );
}
