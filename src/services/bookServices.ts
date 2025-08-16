import {
  createMutationHook,
  createQueryHook,
  createQueryWithPathParamHook,
  patchMutationHook,
} from "@/hooks/react-query";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { AxiosError } from "axios";
import api from "@/config/axios";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

export const useBooksService = createQueryHook("books", API_ENDPOINTS.MASTER_DATA.BOOKS);
export const useBooksBySubjectService = createQueryWithPathParamHook(
  "booksBySubject",
  API_ENDPOINTS.MASTER_DATA.BOOKS_BY_SUBJECT
);
export const useBookByIdService = createQueryWithPathParamHook(
  "bookById",
  API_ENDPOINTS.MASTER_DATA.BOOKS
);
export const useCreateBookService = createMutationHook("books", API_ENDPOINTS.MASTER_DATA.BOOKS);
export const useUpdateBookStatus = patchMutationHook("books", API_ENDPOINTS.MASTER_DATA.BOOKS);

/**
 * Hook để lấy sách theo subject ID với filter status
 * @param subjectId - ID của subject (path parameter)
 * @param status - Status để filter (query parameter): "ACTIVE" | "INACTIVE"
 * @param options - Các options khác cho useQuery
 */
export const useBookActiveBySubjectService = (
  subjectId?: string,
  status?: "ACTIVE" | "INACTIVE",
  options?: any
): UseQueryResult<any, AxiosError<{ message: string }>> => {
  // Tạo queryKey bao gồm cả subjectId và status để tự động refetch khi thay đổi
  const queryKey = ["bookActiveBySubject", subjectId, status];

  return useQuery({
    queryKey,
    queryFn: async () => {
      const params = status ? { status } : {};
      const response = await api.get(
        `${API_ENDPOINTS.MASTER_DATA.BOOKS_BY_SUBJECT}/${subjectId}`,
        { params }
      );
      return response.data;
    },
    enabled: !!subjectId, // Chỉ fetch khi có subjectId
    ...options,
  });
};

