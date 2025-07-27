"use client";
import { Button } from "@/components/ui/Button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ORDER_STATUS_COLOR } from "@/constants";
import { getOrderStatusLabel } from "@/constants/enum";
import { Order } from "@/types";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
interface OrderDetailProps {
  order: Order;
  open: boolean;
  onClose: () => void;
  onRetry: () => void;
  onCancel?: (reason: string, customReason?: string) => void;
}

interface CancelOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string, customReason?: string) => void;
  isLoading?: boolean;
}

const CANCEL_REASONS = [
  "Không còn nhu cầu sử dụng",
  "Tìm được gói khác phù hợp hơn",
  "Giá cả không phù hợp",
  "Gặp lỗi trong quá trình thanh toán",
];

export function CancelOrderModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}: CancelOrderModalProps) {
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [customReason, setCustomReason] = useState<string>("");

  const handleConfirm = () => {
    if (!selectedReason) return;
    onConfirm(selectedReason, customReason.trim() || undefined);
  };

  const handleClose = () => {
    if (!isLoading) {
      setSelectedReason("");
      setCustomReason("");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <DialogTitle className="text-lg font-semibold text-gray-900">
              Hủy đơn hàng
            </DialogTitle>
          </div>
          <DialogDescription className="text-sm text-gray-600 mt-2">
            Vui lòng chọn lý do hủy đơn hàng. Hành động này không thể hoàn tác.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Danh sách lý do có sẵn */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Lý do hủy đơn hàng <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              {CANCEL_REASONS.map((reason) => (
                <label
                  key={reason}
                  className="flex items-center space-x-3 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="cancelReason"
                    value={reason}
                    checked={selectedReason === reason}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    disabled={isLoading}
                  />
                  <span className="text-sm text-gray-700">{reason}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Ô nhập lý do tùy chỉnh */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Lý do khác (tùy chọn)
            </label>
            <textarea
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              placeholder="Nhập lý do khác nếu có..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
              maxLength={500}
              disabled={isLoading}
            />
            <div className="text-xs text-gray-500 text-right">
              {customReason.length}/500 ký tự
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Hủy bỏ
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={!selectedReason || isLoading}
            className="bg-red-600 hover:bg-red-700"
          >
            {isLoading ? "Đang xử lý..." : "Xác nhận hủy"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function OrderDetail({
  order,
  open,
  onClose,
  onRetry,
  onCancel,
}: OrderDetailProps) {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const colorClass =
    ORDER_STATUS_COLOR[order.status] || "bg-gray-100 text-gray-800";

  const handleCancelOrder = async (reason: string, customReason?: string) => {
    if (!onCancel) return;

    setIsCancelling(true);
    try {
      await onCancel(reason, customReason);
      setShowCancelModal(false);
    } catch (error) {
      // Error handling will be done in parent component
    } finally {
      setIsCancelling(false);
    }
  };
  return (
    <div className="space-y-3">
      <h1 className="font-calsans text-xl">Chi tiết đơn hàng</h1>

      <div className="space-y-6  px-5">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex justify-start items-center gap-2">
              <label className="text-sm font-medium text-gray-600">
                Mã đơn hàng
              </label>
              <p className="font-questrial font-bold text-gray-900 ">
                {order.id}
              </p>
            </div>
            <span
              className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${colorClass}`}
            >
              {getOrderStatusLabel(order.status)}
            </span>
          </div>

          <div className="flex justify-start items-center gap-5">
            <div>
              <label className="text-sm font-medium text-gray-600">
                Ngày tạo
              </label>
              <p className="font-questrial text-gray-900 mt-1">
                {new Date(order.createdAt).toLocaleString("vi-VN")}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">
                Cập nhật lần cuối
              </label>
              <p className="font-questrial text-gray-900 mt-1">
                {new Date(order.updatedAt).toLocaleString("vi-VN")}
              </p>
            </div>
          </div>

          {order.subscriptionPackage && (
            <div>
              <label className="text-sm font-medium text-gray-600">
                Gói đăng ký
              </label>
              <div className="w-1/3">
                <div className="bg-[url('/images/background/abstract-bg.png')] bg-[length:300%] bg-center text-white mt-1 p-5 rounded-lg space-y-3">
                  <p className="font-calsans text-base ">
                    {order.subscriptionPackage.name}
                  </p>
                  <p className="text-sm ">
                    {order.subscriptionPackage.description}
                  </p>

                  <div className="pt-2 space-y-2">
                    <p className="text-sm font-medium mb-3 opacity-80">
                      Tính năng bao gồm:
                    </p>
                    <ul className="text-sm">
                      <li className="flex items-center gap-x-2">
                        <span>•</span>
                        <span>
                          Tặng ngay {order.subscriptionPackage.tokenAmount}{" "}
                          token AI
                        </span>
                      </li>
                      {order.subscriptionPackage.features &&
                        Object.entries(order.subscriptionPackage.features)
                          .sort((a, b) => Number(a[0]) - Number(b[0])) // sort theo key số
                          .map(([key, f]) => (
                            <li key={key} className="flex items-center gap-2">
                              <span className="mt-1">•</span>
                              <span>{f}</span>
                            </li>
                          ))}
                    </ul>
                  </div>

                  <h1 className="font-calsans text-3xl lg:text-6xl">
                    {order.subscriptionPackage.price?.toLocaleString("vi-VN")}
                  </h1>
                  <p className="text-sm">
                    Bắt đầu số hóa công việc giảng dạy. Tiết kiệm thời gian và
                    nâng cao hiệu quả
                  </p>
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="text-lg font-calsans ">Lịch sử thanh toán</label>
            <div className="mt-2 space-y-2">
              {order.transactions.map((transaction, index: number) => {
                const statusColor =
                  ORDER_STATUS_COLOR[transaction.status] ||
                  "bg-gray-100 text-gray-800";
                return (
                  <div
                    key={transaction.id}
                    className="border rounded-lg p-3 shadow-sm"
                  >
                    <div className="flex justify-between items-center gap-2">
                      <p>
                        {" "}
                        Mã giao dịch{" "}
                        <span className="font-bold">{transaction.id}</span>
                      </p>
                      <span
                        className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${statusColor}`}
                      >
                        {" " + getOrderStatusLabel(transaction.status)}
                      </span>
                    </div>

                    <p>
                      Lí do{" "}
                      <span className="font-bold">
                        {transaction?.failureReason
                          ? transaction?.failureReason
                          : "N/A"}
                      </span>
                    </p>

                    <p>
                      Vào lúc{" "}
                      <span className="font-bold">
                        {new Date(transaction.createdAt).toLocaleString(
                          "vi-VN"
                        )}
                      </span>
                    </p>

                    {(transaction?.status === "RETRY" &&
                      order.status === "RETRY") ||
                      (transaction?.status === "PENDING" &&
                        order.status === "PENDING" && (
                          <Link
                            href={transaction?.checkoutUrl || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-red-600 mt-1 block"
                          >
                            Click vào đây để thanh toán
                          </Link>
                        ))}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 mb-5 border-t border-gray-200">
        <Button variant="dash" onClick={onClose}>
          Đóng
        </Button>
        {order.status === "PENDING" && (
          <>
            <Button variant="outline" onClick={onRetry}>
              Thanh toán lại
            </Button>
            <Button
              variant="destructive"
              onClick={() => setShowCancelModal(true)}
            >
              Hủy đơn hàng
            </Button>
          </>
        )}
        {order.status === "RETRY" && (
          <>
            <Button
              variant="destructive"
              onClick={() => setShowCancelModal(true)}
            >
              Hủy đơn hàng
            </Button>
          </>
        )}
      </div>

      {/* Cancel Order Modal */}
      <CancelOrderModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancelOrder}
        isLoading={isCancelling}
      />
    </div>
  );
}

export default OrderDetail;
