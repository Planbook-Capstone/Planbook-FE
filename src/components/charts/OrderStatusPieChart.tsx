"use client";

import React, { useMemo } from "react";
import { ResponsivePie } from "@nivo/pie";
import { Order, OrderStatus } from "@/types/order";

interface OrderStatusPieChartProps {
  orders: Order[];
}

interface StatusData {
  id: string;
  label: string;
  value: number;
  color: string;
}

export function OrderStatusPieChart({ orders }: OrderStatusPieChartProps) {
  const chartData = useMemo(() => {
    if (!orders || orders.length === 0) {
      return [];
    }

    // Count orders by status
    const statusCount = new Map<OrderStatus, number>();

    orders.forEach((order) => {
      const currentCount = statusCount.get(order.status) || 0;
      statusCount.set(order.status, currentCount + 1);
    });

    // Define colors for each status
    const statusColors: Record<OrderStatus, string> = {
      PAID: "url(#paidGradient)", // Use gradient for PAID
      PENDING: "#f59e0b", // amber-500
      CANCELLED: "#6b7280", // gray-500 (changed to gray)
      EXPIRED: "#6b7280", // gray-500
      FAILED: "#dc2626", // red-600
      RETRY: "#8b5cf6", // violet-500
    };

    // Define Vietnamese labels
    const statusLabels: Record<OrderStatus, string> = {
      PAID: "Đã thanh toán",
      PENDING: "Chờ thanh toán",
      CANCELLED: "Đã hủy",
      EXPIRED: "Hết hạn",
      FAILED: "Thất bại",
      RETRY: "Thử lại",
    };

    // Convert to chart format
    return Array.from(statusCount.entries()).map(([status, count]) => ({
      id: status,
      label: statusLabels[status],
      value: count,
      color: statusColors[status],
    }));
  }, [orders]);

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Không có dữ liệu trạng thái để hiển thị
      </div>
    );
  }

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="h-96 w-full">
      <ResponsivePie
        data={chartData}
        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
        innerRadius={0.5}
        padAngle={0.7}
        cornerRadius={50}
        activeOuterRadiusOffset={8}
        defs={[
          {
            id: "paidGradient",
            type: "linearGradient",
            colors: [
              { offset: 45, color: "#3AA7FC" },
              { offset: 80, color: "#407BE9" },
              { offset: 100, color: "#3714A2" },
            ],
          },
        ]}
        fill={[
          {
            match: { id: "PAID" },
            id: "paidGradient",
          },
        ]}
        colors={(datum) => datum.data.color}
        borderWidth={0}
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsTextColor="#333333"
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: "color" }}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor={{
          from: "color",
          modifiers: [["darker", 2]],
        }}
        theme={{
          labels: {
            text: {
              fontFamily: "Questrial, sans-serif",
            },
          },
          legends: {
            text: {
              fontFamily: "Questrial, sans-serif",
            },
          },
        }}
        legends={[
          {
            anchor: "bottom",
            direction: "row",
            justify: false,
            translateX: 0,
            translateY: 56,
            itemsSpacing: 0,
            itemWidth: 100,
            itemHeight: 18,
            itemTextColor: "#999",
            itemDirection: "left-to-right",
            itemOpacity: 1,
            symbolSize: 18,
            symbolShape: "circle",
            effects: [
              {
                on: "hover",
                style: {
                  itemTextColor: "#000",
                },
              },
            ],
          },
        ]}
        tooltip={({ datum }) => (
          <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg font-questrial min-w-[200px]">
            <div className="font-semibold text-gray-900 mb-2 whitespace-nowrap">
              {datum.label}
            </div>
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{
                      background:
                        datum.id === "PAID"
                          ? "linear-gradient(to bottom, #28E1E4 0%, #30C7EF 65%, #3AA7FC 75%, #407BE9 90%, #3714A2 100%)"
                          : datum.color,
                    }}
                  />
                  <span className="text-sm text-gray-600">Số lượng:</span>
                </div>
                <span className="text-sm font-medium">{datum.value}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Tỷ lệ:</span>
                <span className="text-sm font-medium">
                  {((datum.value / total) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        )}
        animate={true}
        motionConfig="gentle"
      />
    </div>
  );
}
