import {
  createMutationHook,
  createQueryHook,
  updateMutationHook,
  patchMutationHook,
  createQueryWithPathParamHook
} from "@/hooks/react-query";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

export const useBookTypesService = createQueryHook("bookTypes", API_ENDPOINTS.BOOK_TYPES);

export const useCreateBookTypeService = createMutationHook(
  "bookTypes",
  API_ENDPOINTS.BOOK_TYPES
);

export const useUpdateBookTypeService = updateMutationHook(
  "bookTypes",
  API_ENDPOINTS.BOOK_TYPES
);

export const useUpdateBookTypeStatus = patchMutationHook("bookTypes", API_ENDPOINTS.BOOK_TYPES);

export const useBookTypeByIdService = createQueryWithPathParamHook("bookTypeById", API_ENDPOINTS.BOOK_TYPES);
