import { createMutationHook } from "@/hooks/react-query";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

export const useExecuteToolService = createMutationHook(
  "execute-tool",
  API_ENDPOINTS.EXECUTE_TOOL
);

export const useEstimateTokenService = createMutationHook(
  "estimate-token",
  API_ENDPOINTS.ESTIMATE_TOKEN
);
