import { EXAM_GENERATION_ENDPOINTS } from "@/constants/apiEndpoints";
import { createSecondaryMutationHook } from "@/hooks/useApiFactory";

/**
 * Exam Generation Service
 * This service handles the generation of exams using the secondary API.
 * It provides a mutation hook for creating new exam generations.
 */
export const useExamGenerationService = createSecondaryMutationHook(
  "examGeneration",
  EXAM_GENERATION_ENDPOINTS.EXAM_GENERATION
);
