"use client";

import { File, FileIcon, FileText, Undo2, Redo2 } from "lucide-react";
import { Button } from "../ui/Button";
import Image from "next/image";

interface ToolbarProps {
  showDeleteButtons: boolean;
  onToggleDeleteButtons: () => void;
  onShowPreview: () => void;
  onExportJSON: () => void;
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  // Undo/Redo props
  canUndo?: boolean;
  canRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
  // Hide AI button in edit mode
  hideAIButton?: boolean;
}

export default function Toolbar({
  showDeleteButtons,
  onToggleDeleteButtons,
  onShowPreview,
  onExportJSON,
  sidebarCollapsed,
  onToggleSidebar,
  canUndo = false,
  canRedo = false,
  onUndo,
  onRedo,
  hideAIButton = false,
}: ToolbarProps) {
  return (
    <div className=" p-4">
      <div className="flex items-center justify-between">
        {/* <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className=" cursor-pointer px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium transition-colors"
            title={sidebarCollapsed ? "Mở sidebar" : "Đóng sidebar"}
          >
            {sidebarCollapsed ? "☰" : "✕"}
          </button>
          <h1 className="text-xl font-calsans">Tạo giáo án</h1>
        </div> */}

        <div className="flex items-center gap-3">
          {/* Undo/Redo buttons */}
          {(onUndo || onRedo) && (
            <div className="flex items-center gap-1 mr-2">
              <Button
                onClick={onUndo}
                disabled={!canUndo}
                variant="outline"
                size="sm"
                className="px-2"
                title={`Undo (${
                  navigator.platform.includes("Mac") ? "⌘" : "Ctrl"
                }+Z)`}
              >
                <Undo2 size={16} />
              </Button>
              <Button
                onClick={onRedo}
                disabled={!canRedo}
                variant="outline"
                size="sm"
                className="px-2"
                title={`Redo (${
                  navigator.platform.includes("Mac") ? "⌘⇧" : "Ctrl+Shift"
                }+Z)`}
              >
                <Redo2 size={16} />
              </Button>
            </div>
          )}

          {!hideAIButton && (
            <Button
              onClick={onExportJSON}
              className=" flex items-center justify-center bg-[linear-gradient(227deg,_#20DCDF_5.38%,_#25BEE5_16.58%,_#2C99EE_26.8%,_#368BEB_39.32%,_#3860D2_50.53%,_#3A39BB_60.74%,_#3714A2_73.92%)]"
            >
              <Image
                src="/images/illustration/robot-head.svg"
                width={25}
                height={25}
                alt="AI"
              />
              <p>Tạo nhanh cùng AI</p>
            </Button>
          )}

          <Button
            onClick={onToggleDeleteButtons}
            variant={showDeleteButtons ? "default" : "outline"}
          >
            {showDeleteButtons ? "Hoàn thành" : "Chỉnh sửa"}
          </Button>
          <Button onClick={onShowPreview}>
            <FileText /> Preview
          </Button>
        </div>
      </div>
    </div>
  );
}
