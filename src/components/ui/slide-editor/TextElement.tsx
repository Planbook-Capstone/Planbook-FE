"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Rnd } from "react-rnd";
import { TextElement as TextElementType, TextStyle } from "@/types";
import { useSnapAlignment } from "@/hooks/useSnapAlignment";

// Helper function to convert vertical alignment to CSS justify-content
const getVerticalAlignment = (
  verticalAlign: "top" | "middle" | "bottom"
): string => {
  switch (verticalAlign) {
    case "top":
      return "flex-start";
    case "middle":
      return "center";
    case "bottom":
      return "flex-end";
    default:
      return "flex-start";
  }
};

// Fallback helper to ensure text is always string (defensive programming)
const ensureTextIsString = (text: any): string => {
  if (typeof text === "string") {
    return text;
  }

  if (typeof text === "object" && text !== null) {
    console.warn(
      "⚠️ Text object detected in component, should be normalized at API layer:",
      text
    );
    // Convert object like {"0": "line1", "1": "line2"} to "line1\nline2"
    const keys = Object.keys(text).sort((a, b) => parseInt(a) - parseInt(b));
    return keys.map((key) => text[key]).join("\n");
  }

  return String(text || "");
};

interface TextElementProps {
  element: TextElementType;
  isSelected: boolean;
  isEditing: boolean;
  onSelect: (id: string) => void;
  onEdit: (id: string) => void;
  onStopEdit: () => void;
  onUpdate: (id: string, updates: Partial<TextElementType>) => void;
  onDelete: (id: string) => void;
  otherElements?: Array<{
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
  }>;
  onSnapUpdate?: (guides: any[]) => void;
  onContextMenu?: (elementId: string, x: number, y: number) => void;
}

