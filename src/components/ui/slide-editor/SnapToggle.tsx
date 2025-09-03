"use client";

import React, { useState, useEffect } from "react";
import { Grid3X3, X, Eye } from "lucide-react";
import {
  getSnapSettings,
  toggleSnap,
  applySnapPreset,
  SNAP_PRESETS,
} from "@/config/snapConfig";

interface SnapToggleProps {
  className?: string;
}

export default function SnapToggle({ className = "" }: SnapToggleProps) {
  const [snapEnabled, setSnapEnabled] = useState(true);
  const [isGuideOnly, setIsGuideOnly] = useState(false);
  const [showPresets, setShowPresets] = useState(false);

  // Update state when component mounts
  useEffect(() => {
    const settings = getSnapSettings();
    setSnapEnabled(settings.enabled);
    setIsGuideOnly(settings.guideOnly);
  }, []);

  const handleToggleSnap = () => {
    const newState = toggleSnap();
    setSnapEnabled(newState);
    setShowPresets(false);
  };

  const handlePresetSelect = (preset: keyof typeof SNAP_PRESETS) => {
    applySnapPreset(preset);
    const settings = getSnapSettings();
    setSnapEnabled(settings.enabled);
    setIsGuideOnly(settings.guideOnly);
    setShowPresets(false);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Main toggle button */}
      <button
        onClick={handleToggleSnap}
        onContextMenu={(e) => {
          e.preventDefault();
          setShowPresets(!showPresets);
        }}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-lg border transition-all
          ${
            !snapEnabled
              ? "bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100"
              : isGuideOnly
              ? "bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100"
              : "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
          }
        `}
        title={
          !snapEnabled
            ? "Snap disabled (right-click for presets)"
            : isGuideOnly
            ? "Guide only mode (right-click for presets)"
            : "Snap enabled (right-click for presets)"
        }
      >
        {!snapEnabled ? (
          <X className="w-4 h-4" />
        ) : isGuideOnly ? (
          <Eye className="w-4 h-4" />
        ) : (
          <Grid3X3 className="w-4 h-4" />
        )}
        <span className="text-sm font-medium">
          {!snapEnabled ? "Snap Off" : isGuideOnly ? "Guide Only" : "Snap On"}
        </span>
      </button>

      {/* Presets dropdown */}
      {showPresets && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[160px]">
          <div className="p-2">
            <div className="text-xs text-gray-500 font-medium mb-2">
              Snap Presets
            </div>

            <button
              onClick={() => handlePresetSelect("OFF")}
              className="w-full text-left px-2 py-1 text-sm hover:bg-gray-50 rounded flex items-center gap-2"
            >
              <X className="w-3 h-3" />
              Off
            </button>

            <button
              onClick={() => handlePresetSelect("GUIDE_ONLY")}
              className="w-full text-left px-2 py-1 text-sm hover:bg-gray-50 rounded flex items-center gap-2"
            >
              <Eye className="w-3 h-3 text-yellow-500" />
              Guide Only
            </button>

            <button
              onClick={() => handlePresetSelect("LOW_SENSITIVITY")}
              className="w-full text-left px-2 py-1 text-sm hover:bg-gray-50 rounded flex items-center gap-2"
            >
              <Grid3X3 className="w-3 h-3 text-green-500" />
              Low (2px)
            </button>

            <button
              onClick={() => handlePresetSelect("MEDIUM_SENSITIVITY")}
              className="w-full text-left px-2 py-1 text-sm hover:bg-gray-50 rounded flex items-center gap-2"
            >
              <Grid3X3 className="w-3 h-3 text-blue-500" />
              Medium (3px)
            </button>

            <button
              onClick={() => handlePresetSelect("HIGH_SENSITIVITY")}
              className="w-full text-left px-2 py-1 text-sm hover:bg-gray-50 rounded flex items-center gap-2"
            >
              <Grid3X3 className="w-3 h-3 text-red-500" />
              High (6px)
            </button>
          </div>
        </div>
      )}

      {/* Click outside to close presets */}
      {showPresets && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowPresets(false)}
        />
      )}
    </div>
  );
}
