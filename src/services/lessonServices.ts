import {
  createMutationHook,
  createQueryHook,
  createQueryWithPathParamHook,
  updateMutationHook,
} from "@/hooks/react-query";

export const useLessonsService = createQueryHook("lessons", "/lesson");
export const useCreateLessonService = createMutationHook("lessons", "/lesson");
export const useLessonsByChapterService = createQueryWithPathParamHook(
  "lessonsByChapter",
  "/lesson/by-chapter"
);
export const useUpdateLessonService = updateMutationHook(
  "lessons",
  "/lesson"
);