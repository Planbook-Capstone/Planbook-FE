"use client";

import React, { useState } from "react";
import { Palette } from "lucide-react";

interface SlidePreviewModalProps {
  data: any;
}

// Slide canvas component tối ưu cho modal với kích thước nhỏ hơn
const SlideCanvasModal = ({
  slide,
  width = 300, // Giảm kích thước cho modal
  height = 170, // Giảm kích thước cho modal
}: {
  slide: any;
  width?: number;
  height?: number;
}) => {
  if (!slide) return null;

  const scale = width / 960; // Scale down từ canvas size gốc (960px)
  const elements = slide.elements || [];

  // Xử lý background style
  const getBackgroundStyle = () => {
    if (!slide.background) return { backgroundColor: "#ffffff" };

    if (slide.background.startsWith("url(")) {
      return {
        backgroundImage: slide.background,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      };
    } else if (
      slide.background.startsWith("#") ||
      slide.background.startsWith("rgb")
    ) {
      return { backgroundColor: slide.background };
    } else {
      return { backgroundColor: "#ffffff" };
    }
  };

  return (
    <div
      className="relative border border-gray-200  overflow-hidden "
      style={{
        width: `${width}px`,
        height: `${height}px`,
        ...getBackgroundStyle(),
      }}
    >
      {elements.length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-400 text-xs">
          Empty Slide
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
                {/* Xử lý text có thể ở dạng object {"0": "content"} hoặc string */}
                {(() => {
                  if (element.text) {
                    // Nếu text là object với key "0", lấy giá trị đó
                    if (typeof element.text === "object" && element.text["0"]) {
                      return element.text["0"];
                    }
                    // Nếu text là string, trả về trực tiếp
                    if (typeof element.text === "string") {
                      return element.text;
                    }
                  }
                  return element.content || "Text";
                })()}
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
                    ? `${(element.strokeWidth || 1) * scale}px solid ${
                        element.stroke
                      }`
                    : "none",
                  transform: element.rotation
                    ? `rotate(${element.rotation}deg)`
                    : "none",
                  transformOrigin: "center center",
                  opacity: element.opacity || 1,
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

export function SlidePreviewModal({ data }: SlidePreviewModalProps) {
  if (!data || !data.slides || data.slides.length === 0) {
    return (
      <div className="w-full flex items-center justify-center py-8">
        <div className="text-center">
          <Palette className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Không có dữ liệu slide</p>
        </div>
      </div>
    );
  }

  const slides = data?.slides;

  return (
    <div className="w-full md:px-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
        {slides?.map((slide: any, index: number) => (
          <div
            key={slide.id || index}
            className="flex flex-col items-center space-y-2"
          >
            <div className="text-sm font-medium text-gray-700">
              Slide {index + 1}:{" "}
              {slide.title || slide.slideData?.title || "Untitled"}
            </div>
            <SlideCanvasModal slide={slide} />
          </div>
        ))}
      </div>
    </div>
  );
}
