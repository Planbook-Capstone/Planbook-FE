import {
  createMutationHook,
  createQueryHook,
  createQueryWithPathParamHook,
  patchMutationHook,
} from "@/hooks/react-query";

export const useAcademicYearsService = createQueryHook(
  "academicYears",
  "/academic-years"
);

export const useCreateAcademicYearService = createMutationHook(
  "academicYears",
  "/academic-years"
);
// export const useUpdateBookStatus = patchMutationHook("books", "/book");
// export const useBookTypesService = createQueryHook("bookTypes", "/book");
// export const useBookByIdService = createQueryWithPathParamHook(
//   "bookById",
//   "/book"
// );
