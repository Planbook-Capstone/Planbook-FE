"use client";

import React from "react";

interface OverallStats {
  totalOrders: number;
  paidOrders: number;
  totalRevenue: number;
  conversionRate: number;
  averageOrderValue: number;
}

interface OrderOverallStatsProps {
  stats: OverallStats;
}

export function OrderOverallStats({ stats }: OrderOverallStatsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN").format(value) + " VNĐ";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="text-sm text-gray-600 font-medium">Tổng doanh thu</div>
        <div className="text-2xl font-calsans text-gray-900">
          {formatCurrency(stats.totalRevenue)}
        </div>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="text-sm text-gray-600 font-medium">Tổng đơn hàng</div>
        <div className="text-2xl font-calsans text-gray-900">
          {stats.totalOrders}
        </div>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="text-sm text-gray-600 font-medium">Đơn thành công</div>
        <div className="text-2xl font-calsans text-gray-900">
          {stats.paidOrders}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="text-sm text-gray-600 font-medium">
          Tỷ lệ chuyển đổi
        </div>
        <div className="text-2xl font-calsans text-gray-900">
          {stats.conversionRate.toFixed(1)}%
        </div>
      </div>
    </div>
  );
}
