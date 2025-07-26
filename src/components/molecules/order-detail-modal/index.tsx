"use client";
import { Button } from "@/components/ui/Button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ORDER_STATUS_COLOR, ROLE_LABELS } from "@/constants";
import { getOrderStatusLabel } from "@/constants/enum";
import { Order } from "@/types";
interface OrderDetailModalProps {
  order: Order;
  open: boolean;
  onClose: () => void;
}

function OrderDetailModal({ order, open, onClose }: OrderDetailModalProps) {
  const colorClass =
    ORDER_STATUS_COLOR[order.status] || "bg-gray-100 text-gray-800";

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-1/2 !max-w-none max-h-screen overflow-y-auto"
      >
        <SheetHeader>
          <SheetTitle className="font-calsans font-normal text-xl">
            Chi tiết đơn hàng
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-6  px-5">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex justify-start items-center gap-2">
                <label className="text-sm font-medium text-gray-600">
                  Mã đơn hàng
                </label>
                <p className="font-questrial text-gray-900 mt-1">{order.id}</p>
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
                <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                  <p className="font-questrial text-gray-900 font-medium">
                    {order.subscriptionPackage.name}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {order.subscriptionPackage.description}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Token: {order.subscriptionPackage.tokenAmount}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button variant="outline" onClick={onClose}>
            Đóng
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default OrderDetailModal;
