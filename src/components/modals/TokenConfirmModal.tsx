"use client";

import React from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/Button";
import { Zap, AlertTriangle } from "lucide-react";
import Image from "next/image";

interface TokenConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  estimatedTokens: number;
  isLoading?: boolean;
}

export const TokenConfirmModal: React.FC<TokenConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  estimatedTokens,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Xác nhận sử dụng Token"
      size="md"
    >
      <div className="space-y-6">
        {/* Token cost information */}
        <div className="text-center space-y-3">
          <div className="bg-gray-50 rounded-lg p-4 border">
            <div className="flex items-center justify-center space-x-2">
              <Image
                src="/images/power.svg"
                alt="PlanBook Logo"
                width={20}
                height={20}
                className="object-contain"
              />
              <span className="text-2xl font-bold text-gray-900">
                {estimatedTokens.toLocaleString()}
              </span>
              <span className="text-gray-600">tokens</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Ước tính chi phí cho việc tạo giáo án này
            </p>
          </div>
        </div>

        {/* Warning message */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="text-amber-800 font-medium">Lưu ý quan trọng:</p>
              <ul className="text-amber-700 mt-1 space-y-1">
                <li>• Số token sẽ được trừ từ tài khoản của bạn</li>
                <li>• Quá trình tạo có thể mất vài phút</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex space-x-3 pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
            disabled={isLoading}
          >
            Hủy bỏ
          </Button>
          <Button onClick={onConfirm} disabled={isLoading}>
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Đang xử lý...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Image
                  src="/images/power.svg"
                  alt="PlanBook Logo"
                  width={20}
                  height={20}
                  className="object-contain"
                />
                <span>Xác nhận & Tạo cùng AI</span>
              </div>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default TokenConfirmModal;
