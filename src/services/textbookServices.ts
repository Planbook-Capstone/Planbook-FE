import {  PDF_API_ENDPOINTS } from "@/constants/apiEndpoints";
import {
  createSecondaryDynamicQueryHook,
  createSecondaryMutationHook,
  createSecondaryQueryHook,
  deleteSecondaryMutationHook,
} from "@/hooks/useApiFactory";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiSecondary } from "@/config/axios";


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

// Update textbook - Custom hook for PUT without ID in path
export const useUpdateTextBookService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) =>
      apiSecondary.put(PDF_API_ENDPOINTS.BASE, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["secondary-textbooks"],
      });
    },
  });
};

// Get task result by ID with step context
export const useTaskResultService = (taskId: string, currentStep?: number) => {
  return useQuery({
    queryKey:
      currentStep !== undefined
        ? ["secondary-task-result", taskId, currentStep]
        : ["secondary-task-result", taskId],
    queryFn: async () =>
      (await apiSecondary.get(PDF_API_ENDPOINTS.TASKS_RESULT(taskId))).data,
    enabled: false, // Disable auto-fetch, will be triggered manually
  });
};

export const useGetAllGuides = createSecondaryQueryHook(
  "guides",
  PDF_API_ENDPOINTS.GUIDES
);

export const useDeletePdf = deleteSecondaryMutationHook(
  "guides",
  PDF_API_ENDPOINTS.BASE
);

// Delete PDF with query parameter
export const useDeletePdfWithQuery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: string | { lesson_id: string; book_id: string }) => {
      let url = `${PDF_API_ENDPOINTS.BASE}`;

      if (typeof params === 'string') {
        // Backward compatibility: if string is passed, treat as book_id
        url += `?book_id=${params}`;
      } else {
        // New format: object with lesson_id and book_id
        url += `?lesson_id=${params.lesson_id}&book_id=${params.book_id}`;
      }

      const response = await apiSecondary.delete(url);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch guides
      queryClient.invalidateQueries({
        queryKey: ["secondary-guides"],
      });
    },
  });
};

export const useTextbookByLessonIdService = createSecondaryDynamicQueryHook(
  "textbook",
  PDF_API_ENDPOINTS.LESSON
);
