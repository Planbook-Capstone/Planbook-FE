"use client";

import * as React from "react";
import { ChatButton } from "@/components/ui/chat-button";
import { cn } from "@/lib/utils";

export interface ChatToggleProps {
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "secondary" | "outline" | "ghost";
  position?: "bottom-left" | "bottom-right" | "top-left" | "top-right";
  showBadge?: boolean;
  badgeCount?: number;
  disabled?: boolean;
}

const positionClasses = {
  "bottom-left": "bottom-4 left-4",
  "bottom-right": "bottom-4 right-4",
  "top-left": "top-4 left-4",
  "top-right": "top-4 right-4",
};

export default function ChatToggle({
  isOpen,
  onToggle,
  className,
  size = "md",
  variant = "default",
  position = "bottom-left",
  showBadge = false,
  badgeCount = 0,
  disabled = false,
}: ChatToggleProps) {
  console.log("ChatToggle rendering with isOpen:", isOpen);

  const handleClick = () => {
    console.log("ChatToggle clicked!");
    onToggle();
  };

  return (
    <div className={cn("fixed z-50", positionClasses[position], className)}>
      <div className="relative">
        {/* Pulse animation when closed - behind button */}
        {!isOpen && (
          <div className="absolute inset-0 rounded-full bg-blue-600 animate-ping opacity-20 pointer-events-none" />
        )}

        <ChatButton
          variant={variant}
          size={size}
          iconType={isOpen ? "close" : "message"}
          onClick={handleClick}
          disabled={disabled}
          className="relative z-10 transition-transform hover:scale-105 active:scale-95"
        />

        {/* Badge for unread messages */}
        {showBadge && badgeCount > 0 && !isOpen && (
          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1 font-medium shadow-sm z-20">
            {badgeCount > 99 ? "99+" : badgeCount}
          </div>
        )}
      </div>
    </div>
  );
}
