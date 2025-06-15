import { createMutationHook, createQueryHook } from "@/hooks/react-query";

export const useBookTypesService = createQueryHook("bookTypes", "/book-type");

export const useCreateBookTypeService = createMutationHook(
  "bookTypes",
  "/book-type"
);
// export const useUpdateBookStatus = patchMutationHook("books", "/book");
// export const useBookTypesService = createQueryHook("bookTypes", "/book");
// export const useBookByIdService = createQueryWithPathParamHook(
//   "bookById",
//   "/book"
// );
