"use client";

import React, { useMemo } from "react";
import { ResponsiveLine } from "@nivo/line";
import { Order } from "@/types/order";

interface OrderTrendChartProps {
  orders: Order[];
  timeRange?: "day" | "week" | "month";
}

interface TrendData {
  date: string;
  successful: number;
  failed: number;
  total: number;
}

export function OrderTrendChart({
  orders,
  timeRange = "day",
}: OrderTrendChartProps) {
  const chartData = useMemo(() => {
    if (!orders || orders.length === 0) {
      return [];
    }

    // Group orders by date
    const dateMap = new Map<string, TrendData>();

    orders.forEach((order) => {
      const createdDate = new Date(order.createdAt);
      let dateKey: string;

      // Format date based on time range
      switch (timeRange) {
        case "week":
          // Get week start (Monday)
          const weekStart = new Date(createdDate);
          weekStart.setDate(createdDate.getDate() - createdDate.getDay() + 1);
          dateKey = weekStart.toISOString().split("T")[0];
          break;
        case "month":
          dateKey = `${createdDate.getFullYear()}-${String(
            createdDate.getMonth() + 1
          ).padStart(2, "0")}`;
          break;
        default: // day
          dateKey = createdDate.toISOString().split("T")[0];
      }

      if (!dateMap.has(dateKey)) {
        dateMap.set(dateKey, {
          date: dateKey,
          successful: 0,
          failed: 0,
          total: 0,
        });
      }

      const dateData = dateMap.get(dateKey)!;
      dateData.total++;

      if (order.status === "PAID") {
        dateData.successful++;
      } else if (["CANCELLED", "EXPIRED", "FAILED"].includes(order.status)) {
        dateData.failed++;
      }
    });

    // Convert to array and sort by date
    const sortedData = Array.from(dateMap.values()).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Format for nivo line chart
    return [
      {
        id: "Thành công",
        color: "#28E1E4",
        data: sortedData.map((item) => ({
          x: item.date,
          y: item.successful,
        })),
      },
      {
        id: "Thất bại",
        color: "#525252",
        data: sortedData.map((item) => ({
          x: item.date,
          y: item.failed,
        })),
      },
    ];
  }, [orders, timeRange]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    switch (timeRange) {
      case "week":
        return `Tuần ${Math.ceil(date.getDate() / 7)}/${date.getMonth() + 1}`;
      case "month":
        return `${date.getMonth() + 1}/${date.getFullYear()}`;
      default:
        return `${date.getDate()}/${date.getMonth() + 1}`;
    }
  };

  if (chartData.length === 0 || chartData[0].data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Không có dữ liệu để hiển thị xu hướng
      </div>
    );
  }

  return (
    <div className="h-96 w-full">
      <ResponsiveLine
        data={chartData}
        margin={{ top: 50, right: 110, bottom: 80, left: 60 }}
        xScale={{ type: "point" }}
        yScale={{
          type: "linear",
          min: 0,
          max: "auto",
          stacked: false,
          reverse: false,
        }}
        curve="cardinal"
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: -45,
          legend: `Thời gian (${
            timeRange === "day"
              ? "ngày"
              : timeRange === "week"
              ? "tuần"
              : "tháng"
          })`,
          legendOffset: 60,
          legendPosition: "middle",
          format: formatDate,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Số lượng đơn hàng",
          legendOffset: -45,
          legendPosition: "middle",
          format: (value) => (Number.isInteger(value) ? value.toString() : ""),
        }}
        pointSize={8}
        pointColor={{ theme: "background" }}
        pointBorderWidth={2}
        pointBorderColor={{ from: "serieColor" }}
        pointLabelYOffset={-12}
        useMesh={true}
        theme={{
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
          legends: {
            text: {
              fontFamily: "Questrial, sans-serif",
            },
          },
        }}
        legends={[
          {
            anchor: "bottom-right",
            direction: "column",
            justify: false,
            translateX: 100,
            translateY: 0,
            itemsSpacing: 0,
            itemDirection: "left-to-right",
            itemWidth: 80,
            itemHeight: 20,
            itemOpacity: 0.75,
            symbolSize: 12,
            symbolShape: "circle",
            symbolBorderColor: "rgba(0, 0, 0, .5)",
            effects: [
              {
                on: "hover",
                style: {
                  itemBackground: "rgba(0, 0, 0, .03)",
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
        tooltip={({ point }) => (
          <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg font-questrial min-w-[180px]">
            <div className="font-semibold text-gray-900 mb-1 whitespace-nowrap">
              {formatDate(point.data.x as string)}
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: point.serieColor }}
              />
              <span className="text-sm text-gray-600">{point.serieId}:</span>
              <span className="text-sm font-medium">{point.data.y}</span>
            </div>
          </div>
        )}
        animate={true}
        motionConfig="gentle"
      />
    </div>
  );
}
