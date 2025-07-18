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
  FileText,
  Loader2,
} from "lucide-react";

interface SlideEditorHeaderProps {
  onSave?: () => void;
  onExportPPTX?: () => void;
  onExportJSON?: () => void;
  onImport?: () => void;
  onPreview?: () => void;
  onLoadSampleData?: () => void;
  onClearData?: () => void;
  slideCount?: number;
  currentSlide?: number;
  isExporting?: boolean;
  isLoadingData?: boolean;
  hasLoadedData?: boolean;
}

export default function SlideEditorHeader({
  onSave,
  onExportPPTX,
  onExportJSON,
  onImport,
  onPreview,
  onLoadSampleData,
  onClearData,
  slideCount = 1,
  currentSlide = 1,
  isExporting = false,
  isLoadingData = false,
  hasLoadedData = false,
}: SlideEditorHeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      {/* Left Section - Logo & Title */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-calsans text-gray-900">Slide Editor</h1>
        </div>
      </div>

      {/* Right Section - File Actions */}
      <div className="flex items-center gap-2">
        {/* Load Sample Data Button */}
        <button
          onClick={onLoadSampleData}
          disabled={isLoadingData}
          className={`px-4 py-2 bg-neutral-800 text-white text-sm rounded-full transition-colors flex items-center gap-2 ${
            isLoadingData
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-neutral-700"
          }`}
          title="Load sample presentation data"
        >
          {isLoadingData ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Upload className="w-4 h-4" />
          )}
          {isLoadingData ? "Loading..." : "Load Data"}
        </button>

        {/* Clear Data Button */}
        {hasLoadedData && (
          <button
            onClick={onClearData}
            className="px-4 py-2 bg-gray-500 text-white text-sm rounded-full hover:bg-gray-600 transition-colors flex items-center gap-2"
            title="Clear loaded data"
          >
            <FileText className="w-4 h-4" />
            Clear
          </button>
        )}

        <button
          onClick={onImport}
          className="px-4 py-2 bg-transparent border text-sm text-neutral-800 rounded-full transition-colors flex items-center gap-2 hover:bg-neutral-100"
          title="Import JSON file"
        >
          <Upload className="w-4 h-4" />
          Import JSON
        </button>

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
          onClick={onExportJSON}
          className="px-4 py-2 bg-transparent border text-sm text-neutral-800 rounded-full transition-colors flex items-center gap-2 hover:bg-neutral-100"
          title="Export to JSON"
        >
          <FileText className="w-4 h-4" />
          Tải JSON
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
