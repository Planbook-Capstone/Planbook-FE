import { API_ENDPOINTS, PDF_API_ENDPOINTS } from "@/constants/apiEndpoints";
import {
  createSecondaryMutationHook,
  createSecondaryQueryHook,
} from "@/hooks/useApiFactory";

// ===== TEXTBOOK SERVICES USING PDF API (Secondary API - Port 8000) =====

// Get all textbooks
export const useTextBooksService = createSecondaryQueryHook(
  "textbooks",
  PDF_API_ENDPOINTS.GET_ALL_TEXTBOOKS
);

// Get textbook by ID
export const useTextBookByIdService = createSecondaryQueryHook(
  "textbook",
  PDF_API_ENDPOINTS.GET_TEXTBOOK_BY_ID("") // Will be replaced with actual ID
);


// Quick textbook analysis
export const useQuickTextBookAnalysisService = createSecondaryMutationHook(
  "textbooks",
  PDF_API_ENDPOINTS.QUICK_TEXTBOOK_ANALYSIS
);

