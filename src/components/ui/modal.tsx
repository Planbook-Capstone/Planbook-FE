import React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  className,
  size = "md",
}: ModalProps) {
  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={cn(
          "bg-white rounded-lg shadow-lg w-full mx-4 p-0",
          sizeClasses[size],
          className
        )}
        showCloseButton={false}
      >
        {/* Header */}
        {title && (
          <DialogHeader className="flex items-center flex-row justify-between px-6 pt-6 border-gray-200">
            <DialogTitle className="text-lg font-calsans text-gray-900 font-normal">
              {title}
            </DialogTitle>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </DialogHeader>
        )}

        {/* Content */}
        <div className="px-6 pb-6">{children}</div>
      </DialogContent>
    </Dialog>
  );
}
