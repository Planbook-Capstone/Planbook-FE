import {
  createMutationHook,
  createQueryHook,
  createQueryWithPathParamHook,
  patchMutationHook,
} from "@/hooks/react-query";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

export const useBooksService = createQueryHook("books", API_ENDPOINTS.BOOKS);
export const useBookByIdService = createQueryWithPathParamHook(
  "bookById",
  API_ENDPOINTS.BOOKS
);
export const useCreateBookService = createMutationHook("books", API_ENDPOINTS.BOOKS);
export const useUpdateBookStatus = patchMutationHook("books", API_ENDPOINTS.BOOKS);
