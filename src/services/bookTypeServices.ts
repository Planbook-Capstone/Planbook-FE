import {
  createMutationHook,
  createQueryHook,
  updateMutationHook,
  patchMutationHook
} from "@/hooks/react-query";

export const useBookTypesService = createQueryHook("bookTypes", "/book-type");

export const useCreateBookTypeService = createMutationHook(
  "bookTypes",
  "/book-type"
);

export const useUpdateBookTypeService = updateMutationHook(
  "bookTypes",
  "/book-type"
);

export const useUpdateBookTypeStatus = patchMutationHook("bookTypes", "/book-type");
