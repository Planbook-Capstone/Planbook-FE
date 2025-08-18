"use client";

import { useEffect, useState } from "react";
import { useOrdersFilterService } from "@/services/orderServices";
import { OrderStatusByPackageChart } from "@/components/charts/OrderStatusByPackageChart";
import { OrderStatusPieChart } from "@/components/charts/OrderStatusPieChart";
import { RevenueByPackageChart } from "@/components/charts/RevenueByPackageChart";
import { OrderStatsTable } from "@/components/charts/OrderStatsTable";
import { OrderOverallStats } from "@/components/charts/OrderOverallStats";
import { useOrderStats, useUserStats } from "@/hooks/useOrderStats";
import { UserStatsTable } from "@/components/charts/UserStatsTable";
import Loading from "@/components/ui/loading";

const AdminPage = () => {
  // Gọi API get all orders với pagination
  const [orderPage, setOrderPage] = useState(1);
  const [orderPageSize, setOrderPageSize] = useState(50); // Lấy nhiều hơn để có đủ data cho charts

  const {
    data: orders,
    isLoading,
    error,
  } = useOrdersFilterService({
    offset: orderPage.toString(),
    pageSize: orderPageSize.toString(),
  });

  const [timeRange, setTimeRange] = useState<"day" | "week" | "month">("day");

  // Calculate overall stats
  const overallStats = useOrderStats(orders?.data?.content || []);
  const userStats = useUserStats(orders?.data?.content || []);

  // Console log kết quả khi data thay đổi
  useEffect(() => {
    if (orders) {
      console.log("Orders data:", orders);
    }
    if (error) {
      console.error("Error fetching orders:", error);
    }
  }, [orders, error]);

  console.log(userStats, "userStats");

  return (
    <div className="p-6">
      {isLoading && (
        <div className="flex items-center justify-center h-64">
          <Loading />
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600">Lỗi khi tải orders: {error.message}</p>
        </div>
      )}

      {orders && (
        <div className="space-y-6">
          {/* Overall Stats Cards */}
          <OrderOverallStats stats={overallStats} />

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Order Status by Package */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 lg:col-span-3">
              <h2 className="text-xl font-calsans mb-4">
                Thống kê đơn hàng theo gói dịch vụ
              </h2>
              <OrderStatusByPackageChart orders={orders.data?.content || []} />
            </div>

            {/* Order Status Distribution */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 lg:col-span-2">
              <h2 className="text-xl font-calsans mb-4">
                Phân bố trạng thái đơn hàng
              </h2>
              <OrderStatusPieChart orders={orders.data?.content || []} />
            </div>
          </div>

          {/* Trend Chart */}
          {/* <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                Xu hướng đơn hàng theo thời gian
              </h2>
              <div className="flex gap-2">
                {(["day", "week", "month"] as const).map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      timeRange === range
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {range === "day"
                      ? "Ngày"
                      : range === "week"
                      ? "Tuần"
                      : "Tháng"}
                  </button>
                ))}
              </div>
            </div>
            <OrderTrendChart
              orders={orders.data?.content || []}
              timeRange={timeRange}
            />
          </div> */}

          {/* Revenue Chart and Top 5 Users Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Chart */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-calsans mb-4">
                Doanh thu theo gói dịch vụ
              </h2>
              <RevenueByPackageChart orders={orders.data?.content || []} />
            </div>

            {/* Top 5 Users Table */}
            <div>
              <UserStatsTable userStats={userStats} />
            </div>
          </div>

          {/* Package Statistics Table */}
          <OrderStatsTable orders={orders.data?.content || []} />
        </div>
      )}
    </div>
  );
};

export default AdminPage;
