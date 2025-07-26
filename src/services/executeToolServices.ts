import { createMutationHook } from "@/hooks/react-query";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

export const useExecuteToolService = createMutationHook(
  "execute-tool",
  API_ENDPOINTS.EXECUTE_TOOL
);
