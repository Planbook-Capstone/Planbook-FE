
import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import { createSecondaryMutationHook } from "@/hooks/useApiFactory";


export const useLessonPlanGenerationService = createSecondaryMutationHook(
  "lessonPlanGeneration",
  API_ENDPOINTS.LESSON_PLAN_GENERATION
);

