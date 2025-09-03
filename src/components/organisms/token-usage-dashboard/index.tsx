"use client";

import React, { useState, useMemo } from "react";
import dayjs from "dayjs";
import { TokenUsageCalculationResult } from "@/utils/tokenUsageCalculation";
import { DateRangePicker, DateRange } from "@/components/ui/date-range-picker";
import { ToolSelector } from "@/components/ui/tool-selector";
import {
  TimeGranularitySelector,
  TimeGranularity,
} from "@/components/ui/time-granularity-selector";
import { KPICard } from "@/components/ui/kpi-card";
import { InteractiveChart } from "@/components/ui/interactive-chart";
import {
  applyDashboardFilters,
  DashboardFilters,
} from "@/utils/dashboardFilters";

interface TokenUsageDashboardProps {
  tokenUsageData: TokenUsageCalculationResult;
  tools: any[]; // Add tools prop for filtering
  allLogs: any[]; // Add all logs for filtering
  loading?: boolean;
}

const TokenUsageDashboard: React.FC<TokenUsageDashboardProps> = ({
  tokenUsageData: _tokenUsageData,
  tools,
  allLogs,
  loading = false,
}) => {
  // Filter states
  const [dateRange, setDateRange] = useState<DateRange>({
    start: dayjs().subtract(30, "day"),
    end: dayjs(),
  });
  const [selectedToolIds, setSelectedToolIds] = useState<string[]>([]);
  const [timeGranularity, setTimeGranularity] =
    useState<TimeGranularity>("month");

  // Apply filters to get filtered data
  const filteredData = useMemo(() => {
    const filters: DashboardFilters = {
      dateRange,
      selectedToolIds,
      timeGranularity,
    };
    return applyDashboardFilters(tools, allLogs, filters);
  }, [tools, allLogs, dateRange, selectedToolIds, timeGranularity]);

  const {
    totalTokens,
    currentPeriodTokens,
    previousPeriodTokens,
    monthlyChartData,
    toolUsageData,
  } = filteredData;

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("vi-VN").format(num);
  };

  return (
    <div className="space-y-6">
      {/* Filter Controls */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <h3 className="text-lg font-calsans text-gray-900 mb-4">
          Bộ lọc dữ liệu
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <DateRangePicker value={dateRange} onChange={setDateRange} />
          <ToolSelector
            tools={tools}
            value={selectedToolIds}
            onChange={setSelectedToolIds}
            loading={loading}
          />
          <TimeGranularitySelector
            value={timeGranularity}
            onChange={setTimeGranularity}
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard
          title="Token kỳ hiện tại"
          value={currentPeriodTokens}
          previousValue={previousPeriodTokens}
          format="number"
          suffix="tokens"
          loading={loading}
          className="relative overflow-hidden text-white [&_*]:text-white"
          style={{
            backgroundImage: "url('/images/background/abstract-bg.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <KPICard
          title="Tổng token đã sử dụng"
          value={totalTokens}
          format="number"
          suffix="tokens"
          loading={loading}
        />

        <KPICard
          title="Số công cụ được sử dụng"
          value={toolUsageData.length}
          format="number"
          suffix="công cụ"
          loading={loading}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Usage Chart */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-calsans text-gray-900 mb-4">
            Token sử dụng theo{" "}
            {timeGranularity === "day"
              ? "ngày"
              : timeGranularity === "week"
              ? "tuần"
              : "tháng"}
          </h2>
          <InteractiveChart
            data={monthlyChartData.map((item) => ({
              name: item.month,
              amount: item.amount,
              details: { period: item.month, tokens: item.amount },
            }))}
            type="line"
            title="Token Usage Timeline"
            loading={loading}
            formatValue={formatNumber}
            onItemClick={(item) => {
              console.log("Clicked period:", item);
            }}
          />
        </div>

        {/* Tool Usage Chart */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-calsans text-gray-900 mb-4">
            Token usage theo công cụ
          </h2>
          <InteractiveChart
            data={toolUsageData.map((item) => ({
              name: item.name,
              amount: item.amount,
              id: item.id,
              details: {
                toolId: item.id,
                toolName: item.name,
                totalTokens: item.amount,
              },
            }))}
            type="bar"
            title="Tool Usage Distribution"
            loading={loading}
            formatValue={formatNumber}
            onItemClick={(item) => {
              console.log("Clicked tool:", item);
              // Could navigate to tool detail page or show more info
            }}
          />
        </div>
      </div>

      {/* Tool Usage Table */}
      {toolUsageData.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-calsans text-gray-900 mb-4">
            Chi tiết sử dụng token theo công cụ
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-4 font-medium font-calsans">
                    Tên công cụ
                  </th>
                  <th className="text-right py-2 px-4 font-medium font-calsans">
                    Token sử dụng
                  </th>
                  <th className="text-right py-2 px-4 font-medium font-calsans">
                    Tỷ lệ
                  </th>
                </tr>
              </thead>
              <tbody>
                {toolUsageData.map((tool, index) => {
                  const percentage =
                    totalTokens > 0
                      ? ((tool.amount / totalTokens) * 100).toFixed(1)
                      : "0";
                  return (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-4 font-questrial">{tool.name}</td>
                      <td className="py-2 px-4 text-right font-mono">
                        {formatNumber(tool.amount)}
                      </td>
                      <td className="py-2 px-4 text-right font-questrial">
                        {percentage}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default TokenUsageDashboard;
