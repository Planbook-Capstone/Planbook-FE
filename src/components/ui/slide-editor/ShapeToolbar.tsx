"use client";

import React, { useState, useEffect, useRef } from "react";
import { ShapeElement } from "@/types";

interface ShapeToolbarProps {
  selectedElement: ShapeElement;
  onUpdateStyle: (id: string, updates: Partial<ShapeElement>) => void;
}

export default function ShapeToolbar({
  selectedElement,
  onUpdateStyle,
}: ShapeToolbarProps) {
  const [showColorPicker, setShowColorPicker] = useState<string | null>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);

  // Close color picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        toolbarRef.current &&
        !toolbarRef.current.contains(event.target as Node)
      ) {
        setShowColorPicker(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleFillChange = (color: string) => {
    onUpdateStyle(selectedElement.id, { fill: color });
  };

  const handleStrokeChange = (color: string) => {
    onUpdateStyle(selectedElement.id, { stroke: color });
  };

  const handleOpacityChange = (opacity: number) => {
    onUpdateStyle(selectedElement.id, { opacity });
  };

  const handleStrokeWidthChange = (strokeWidth: number) => {
    onUpdateStyle(selectedElement.id, { strokeWidth });
  };

  const handleRotationChange = (rotation: number) => {
    onUpdateStyle(selectedElement.id, { rotation });
  };

  const handleRotateLeft = () => {
    const currentRotation = selectedElement.rotation || 0;
    onUpdateStyle(selectedElement.id, { rotation: currentRotation - 15 });
  };

  const handleRotateRight = () => {
    const currentRotation = selectedElement.rotation || 0;
    onUpdateStyle(selectedElement.id, { rotation: currentRotation + 15 });
  };

  const presetColors = [
    "#3b82f6", // Blue
    "#ef4444", // Red
    "#10b981", // Green
    "#f59e0b", // Yellow
    "#8b5cf6", // Purple
    "#f97316", // Orange
    "#06b6d4", // Cyan
    "#84cc16", // Lime
    "#ec4899", // Pink
    "#6b7280", // Gray
    "#000000", // Black
    "#ffffff", // White
  ];

  return (
    <div
      ref={toolbarRef}
      className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 flex items-center space-x-4 font-questrial"
    >
      {/* Fill Color */}
      <div className="relative flex items-center gap-2">
        <label className="text-xs text-gray-600 block mb-1">Màu nền</label>
        <button
          className="w-8 h-8 rounded-full border-2 border-gray-300 shadow-sm"
          style={{ backgroundColor: selectedElement.fill || "#3b82f6" }}
          onClick={() =>
            setShowColorPicker(showColorPicker === "fill" ? null : "fill")
          }
        />
        {showColorPicker === "fill" && (
          <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-50 min-w-[180px] w-max">
            <div className="grid grid-cols-4 gap-2 mb-3">
              {presetColors.map((color) => (
                <button
                  key={color}
                  className="w-7 h-7 rounded border border-gray-300 hover:scale-105 transition-transform"
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    handleFillChange(color);
                    setShowColorPicker(null);
                  }}
                />
              ))}
            </div>
            <input
              type="color"
              value={selectedElement.fill || "#3b82f6"}
              onChange={(e) => handleFillChange(e.target.value)}
              className="w-full h-8 rounded border border-gray-300 cursor-pointer"
            />
          </div>
        )}
      </div>

      {/* Stroke Color */}
      <div className="relative flex items-center gap-2">
        <label className="text-xs text-gray-600 block mb-1">Màu viền</label>
        <button
          className="w-8 h-8 rounded-full border-2 border-gray-300 shadow-sm"
          style={{ backgroundColor: selectedElement.stroke || "#1e40af" }}
          onClick={() =>
            setShowColorPicker(showColorPicker === "stroke" ? null : "stroke")
          }
        />
        {showColorPicker === "stroke" && (
          <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-50 min-w-[180px] w-max">
            <div className="grid grid-cols-4 gap-2 mb-3">
              {presetColors.map((color) => (
                <button
                  key={color}
                  className="w-7 h-7 rounded border border-gray-300 hover:scale-105 transition-transform"
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    handleStrokeChange(color);
                    setShowColorPicker(null);
                  }}
                />
              ))}
            </div>
            <input
              type="color"
              value={selectedElement.stroke || "#1e40af"}
              onChange={(e) => handleStrokeChange(e.target.value)}
              className="w-full h-8 rounded border border-gray-300 cursor-pointer"
            />
          </div>
        )}
      </div>

      {/* Stroke Width */}
      <div className="flex items-center gap-2">
        <label className="text-xs text-gray-600 block mb-1">Độ dày viền</label>
        <input
          type="range"
          min="0"
          max="10"
          step="1"
          value={selectedElement.strokeWidth || 2}
          onChange={(e) => handleStrokeWidthChange(Number(e.target.value))}
          className="w-16 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="text-xs text-gray-500 text-center">
          {selectedElement.strokeWidth || 2}px
        </div>
      </div>

      {/* Opacity */}
      <div className="flex items-center gap-2">
        <label className="text-xs text-gray-600 block mb-1">
          Độ trong suốt
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={selectedElement.opacity || 1}
          onChange={(e) => handleOpacityChange(Number(e.target.value))}
          className="w-16 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="text-xs text-gray-500 text-center mt-1">
          {Math.round((selectedElement.opacity || 1) * 100)}%
        </div>
      </div>

      {/* Rotation */}
      <div className="flex items-center gap-2">
        <label className="text-xs text-gray-600 block mb-1">Xoay</label>
        <div className="flex items-center space-x-1">
          <button
            onClick={handleRotateLeft}
            className="w-6 h-6 bg-gray-100 hover:bg-gray-200 rounded text-xs flex items-center justify-center transition-colors"
            title="Xoay trái 15°"
          >
            ↺
          </button>
          <input
            type="range"
            min="0"
            max="360"
            step="15"
            value={selectedElement.rotation || 0}
            onChange={(e) => handleRotationChange(Number(e.target.value))}
            className="w-12 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <button
            onClick={handleRotateRight}
            className="w-6 h-6 bg-gray-100 hover:bg-gray-200 rounded text-xs flex items-center justify-center transition-colors"
            title="Xoay phải 15°"
          >
            ↻
          </button>
        </div>
        <div className="text-xs text-gray-500 text-center mt-1">
          {selectedElement.rotation || 0}°
        </div>
      </div>

      {/* Close button */}
      <button
        onClick={() => setShowColorPicker(null)}
        className="text-gray-400 hover:text-gray-600 ml-auto"
      >
        ✕
      </button>
    </div>
  );
}
