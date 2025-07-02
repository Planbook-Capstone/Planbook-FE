import { createMutationHook, createQueryHook } from "@/hooks/react-query";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

export const useLessonPlanNodeService = createMutationHook(
  "lesson-plan-node",
  API_ENDPOINTS.LESSON_NODES
);
