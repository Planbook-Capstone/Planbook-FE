import dayjs, { Dayjs } from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import { TimeGranularity } from "@/components/ui/time-granularity-selector";

dayjs.extend(weekOfYear);

export interface DateRange {
  start: Dayjs;
  end: Dayjs;
}

export interface FilteredData {
  totalTokens: number;
  currentPeriodTokens: number;
  previousPeriodTokens: number;
  monthlyChartData: Array<{ month: string; amount: number }>;
  toolUsageData: Array<{ name: string; amount: number; id: string }>;
  userToolLogs: any[];
}

export interface DashboardFilters {
  dateRange: DateRange;
  selectedToolIds: string[];
  timeGranularity: TimeGranularity;
}

// Filter tool logs by date range
export const filterLogsByDateRange = (logs: any[], dateRange: DateRange) => {
  return logs.filter((log) => {
    const logDate = dayjs(log.createdAt);
    return (
      logDate.isAfter(dateRange.start.startOf("day")) &&
      logDate.isBefore(dateRange.end.endOf("day"))
    );
  });
};

// Filter tool logs by selected tools
export const filterLogsByTools = (logs: any[], selectedToolIds: string[]) => {
  if (selectedToolIds.length === 0) return logs;
  return logs.filter((log) => selectedToolIds.includes(log.toolId));
};

// Group data by time granularity
export const groupDataByTime = (
  logs: any[],
  granularity: TimeGranularity,
  dateRange: DateRange
): Array<{ period: string; amount: number; date: Dayjs }> => {
  const grouped: Record<string, { amount: number; date: Dayjs }> = {};

  // Initialize all periods in range with 0
  let current = dateRange.start.clone();
  while (current.isBefore(dateRange.end) || current.isSame(dateRange.end)) {
    let key: string;
    let nextPeriod: Dayjs;

    switch (granularity) {
      case "day":
        key = current.format("DD/MM");
        nextPeriod = current.add(1, "day");
        break;
      case "week":
        key = `Tuần ${current.week()}`;
        nextPeriod = current.add(1, "week");
        break;
      case "month":
      default:
        key = current.format("MM/YYYY");
        nextPeriod = current.add(1, "month");
        break;
    }

    grouped[key] = { amount: 0, date: current.clone() };
    current = nextPeriod;
  }

  // Add actual data
  logs.forEach((log) => {
    const logDate = dayjs(log.createdAt);
    let key: string;

    switch (granularity) {
      case "day":
        key = logDate.format("DD/MM");
        break;
      case "week":
        key = `Tuần ${logDate.week()}`;
        break;
      case "month":
      default:
        key = logDate.format("MM/YYYY");
        break;
    }

    if (grouped[key]) {
      grouped[key].amount += log.tokenUsed || 0;
    }
  });

  return Object.entries(grouped)
    .map(([period, data]) => ({
      period,
      amount: data.amount,
      date: data.date,
    }))
    .sort((a, b) => a.date.valueOf() - b.date.valueOf());
};

// Calculate previous period for comparison
export const calculatePreviousPeriod = (dateRange: DateRange): DateRange => {
  const duration = dateRange.end.diff(dateRange.start, "day");
  return {
    start: dateRange.start.subtract(duration + 1, "day"),
    end: dateRange.start.subtract(1, "day"),
  };
};

// Calculate tool usage data with filtering
export const calculateToolUsage = (
  tools: any[],
  logs: any[],
  selectedToolIds: string[]
) => {
  const toolUsageMap: Record<
    string,
    { name: string; amount: number; id: string }
  > = {};

  // Initialize with selected tools or all tools
  const relevantTools =
    selectedToolIds.length > 0
      ? tools.filter((tool) => selectedToolIds.includes(tool.id))
      : tools;

  relevantTools.forEach((tool) => {
    toolUsageMap[tool.id] = {
      name: tool.name,
      amount: 0,
      id: tool.id,
    };
  });

  // Add usage data
  logs.forEach((log) => {
    if (toolUsageMap[log.toolId]) {
      toolUsageMap[log.toolId].amount += log.tokenUsed || 0;
    }
  });

  return Object.values(toolUsageMap)
    .filter((tool) => tool.amount > 0) // Only show tools with usage
    .sort((a, b) => b.amount - a.amount); // Sort by usage desc
};

// Apply all filters to calculate dashboard data
export const applyDashboardFilters = (
  tools: any[],
  allLogs: any[],
  filters: DashboardFilters
): FilteredData => {
  // Filter logs by date range and tools
  const filteredLogs = filterLogsByTools(
    filterLogsByDateRange(allLogs, filters.dateRange),
    filters.selectedToolIds
  );

  // Calculate current period data
  const currentPeriodTokens = filteredLogs.reduce(
    (sum, log) => sum + (log.tokenUsed || 0),
    0
  );

  // Calculate previous period for comparison
  const previousPeriod = calculatePreviousPeriod(filters.dateRange);
  const previousPeriodLogs = filterLogsByTools(
    filterLogsByDateRange(allLogs, previousPeriod),
    filters.selectedToolIds
  );
  const previousPeriodTokens = previousPeriodLogs.reduce(
    (sum, log) => sum + (log.tokenUsed || 0),
    0
  );

  // Group data by time granularity
  const timeGroupedData = groupDataByTime(
    filteredLogs,
    filters.timeGranularity,
    filters.dateRange
  );
  const monthlyChartData = timeGroupedData.map((item) => ({
    month: item.period,
    amount: item.amount,
  }));

  // Calculate tool usage
  const toolUsageData = calculateToolUsage(
    tools,
    filteredLogs,
    filters.selectedToolIds
  );

  return {
    totalTokens: currentPeriodTokens, // For current period
    currentPeriodTokens,
    previousPeriodTokens,
    monthlyChartData,
    toolUsageData,
    userToolLogs: filteredLogs,
  };
};
