"use client";

import React, { useState, useMemo, useEffect } from "react";
import { ExternalToolConfig, mockExternalToolConfigs } from "@/data/tools";
import { BarChart3 } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

import { useExternalToolsService } from "@/services/externalToolsServices";
import { useToolLogsWithParamsService } from "@/services/toolLogServices";
import { calculateTokenUsage } from "@/utils/tokenUsageCalculation";

// Mock current user (tool-manager)
const CURRENT_USER_ID = "uuid-4"; // Phạm Thị Tool Manager

export default function ToolManagerDashboardPage() {
  // API calls with number parameters (not strings)
  const {
    data: externalToolsData,
    isLoading: isLoadingTools,
    error: apiError,
  } = useExternalToolsService(
    {
      retry: 1, // Only retry once
      staleTime: 0, // Don't use stale data
    },
    {
      offset: 1, // Number instead of string
      pageSize: 10, // Number instead of string
      sortBy: "createdAt",
      sortDirection: "desc",
    }
  );

  // State management
  const [tools, setTools] = useState<ExternalToolConfig[]>([]);

  // Set tools data from API with error handling
  useEffect(() => {
    if (externalToolsData?.data?.content) {
      // API returns data.content array, not data directly
      const apiTools = externalToolsData.data.content;

      setTools(apiTools);
    } else if (apiError) {
      // Fallback to mock data if API fails
      setTools(
        mockExternalToolConfigs.filter(
          (tool) => tool.ownerId === CURRENT_USER_ID
        )
      );
    } else if (!isLoadingTools) {
      // Fallback to mock data if no data
      setTools(
        mockExternalToolConfigs.filter(
          (tool) => tool.ownerId === CURRENT_USER_ID
        )
      );
    }
  }, [externalToolsData, apiError, isLoadingTools]);

  // Fetch tool logs using existing service
  const {
    data: toolLogsResponse,
    isLoading: isLoadingToolLogs,
    error: toolLogsError,
  } = useToolLogsWithParamsService(
    [tools.length], // dependency for query key
    { retry: 1, staleTime: 5 * 60 * 1000 }, // options
    {
      toolType: "EXTERNAL",
      status: "SUCCESS",
      pageSize: 1000,
      sortBy: "createdAt",
      sortDirection: "desc",
    } // params
  );

  // Calculate token usage from tool logs
  const tokenUsageCalculation = useMemo(() => {
    const toolLogsData = toolLogsResponse?.data?.content || [];
    return calculateTokenUsage(tools, toolLogsData);
  }, [tools, toolLogsResponse]);

  // Extract token usage data
  const {
    totalTokens,
    currentMonthTokens,
    monthlyChartData,
    toolUsageData,
    userToolLogs,
  } = tokenUsageCalculation;

  // Log for debugging
  console.log("Token usage calculation:", {
    totalTokens,
    currentMonthTokens,
    toolLogsCount: userToolLogs.length,
    isLoadingToolLogs,
    toolLogsError,
  });

  // Format token count
  const formatTokenCount = (tokenCount: number) => {
    return new Intl.NumberFormat("vi-VN").format(tokenCount) + " tokens";
  };

  return (
    <div className="bg-white">
      {/* Main Content */}
      <div className="w-full">
        {/* Token Usage Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Card đầu với background image */}
          <div
            className="rounded-lg border border-gray-200 p-6 relative overflow-hidden"
            style={{
              backgroundImage: "url('/images/background/abstract-bg.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="relative z-10">
              <h3 className="text-lg font-calsans text-white mb-2">
                Tổng tokens đã sử dụng
              </h3>
              <p className="text-3xl font-calsans text-white">
                {formatTokenCount(totalTokens)}
              </p>
            </div>
          </div>

          {/* Card thứ 2 - background trắng */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div>
              <h3 className="text-lg font-calsans text-gray-900 mb-2">
                Tokens tháng này
              </h3>
              <p className="text-3xl font-calsans text-gray-900">
                {formatTokenCount(currentMonthTokens)}
              </p>
            </div>
          </div>

          {/* Card thứ 3 - background trắng */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div>
              <h3 className="text-lg font-calsans text-gray-900 mb-2">
                Số API đang hoạt động
              </h3>
              <p className="text-3xl font-calsans text-gray-900">
                {tools.length}
              </p>
            </div>
          </div>
        </div>

        {/* Token Usage Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Monthly Token Usage Line Chart */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-calsans text-gray-900 mb-4">
              Tokens sử dụng theo tháng
            </h2>
            <div className="h-64">
              {isLoadingToolLogs ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="font-questrial text-sm">
                      Đang tải dữ liệu doanh thu...
                    </p>
                  </div>
                </div>
              ) : totalTokens === 0 || monthlyChartData.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="font-questrial text-lg">
                      Chưa có dữ liệu token usage
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      Token usage sẽ hiển thị khi có giao dịch từ tool logs
                    </p>
                  </div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={monthlyChartData}
                    margin={{ left: 0, right: 20, top: 20, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis width={100} />
                    <Tooltip
                      formatter={(value: any) => [
                        new Intl.NumberFormat("vi-VN").format(value) +
                          " tokens",
                        "Token Usage",
                      ]}
                    />
                    <Line
                      type="monotone"
                      dataKey="amount"
                      stroke="#3B82F6"
                      strokeWidth={2}
                      dot={{ fill: "#3B82F6" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Tool Usage Bar Chart */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-calsans text-gray-900 mb-4">
              Token usage theo API
            </h2>
            <div className="h-64">
              {isLoadingToolLogs ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="font-questrial text-sm">
                      Đang tải dữ liệu token usage...
                    </p>
                  </div>
                </div>
              ) : totalTokens === 0 || toolUsageData.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="font-questrial text-lg">
                      Chưa có dữ liệu token usage
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      Token usage sẽ hiển thị khi có giao dịch từ tool logs
                    </p>
                  </div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={toolUsageData}
                    margin={{ left: 0, right: 20, top: 20, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis width={100} />
                    <Tooltip
                      formatter={(value: any) => [
                        new Intl.NumberFormat("vi-VN").format(value) +
                          " tokens",
                        "Token Usage",
                      ]}
                    />
                    <Bar dataKey="amount" fill="#330BA2" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
