import {
  createMutationHook,
  createQueryHook,
  createQueryWithPathParamHook,
  updateMutationHook,
} from "@/hooks/react-query";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

export const useChaptersService = createQueryHook("chapters", API_ENDPOINTS.CHAPTERS);
export const useChaptersByBookService = createQueryWithPathParamHook(
  "chaptersByBook",
  API_ENDPOINTS.CHAPTERS_BY_BOOK
);
export const useCreateChapterService = createMutationHook(
  "chapters",
  API_ENDPOINTS.CHAPTERS
);
export const useUpdateChapterService = updateMutationHook(
  "chaptersByBook",
  API_ENDPOINTS.CHAPTERS
);
