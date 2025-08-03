"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Copy,
  Clipboard,
  Trash2,
  MoveUp,
  MoveDown,
  RotateCcw,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  BringToFront,
  SendToBack,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

interface ContextMenuProps {
  x: number;
  y: number;
  elementId: string | null;
  onClose: () => void;
  onCopy?: (elementId: string) => void;
  onPaste?: () => void;
  onDelete?: (elementId: string) => void;
  onBringToFront?: (elementId: string) => void;
  onSendToBack?: (elementId: string) => void;
  onBringForward?: (elementId: string) => void;
  onSendBackward?: (elementId: string) => void;
  onFlipHorizontal?: (elementId: string) => void;
  onFlipVertical?: (elementId: string) => void;
  onRotateLeft?: (elementId: string) => void;
  onRotateRight?: (elementId: string) => void;
  hasCopiedElement?: boolean;
}

export default function ContextMenu({
  x,
  y,
  elementId,
  onClose,
  onCopy,
  onPaste,
  onDelete,
  onBringToFront,
  onSendToBack,
  onBringForward,
  onSendBackward,
  onFlipHorizontal,
  onFlipVertical,
  onRotateLeft,
  onRotateRight,
  hasCopiedElement,
}: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  if (!elementId) return null;

  const menuItems = [
    {
      label: "Copy",
      icon: Copy,
      action: () => onCopy?.(elementId),
      shortcut: "Ctrl+C",
    },
    {
      label: "Paste",
      icon: Clipboard,
      action: () => onPaste?.(),
      shortcut: "Ctrl+V",
      disabled: !hasCopiedElement,
    },
    {
      label: "Delete",
      icon: Trash2,
      action: () => onDelete?.(elementId),
      shortcut: "Del",
      danger: true,
    },
    { type: "separator" },
    {
      label: "Bring to Front",
      icon: BringToFront,
      action: () => onBringToFront?.(elementId),
      shortcut: "Ctrl+]",
    },
    {
      label: "Bring Forward",
      icon: ChevronUp,
      action: () => onBringForward?.(elementId),
      shortcut: "Ctrl+↑",
    },
    {
      label: "Send Backward",
      icon: ChevronDown,
      action: () => onSendBackward?.(elementId),
      shortcut: "Ctrl+↓",
    },
    {
      label: "Send to Back",
      icon: SendToBack,
      action: () => onSendToBack?.(elementId),
      shortcut: "Ctrl+[",
    },
    { type: "separator" },
    {
      label: "Flip Horizontal",
      icon: FlipHorizontal,
      action: () => onFlipHorizontal?.(elementId),
    },
    {
      label: "Flip Vertical",
      icon: FlipVertical,
      action: () => onFlipVertical?.(elementId),
    },
    {
      label: "Rotate Left",
      icon: RotateCcw,
      action: () => onRotateLeft?.(elementId),
    },
    {
      label: "Rotate Right",
      icon: RotateCw,
      action: () => onRotateRight?.(elementId),
    },
  ];

  const handleItemClick = (action: () => void) => {
    action();
    onClose();
  };

  // Adjust position to keep menu within viewport
  const adjustedPosition = React.useMemo(() => {
    const menuWidth = 200; // Approximate menu width
    const menuHeight = 300; // Approximate menu height
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let adjustedX = x;
    let adjustedY = y;

    // Adjust horizontal position
    if (x + menuWidth > viewportWidth) {
      adjustedX = viewportWidth - menuWidth - 10;
    }

    // Adjust vertical position
    if (y + menuHeight > viewportHeight) {
      adjustedY = viewportHeight - menuHeight - 10;
    }

    return { x: Math.max(10, adjustedX), y: Math.max(10, adjustedY) };
  }, [x, y]);

  return (
    <div
      ref={menuRef}
      className="fixed bg-white rounded-lg shadow-xl border border-gray-200 py-2 min-w-48"
      style={{
        left: adjustedPosition.x,
        top: adjustedPosition.y,
        zIndex: 9999,
      }}
    >
      {menuItems.map((item, index) => {
        if (item.type === "separator") {
          return (
            <div
              key={`separator-${index}`}
              className="border-t border-gray-200 my-1"
            />
          );
        }

        const Icon = item.icon;
        return (
          <button
            key={item.label}
            onClick={() => handleItemClick(item.action)}
            className={`w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-3 text-sm transition-colors ${
              item.danger ? "text-red-600 hover:bg-red-50" : "text-gray-700"
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="flex-1">{item.label}</span>
            {item.shortcut && (
              <span className="text-xs text-gray-400">{item.shortcut}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
