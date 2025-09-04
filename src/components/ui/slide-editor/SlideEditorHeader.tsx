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
import { SlideTemplateTempData } from "@/contexts/SlideTemplateContext";
import SnapToggle from "./SnapToggle";
import { useRouter } from "next/navigation";

interface SlideEditorHeaderProps {
  onSave?: () => void;
  onExportPPTX?: () => void;
  onExportJSON?: () => void;
  onImport?: () => void;
  onPreview?: () => void;
  onLoadSampleData?: () => void;
  onClearData?: () => void;
  onCancel?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  slideCount?: number;
  currentSlide?: number;
  isExporting?: boolean;
  isLoadingData?: boolean;
  hasLoadedData?: boolean;
  showTemplateActions?: boolean;
  templateData?: SlideTemplateTempData;
  userRole?: string;
  isGenerating?: boolean;
}

export default function SlideEditorHeader({
  onSave,
  onExportPPTX,
  onExportJSON,
  onImport,
  onPreview,
  onLoadSampleData,
  onClearData,
  onCancel,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
  slideCount = 1,
  currentSlide = 1,
  templateData,
  isExporting = false,
  isLoadingData = false,
  hasLoadedData = false,
  showTemplateActions = false,
  userRole = "admin",
  isGenerating = false,
}: SlideEditorHeaderProps) {
  const router = useRouter();
  return (
    <header className="h-16 py-5 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      {/* Left Section - Logo & Title */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <p
            onClick={() => router.back()}
            className="font-questrial cursor-pointer text-neutral-600"
          >
            Quay lại
          </p>
          <div className="h-5 border-l border-gray-300" />
          <h1 className="text-xl font-calsans text-gray-900">
            {templateData?.name}
          </h1>
        </div>
      </div>

      {/* Right Section - File Actions */}
      <div className="flex items-center gap-2">
        {/* Undo/Redo Buttons - Hidden for teachers and when generating */}
        {userRole !== "TEACHER" && !isGenerating && (
          <div className="flex items-center gap-1 mr-2">
            <button
              onClick={onUndo}
              disabled={!canUndo}
              className={`p-2 rounded-lg transition-colors flex items-center justify-center ${
                canUndo
                  ? "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  : "text-gray-300 cursor-not-allowed"
              }`}
              title="Undo (Ctrl+Z)"
            >
              <Undo className="w-4 h-4" />
            </button>
            <button
              onClick={onRedo}
              disabled={!canRedo}
              className={`p-2 rounded-lg transition-colors flex items-center justify-center ${
                canRedo
                  ? "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  : "text-gray-300 cursor-not-allowed"
              }`}
              title="Redo (Ctrl+Y)"
            >
              <Redo className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Snap Toggle - Disabled by user request */}
        {/* {userRole !== "TEACHER" && !isGenerating && (
          <SnapToggle className="mr-2" />
        )} */}

        {/* Load Sample Data Button - Hidden for teachers and when generating */}
        {userRole !== "TEACHER" && !isGenerating && (
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
        )}

        {/* Clear Data Button - Hidden for teachers and when generating */}
        {userRole !== "TEACHER" && hasLoadedData && !isGenerating && (
          <button
            onClick={onClearData}
            className="px-4 py-2 bg-gray-500 text-white text-sm rounded-full hover:bg-gray-600 transition-colors flex items-center gap-2"
            title="Clear loaded data"
          >
            <FileText className="w-4 h-4" />
            Clear
          </button>
        )}

        {/* Import JSON Button - Hidden for teachers and when generating */}
        {userRole !== "TEACHER" && !isGenerating && (
          <button
            onClick={onImport}
            className="px-4 py-2 bg-transparent border text-sm text-neutral-800 rounded-full transition-colors flex items-center gap-2 hover:bg-neutral-100"
            title="Import JSON file"
          >
            <Upload className="w-4 h-4" />
            Import JSON
          </button>
        )}

        {/* Export PPTX Button - Hidden when generating */}
        {!isGenerating && (
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
        )}

        {/* Export JSON Button - Hidden for teachers and when generating */}
        {userRole !== "TEACHER" && !isGenerating && (
          <button
            onClick={onExportJSON}
            className="px-4 py-2 bg-transparent border text-sm text-neutral-800 rounded-full transition-colors flex items-center gap-2 hover:bg-neutral-100"
            title="Export to JSON"
          >
            <FileText className="w-4 h-4" />
            Tải JSON
          </button>
        )}

        {/* Presentation Button - Always visible */}
        <button
          onClick={onPreview}
          className="px-4 py-2 cursor-pointer text-sm bg-[linear-gradient(227deg,_#20DCDF_5.38%,_#25BEE5_16.58%,_#2C99EE_26.8%,_#368BEB_39.32%,_#3860D2_50.53%,_#3A39BB_60.74%,_#3714A2_73.92%)] text-white rounded-full transition-colors flex items-center gap-2"
          title="Trình chiếu slide (F5)"
        >
          <Play className="w-4 h-4" />
          Trình chiếu
        </button>

        {/* Template Actions */}
        {showTemplateActions ? (
          <>
            {/* Cancel button - Hidden for teachers and when generating */}
            {userRole !== "TEACHER" && !isGenerating && (
              <button
                onClick={onCancel}
                className="px-4 py-2 bg-gray-500 text-white text-sm rounded-full hover:bg-gray-600 transition-colors flex items-center gap-2"
                title="Cancel and go back"
              >
                Hủy
              </button>
            )}
          </>
        ) : null}
        {/* Save button - Hidden when generating */}
        {!isGenerating && (
          <button
            onClick={onSave}
            className="px-4 py-2 cursor-pointer text-sm bg-[linear-gradient(227deg,_#20DCDF_5.38%,_#25BEE5_16.58%,_#2C99EE_26.8%,_#368BEB_39.32%,_#3860D2_50.53%,_#3A39BB_60.74%,_#3714A2_73.92%)] text-white rounded-full transition-colors flex items-center gap-2"
            title="Save Template"
          >
            <Save className="w-4 h-4" />
            Lưu Template
          </button>
        )}
      </div>
    </header>
  );
}
