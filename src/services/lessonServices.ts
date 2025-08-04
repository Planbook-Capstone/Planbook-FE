import {
  createMultiQueryHook,
  createMutationHook,
  createQueryHook,
  createQueryWithPathParamHook,
  updateMutationHook,
} from "@/hooks/react-query";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

export const useLessonsService = createQueryHook(
  "lessons",
  API_ENDPOINTS.MASTER_DATA.LESSONS
);
export const useLessonByIdService = createQueryWithPathParamHook(
  "lessonById",
  API_ENDPOINTS.MASTER_DATA.LESSONS
);

export const useCreateLessonService = createMutationHook(
  "lessons",
  API_ENDPOINTS.MASTER_DATA.LESSONS
);
export const useLessonsByChapterService = createQueryWithPathParamHook(
  "lessonsByChapter",
  API_ENDPOINTS.MASTER_DATA.LESSONS_BY_CHAPTER
);
export const useUpdateLessonService = updateMutationHook(
  "lessonsByChapter",
  API_ENDPOINTS.MASTER_DATA.LESSONS
);

export const useLessonsByChaptersService = createMultiQueryHook(
  "lessonsByChapter",
  (chapterId) => `${API_ENDPOINTS.MASTER_DATA.LESSONS_BY_CHAPTER}/${chapterId}`
);

export const useLessonsByIdsService = createMultiQueryHook(
  "lessonById",
  (lessonId) => `${API_ENDPOINTS.MASTER_DATA.LESSONS}/${lessonId}`
);
