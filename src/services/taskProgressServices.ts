import { PDF_API_ENDPOINTS } from "@/constants/apiEndpoints";
import { createSecondaryQueryHook } from "@/hooks/useApiFactory";

// Get all textbooks
export const useTextBooksService = createSecondaryQueryHook(
  "tasks-progress",
  PDF_API_ENDPOINTS.GET_ALL_TEXTBOOKS
);
