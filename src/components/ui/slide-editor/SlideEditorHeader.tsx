"use client";

import React from "react";
import {
  Save,
  Download,
  Upload,
  Undo,
  Redo,
  Play,
  Settings,
} from "lucide-react";

interface SlideEditorHeaderProps {
  onSave?: () => void;
  onExportPPTX?: () => void;
  onImport?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onPreview?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  slideCount?: number;
  currentSlide?: number;
  isExporting?: boolean;
}

export default function SlideEditorHeader({
  onSave,
  onExportPPTX,
  onImport,
  onUndo,
  onRedo,
  onPreview,
  canUndo = false,
  canRedo = false,
  slideCount = 1,
  currentSlide = 1,
  isExporting = false,
}: SlideEditorHeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      {/* Left Section - Logo & Title */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-calsans text-gray-900">Slide Editor</h1>
        </div>
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className={`p-2 rounded-lg transition-colors ${
            canUndo
              ? "hover:bg-gray-100 text-gray-700"
              : "text-gray-400 cursor-not-allowed"
          }`}
          title="Undo (Ctrl+Z)"
        >
          <Undo className="w-5 h-5" />
        </button>

        <button
          onClick={onRedo}
          disabled={!canRedo}
          className={`p-2 rounded-lg transition-colors ${
            canRedo
              ? "hover:bg-gray-100 text-gray-700"
              : "text-gray-400 cursor-not-allowed"
          }`}
          title="Redo (Ctrl+Y)"
        >
          <Redo className="w-5 h-5" />
        </button>
      </div>

      {/* Right Section - File Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onExportPPTX}
          disabled={isExporting}
          className={`px-4 py-2 bg-transparent border text-sm text-neutral-800 rounded-full transition-colors flex items-center gap-2 ${
            isExporting
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-neutral-100"
          }`}
          title="Export to PowerPoint"
        >
          <Download
            className={`w-4 h-4 ${isExporting ? "animate-spin" : ""}`}
          />
          {isExporting ? "Đang xuất..." : "Tải PPTX"}
        </button>

        <button
          onClick={onPreview}
          className="px-4 py-2 cursor-pointer text-sm bg-[linear-gradient(227deg,_#20DCDF_5.38%,_#25BEE5_16.58%,_#2C99EE_26.8%,_#368BEB_39.32%,_#3860D2_50.53%,_#3A39BB_60.74%,_#3714A2_73.92%)] text-white rounded-full transition-colors flex items-center gap-2"
          title="Preview Slideshow"
        >
          <Play className="w-4 h-4" />
          Preview
        </button>
      </div>
    </header>
  );
}
