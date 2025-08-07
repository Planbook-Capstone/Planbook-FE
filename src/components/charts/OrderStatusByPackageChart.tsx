"use client";

import React, { useMemo } from "react";
import { ResponsiveBar } from "@nivo/bar";
import { Order } from "@/types/order";

interface OrderStatusByPackageChartProps {
  orders: Order[];
}

interface PackageOrderData {
  packageName: string;
  packageId: string;
  successful: number;
  failed: number;
  total: number;
}

export function OrderStatusByPackageChart({
  orders,
}: OrderStatusByPackageChartProps) {
  const chartData = useMemo(() => {
    if (!orders || orders.length === 0) {
      return [];
    }

    // Group orders by package
    const packageMap = new Map<string, PackageOrderData>();

    orders.forEach((order) => {
      const packageId = order.subscriptionPackage.id;
      const packageName = order.subscriptionPackage.name;

      if (!packageMap.has(packageId)) {
        packageMap.set(packageId, {
          packageName,
          packageId,
          successful: 0,
          failed: 0,
          total: 0,
        });
      }

      const packageData = packageMap.get(packageId)!;
      packageData.total++;

      // Count successful (PAID) vs failed (CANCELLED, EXPIRED, FAILED)
      if (order.status === "PAID") {
        packageData.successful++;
      } else if (["CANCELLED", "EXPIRED", "FAILED"].includes(order.status)) {
        packageData.failed++;
      }
    });

    // Convert to chart format
    return Array.from(packageMap.values()).map((pkg) => ({
      package: pkg.packageName,
      "Thành công": pkg.successful,
      "Thất bại": pkg.failed,
      successfulColor: "#67e8f9", // cyan-300
      failedColor: "#525252", // neutral-700
    }));
  }, [orders]);

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Không có dữ liệu đơn hàng để hiển thị
      </div>
    );
  }

  return (
    <div className="h-96 w-full relative">
      <ResponsiveBar
        data={chartData}
        keys={["Thành công", "Thất bại"]}
        indexBy="package"
        margin={{ top: 50, right: 130, bottom: 80, left: 60 }}
        padding={0.3}
        groupMode="grouped"
        valueScale={{ type: "linear" }}
        indexScale={{ type: "band", round: true }}
        defs={[
          {
            id: "successGradient",
            type: "linearGradient",
            colors: [
              { offset: 0, color: "#28E1E4" },
              { offset: 65, color: "#30C7EF" },
              { offset: 90, color: "#3AA7FC" },
            ],
          },
        ]}
        fill={[
          {
            match: { id: "Thành công" },
            id: "successGradient",
          },
        ]}
        colors={({ id }) => {
          return id === "Thành công" ? "#28E1E4" : "#6b7280";
        }}
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
          legend: "Số lượng đơn hàng",
          legendPosition: "middle",
          legendOffset: -45,
          format: (value) => (Number.isInteger(value) ? value.toString() : ""),
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
        tooltip={({ id, value, indexValue, data }) => (
          <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg font-questrial min-w-[250px]">
            <div className="font-semibold text-gray-900 mb-2 whitespace-nowrap">
              {indexValue}
            </div>
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded"
                    style={{
                      background:
                        id === "Thành công"
                          ? "linear-gradient(to bottom, #28E1E4 0%, #30C7EF 65%, #3AA7FC 75%, #407BE9 90%, #3714A2 100%)"
                          : "#525252",
                    }}
                  />
                  <span className="text-sm text-gray-600">{id}:</span>
                </div>
                <span className="text-sm font-medium">{value}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Tổng đơn hàng:</span>
                <span className="text-sm font-medium">
                  {(data["Thành công"] as number) +
                    (data["Thất bại"] as number)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Tỷ lệ thành công:</span>
                <span className="text-sm font-medium">
                  {(
                    ((data["Thành công"] as number) /
                      ((data["Thành công"] as number) +
                        (data["Thất bại"] as number))) *
                    100
                  ).toFixed(1)}
                  %
                </span>
              </div>
            </div>
          </div>
        )}
        animate={true}
        motionConfig="gentle"
      />

      {/* Custom Legend */}
      <div className="absolute top-12 right-4 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div
            className="w-5 h-5 rounded"
            style={{
              background:
                "linear-gradient(to bottom, #28E1E4 0%, #30C7EF 65%, #3AA7FC 90%)",
            }}
          />
          <span className="text-sm text-gray-700 font-questrial">
            Thành công
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-5 h-5 rounded"
            style={{ backgroundColor: "#6b7280" }}
          />
          <span className="text-sm text-gray-700 font-questrial">Thất bại</span>
        </div>
      </div>
    </div>
  );
}
