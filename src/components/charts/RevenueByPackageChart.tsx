"use client";

import React, { useMemo } from "react";
import { ResponsiveBar } from "@nivo/bar";
import { Order } from "@/types/order";

interface RevenueByPackageChartProps {
  orders: Order[];
}

interface RevenueData {
  packageName: string;
  packageId: string;
  totalRevenue: number;
  orderCount: number;
  averageOrderValue: number;
  color: string;
}

export function RevenueByPackageChart({ orders }: RevenueByPackageChartProps) {
  const chartData = useMemo(() => {
    if (!orders || orders.length === 0) {
      return [];
    }

    // Only count PAID orders for revenue
    const paidOrders = orders.filter((order) => order.status === "PAID");

    if (paidOrders.length === 0) {
      return [];
    }

    // Group by package
    const packageMap = new Map<string, RevenueData>();

    paidOrders.forEach((order) => {
      const packageId = order.subscriptionPackage.id;
      const packageName = order.subscriptionPackage.name;

      if (!packageMap.has(packageId)) {
        packageMap.set(packageId, {
          packageName,
          packageId,
          totalRevenue: 0,
          orderCount: 0,
          averageOrderValue: 0,
          color: "#3b82f6", // Default blue
        });
      }

      const packageData = packageMap.get(packageId)!;
      packageData.totalRevenue += order.amount;
      packageData.orderCount++;
    });

    // Calculate average and assign colors
    const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

    return Array.from(packageMap.values())
      .map((pkg, index) => ({
        ...pkg,
        averageOrderValue: pkg.totalRevenue / pkg.orderCount,
        color: colors[index % colors.length],
      }))
      .sort((a, b) => b.totalRevenue - a.totalRevenue); // Sort by revenue desc
  }, [orders]);

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Không có dữ liệu doanh thu để hiển thị
      </div>
    );
  }

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN").format(value) + " VNĐ";
  };

  // Prepare data for chart
  const barData = chartData.map((item) => ({
    package: item.packageName,
    "Tổng doanh thu": item.totalRevenue,
    "Giá trị TB/đơn": item.averageOrderValue,
    color: item.color,
  }));

  return (
    <div className="h-96 w-full">
      <ResponsiveBar
        data={barData}
        keys={["Tổng doanh thu"]}
        indexBy="package"
        margin={{ top: 50, right: 130, bottom: 80, left: 80 }}
        padding={0.3}
        valueScale={{ type: "linear" }}
        indexScale={{ type: "band", round: true }}
        colors={(bar) => bar.data.color}
        defs={[
          {
            id: "revenueGradient",
            type: "linearGradient",
            colors: [
              { offset: 0, color: "#3b82f6" },
              { offset: 100, color: "#1d4ed8" },
            ],
          },
        ]}
        fill={[
          {
            match: "*",
            id: "revenueGradient",
          },
        ]}
        borderColor={{
          from: "color",
          modifiers: [["darker", 1.6]],
        }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: -45,
          legend: "Gói dịch vụ",
          legendPosition: "middle",
          legendOffset: 60,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Doanh thu (VND)",
          legendPosition: "middle",
          legendOffset: -60,
          format: (value) => {
            if (value >= 1000000) {
              return `${(value / 1000000).toFixed(1)}M`;
            } else if (value >= 1000) {
              return `${(value / 1000).toFixed(0)}K`;
            }
            return value.toString();
          },
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{
          from: "color",
          modifiers: [["darker", 1.6]],
        }}
        theme={{
          labels: {
            text: {
              fontFamily: "Questrial, sans-serif",
            },
          },
          axis: {
            legend: {
              text: {
                fontFamily: "Questrial, sans-serif",
              },
            },
            ticks: {
              text: {
                fontFamily: "Questrial, sans-serif",
              },
            },
          },
        }}
        legends={[]}
        tooltip={({ id, value, indexValue, data }) => {
          const packageData = chartData.find(
            (p) => p.packageName === indexValue
          );
          return (
            <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg font-questrial min-w-[280px]">
              <div className="font-semibold text-gray-900 mb-2 whitespace-nowrap">
                {indexValue}
              </div>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Tổng doanh thu:</span>
                  <span className="text-sm font-medium">
                    {formatCurrency(value as number)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Số đơn hàng:</span>
                  <span className="text-sm font-medium">
                    {packageData?.orderCount || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Giá trị TB/đơn:</span>
                  <span className="text-sm font-medium">
                    {formatCurrency(packageData?.averageOrderValue || 0)}
                  </span>
                </div>
              </div>
            </div>
          );
        }}
        animate={true}
        motionConfig="gentle"
      />
    </div>
  );
}
