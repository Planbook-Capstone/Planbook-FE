import { createQueryHook, createQueryWithPathParamHook, updateMutationHook } from "@/hooks/react-query";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

export const useToolResultsService = createQueryHook(
  "tool-results",
  API_ENDPOINTS.TOOL_RESULTS
);
export const useToolResultByIdService = createQueryWithPathParamHook(
  "tool-results",
  API_ENDPOINTS.TOOL_RESULTS
);

export const useUpdateToolResultService = updateMutationHook(
  "tool-results",
  API_ENDPOINTS.TOOL_RESULTS
);
