import {
  createMutationHook,
  createQueryHook,
  createQueryWithPathParamHook,
  patchMutationHook,
} from "@/hooks/react-query";

export const useBooksService = createQueryHook("books", "/book");
export const useBookByIdService = createQueryWithPathParamHook(
  "bookById",
  "/book"
);
export const useCreateBookService = createMutationHook("books", "/book");
export const useUpdateBookStatus = patchMutationHook("books", "/book");
