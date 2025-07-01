import { EXAM_ENDPOINTS } from "@/constants/apiEndpoints";
import { createSecondaryMutationHook } from "@/hooks/useApiFactory";

export const useExamImportService = createSecondaryMutationHook(
  "examImport",
  EXAM_ENDPOINTS.EXAM_IMPORT
);