export default function TextElement({
  element,
  isSelected,
  isEditing,
  onSelect,
  onEdit,
  onStopEdit,
  onUpdate,
  onDelete,
  otherElements = [],
  onSnapUpdate,
  onContextMenu,
}: TextElementProps) {
  const [localText, setLocalText] = useState(element.text);
  const textRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);

  // Sync localText with element.text when element changes
  useEffect(() => {
    setLocalText(element.text);
  }, [element.text]);

  // Focus text element when editing starts
  useEffect(() => {
    if (isEditing && textRef.current) {
      // Don't set innerText here, let the initial render handle it
      textRef.current.focus();

      // Set cursor to end of text
      setTimeout(() => {
        if (textRef.current) {
          const range = document.createRange();
          const selection = window.getSelection();
          range.selectNodeContents(textRef.current);
          range.collapse(false);
          selection?.removeAllRanges();
          selection?.addRange(range);
        }
      }, 0);
    }
  }, [isEditing]);

  // Debug logging
  console.log("📝 TextElement rendering:", {
    id: element.id,
    text: element.text,
    localText: localText,
    position: { x: element.x, y: element.y },
    size: { width: element.width, height: element.height },
    style: element.style,
    isSelected,
    isEditing,
  });

  // Snap alignment hook
  const { handleDragWithSnap, clearGuides } = useSnapAlignment({
    threshold: 6,
    showGuides: true,
    snapToCanvas: true,
    canvasWidth: 960,
    canvasHeight: 540,
  });

  // Calculate minimum size based on text content
  const calculateMinSize = useCallback(() => {
    // Create a temporary element to measure text
    const tempDiv = document.createElement("div");
    tempDiv.style.position = "absolute";
    tempDiv.style.visibility = "hidden";
    tempDiv.style.fontSize = `${element.style.fontSize}px`;
    tempDiv.style.fontFamily = element.style.fontFamily;
    tempDiv.style.fontWeight = element.style.bold ? "bold" : "normal";
    tempDiv.style.fontStyle = element.style.italic ? "italic" : "normal";
    tempDiv.style.lineHeight = "1.4"; // Match CSS lineHeight
    tempDiv.style.padding = "4px";
    tempDiv.style.boxSizing = "border-box";
    tempDiv.style.whiteSpace = "pre-wrap"; // Match actual rendering
    tempDiv.style.wordBreak = "break-word";
    tempDiv.style.width = `${Math.max(element.width - 8, 80)}px`; // Account for padding

    const rawText = localText || element.text || "A";
    const currentText = ensureTextIsString(rawText);

    tempDiv.textContent = currentText;
    document.body.appendChild(tempDiv);

    const actualHeight = tempDiv.offsetHeight;
    const actualWidth = tempDiv.offsetWidth;

    document.body.removeChild(tempDiv);

    // Simple minimum calculations
    const minWidth = Math.max(80, element.style.fontSize * 3);
    const minHeight = Math.max(
      actualHeight, // Use actual measured height
      element.style.fontSize * 1.2 + 8 // Minimal fallback: font size + small padding
    );

    return { width: minWidth, height: minHeight };
  }, [element.style, localText, element.text, element.width]);

  // Update local text when element text changes
  useEffect(() => {
    setLocalText(ensureTextIsString(element.text));
  }, [element.text]);

  // ✅ Smart auto-resize: only expand if text doesn't fit, allow manual shrinking
  useEffect(() => {
    const minSize = calculateMinSize();

    // Only auto-expand height if current size is smaller than minimum needed for text
    // Don't auto-shrink - let user control that
    // Don't auto-expand width - let user control that too
    if (element.height < minSize.height) {
      const newHeight = minSize.height;

      if (newHeight !== element.height) {
        onUpdate(element.id, {
          height: newHeight,
        });
      }
    }
  }, [
    localText,
    element.text,
    element.width,
    calculateMinSize,
    element.id,
    onUpdate,
    element.height,
  ]);

  // Handle text editing
  const handleTextChange = useCallback(
    (e: React.FormEvent<HTMLDivElement>) => {
      const newText = e.currentTarget.innerText; // 👈 dùng innerText thay vì textContent
      console.log("📝 TextChange - newText:", newText, "localText:", localText);
      setLocalText(newText);
    },
    [localText]
  );

  const handleTextBlur = useCallback(() => {
    const currentText = textRef.current?.innerText || "";
    console.log(
      "📝 TextBlur - currentText:",
      currentText,
      "element.text:",
      element.text
    );

    // Only update if text actually changed
    if (currentText !== element.text) {
      onUpdate(element.id, { text: currentText });
    }

    // Update local state to match
    setLocalText(currentText);
    onStopEdit();
  }, [element.id, element.text, onUpdate, onStopEdit]);

  const handleTextKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      // Cho Enter xuống dòng bình thường
      if (e.key === "Enter" && !e.shiftKey) {
        // Đừng chặn mặc định - để contentEditable tự xử lý xuống dòng
        return;
      }

      // Escape để huỷ
      if (e.key === "Escape") {
        setLocalText(element.text); // Reset to original text
        textRef.current?.blur();
      }
    },
    [element.text]
  );

  // Handle double click to edit
  const handleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      console.log("🔍 Double click detected:", {
        elementId: element.id,
        isEditing,
        target: e.target,
        currentTarget: e.currentTarget,
      });
      e.stopPropagation();
      if (!isEditing) {
        console.log("🎯 Starting edit mode for:", element.id);
        onEdit(element.id);
        setTimeout(() => {
          if (textRef.current) {
            // Set initial content for editing
            textRef.current.innerText = ensureTextIsString(element.text) || "";
            textRef.current.focus();

            // Place cursor at end
            const range = document.createRange();
            const selection = window.getSelection();
            range.selectNodeContents(textRef.current);
            range.collapse(false);
            selection?.removeAllRanges();
            selection?.addRange(range);
          }
        }, 0);
      }
    },
    [element.id, isEditing, onEdit, element.text]
  );

  // Handle single click to select
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      console.log("🔍 Single click detected:", {
        elementId: element.id,
        isEditing,
        target: e.target,
        currentTarget: e.currentTarget,
      });
      e.stopPropagation();
      if (!isEditing) {
        onSelect(element.id, e);
      }
    },
    [element.id, isEditing, onSelect]
  );

  // Handle delete key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        isSelected &&
        !isEditing &&
        (e.key === "Delete" || e.key === "Backspace")
      ) {
        e.preventDefault();
        onDelete(element.id);
      }
    };

    if (isSelected) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isSelected, isEditing, element.id, onDelete]);

  // Generate text styles
  const textStyles: React.CSSProperties = {
    fontSize: `${element.style?.fontSize || 14}px`,
    fontFamily: element.style?.fontFamily || "Arial",
    fontWeight: element.style?.bold ? "bold" : "normal",
    fontStyle: element.style?.italic ? "italic" : "normal",
    textDecoration: element.style?.underline ? "underline" : "none",
    color: element.style?.color || "#000000",
    background: "transparent",
    outline: "none",
    border: "none",
    padding: "4px",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    overflowWrap: "anywhere",
    lineHeight: "1.4",
    height: "100%",
    width: "100%",
    boxSizing: "border-box",
    cursor: isEditing ? "text" : "pointer",
    textAlign: element.style?.textAlign || "left",
  };

  // Debug text styles
  console.log("📝 Text styles for", element.id, ":", textStyles);
  console.log("📝 Element text content:", element.text);
  console.log("📝 Vertical alignment:", {
    verticalAlign: element.style?.verticalAlign,
    justifyContent: getVerticalAlignment(element.style?.verticalAlign || "top"),
  });

  const minSize = calculateMinSize();

  return (
    <Rnd
      size={{ width: element.width, height: element.height }}
      position={{ x: element.x, y: element.y }}
      minWidth={minSize.width}
      minHeight={minSize.height}
      onClick={handleClick}
      onDrag={(e, d) => {
        // Handle snap during drag
        const snapResult = handleDragWithSnap(
          { ...element, x: d.x, y: d.y },
          otherElements
        );

        if (onSnapUpdate) {
          onSnapUpdate(snapResult.guides);
        }

        if (snapResult.snapped) {
          // Update position with snapped coordinates
          onUpdate(element.id, { x: snapResult.x, y: snapResult.y });
        }
      }}
      onDragStop={(e, d) => {
        clearGuides();
        if (onSnapUpdate) {
          onSnapUpdate([]);
        }
        onUpdate(element.id, { x: d.x, y: d.y });
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        const newWidth = parseInt(ref.style.width);
        const newHeight = parseInt(ref.style.height);

        // Ensure minimum size constraints
        const finalWidth = Math.max(newWidth, minSize.width);
        const finalHeight = Math.max(newHeight, minSize.height);

        onUpdate(element.id, {
          width: finalWidth,
          height: finalHeight,
          x: position.x,
          y: position.y,
        });
      }}
      bounds="parent"
      enableResizing={isSelected && !isEditing}
      disableDragging={isEditing}
      className={`
        ${isSelected ? "ring-2 ring-blue-500" : ""}
        ${isEditing ? "ring-2 ring-green-500" : ""}
      `}
      style={{
        zIndex: isEditing ? 1000 : isSelected ? 999 : element.zIndex ?? 0,
      }}
      resizeHandleStyles={{
        bottomRight: {
          width: "12px",
          height: "12px",
          backgroundColor: "#3b82f6",
          border: "2px solid white",
          borderRadius: "50%",
          right: "-6px",
          bottom: "-6px",
        },
        bottomLeft: {
          width: "12px",
          height: "12px",
          backgroundColor: "#3b82f6",
          border: "2px solid white",
          borderRadius: "50%",
          left: "-6px",
          bottom: "-6px",
        },
        topRight: {
          width: "12px",
          height: "12px",
          backgroundColor: "#3b82f6",
          border: "2px solid white",
          borderRadius: "50%",
          right: "-6px",
          top: "-6px",
        },
        topLeft: {
          width: "12px",
          height: "12px",
          backgroundColor: "#3b82f6",
          border: "2px solid white",
          borderRadius: "50%",
          left: "-6px",
          top: "-6px",
        },
      }}
    >
      {/* Vertical alignment wrapper */}
      <div
        className="w-full h-full"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: getVerticalAlignment(
            element.style?.verticalAlign || "top"
          ),
        }}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
      >
        {isEditing ? (
          <div
            key={`editing-${element.id}-${isEditing}`}
            ref={textRef}
            contentEditable
            suppressContentEditableWarning
            onInput={handleTextChange}
            onBlur={handleTextBlur}
            onKeyDown={handleTextKeyDown}
            className="w-full"
            style={{
              ...textStyles,
              display: "block",
              userSelect: "text",
              height: "auto",
              minHeight: "1em",
            }}
          >
            {ensureTextIsString(element.text) || ""}
          </div>
        ) : (
          <div
            onContextMenu={(e) => {
              e.preventDefault();
              if (onContextMenu) {
                onContextMenu(element.id, e.clientX, e.clientY);
              }
            }}
            className="w-full"
            style={{
              ...textStyles,
              display: "block",
              userSelect: "text",
              whiteSpace: "pre-wrap",
              overflowWrap: "break-word",
              height: "auto",
              minHeight: "1em",
            }}
          >
            {ensureTextIsString(element.text) || "Double-click to edit"}
            {/* Debug fallback */}
            {!element.text && (
              <div style={{ color: "red", fontSize: "12px" }}>
                [No text content]
              </div>
            )}
          </div>
        )}
      </div>
    </Rnd>
  );
}
