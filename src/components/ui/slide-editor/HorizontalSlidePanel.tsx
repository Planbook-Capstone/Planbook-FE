"use client";

import React, { useState } from "react";
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
                  fontSize: element.style.fontSize * scale + "px",
                  fontFamily: element.style.fontFamily,
                  fontWeight: element.style.bold ? "bold" : "normal",
                  fontStyle: element.style.italic ? "italic" : "normal",
                  textDecoration: element.style.underline
                    ? "underline"
                    : "none",
                  color: element.style.color || "#000000",
                  textAlign: element.style.textAlign || "left",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                }}
              >
                {element.text || "Text"}
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
}: HorizontalSlidePanelProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [draggedSlide, setDraggedSlide] = useState<string | null>(null);

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
    setDraggedSlide(slideId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetSlideId: string) => {
    e.preventDefault();
    if (draggedSlide && draggedSlide !== targetSlideId) {
      const fromIndex = slides.findIndex((s) => s.id === draggedSlide);
      const toIndex = slides.findIndex((s) => s.id === targetSlideId);
      onSlideReorder?.(fromIndex, toIndex);
    }
    setDraggedSlide(null);
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
      {/* Slides List - Horizontal */}
      <div className=" w-full overflow-x-scroll overflow-y-hidden p-2 h-full">
        <div className="flex gap-2 h-full">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              draggable
              onDragStart={(e) => handleDragStart(e, slide.id)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, slide.id)}
              className={`group relative flex-shrink-0 w-25 h-auto rounded-lg border-2 cursor-pointer transition-all mt-6 ${
                currentSlideId === slide.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
              } ${draggedSlide === slide.id ? "opacity-50" : ""}`}
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
