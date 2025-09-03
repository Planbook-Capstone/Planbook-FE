"use client";

import React, { useMemo } from "react";
import { message } from "antd";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ExternalToolsTable from "@/components/organisms/external-tools-table";
import TokenUsageDashboard from "@/components/organisms/token-usage-dashboard";
import { useExternalToolsService } from "@/services/externalToolsServices";
import { useToolLogsWithParamsService } from "@/services/toolLogServices";
import { calculateTokenUsage } from "@/utils/tokenUsageCalculation";

export default function AdminExternalToolsPage() {
  // Fetch external tools
  const {
    data: externalToolsData,
    isLoading: isLoadingTools,
    error: apiError,
    refetch: refetchTools,
  } = useExternalToolsService(
    {
      retry: 1,
      staleTime: 0,
    },
    {
      offset: 1,
      pageSize: 100,
      sortBy: "createdAt",
      sortDirection: "desc",
    }
  );

  // Extract tools data
  const tools = useMemo(() => {
    return externalToolsData?.data?.content || [];
  }, [externalToolsData]);

  // Fetch tool logs for token usage calculation
  const { data: toolLogsResponse, isLoading: isLoadingToolLogs } =
    useToolLogsWithParamsService(
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
    const toolsForCalculation = tools.map((tool: any) => ({
      id: tool.id,
      name: tool.name,
    }));
    return calculateTokenUsage(toolsForCalculation, toolLogsData);
  }, [tools, toolLogsResponse]);

  // Handle status change
  const handleStatusChange = (_toolId: string, _newStatus: string) => {
    // Refetch tools data to update the table
    refetchTools();
    toast.success("Cập nhật trạng thái thành công");
  };

  // Handle view details
  const handleViewDetails = (tool: any) => {
    console.log("Viewing details for tool:", tool);
  };

  // Show error message if API fails
  React.useEffect(() => {
    if (apiError) {
      message.error("Không thể tải danh sách công cụ bên thứ 3");
    }
  }, [apiError]);

  const tabs = [
    {
      value: "dashboard",
      label: "Báo cáo",
      content: (
        <div className="py-4 md:py-6">
          <TokenUsageDashboard
            tokenUsageData={tokenUsageCalculation}
            tools={tools}
            allLogs={toolLogsResponse?.data?.content || []}
            loading={isLoadingToolLogs}
          />
        </div>
      ),
    },
    {
      value: "tools",
      label: `Danh sách công cụ (${tools.length})`,
      content: (
        <div className="py-4 md:py-6">
          <ExternalToolsTable
            tools={tools}
            loading={isLoadingTools}
            groupByOwner={true} // Group by owner for admin view
            onViewDetails={handleViewDetails}
            onStatusChange={handleStatusChange}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white">
      {/* Tabs */}
      <div className="px-4 md:px-6">
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList>
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="font-calsans"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {tabs.map((tab) => (
            <TabsContent key={tab.value} value={tab.value}>
              {tab.content}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
