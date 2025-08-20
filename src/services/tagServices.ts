import { createMutationHook, createQueryHook, deleteMutationHook, updateMutationHook } from "@/hooks/react-query";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

export const useTagService = createQueryHook("tags", API_ENDPOINTS.TAGS);

export const useCreateTagService = createMutationHook(
  "tags",
  API_ENDPOINTS.TAGS
);

export const useUpdateTagService = updateMutationHook(
  "tags",
  API_ENDPOINTS.TAGS
);
// export const useUpdateBookStatus = patchMutationHook("books", API_ENDPOINTS.BOOKS);
export const useDeleteTagService = deleteMutationHook(
  "tags",
  API_ENDPOINTS.TAGS
);
