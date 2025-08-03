import { createQueryHook, createDynamicQueryHook } from "@/hooks/react-query";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

// Original service without params
export const useToolLogsService = createQueryHook(
  "tool-logs",
  API_ENDPOINTS.TOOL_LOG
);

// Service with pagination params
export const useToolLogsWithParamsService = createDynamicQueryHook(
  "tool-logs-paginated",
  API_ENDPOINTS.TOOL_LOG
);
