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

// Upload textbook
export const useUploadTextBookService = createSecondaryMutationHook(
  "textbooks",
  PDF_API_ENDPOINTS.UPLOAD_TEXTBOOK
);

// Quick textbook analysis
export const useQuickTextBookAnalysisService = createSecondaryMutationHook(
  "textbooks",
  PDF_API_ENDPOINTS.QUICK_TEXTBOOK_ANALYSIS
);

// Delete textbook
export const useDeleteTextBookService = createSecondaryMutationHook(
  "textbooks",
  PDF_API_ENDPOINTS.DELETE_TEXTBOOK("") // Will be replaced with actual ID
);

// // Search textbooks
// export const useSearchTextBooksService = createSecondaryQueryHook(
//   "search-textbooks",
//   PDF_API_ENDPOINTS.SEARCH_TEXTBOOKS
// );

// // Filter by subject
// export const useFilterBySubjectService = createSecondaryQueryHook(
//   "filter-subject",
//   PDF_API_ENDPOINTS.FILTER_BY_SUBJECT
// );

// // Filter by grade
// export const useFilterByGradeService = createSecondaryQueryHook(
//   "filter-grade",
//   PDF_API_ENDPOINTS.FILTER_BY_GRADE
// );

// // Extract content
// export const useExtractContentService = createSecondaryMutationHook(
//   "extract-content",
//   PDF_API_ENDPOINTS.EXTRACT_CONTENT
// );

// // Get chapters
// export const useGetChaptersService = createSecondaryQueryHook(
//   "chapters",
//   PDF_API_ENDPOINTS.GET_CHAPTERS("") // Will be replaced with actual bookId
// );

// // Get processing status
// export const useGetProcessingStatusService = createSecondaryQueryHook(
//   "processing-status",
//   PDF_API_ENDPOINTS.GET_PROCESSING_STATUS("") // Will be replaced with actual jobId
// );


// ===== LEGACY SERVICES (Main API) =====

// export const useCreateBookService = createMutationHook(
//   "books",
//   API_ENDPOINTS.BOOKS
// );
// export const useUpdateBookStatus = patchMutationHook(
//   "books",
//   API_ENDPOINTS.BOOKS
// );
