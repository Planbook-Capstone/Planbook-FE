import { createSecondaryQueryWithPathParamHook } from "@/hooks/useApiFactory";

export const useTaskStatusService = createSecondaryQueryWithPathParamHook(
  "progressStatus",
  "/tasks/status"
);
