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
  AlignVerticalJustifyStart,
  AlignVerticalJustifyCenter,
  AlignVerticalJustifyEnd,
  Plus,
  Minus,
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
  "Arial",
  "Arial, sans-serif",
  "Helvetica",
  "Helvetica, sans-serif",
  "Times New Roman",
  "Times New Roman, serif",
  "Georgia",
  "Georgia, serif",
  "Verdana",
  "Verdana, sans-serif",
  "Courier New",
  "Courier New, monospace",
  "Impact",
  "Impact, sans-serif",
  "Comic Sans MS",
  "Comic Sans MS, cursive",
  "Calibri",
  "Tahoma",
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
          value={style.fontFamily || "Arial, sans-serif"}
          onValueChange={(value) => handleStyleUpdate({ fontFamily: value })}
        >
          <SelectTrigger className="w-[160px] h-8 rounded-full py-4 bg-gray-50 border-none shadow-none">
            <SelectValue placeholder="Select font" />
          </SelectTrigger>
          <SelectContent className="z-[99999]">
            {FONT_FAMILIES.map((font) => (
              <SelectItem key={font} value={font}>
                <span style={{ fontFamily: font }}>
                  {font.includes(",") ? font.split(",")[0] : font}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Font Size with +/- Controls */}
      <div className="flex items-center gap-1 bg-gray-50 rounded-full px-2 py-1">
        <button
          onClick={() => {
            const newSize = Math.max(8, (style.fontSize || 16) - 2);
            handleStyleUpdate({ fontSize: newSize });
          }}
          className="p-1 rounded-full hover:bg-gray-200 transition-colors "
          title="Decrease font size"
        >
          <Minus className="w-3 h-3" />
        </button>

        <input
          type="number"
          value={style.fontSize || 16}
          onChange={(e) => {
            const newSize = Math.max(
              8,
              Math.min(200, parseInt(e.target.value) || 16)
            );
            handleStyleUpdate({ fontSize: newSize });
          }}
          className="w-12 py-1 text-center text-sm bg-transparent border-none outline-none"
          min="8"
          max="200"
        />

        <span className="text-xs text-gray-500">px</span>

        <button
          onClick={() => {
            const newSize = Math.min(200, (style.fontSize || 16) + 2);
            handleStyleUpdate({ fontSize: newSize });
          }}
          className="p-1 rounded-full hover:bg-gray-200 transition-colors"
          title="Increase font size"
        >
          <Plus className="w-3 h-3" />
        </button>
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

      {/* Vertical Alignment */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => {
            const currentAlign = style.verticalAlign || "top";
            const nextAlign =
              currentAlign === "top"
                ? "middle"
                : currentAlign === "middle"
                ? "bottom"
                : "top";
            handleStyleUpdate({ verticalAlign: nextAlign });
          }}
          className="p-2 rounded bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
          title={`Vertical Align: ${
            style.verticalAlign || "top"
          } (click to cycle)`}
        >
          {style.verticalAlign === "middle" ? (
            <AlignVerticalJustifyCenter className="w-4 h-4" />
          ) : style.verticalAlign === "bottom" ? (
            <AlignVerticalJustifyEnd className="w-4 h-4" />
          ) : (
            <AlignVerticalJustifyStart className="w-4 h-4" />
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
