"use client";

import React, { useState } from "react";
import { Palette } from "lucide-react";

interface SlidePreviewProps {
  data: any;
}

// Simple slide preview component (based on HorizontalSlidePanel logic)
const SlideCanvas = ({
  slide,
  width = 960,
  height = 540,
}: {
  slide: any;
  width?: number;
  height?: number;
}) => {
  if (!slide) return null;

  const scale = width / 960; // Scale down from canvas size (960px)
  const elements = slide.elements || [];

  // Helper function to get background style
  const getBackgroundStyle = () => {
    if (!slide.background || slide.background === "#ffffff") {
      return { backgroundColor: "#ffffff" };
    }

    if (slide.background.startsWith("#")) {
      return { backgroundColor: slide.background };
    }

    if (slide.background.startsWith("linear-gradient")) {
      return { background: slide.background };
    }

    if (slide.background.startsWith("url(")) {
      return {
        backgroundImage: slide.background,
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
        width: `${width}px`,
        height: `${height}px`,
        ...getBackgroundStyle(),
      }}
    >
      {elements.length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-400 text-xs">
          Empty
        </div>
      ) : (
        elements.map((element: any) => {
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
                  fontSize:
                    (element.style?.fontSize || element.fontSize || 16) *
                      scale +
                    "px",
                  fontFamily:
                    element.style?.fontFamily || element.fontFamily || "Arial",
                  fontWeight: element.style?.bold
                    ? "bold"
                    : element.fontWeight || "normal",
                  fontStyle: element.style?.italic
                    ? "italic"
                    : element.fontStyle || "normal",
                  textDecoration: element.style?.underline
                    ? "underline"
                    : element.textDecoration || "none",
                  color: element.style?.color || element.color || "#000000",
                  textAlign:
                    element.style?.textAlign || element.textAlign || "left",
                  overflow: "hidden",
                  whiteSpace: "pre-wrap",
                  textOverflow: "ellipsis",
                  lineHeight: "1.2",
                  transform: element.rotation
                    ? `rotate(${element.rotation}deg)`
                    : "none",
                  transformOrigin: "center center",
                }}
              >
                {element.text || element.content || "Text"}
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
                  transform: element.rotation
                    ? `rotate(${element.rotation}deg)`
                    : "none",
                  transformOrigin: "center center",
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
                  backgroundColor: element.fill || element.color || "#cccccc",
                  borderRadius:
                    element.shapeType === "circle" || element.shape === "circle"
                      ? "50%"
                      : element.shapeType === "rounded-rectangle"
                      ? "4px"
                      : "0",
                  border: element.stroke
                    ? `1px solid ${element.stroke}`
                    : "none",
                  transform: element.rotation
                    ? `rotate(${element.rotation}deg)`
                    : "none",
                  transformOrigin: "center center",
                }}
              />
            );
          }

          if (element.type === "video") {
            return (
              <div
                key={element.id}
                className="absolute bg-gray-800 flex items-center justify-center"
                style={{
                  left: element.x * scale,
                  top: element.y * scale,
                  width: element.width * scale,
                  height: element.height * scale,
                  transform: element.rotation
                    ? `rotate(${element.rotation}deg)`
                    : "none",
                  transformOrigin: "center center",
                }}
              >
                <div className="text-white text-xs">Video</div>
              </div>
            );
          }

          return null;
        })
      )}
    </div>
  );
};

export function SlidePreview({ data }: SlidePreviewProps) {
  const [selectedThumbnailIndex, setSelectedThumbnailIndex] = useState(0);

  if (!data || !data.slides || data.slides.length === 0) {
    return (
      <div className="w-full flex items-center justify-center">
        <div className="text-center">
          <Palette className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 font-questrial">Không có dữ liệu slide</p>
        </div>
      </div>
    );
  }

  const slides = data?.slides;

  return (
    <div className="w-full">
      <div className="flex w-full">
        <div className="w-full flex flex-col h-full">
          <div className="flex-1 overflow-y-auto space-y-8">
            {slides?.map((slide: any, index: number) => (
              <div
                key={slide.id || index}
                onClick={() => setSelectedThumbnailIndex(index)}
                className={`w-full rounded overflow-hidden cursor-pointer transition-all`}
                style={{ height: "auto" }}
              >
                <div className="w-full h-full flex items-center justify-center transform scale-100">
                  <SlideCanvas slide={slide} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
