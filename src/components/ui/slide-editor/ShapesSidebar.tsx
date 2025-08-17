"use client";

import React from "react";

interface ShapesSidebarProps {
  onAddShape: (
    shapeType: "rectangle" | "circle" | "triangle" | "star",
    fill?: string,
    stroke?: string
  ) => void;
}

export default function ShapesSidebar({ onAddShape }: ShapesSidebarProps) {
  const shapes = [
    {
      type: "rectangle" as const,
      name: "Hình vuông",
      icon: "⬜",
      fill: "#3b82f6",
      stroke: "#1e40af",
    },
    {
      type: "circle" as const,
      name: "Hình tròn",
      icon: "⭕",
      fill: "#ef4444",
      stroke: "#dc2626",
    },
    {
      type: "triangle" as const,
      name: "Tam giác",
      icon: "🔺",
      fill: "#10b981",
      stroke: "#059669",
    },
    {
      type: "star" as const,
      name: "Hình sao",
      icon: "⭐",
      fill: "#f59e0b",
      stroke: "#d97706",
    },
  ];

  const handleShapeClick = (
    shapeType: "rectangle" | "circle" | "triangle" | "star",
    fill: string,
    stroke: string
  ) => {
    onAddShape(shapeType, fill, stroke);
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto">
      <div className="mb-6">
        <h3 className="text-lg font-calsans text-gray-800 mb-4">Hình dạng</h3>
        <p className="text-sm text-gray-600 mb-4">
          Chọn hình dạng để thêm vào slide
        </p>

        <div className="space-y-3">
          {shapes.map((shape) => (
            <button
              key={shape.type}
              onClick={() =>
                handleShapeClick(shape.type, shape.fill, shape.stroke)
              }
              className="w-full p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors duration-200 flex items-center space-x-3"
            >
              <div
                className="w-8 h-8 flex items-center justify-center rounded"
                style={{ backgroundColor: shape.fill, color: "white" }}
              >
                {shape.type === "rectangle" && (
                  <div className="w-6 h-6 bg-white rounded-sm"></div>
                )}
                {shape.type === "circle" && (
                  <div className="w-6 h-6 bg-white rounded-full"></div>
                )}
                {shape.type === "triangle" && (
                  <div
                    className="w-0 h-0"
                    style={{
                      borderLeft: "12px solid transparent",
                      borderRight: "12px solid transparent",
                      borderBottom: "20px solid white",
                    }}
                  ></div>
                )}
                {shape.type === "star" && (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                )}
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-800">{shape.name}</div>
                <div className="text-xs text-gray-500">
                  Nhấn để thêm {shape.name.toLowerCase()}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <h4 className="text-sm font-medium text-gray-700 mb-3">
          Hướng dẫn sử dụng
        </h4>
        <div className="text-xs text-gray-600 space-y-2">
          <p>• Nhấn vào hình dạng để thêm vào slide</p>
          <p>• Kéo thả để di chuyển vị trí</p>
          <p>• Kéo góc để thay đổi kích thước</p>
          <p>• Nhấp chuột phải để xem thêm tùy chọn</p>
        </div>
      </div>
    </div>
  );
}
