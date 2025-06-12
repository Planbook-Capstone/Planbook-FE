import {
  createMutationHook,
  createQueryHook,
  createQueryWithPathParamHook,
} from "@/hooks/react-query";

export const useLessonsService = createQueryHook("lessons", "/lesson");
export const useCreateLessonService = createMutationHook("lessons", "/lesson");
export const useLessonsByChapterService = createQueryWithPathParamHook(
  "lessonsByChapter",
  "/lesson/by-chapter"
);
