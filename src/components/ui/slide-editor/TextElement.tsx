"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Rnd } from "react-rnd";
import { TextElement as TextElementType, TextStyle } from "@/types";

interface TextElementProps {
  element: TextElementType;
  isSelected: boolean;
  isEditing: boolean;
  onSelect: (id: string) => void;
  onEdit: (id: string) => void;
  onStopEdit: () => void;
  onUpdate: (id: string, updates: Partial<TextElementType>) => void;
  onDelete: (id: string) => void;
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
}: TextElementProps) {
  const [localText, setLocalText] = useState(element.text);
  const textRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);

  // Calculate minimum size based on text content
  const calculateMinSize = useCallback(() => {
    // Create a temporary element to measure text
    const tempDiv = document.createElement("div");
    tempDiv.style.position = "absolute";
    tempDiv.style.visibility = "hidden";
    tempDiv.style.whiteSpace = "nowrap";
    tempDiv.style.fontSize = `${element.style.fontSize}px`;
    tempDiv.style.fontFamily = element.style.fontFamily;
    tempDiv.style.fontWeight = element.style.bold ? "bold" : "normal";
    tempDiv.style.fontStyle = element.style.italic ? "italic" : "normal";
    tempDiv.style.padding = "4px";
    tempDiv.style.boxSizing = "border-box";

    // Use current text content or fallback
    const currentText = localText || element.text || "A";
    tempDiv.textContent = currentText;

    document.body.appendChild(tempDiv);
    const singleLineWidth = tempDiv.offsetWidth;
    const lineHeight = tempDiv.offsetHeight;
    document.body.removeChild(tempDiv);

    // Calculate minimum width based on content
    // For multiline support, ensure minimum width for text wrapping
    const minWidth = Math.max(80, element.style.fontSize * 4);

    // Calculate minimum height based on line height
    // Account for potential multiline content
    const estimatedLines = Math.max(1, Math.ceil(currentText.length / 20));
    const minHeight = Math.max(
      lineHeight * estimatedLines + 16,
      element.style.fontSize * 1.8
    );

    return { width: minWidth, height: minHeight };
  }, [element.style, localText, element.text]);

  // Update local text when element text changes
  useEffect(() => {
    setLocalText(element.text);
  }, [element.text]);

  // Auto-resize element if it's smaller than minimum size
  useEffect(() => {
    const minSize = calculateMinSize();
    if (element.width < minSize.width || element.height < minSize.height) {
      const newWidth = Math.max(element.width, minSize.width);
      const newHeight = Math.max(element.height, minSize.height);

      if (newWidth !== element.width || newHeight !== element.height) {
        onUpdate(element.id, {
          width: newWidth,
          height: newHeight,
        });
      }
    }
  }, [element.width, element.height, calculateMinSize, element.id, onUpdate]);

  // Handle text editing
  const handleTextChange = useCallback((e: React.FormEvent<HTMLDivElement>) => {
    const newText = e.currentTarget.innerText; // 👈 dùng innerText thay vì textContent
    setLocalText(newText);
  }, []);

  const handleTextBlur = useCallback(() => {
    const currentText = textRef.current?.innerText || "";
    onUpdate(element.id, { text: currentText });
    onStopEdit();
  }, [element.id, onUpdate, onStopEdit]);

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
      e.stopPropagation();
      onEdit(element.id);
      setTimeout(() => {
        if (textRef.current) {
          // Set initial content for editing
          textRef.current.innerText = element.text || "";
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
    },
    [element.id, onEdit, element.text]
  );

  // Handle single click to select
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!isEditing) {
        onSelect(element.id);
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
    fontSize: `${element.style.fontSize}px`,
    fontFamily: element.style.fontFamily,
    fontWeight: element.style.bold ? "bold" : "normal",
    fontStyle: element.style.italic ? "italic" : "normal",
    textDecoration: element.style.underline ? "underline" : "none",
    color: element.style.color || "#000000",
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
    textAlign: element.style.textAlign || "left",
  };

  const minSize = calculateMinSize();

  return (
    <Rnd
      size={{ width: element.width, height: element.height }}
      position={{ x: element.x, y: element.y }}
      minWidth={minSize.width}
      minHeight={minSize.height}
      onDragStop={(e, d) => {
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
        zIndex: isSelected || isEditing ? 1000 : 1,
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
      {isEditing ? (
        <div
          ref={textRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleTextChange}
          onBlur={handleTextBlur}
          onKeyDown={handleTextKeyDown}
          className="w-full h-full"
          style={{
            ...textStyles,
            display: "block",
            userSelect: "text",
          }}
        />
      ) : (
        <div
          onClick={handleClick}
          onDoubleClick={handleDoubleClick}
          className="w-full h-full"
          style={{
            ...textStyles,
            display: "block",
            userSelect: "text",
            whiteSpace: "pre-wrap",
            overflowWrap: "break-word",
          }}
        >
          {element.text || "Double-click to edit"}
        </div>
      )}
    </Rnd>
  );
}
