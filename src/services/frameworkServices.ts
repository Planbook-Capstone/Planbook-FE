import { LESSON_FRAMEWORK_ENDPOINTS } from "@/constants/apiEndpoints";
import { createSecondaryMutationHook } from "@/hooks/useApiFactory";

// Upload lesson plan framework
export const useLessonPlanFrameworkService = createSecondaryMutationHook(
  "framework",
  LESSON_FRAMEWORK_ENDPOINTS.LESSON_PLAN_FRAMEWORK
);
