"use client";

import OrderCard from "@/components/organisms/order-card";

import { useQueryClient } from "@tanstack/react-query";
import { useOrderByUserIdService } from "@/services/orderServices";

function OrderHistoryPage() {
  const queryClient = useQueryClient();
  const userData = queryClient.getQueryData(["currentUser"]);

  // Get userId
  const user = userData as any;
  const userId = user?.id;
  console.log(userId, "userId");
  const {
    data: ordersData,
    isLoading,
    error,
  } = useOrderByUserIdService("b15c2276-ebd4-4ce2-b1ec-275b6cb536f0");

  // Use API data if available
  const orders = ordersData?.data?.content || [];

  console.log(orders, "orders data");
  console.log(ordersData?.data?.content?.orderHistories, "full response");

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {orders && orders.length > 0 ? (
            orders?.map((order: any) => (
              <OrderCard
                key={order.id}
                orderStatus={order?.orderHistories[0]}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">Không có đơn hàng nào</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default OrderHistoryPage;
