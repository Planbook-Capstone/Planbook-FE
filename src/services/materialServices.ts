import {
  createMutationHook,
  createQueryHook,
  createQueryWithPathParamHook,
  createSearchQueryHook,
} from "@/hooks/react-query";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

export const useMaterialervice = createQueryHook(
  "materials",
  API_ENDPOINTS.ACADEMIC_RESOURCE
);

// Using search query hook - automatically refetches when search params change
export const useMaterialSearchService = (tagIds?: string) => {
  const searchParams = tagIds ? { tagIds } : undefined;

  return createSearchQueryHook(
    "materials-search",
    API_ENDPOINTS.ACADEMIC_RESOURCE_SEARCH
  )(searchParams);
};

export const useCreateMaterialService = createMutationHook(
  "materials",
  API_ENDPOINTS.ACADEMIC_RESOURCE_UPLOAD
);
// export const useUpdateBookStatus = patchMutationHook("books", API_ENDPOINTS.BOOKS);
