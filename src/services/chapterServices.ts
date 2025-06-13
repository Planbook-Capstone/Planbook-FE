import {
  createMutationHook,
  createQueryHook,
  createQueryWithPathParamHook,
  updateMutationHook,
} from "@/hooks/react-query";

export const useChaptersService = createQueryHook("chapters", "/chapter");
export const useChaptersByBookService = createQueryWithPathParamHook(
  "chaptersByBook",
  "/chapter/by-book"
);
export const useCreateChapterService = createMutationHook(
  "chapters",
  "/chapter"
);
export const useUpdateChapterService = updateMutationHook(
  "chaptersByBook",
  "/chapter"
);
