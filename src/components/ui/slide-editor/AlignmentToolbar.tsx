"use client";

import React, { useState, useRef } from "react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  MoveUp,
  MoveDown,
} from "lucide-react";

interface AlignmentToolbarProps {
  selectedElementId: string | null;
  onAlignToCenter?: (elementId: string) => void;
  onAlignLeft?: (elementId: string) => void;
  onAlignRight?: (elementId: string) => void;
  onAlignTop?: (elementId: string) => void;
  onAlignBottom?: (elementId: string) => void;
}

export default function AlignmentToolbar({
  selectedElementId,
  onAlignToCenter,
  onAlignLeft,
  onAlignRight,
  onAlignTop,
  onAlignBottom,
}: AlignmentToolbarProps) {
  // Early return - no hooks needed for simple fixed position
  if (!selectedElementId) return null;

  const buttonClass =
    "p-2 bg-white border border-gray-200 rounded hover:bg-gray-50 transition-colors flex items-center justify-center";
  const iconClass = "w-4 h-4 text-gray-600";

  return (
    <div className="absolute top-4 right-2 bg-white rounded-lg shadow-lg border border-gray-200 p-2 flex flex-col gap-1 z-40">
      <div className="text-xs text-gray-500 font-medium px-2 py-1">Align</div>

      {/* Perfect center alignment */}
      <button
        onClick={() => onAlignToCenter?.(selectedElementId)}
        className={buttonClass}
        title="Align to center of canvas"
      >
        <AlignCenter className={iconClass} />
      </button>

      {/* Edge alignments */}
      <button
        onClick={() => onAlignLeft?.(selectedElementId)}
        className={buttonClass}
        title="Align to left edge"
      >
        <AlignLeft className={iconClass} />
      </button>

      <button
        onClick={() => onAlignRight?.(selectedElementId)}
        className={buttonClass}
        title="Align to right edge"
      >
        <AlignRight className={iconClass} />
      </button>

      <button
        onClick={() => onAlignTop?.(selectedElementId)}
        className={buttonClass}
        title="Align to top edge"
      >
        <MoveUp className={iconClass} />
      </button>

      <button
        onClick={() => onAlignBottom?.(selectedElementId)}
        className={buttonClass}
        title="Align to bottom edge"
      >
        <MoveDown className={iconClass} />
      </button>
    </div>
  );
}
