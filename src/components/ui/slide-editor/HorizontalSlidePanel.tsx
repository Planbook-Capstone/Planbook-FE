"use client";

import React, { useState } from "react";

// Add shimmer animation styles
const shimmerStyles = `
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
`;
import {
  ChevronUp,
  ChevronDown,
  Plus,
  Copy,
  Trash2,
  Eye,
  EyeOff,
  Move,
} from "lucide-react";

// Skeleton loading component for slide thumbnails
const SkeletonSlide = ({
  width = 88,
  height = 50,
  slideNumber,
}: {
  width?: number;
  height?: number;
  slideNumber?: number;
}) => {
  return (
    <div
      className="relative border border-gray-200 rounded overflow-hidden bg-gray-100 animate-pulse"
      style={{ width, height }}
    >
      {/* Skeleton background with shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 bg-[length:200%_100%] animate-[shimmer_2s_infinite]" />

      {/* Skeleton elements */}
      <div className="absolute inset-2 space-y-1">
        {/* Title skeleton */}
        <div className="h-2 bg-gray-300 rounded w-3/4 animate-pulse" />

        {/* Content skeletons */}
        <div className="h-1.5 bg-gray-300 rounded w-full animate-pulse" />
        <div className="h-1.5 bg-gray-300 rounded w-2/3 animate-pulse" />

        {/* Image placeholder skeleton */}
        <div className="absolute bottom-1 right-1 w-3 h-3 bg-gray-300 rounded animate-pulse" />
      </div>

      {/* Loading indicator */}
      <div className="absolute top-1 left-1 text-xs font-medium text-gray-400 bg-white rounded px-1">
        {slideNumber || "..."}
      </div>

      {/* AI loading icon */}
      <div className="absolute top-1 right-1 w-3 h-3">
        <img
          src="/loading/loading_AI.gif"
          alt="AI Loading"
          className="w-full h-full opacity-60"
        />
      </div>
    </div>
  );
};

