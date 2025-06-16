import {
  createMutationHook,
  createQueryHook,
  createQueryWithPathParamHook,
  patchMutationHook,
} from "@/hooks/react-query";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

export const useAcademicYearsService = createQueryHook(
  "academicYears",
  API_ENDPOINTS.ACADEMIC_YEARS
);

export const useCreateAcademicYearService = createMutationHook(
  "academicYears",
  API_ENDPOINTS.ACADEMIC_YEARS
);
// export const useUpdateBookStatus = patchMutationHook("books", "/book");
// export const useBookTypesService = createQueryHook("bookTypes", "/book");
// export const useBookByIdService = createQueryWithPathParamHook(
//   "bookById",
//   "/book"
// );
