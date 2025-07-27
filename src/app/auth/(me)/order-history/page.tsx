"use client";

import { useOrderByUserIdService } from "@/services/orderServices";
import { useAuth } from "@/hooks/useAuth";
import OrderTable from "@/components/organisms/table-order-history";
import { Order } from "@/types";
import { useState } from "react";
import OrderDetailModal from "@/components/molecules/order-detail-modal";
import OrderDetail from "@/components/molecules/order-detail";

function OrderHistoryPage() {
  const { user } = useAuth();
  const [selected, setSelected] = useState<Order>();
  const [open, setOpen] = useState(false);

  const {
    data: ordersData,
    isLoading,
    error,
  } = useOrderByUserIdService(user?.id);

  // Use API data if available
  const orders = ordersData?.data?.content || [];

  const handleViewDetail = (order: Order) => {
    // You can implement modal/drawer logic here
    setOpen(true);
    setSelected(order);
  };

  if (selected && open) {
    return (
      <OrderDetail
        order={selected}
        open={open}
        onClose={() => setOpen(!open)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-calsans text-gray-900">
          Lịch sử đơn hàng
        </h1>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <p className="text-gray-500">Đang tải dữ liệu...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-12">
          <p className="text-red-500">Có lỗi xảy ra khi tải dữ liệu</p>
        </div>
      )}

      {/* Order Cards */}
      {!isLoading && !error && (
        <div>
          <OrderTable orders={orders} onViewDetail={handleViewDetail} />
        </div>
      )}

      {/* {open && selected && (
        <OrderDetail
          order={selected}
          open={open}
          onClose={() => setOpen(!open)}
        />
      )} */}
    </div>
  );
}

export default OrderHistoryPage;