// Mini preview component for slide thumbnails
const SlidePreview = ({
  elements = [],
  background = "#ffffff",
  width = 80,
  height = 45,
}: {
  elements?: any[];
  background?: string;
  width?: number;
  height?: number;
}) => {
  const scale = width / 960; // Scale down from canvas size (960px)

  // Helper function to get background style
  const getBackgroundStyle = () => {
    console.log("🎨 SlidePreview background:", {
      background,
      type: typeof background,
      isEmpty: !background,
      isWhite: background === "#ffffff",
    });

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

  return (
    <div
      className="relative border border-gray-200 rounded overflow-hidden"
      style={{
        width,
        height,
        ...getBackgroundStyle(),
      }}
    >
      {elements.length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-400 text-xs">
          Empty
        </div>
      ) : (
        elements.map((element) => {
          if (element.type === "text") {
            return (
              <div
                key={element.id}
                className="absolute"
                style={{
                  left: element.x * scale,
                  top: element.y * scale,
                  width: element.width * scale,
                  height: element.height * scale,
                  fontSize: element.style?.fontSize * scale + "px" || "12px",
                  fontFamily: element.style?.fontFamily || "Arial",
                  fontWeight: element.style?.bold ? "bold" : "normal",
                  fontStyle: element.style?.italic ? "italic" : "normal",
                  textDecoration: element.style?.underline
                    ? "underline"
                    : "none",
                  color: element.style?.color || "#000000",
                  textAlign: element.style?.textAlign || "left",
                  overflow: "hidden",
                  whiteSpace: "pre-wrap",
                  textOverflow: "ellipsis",
                  lineHeight: "1.2",
                }}
              >
                {element.text || "Text"}
              </div>
            );
          }

          if (element.type === "image") {
            return (
              <div
                key={element.id}
                className="absolute"
                style={{
                  left: element.x * scale,
                  top: element.y * scale,
                  width: element.width * scale,
                  height: element.height * scale,
                }}
              >
                <img
                  src={element.src}
                  alt={element.alt || "Image"}
                  className="w-full h-full object-cover rounded"
                  style={{
                    opacity: element.opacity || 1,
                  }}
                />
              </div>
            );
          }

          if (element.type === "shape") {
            return (
              <div
                key={element.id}
                className="absolute"
                style={{
                  left: element.x * scale,
                  top: element.y * scale,
                  width: element.width * scale,
                  height: element.height * scale,
                  backgroundColor: element.fill || "#cccccc",
                  borderRadius:
                    element.shapeType === "circle"
                      ? "50%"
                      : element.shapeType === "rounded-rectangle"
                      ? "4px"
                      : "0",
                  border: element.stroke
                    ? `1px solid ${element.stroke}`
                    : "none",
                }}
              />
            );
          }

          if (element.type === "table") {
            const tableElement = element as any;
            const { headers, rows, style: tableStyle = {} } = tableElement;
            const {
              borderColor = "#000000",
              borderWidth = 1,
              headerBackgroundColor = "#f3f4f6",
              cellBackgroundColor = "#ffffff",
              fontSize = 14,
              fontFamily = "Arial, sans-serif",
            } = tableStyle;

            return (
              <div
                key={element.id}
                className="absolute"
                style={{
                  left: element.x * scale,
                  top: element.y * scale,
                  width: element.width * scale,
                  height: element.height * scale,
                }}
              >
                <table
                  style={{
                    width: "100%",
                    height: "100%",
                    borderCollapse: "collapse",
                    fontSize: Math.max(3, fontSize * scale * 0.5), // Much smaller font for thumbnail
                    fontFamily,
                    tableLayout: "fixed", // Fixed layout for better control
                  }}
                >
                  {/* Table Header */}
                  {headers.length > 0 && (
                    <thead>
                      <tr>
                        {headers.map((header: string, index: number) => (
                          <th
                            key={index}
                            style={{
                              border: `${Math.max(
                                0.5,
                                borderWidth * scale * 0.5
                              )}px solid ${borderColor}`,
                              backgroundColor: headerBackgroundColor,
                              padding: `${Math.max(0.5, 1 * scale)}px`,
                              fontSize: Math.max(2, fontSize * scale * 0.3),
                              fontWeight: "bold",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
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
                    {rows.map((row: string[], rowIndex: number) => (
                      <tr key={rowIndex}>
                        {row.map((cell: string, cellIndex: number) => (
                          <td
                            key={cellIndex}
                            style={{
                              border: `${Math.max(
                                0.5,
                                borderWidth * scale * 0.5
                              )}px solid ${borderColor}`,
                              backgroundColor: cellBackgroundColor,
                              padding: `${Math.max(0.5, 1 * scale)}px`,
                              fontSize: Math.max(2, fontSize * scale * 0.3),
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          }

          return null;
        })
      )}
    </div>
  );
};

interface Slide {
  id: string;
  title: string;
  thumbnail?: string;
  isVisible: boolean;
  elements?: any[]; // Canvas elements for preview
  background?: string; // Background color, gradient, or image URL
}

interface HorizontalSlidePanelProps {
  slides?: Slide[];
  currentSlideId?: string;
  onSlideSelect?: (slideId: string) => void;
  onSlideAdd?: () => void;
  onSlideDuplicate?: (slideId: string) => void;
  onSlideDelete?: (slideId: string) => void;
  onSlideToggleVisibility?: (slideId: string) => void;
  onSlideReorder?: (fromIndex: number, toIndex: number) => void;
  // Loading state props
  isGenerating?: boolean;
  generationProgress?: number;
  totalSlides?: number;
}

export default function HorizontalSlidePanel({
  slides = [
    { id: "slide-1", title: "Slide 1", isVisible: true },
    { id: "slide-2", title: "Slide 2", isVisible: true },
    { id: "slide-3", title: "Slide 3", isVisible: false },
    { id: "slide-4", title: "Slide 4", isVisible: true },
    { id: "slide-5", title: "Slide 5", isVisible: true },
  ],
  currentSlideId = "slide-1",
  onSlideSelect,
  onSlideAdd,
  onSlideDuplicate,
  onSlideDelete,
  onSlideToggleVisibility,
  onSlideReorder,
  isGenerating = false,
  generationProgress = 0,
  totalSlides = 0,
}: HorizontalSlidePanelProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [draggedSlide, setDraggedSlide] = useState<string | null>(null);
  const [dragOverSlide, setDragOverSlide] = useState<string | null>(null);

  const handleSlideClick = (slideId: string) => {
    onSlideSelect?.(slideId);
  };

  const handleAddSlide = () => {
    onSlideAdd?.();
  };

  const handleDuplicateSlide = (slideId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onSlideDuplicate?.(slideId);
  };

  const handleDeleteSlide = (slideId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (slides.length > 1) {
      onSlideDelete?.(slideId);
    }
  };

  const handleToggleVisibility = (slideId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onSlideToggleVisibility?.(slideId);
  };

  const handleDragStart = (e: React.DragEvent, slideId: string) => {
    console.log("🎯 Drag start:", slideId);
    setDraggedSlide(slideId);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", slideId);
  };

  const handleDragOver = (e: React.DragEvent, slideId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (draggedSlide && draggedSlide !== slideId) {
      setDragOverSlide(slideId);
    }
  };

  const handleDragLeave = () => {
    setDragOverSlide(null);
  };

  const handleDrop = (e: React.DragEvent, targetSlideId: string) => {
    e.preventDefault();
    console.log("🎯 Drop:", { draggedSlide, targetSlideId });

    if (draggedSlide && draggedSlide !== targetSlideId) {
      const fromIndex = slides.findIndex((s) => s.id === draggedSlide);
      const toIndex = slides.findIndex((s) => s.id === targetSlideId);

      console.log("🔄 Calling onSlideReorder:", { fromIndex, toIndex });
      onSlideReorder?.(fromIndex, toIndex);
    }

    setDraggedSlide(null);
    setDragOverSlide(null);
  };

  if (isCollapsed) {
    return (
      <div className="h-12 bg-gray-50 border-t border-gray-200 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">
            Slides ({slides.length})
          </span>
          <div className="flex gap-1">
            {slides.slice(0, 5).map((slide, index) => (
              <div
                key={slide.id}
                className={`w-6 h-4 rounded border cursor-pointer transition-colors ${
                  currentSlideId === slide.id
                    ? "border-blue-500 bg-blue-100"
                    : "border-gray-300 bg-white hover:border-gray-400"
                }`}
                onClick={() => handleSlideClick(slide.id)}
                title={slide.title}
              >
                <div className="text-xs text-center leading-3">{index + 1}</div>
              </div>
            ))}
            {slides.length > 5 && (
              <span className="text-xs text-gray-400 ml-1">
                +{slides.length - 5}
              </span>
            )}
          </div>
        </div>
        <button
          onClick={() => setIsCollapsed(false)}
          className="p-1 hover:bg-gray-200 rounded transition-colors"
          title="Expand Slides Panel"
        >
          <ChevronUp className="w-4 h-4 text-gray-600" />
        </button>
      </div>
    );
  }

  return (
    <div className="w-full h-40 border-gray-200 flex flex-col py-4 px-6 mb-10">
      {/* Add shimmer animation styles */}
      <style jsx>{shimmerStyles}</style>

      {/* Slides List - Horizontal */}
      <div className=" w-full overflow-x-scroll overflow-y-hidden p-2 h-full">
        <div className="flex gap-2 h-full">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              draggable
              onDragStart={(e) => handleDragStart(e, slide.id)}
              onDragOver={(e) => handleDragOver(e, slide.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, slide.id)}
              className={`group relative flex-shrink-0 w-25 h-auto rounded-lg border-2 transition-all mt-6 ${
                currentSlideId === slide.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
              } ${
                draggedSlide === slide.id
                  ? "opacity-50 scale-95 cursor-grabbing"
                  : "cursor-grab"
              } ${
                dragOverSlide === slide.id
                  ? "border-blue-400 bg-blue-100 scale-105"
                  : ""
              }`}
              onClick={() => handleSlideClick(slide.id)}
            >
              {/* Slide Number */}
              <div className="absolute top-1 left-1 text-xs font-medium text-gray-500 bg-white rounded px-1">
                {index + 1}
              </div>

              {/* Actions */}
              <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => handleToggleVisibility(slide.id, e)}
                  className="p-0.5 hover:bg-gray-200 rounded transition-colors bg-white"
                  title={slide.isVisible ? "Hide Slide" : "Show Slide"}
                >
                  {slide.isVisible ? (
                    <Eye className="w-3 h-3 text-gray-600" />
                  ) : (
                    <EyeOff className="w-3 h-3 text-gray-400" />
                  )}
                </button>
              </div>

              {/* Slide Thumbnail */}
              <div className="w-full h-full p-1">
                <SlidePreview
                  elements={slide.elements || []}
                  background={
                    slide.background ||
                    (index % 3 === 0
                      ? "#e3f2fd"
                      : index % 3 === 1
                      ? "#f3e5f5"
                      : "#e8f5e8")
                  }
                  width={88}
                  height={50}
                />
              </div>

              {/* Slide Title */}
              <div className="absolute bottom-1 left-1 right-1 text-xs font-medium text-gray-700 truncate bg-opacity-80 rounded px-1">
                {slide.title}
              </div>

              {/* Drag Handle */}
              <div className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Move className="w-3 h-3 text-gray-400" />
              </div>

              {/* Context Menu */}
              <div className="absolute -top-8 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex gap-1 bg-white border border-gray-200 rounded shadow-lg p-1">
                  <button
                    onClick={(e) => handleDuplicateSlide(slide.id, e)}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                    title="Duplicate Slide"
                  >
                    <Copy className="w-3 h-3 text-gray-600" />
                  </button>
                  {slides.length > 1 && (
                    <button
                      onClick={(e) => handleDeleteSlide(slide.id, e)}
                      className="p-1 hover:bg-red-100 rounded transition-colors"
                      title="Delete Slide"
                    >
                      <Trash2 className="w-3 h-3 text-red-500" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Skeleton Loading Slides */}
          {isGenerating && totalSlides > slides.length && (
            <>
              {Array.from({
                length: Math.min(3, totalSlides - slides.length),
              }).map((_, index) => (
                <div
                  key={`skeleton-${index}`}
                  className="group relative flex-shrink-0 w-25 h-auto rounded-lg border-2 border-dashed border-blue-300 bg-blue-50 mt-6 animate-pulse"
                >
                  {/* Skeleton Slide */}
                  <div className="w-full h-full p-1">
                    <SkeletonSlide
                      width={88}
                      height={50}
                      slideNumber={slides.length + index + 1}
                    />
                  </div>

                  {/* Loading Title */}
                  <div className="absolute bottom-1 left-1 right-1 text-xs font-medium text-blue-600 truncate bg-blue-100 bg-opacity-80 rounded px-1">
                    Đang tạo...
                  </div>
                </div>
              ))}

              {/* Show more indicator if many slides remaining */}
              {totalSlides - slides.length > 3 && (
                <div className="flex-shrink-0 h-auto mt-6 w-24 border-2 border-dashed border-blue-300 rounded-lg bg-blue-50 flex flex-col items-center justify-center gap-1 text-blue-600 animate-pulse">
                  <div className="text-xs font-medium">
                    +{totalSlides - slides.length - 3}
                  </div>
                  <div className="text-xs">slides</div>
                </div>
              )}
            </>
          )}

          {/* Add Slide Button */}
          <button
            onClick={handleAddSlide}
            className="flex-shrink-0 h-auto mt-6 w-24 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors flex flex-col items-center justify-center gap-1 text-gray-600"
          >
            <Plus className="w-6 h-6" />
            <span className="text-xs">Add Slide</span>
          </button>
        </div>
      </div>
    </div>
  );
}
