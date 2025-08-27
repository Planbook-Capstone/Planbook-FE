import { ToolLog } from "@/types";

// Interface for token usage data
export interface TokenUsageData {
  toolId: string;
  month: string;
  tokenCount: number;
}

// Interface for chart data
export interface ChartData {
  month: string;
  amount: number;
  formattedAmount: string;
}

export interface ToolUsageData {
  name: string;
  amount: number;
  formattedAmount: string;
}

// Interface for calculation result
export interface TokenUsageCalculationResult {
  totalTokens: number;
  currentMonthTokens: number;
  monthlyChartData: ChartData[];
  toolUsageData: ToolUsageData[];
  userToolLogs: ToolLog[];
}

/**
 * Calculate token usage from tool logs
 * @param tools - Array of tools with id and name
 * @param toolLogs - Array of tool logs
 * @returns Token usage calculation result
 */
export const calculateTokenUsage = (
  tools: Array<{ id: string; name: string }>,
  toolLogs: ToolLog[]
): TokenUsageCalculationResult => {
  const userToolIds = tools.map((tool) => tool.id);

  // Filter logs for user's tools only
  const userToolLogs = toolLogs.filter(
    (log) =>
      userToolIds.includes(log.toolId) &&
      log.status === "SUCCESS" &&
      log.toolType === "EXTERNAL"
  );

  // Calculate token usage by month and tool
  const tokensByMonth: Record<string, number> = {};
  const tokensByTool: Record<string, number> = {};
  let totalTokens = 0;

  userToolLogs.forEach((log) => {
    const tool = tools.find((t) => t.id === log.toolId);
    if (!tool) return;

    // Get token count from log (API returns 'tokenUsed' field)
    const logTokens = log.tokenUsed || 0;

    // Group by month (YYYY-MM format)
    const month = log.createdAt.substring(0, 7);
    tokensByMonth[month] = (tokensByMonth[month] || 0) + logTokens;

    // Group by tool
    tokensByTool[tool.name] = (tokensByTool[tool.name] || 0) + logTokens;

    totalTokens += logTokens;
  });

  // Format data for charts
  const monthlyChartData: ChartData[] = Object.entries(tokensByMonth)
    .map(([month, amount]) => ({
      month: month.replace("2025-", "T"),
      amount,
      formattedAmount:
        new Intl.NumberFormat("vi-VN").format(amount) + " tokens",
    }))
    .sort((a, b) => a.month.localeCompare(b.month));

  const toolUsageData: ToolUsageData[] = Object.entries(tokensByTool).map(
    ([name, amount]) => ({
      name,
      amount,
      formattedAmount:
        new Intl.NumberFormat("vi-VN").format(amount) + " tokens",
    })
  );

  // Current month token usage
  const currentMonth = new Date().toISOString().substring(0, 7);
  const currentMonthTokens = tokensByMonth[currentMonth] || 0;

  return {
    totalTokens,
    currentMonthTokens,
    monthlyChartData,
    toolUsageData,
    userToolLogs,
  };
};

/**
 * Format token count for display
 * @param tokenCount - Number of tokens
 * @returns Formatted string
 */
export const formatTokenCount = (tokenCount: number): string => {
  return new Intl.NumberFormat("vi-VN").format(tokenCount) + " tokens";
};

/**
 * Format token count with compact notation
 * @param tokenCount - Number of tokens
 * @returns Formatted string with compact notation
 */
export const formatTokenCountCompact = (tokenCount: number): string => {
  return (
    new Intl.NumberFormat("vi-VN", {
      notation: "compact",
    }).format(tokenCount) + " tokens"
  );
};
