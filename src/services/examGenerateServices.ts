import { EXAM_ENDPOINTS } from "@/constants/apiEndpoints";
import { createSecondaryMutationHook } from "@/hooks/useApiFactory";

/**
 * Exam Generation Service
 * This service handles the generation of exams using the secondary API.
 * It provides a mutation hook for creating new exam generations.
 */
export const useExamGenerationService = createSecondaryMutationHook(
  "examGeneration",
  EXAM_ENDPOINTS.GENERATE_EXAM
);

/**
 * Smart Exam Generation Service
 * This service handles the generation of smart exams using the secondary API.
 * It provides a mutation hook for creating new smart exam generations.
 */
export const useGenerateSmartExamService = createSecondaryMutationHook(
  "generateSmartExam",
  EXAM_ENDPOINTS.GENERATE_SMART_EXAM
);
