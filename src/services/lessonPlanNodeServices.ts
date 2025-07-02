import { createQueryHook } from "@/hooks/react-query";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

export const useLessonPlanService = createQueryHook(
  "lesson-plan-node",
  API_ENDPOINTS.LESSON_NODES
);
