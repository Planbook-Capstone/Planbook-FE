import {
  createDynamicQueryHook,
  createQueryHook,
  createQueryWithPathParamHook,
  deleteMutationHook,
  patchMutationHook,
  updateMutationHook,
  createMutationHook,
} from "@/hooks/react-query";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

export const useToolResultsService = createQueryHook(
  "tool-results",
  API_ENDPOINTS.TOOL_RESULTS
);
export const useToolResultByIdService = createQueryWithPathParamHook(
  "tool-results",
  API_ENDPOINTS.TOOL_RESULTS
);

export const useToolResultsWithParamsService = createDynamicQueryHook(
  "tool-results-paginated",
  API_ENDPOINTS.TOOL_RESULTS
);

export const useUpdateToolResultService = updateMutationHook(
  "tool-results",
  API_ENDPOINTS.TOOL_RESULTS
);

export const useDeleteToolResultService = deleteMutationHook(
  "tool-results",
  API_ENDPOINTS.TOOL_RESULTS
);

export const useUpdateToolResultStatusService = patchMutationHook(
  "tool-results",
  API_ENDPOINTS.TOOL_RESULTS
);

export const useCreateToolResultService = createMutationHook(
  "tool-results",
  API_ENDPOINTS.TOOL_RESULTS
);
