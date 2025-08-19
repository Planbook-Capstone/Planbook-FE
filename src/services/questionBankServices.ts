import {
  createSearchQueryHook,
  createMutationHook,
  updateMutationHook,
  deleteMutationHook,
  createQueryHook,
  createDynamicQueryHook,
} from "@/hooks/react-query";
import { EXAM_ENDPOINTS } from "@/constants/apiEndpoints";

/**
 * Interface for question bank filter parameters
 */
export interface QuestionBankFilterParams {
  lessonId?: number;
  questionTypes?: string[]; // PART_I, PART_II, PART_III
  difficultyLevels?: string[]; // KNOWLEDGE, COMPREHENSION, APPLICATION, ANALYSIS
  page?: number;
  size?: number;
}

/**
 * Interface for question content based on question type
 */
export interface QuestionContent {
  image?: string;
  question: string;
  // For PART_I (Multiple choice)
  options?: Record<string, string>;
  answer?: string;
  // For PART_II (True/False) - statements with text and answer
  statements?: Record<string, { text: string; answer: boolean }>;
  // For PART_II (True/False) - legacy format with separate answers
  answers?: Record<string, boolean>;
  // For PART_III (Short answer)
  keywords?: string[];
}

/**
 * Interface for question bank item
 */
export interface QuestionBankItem {
  id: number;
  lessonId?: number; // For backward compatibility
  lessonIds?: number[]; // For multiple lessons support
  questionType: "PART_I" | "PART_II" | "PART_III";
  questionTypeDescription: string;
  difficultyLevel: "KNOWLEDGE" | "COMPREHENSION" | "APPLICATION" | "ANALYSIS";
  difficultyLevelDescription: string;
  questionContent: QuestionContent;
  explanation: string;
  referenceSource?: string;
  isActive: boolean;
  createdBy: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Interface for question bank response
 */
export interface QuestionBankResponse {
  statusCode: number;
  message: string;
  data: QuestionBankItem[];
}

/**
 * Hook for filtering question banks
 * Uses search query hook to automatically refetch when filter params change
 */
export const useQuestionBankFilterService = (
  filterParams?: QuestionBankFilterParams
) => {
  // Convert arrays to comma-separated strings for API
  const searchParams = filterParams
    ? {
        ...filterParams,
        questionTypes: filterParams.questionTypes?.join(","),
        difficultyLevels: filterParams.difficultyLevels?.join(","),
      }
    : {};

  return createSearchQueryHook("questionBanks", EXAM_ENDPOINTS.QUESTION_BANKS)(
    searchParams,
    {
      enabled: true, // Always enable the query
    }
  );
};

/**
 * Hook for getting all question banks
 */
export const useQuestionBanksService = createQueryHook(
  "questionBanks",
  EXAM_ENDPOINTS.QUESTION_BANKS
);

/**
 * Hook for creating a new question bank
 */
export const useCreateQuestionBankService = createMutationHook(
  "questionBanks",
  EXAM_ENDPOINTS.QUESTION_BANKS
);

/**
 * Hook for updating an existing question bank
 */
export const useUpdateQuestionBankService = updateMutationHook(
  "questionBanks",
  EXAM_ENDPOINTS.QUESTION_BANKS
);

/**
 * Hook for deleting a question bank
 */
export const useDeleteQuestionBankService = deleteMutationHook(
  "questionBanks",
  EXAM_ENDPOINTS.QUESTION_BANKS
);

export const useQuestionBanksWithParamsService = createDynamicQueryHook(
  "questionBanks",
  EXAM_ENDPOINTS.QUESTION_BANKS
);

export const useShuffleExamService = createMutationHook(
  "questionBanks",
  EXAM_ENDPOINTS.EXAM_GENERATOR
);
