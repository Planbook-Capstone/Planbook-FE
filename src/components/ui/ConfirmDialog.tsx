"use client";

import React from "react";
import { X } from "lucide-react";
import { QuestionBankItem } from "@/services/questionBankServices";

interface ConfirmDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  action: "clear" | "remove" | null;
  selectedCount?: number;
  questionToRemove?: QuestionBankItem | null;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  action,
  selectedCount = 0,
  questionToRemove,
}) => {
  if (!isOpen) return null;

  const getDialogContent = () => {
    switch (action) {
      case "clear":
        return {
          title: "Xác nhận xóa",
          message: `Bạn có chắc chắn muốn xóa tất cả ${selectedCount} câu hỏi đã chọn?`,
          confirmText: "Xóa tất cả",
        };
      case "remove":
        return {
          title: "Xác nhận xóa",
          message: questionToRemove ? (
            <span
              dangerouslySetInnerHTML={{
                __html: `Bạn có chắc chắn muốn bỏ chọn câu hỏi: ${questionToRemove.questionContent.question}`,
              }}
            />
          ) : (
            "Bạn có chắc chắn muốn thực hiện hành động này?"
          ),
          confirmText: "Bỏ chọn",
        };

      default:
        return {
          title: "Xác nhận",
          message: "Bạn có chắc chắn muốn thực hiện hành động này?",
          confirmText: "Xác nhận",
        };
    }
  };

  const { title, message, confirmText } = getDialogContent();

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <X className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-600">{message}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-end">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
