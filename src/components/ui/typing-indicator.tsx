"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface TypingIndicatorProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "dots" | "text";
  text?: string;
}

export default function TypingIndicator({
  className,
  size = "md",
  variant = "dots",
  text = "",
}: TypingIndicatorProps) {
  const sizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  const dotSizes = {
    sm: "w-1 h-1",
    md: "w-1.5 h-1.5",
    lg: "w-2 h-2",
  };

  if (variant === "text") {
    return (
      <div
        className={cn(
          "flex items-center gap-2 text-gray-500 font-questrial",
          sizeClasses[size],
          className
        )}
      >
        <span>{text}</span>
        <div className="flex gap-1">
          <div
            className={cn(
              "bg-gray-400 rounded-full animate-bounce",
              dotSizes[size]
            )}
            style={{ animationDelay: "0ms" }}
          />
          <div
            className={cn(
              "bg-gray-400 rounded-full animate-bounce",
              dotSizes[size]
            )}
            style={{ animationDelay: "150ms" }}
          />
          <div
            className={cn(
              "bg-gray-400 rounded-full animate-bounce",
              dotSizes[size]
            )}
            style={{ animationDelay: "300ms" }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div
        className={cn(
          "bg-gray-400 rounded-full animate-bounce",
          dotSizes[size]
        )}
        style={{ animationDelay: "0ms" }}
      />
      <div
        className={cn(
          "bg-gray-400 rounded-full animate-bounce",
          dotSizes[size]
        )}
        style={{ animationDelay: "150ms" }}
      />
      <div
        className={cn(
          "bg-gray-400 rounded-full animate-bounce",
          dotSizes[size]
        )}
        style={{ animationDelay: "300ms" }}
      />
    </div>
  );
}
