"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import { AlertTriangle, CheckCircle, Trash2 } from "lucide-react";

interface GeneralConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  itemName?: string;
  isLoading?: boolean;
  type?: "delete" | "activate" | "confirm";
  confirmText?: string;
  loadingText?: string;
}

export default function GeneralConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  itemName,
  isLoading = false,
  type = "confirm",
  confirmText,
  loadingText,
}: GeneralConfirmDialogProps) {
  const getDialogConfig = () => {
    switch (type) {
      case "delete":
        return {
          icon: <Trash2 className="h-5 w-5 text-red-600" />,
          iconBg: "bg-red-100",
          defaultTitle: "Xác nhận xóa",
          defaultDescription: itemName
            ? `Bạn có chắc chắn muốn xóa "${itemName}" không? Hành động này không thể hoàn tác.`
            : "Bạn có chắc chắn muốn xóa mục này không? Hành động này không thể hoàn tác.",
          defaultConfirmText: "Xóa",
          defaultLoadingText: "Đang xóa...",
          buttonVariant: "destructive" as const,
          buttonClass: "bg-red-600 hover:bg-red-700",
        };
      case "activate":
        return {
          icon: <CheckCircle className="h-5 w-5 text-green-600" />,
          iconBg: "bg-green-100",
          defaultTitle: "Xác nhận kích hoạt",
          defaultDescription: itemName
            ? `Bạn có chắc chắn muốn kích hoạt "${itemName}" không?`
            : "Bạn có chắc chắn muốn kích hoạt mục này không?",
          defaultConfirmText: "Kích hoạt",
          defaultLoadingText: "Đang kích hoạt...",
          buttonVariant: "default" as const,
          buttonClass: "bg-green-600 hover:bg-green-700 text-white",
        };
      default:
        return {
          icon: <AlertTriangle className="h-5 w-5 text-blue-600" />,
          iconBg: "bg-blue-100",
          defaultTitle: "Xác nhận",
          defaultDescription: "Bạn có chắc chắn muốn thực hiện hành động này không?",
          defaultConfirmText: "Xác nhận",
          defaultLoadingText: "Đang xử lý...",
          buttonVariant: "default" as const,
          buttonClass: "bg-blue-600 hover:bg-blue-700 text-white",
        };
    }
  };

  const config = getDialogConfig();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-full ${config.iconBg}`}>
              {config.icon}
            </div>
            <DialogTitle className="text-lg font-semibold text-gray-900">
              {title || config.defaultTitle}
            </DialogTitle>
          </div>
          <DialogDescription className="text-sm text-gray-600 mt-2">
            {description || config.defaultDescription}
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="flex gap-3 sm:gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1"
          >
            Hủy
          </Button>
          <Button
            variant={config.buttonVariant}
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 ${config.buttonClass}`}
          >
            {isLoading 
              ? (loadingText || config.defaultLoadingText)
              : (confirmText || config.defaultConfirmText)
            }
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
