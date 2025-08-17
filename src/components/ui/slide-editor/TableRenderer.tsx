import React, { useState, useRef, useCallback } from "react";
import { TableElement } from "@/types";

interface TableRendererProps {
  element: TableElement;
  isSelected?: boolean;
  onSelect?: () => void;
  onUpdate?: (updates: Partial<TableElement>) => void;
  onDelete?: () => void;
}

export const TableRenderer: React.FC<TableRendererProps> = ({
  element,
  isSelected = false,
  onSelect,
  onUpdate,
  onDelete,
}) => {
  const {
    x,
    y,
    width,
    height,
    headers,
    rows,
    style = {},
    zIndex = 0,
  } = element;

  const {
    borderColor = "#000000",
    borderWidth = 1,
    headerBackgroundColor = "#f3f4f6",
    cellBackgroundColor = "#ffffff",
    textColor = "#000000",
    fontSize = 14,
    fontFamily = "Arial, sans-serif",
    textAlign = "center",
  } = style;

  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState<string>("");
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [initialSize, setInitialSize] = useState({ width: 0, height: 0 });
  const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 });
  const elementRef = useRef<HTMLDivElement>(null);

  // Handle click/drag start
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      // First, select the element if not selected
      if (!isSelected && onSelect) {
        onSelect();
        return;
      }

      // If already selected and not resizing, start dragging
      if (isSelected && !isResizing) {
        setIsDragging(true);
        setDragStart({ x: e.clientX, y: e.clientY });
        setInitialPosition({ x, y });
      }
    },
    [isSelected, isResizing, x, y, onSelect]
  );

  // Handle resize start
  const handleResizeStart = useCallback(
    (e: React.MouseEvent, direction: string) => {
      e.preventDefault();
      e.stopPropagation();

      setIsResizing(true);
      setResizeDirection(direction);
      setDragStart({ x: e.clientX, y: e.clientY });
      setInitialSize({ width, height });
      setInitialPosition({ x, y });
    },
    [width, height, x, y]
  );

  // Handle mouse move
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!onUpdate) return;

      if (isDragging) {
        const deltaX = e.clientX - dragStart.x;
        const deltaY = e.clientY - dragStart.y;

        const newX = Math.max(0, initialPosition.x + deltaX);
        const newY = Math.max(0, initialPosition.y + deltaY);

        onUpdate({ x: newX, y: newY });
      } else if (isResizing) {
        const deltaX = e.clientX - dragStart.x;
        const deltaY = e.clientY - dragStart.y;

        let newWidth = initialSize.width;
        let newHeight = initialSize.height;
        let newX = initialPosition.x;
        let newY = initialPosition.y;

        if (resizeDirection.includes("e")) {
          newWidth = Math.max(100, initialSize.width + deltaX);
        }
        if (resizeDirection.includes("w")) {
          newWidth = Math.max(100, initialSize.width - deltaX);
          newX = initialPosition.x + deltaX;
        }
        if (resizeDirection.includes("s")) {
          newHeight = Math.max(50, initialSize.height + deltaY);
        }
        if (resizeDirection.includes("n")) {
          newHeight = Math.max(50, initialSize.height - deltaY);
          newY = initialPosition.y + deltaY;
        }

        onUpdate({
          width: newWidth,
          height: newHeight,
          x: newX,
          y: newY,
        });
      }
    },
    [
      isDragging,
      isResizing,
      dragStart,
      initialSize,
      initialPosition,
      resizeDirection,
      onUpdate,
    ]
  );

  // Handle mouse up
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeDirection("");
  }, []);

  // Add event listeners
  React.useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

  // Handle delete key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        isSelected &&
        (e.key === "Delete" || e.key === "Backspace") &&
        onDelete
      ) {
        e.preventDefault();
        onDelete();
      }
    };

    if (isSelected) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isSelected, onDelete]);

  return (
    <div
      ref={elementRef}
      className={`absolute ${isSelected ? "ring-2 ring-blue-500" : ""} ${
        isDragging ? "cursor-grabbing" : "cursor-pointer"
      }`}
      style={{
        left: x,
        top: y,
        width,
        height,
        zIndex: isSelected ? 1000 : zIndex,
        userSelect: "none",
        border: "1px solid red", // Debug border
      }}
      onMouseDown={handleMouseDown}
      title={`Table at ${x},${y} - ${isSelected ? "Selected" : "Not selected"}`} // Debug tooltip
    >
      <table
        className="w-full h-full border-collapse"
        style={{
          borderColor,
          borderWidth,
          fontFamily,
          fontSize,
          color: textColor,
        }}
      >
        {/* Table Header */}
        {headers.length > 0 && (
          <thead>
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="border"
                  style={{
                    borderColor,
                    borderWidth,
                    backgroundColor: headerBackgroundColor,
                    textAlign,
                    padding: "8px 4px",
                    fontWeight: "bold",
                  }}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
        )}

        {/* Table Body */}
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className="border"
                  style={{
                    borderColor,
                    borderWidth,
                    backgroundColor: cellBackgroundColor,
                    textAlign,
                    padding: "8px 4px",
                  }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Selection handles */}
      {isSelected && (
        <>
          {/* Corner handles for resizing */}
          <div
            className="absolute -top-1 -left-1 w-3 h-3 bg-blue-500 border border-white rounded-full cursor-nw-resize hover:bg-blue-600"
            onMouseDown={(e) => handleResizeStart(e, "nw")}
          />
          <div
            className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 border border-white rounded-full cursor-ne-resize hover:bg-blue-600"
            onMouseDown={(e) => handleResizeStart(e, "ne")}
          />
          <div
            className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-500 border border-white rounded-full cursor-sw-resize hover:bg-blue-600"
            onMouseDown={(e) => handleResizeStart(e, "sw")}
          />
          <div
            className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 border border-white rounded-full cursor-se-resize hover:bg-blue-600"
            onMouseDown={(e) => handleResizeStart(e, "se")}
          />

          {/* Edge handles */}
          <div
            className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-blue-500 border border-white rounded-full cursor-n-resize hover:bg-blue-600"
            onMouseDown={(e) => handleResizeStart(e, "n")}
          />
          <div
            className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-blue-500 border border-white rounded-full cursor-s-resize hover:bg-blue-600"
            onMouseDown={(e) => handleResizeStart(e, "s")}
          />
          <div
            className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-blue-500 border border-white rounded-full cursor-w-resize hover:bg-blue-600"
            onMouseDown={(e) => handleResizeStart(e, "w")}
          />
          <div
            className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-blue-500 border border-white rounded-full cursor-e-resize hover:bg-blue-600"
            onMouseDown={(e) => handleResizeStart(e, "e")}
          />
        </>
      )}
    </div>
  );
};
