import {
  createMutationHook,
  createQueryHook,
  createQueryWithPathParamHook,
  patchMutationHook,
} from "@/hooks/react-query";
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
