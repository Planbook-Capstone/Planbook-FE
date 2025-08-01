import { createQueryHook } from "@/hooks/react-query";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

export const useToolLogsService = createQueryHook(
  "tool-logs",
  API_ENDPOINTS.TOOL_LOG
);
