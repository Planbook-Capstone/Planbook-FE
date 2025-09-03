"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Rnd } from "react-rnd";
import { ImageElement as ImageElementType } from "@/types";
import { useSnapAlignment } from "@/hooks/useSnapAlignment";
import Image from "next/image";

interface ImageElementProps {
  element: ImageElementType;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onUpdate: (id: string, updates: Partial<ImageElementType>) => void;
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

export default function ImageElement({
  element,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  otherElements = [],
  onSnapUpdate,
  onContextMenu,
}: ImageElementProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isShiftPressed, setIsShiftPressed] = useState(false);

  // Check if the image is SVG
  const isSVG =
    element.src.includes("data:image/svg+xml") ||
    element.src.includes(".svg") ||
    (element.alt && element.alt.toLowerCase().includes(".svg"));

  // Calculate original aspect ratio
  const originalAspectRatio = element.width / element.height;

  // Snap alignment hook - uses global settings
  const { handleDragWithSnap, clearGuides } = useSnapAlignment({
    canvasWidth: 960,
    canvasHeight: 540,
  });

  // Track Shift key state
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Shift") {
        setIsShiftPressed(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Shift") {
        setIsShiftPressed(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Handle click
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onSelect(element.id);
    },
    [element.id, onSelect]
  );

  // Handle key down for delete
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        onDelete(element.id);
      }
    },
    [element.id, onDelete]
  );

  // Calculate minimum size
  const minSize = {
    width: 50,
    height: 50,
  };

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

        if (snapResult.x !== d.x || snapResult.y !== d.y) {
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
        let newWidth = parseInt(ref.style.width);
        let newHeight = parseInt(ref.style.height);

        // Lock aspect ratio if Shift is pressed
        if (isShiftPressed) {
          // Calculate which dimension changed more and adjust the other
          const widthRatio = newWidth / element.width;
          const heightRatio = newHeight / element.height;

          // Use the larger ratio to maintain aspect ratio
          const ratio = Math.max(widthRatio, heightRatio);

          newWidth = Math.round(element.width * ratio);
          newHeight = Math.round(element.height * ratio);
        }

        onUpdate(element.id, {
          width: newWidth,
          height: newHeight,
          x: position.x,
          y: position.y,
        });
      }}
      bounds="parent"
      className={`
        ${isSelected ? "ring-2 ring-blue-500" : ""}
      `}
      style={{
        zIndex: isSelected ? 999 : element.zIndex ?? 0,
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
      <div
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onContextMenu={(e) => {
          e.preventDefault();
          if (onContextMenu) {
            onContextMenu(element.id, e.clientX, e.clientY);
          }
        }}
        className="w-full h-full relative cursor-pointer focus:outline-none"
        tabIndex={0}
      >
        {!imageError ? (
          isSVG ? (
            // Render SVG using img tag for better compatibility
            <img
              src={element.src}
              alt={element.alt || "SVG Image"}
              className={`w-full h-full object-contain transition-opacity duration-200 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => {
                setImageError(true);
                setImageLoaded(false);
              }}
              draggable={false}
            />
          ) : (
            // Render bitmap images using Next.js Image component
            <Image
              src={element.src}
              alt={element.alt || "Image"}
              fill
              className={`object-cover transition-opacity duration-200 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => {
                setImageError(true);
                setImageLoaded(false);
              }}
              draggable={false}
            />
          )
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="text-2xl mb-2">🖼️</div>
              <div className="text-sm">Image failed to load</div>
            </div>
          </div>
        )}

        {/* Loading placeholder */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="animate-spin w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full mx-auto mb-2"></div>
              <div className="text-sm">Loading...</div>
            </div>
          </div>
        )}

        {/* Selection indicator */}
        {isSelected && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 border-2 border-blue-500 bg-transparent bg-opacity-10"></div>

            {/* Aspect ratio lock indicator */}
            {isShiftPressed && (
              <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium shadow-lg">
                🔒 Aspect Ratio Locked
              </div>
            )}
          </div>
        )}
      </div>
    </Rnd>
  );
}
