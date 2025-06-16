import {
  createMultiQueryHook,
  createMutationHook,
  createQueryHook,
  createQueryWithPathParamHook,
  updateMutationHook,
} from "@/hooks/react-query";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

export const useLessonsService = createQueryHook("lessons", API_ENDPOINTS.LESSONS);
export const useCreateLessonService = createMutationHook("lessons", API_ENDPOINTS.LESSONS);
export const useLessonsByChapterService = createQueryWithPathParamHook(
  "lessonsByChapter",
  API_ENDPOINTS.LESSONS_BY_CHAPTER
);
export const useUpdateLessonService = updateMutationHook(
  "lessonsByChapter",
  API_ENDPOINTS.LESSONS
);

export const useLessonsByChaptersService = createMultiQueryHook(
  "lessonsByChapter",
  (chapterId) => `${API_ENDPOINTS.LESSONS_BY_CHAPTER}/${chapterId}`
);
