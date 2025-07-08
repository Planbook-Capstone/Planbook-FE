import api from "@/config/axios";
import { PDF_API_ENDPOINTS } from "@/constants/apiEndpoints";
import { createSecondarySearchQueryHook } from "@/hooks/useApiFactory";

export const useRagSearchService = (query?: string) => {
  const searchParams = query ? { query } : undefined;

  return createSecondarySearchQueryHook(
    "rag",
    PDF_API_ENDPOINTS.RAG_QUERY
  )(searchParams);
};

export const useRagService = (query: string) => {
  return api.get(PDF_API_ENDPOINTS.RAG_QUERY, { params: { query } });
};
