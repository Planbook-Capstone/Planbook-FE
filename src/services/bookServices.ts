import { createMutationHook, createQueryHook } from "@/hooks/react-query";

export const useBooksService = createQueryHook("books", "/book");
export const useCreateBookService = createMutationHook("books", "/book");