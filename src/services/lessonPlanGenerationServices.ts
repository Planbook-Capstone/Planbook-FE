import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import { createSecondaryMutationHook } from "@/hooks/useApiFactory";

export const useLessonPlanGenerationService = createSecondaryMutationHook(
  "lessonPlanGeneration",
  API_ENDPOINTS.LESSON_PLAN_GENERATION
);
export const useUploadDocxToOnlineService = createSecondaryMutationHook(
  "lessonPlanGeneration",
  API_ENDPOINTS.UPLOAD_DOCX_TO_ONLINE
);
