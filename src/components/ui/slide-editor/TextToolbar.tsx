"use client";

import React from "react";
import { TextElement, TextStyle } from "@/types";
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  BoldIcon,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TextToolbarProps {
  selectedElement: TextElement | null;
  onUpdateStyle: (id: string, style: Partial<TextStyle>) => void;
}

const FONT_FAMILIES = [
  "Arial, sans-serif",
  "Helvetica, sans-serif",
  "Times New Roman, serif",
  "Georgia, serif",
  "Verdana, sans-serif",
  "Courier New, monospace",
  "Impact, sans-serif",
  "Comic Sans MS, cursive",
];

const FONT_SIZES = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 64, 72];

const COLORS = [
  "#000000",
  "#333333",
  "#666666",
  "#999999",
  "#CCCCCC",
  "#FFFFFF",
  "#FF0000",
  "#FF6600",
  "#FFCC00",
  "#FFFF00",
  "#CCFF00",
  "#66FF00",
  "#00FF00",
  "#00FF66",
  "#00FFCC",
  "#00FFFF",
  "#00CCFF",
  "#0066FF",
  "#0000FF",
  "#6600FF",
  "#CC00FF",
  "#FF00FF",
  "#FF00CC",
  "#FF0066",
];

export default function TextToolbar({
  selectedElement,
  onUpdateStyle,
}: TextToolbarProps) {
  if (!selectedElement || selectedElement.type !== "text") {
    return null;
  }

  const { style } = selectedElement;

  const handleStyleUpdate = (updates: Partial<TextStyle>) => {
    onUpdateStyle(selectedElement.id, updates);
  };

  return (
    <div className="w-fit flex items-center gap-2 p-2 shadow-lg rounded-full bg-white border-1 border-gray-200">
      {/* Font Family */}
      <div className="flex items-center gap-2">
        <Select
          value={style.fontFamily}
          onValueChange={(value) => handleStyleUpdate({ fontFamily: value })}
        >
          <SelectTrigger className="w-[160px] h-8 rounded-full py-4">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="z-[99999]">
            {FONT_FAMILIES.map((font) => (
              <SelectItem key={font} value={font}>
                <span style={{ fontFamily: font }}>{font.split(",")[0]}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Font Size */}
      <div className="flex items-center gap-2">
        <Select
          value={style.fontSize.toString()}
          onValueChange={(value) =>
            handleStyleUpdate({ fontSize: parseInt(value) })
          }
        >
          <SelectTrigger className="w-[80px] h-8 rounded-full py-4">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FONT_SIZES.map((size) => (
              <SelectItem key={size} value={size.toString()}>
                {size}px
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Style Buttons */}
      <div className="flex gap-1">
        <button
          onClick={() => handleStyleUpdate({ bold: !style.bold })}
          className={`p-2 rounded ${
            style.bold
              ? "bg-cyan-200 text-cyan-600"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>

        <button
          onClick={() => handleStyleUpdate({ italic: !style.italic })}
          className={`p-2 rounded ${
            style.italic
              ? "bg-blue-800 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>

        <button
          onClick={() => handleStyleUpdate({ underline: !style.underline })}
          className={`p-2 rounded ${
            style.underline
              ? "bg-indigo-200 text-indigo-600"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
          title="Underline"
        >
          <Underline className="w-4 h-4" />
        </button>
      </div>

      {/* Text Alignment - Cycle Button */}
      <div className="flex gap-1">
        <button
          onClick={() => {
            const currentAlign = style.textAlign || "left";
            const nextAlign =
              currentAlign === "left"
                ? "center"
                : currentAlign === "center"
                ? "right"
                : "left";
            handleStyleUpdate({ textAlign: nextAlign });
          }}
          className="p-2 rounded bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
          title={`Text Align: ${style.textAlign || "left"} (click to cycle)`}
        >
          {style.textAlign === "center" ? (
            <AlignCenter className="w-4 h-4" />
          ) : style.textAlign === "right" ? (
            <AlignRight className="w-4 h-4" />
          ) : (
            <AlignLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Text Color */}
      <div className="flex items-center gap-2">
        <div className="relative">
          <input
            type="color"
            value={style.color || "#000000"}
            onChange={(e) => handleStyleUpdate({ color: e.target.value })}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="w-8 flex flex-col items-center justify-center  rounded cursor-pointer hover:border-gray-400 transition-colors">
            {/* Letter A */}
            <div className="text-lg font-calsans text-gray-800 leading-none">
              A
            </div>
            {/* Rainbow color bar */}
            <div
              className="w-4 h-1 rounded-sm mt-0.5"
              style={{
                background:
                  "linear-gradient(to right, #ff0000, #ff8000, #ffff00, #80ff00, #00ff00, #00ff80, #00ffff, #0080ff, #0000ff)",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
