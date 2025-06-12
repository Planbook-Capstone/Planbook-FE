import { createMutationHook, createQueryHook, createQueryWithPathParamHook } from "@/hooks/react-query";

export const useChaptersService = createQueryHook("chapters", "/chapter");
export const useCreateChapterService = createMutationHook(
  "chapters",
  "/chapter"
);
export const useChaptersByBookService = createQueryWithPathParamHook("chaptersByBook", "/chapter/by-book");