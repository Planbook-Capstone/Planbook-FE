"use client";

import React from "react";
import { Copy, Scissors, Clipboard } from "lucide-react";

interface EditModeStatusProps {
  isEditMode: boolean;
  selectedCount: number;
  clipboard: {
    nodes: any[];
    operation: "copy" | "cut";
  } | null;
}

export default function EditModeStatus({
  isEditMode,
  selectedCount,
  clipboard,
}: EditModeStatusProps) {
  if (!isEditMode) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 min-w-64">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
        <span className="text-sm font-medium text-gray-700">
          Chế độ chỉnh sửa
        </span>
      </div>

      <div className="space-y-2 text-xs text-gray-600">
        <div className="flex items-center justify-between">
          <span>Đã chọn:</span>
          <span className="font-medium">{selectedCount} node</span>
        </div>

        {clipboard && (
          <div className="flex items-center justify-between">
            <span>Clipboard:</span>
            <div className="flex items-center gap-1">
              {clipboard.operation === "copy" ? (
                <Copy size={12} className="text-blue-500" />
              ) : (
                <Scissors size={12} className="text-orange-500" />
              )}
              <span className="font-medium">{clipboard.nodes.length} node</span>
            </div>
          </div>
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100">
        <div className="text-xs text-gray-500 space-y-1">
          <div>• Click để chọn node</div>
          <div>• Ctrl/Cmd + Click để chọn nhiều</div>
          <div>• Ctrl/Cmd + C để copy</div>
          <div>• Ctrl/Cmd + X để cut</div>
          {clipboard && (
            <div className="text-blue-600 font-medium">
              • Chọn 1 node và nhấn Ctrl/Cmd + V để paste
            </div>
          )}
          <div>• Right-click để paste vào node</div>
        </div>
      </div>
    </div>
  );
}
