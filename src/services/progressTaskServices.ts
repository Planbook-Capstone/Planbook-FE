import { createSecondaryQueryWithPathParamHook } from "@/hooks/useApiFactory";

export const useTaskStatusService = (taskId: string, options?: any) => {
  return createSecondaryQueryWithPathParamHook(
    "progressStatus",
    "/tasks/status"
  )(taskId, {
    refetchInterval: 5000, // Fetch lại mỗi 5 giây
    refetchIntervalInBackground: true, // Tiếp tục fetch khi tab không active
    enabled: !!taskId, // Chỉ fetch khi có taskId
    ...options, // Override với options được truyền vào
  });
};
