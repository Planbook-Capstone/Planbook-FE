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
        className="w-2/5 !max-w-none max-h-screen overflow-y-auto"
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
                <p className="font-questrial font-bold text-gray-900 mt-1">
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
                <div className="w-1/2">
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
              <label className="text-lg font-calsans ">
                Lịch sử thanh toán
              </label>
              <div className="mt-2">
                {order.transactions.map((transaction, index: number) => {
                  const statusColor =
                    ORDER_STATUS_COLOR[transaction.status] ||
                    "bg-gray-100 text-gray-800";
                  return (
                    <div
                      key={transaction.id}
                      className="border rounded-lg p-3 shadow-sm"
                    >
                      <p className="flex justify-between items-center gap-2">
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
                      </p>

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
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default OrderDetailModal;
