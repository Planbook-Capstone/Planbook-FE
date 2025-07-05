import { createMutationHook, createQueryHook } from "@/hooks/react-query";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

export const useMaterialervice = createQueryHook(
  "materials",
  API_ENDPOINTS.ACADEMIC_RESOURCE
);

export const useCreateMaterialService = createMutationHook(
  "materials",
  API_ENDPOINTS.ACADEMIC_RESOURCE_UPLOAD
);
// export const useUpdateBookStatus = patchMutationHook("books", API_ENDPOINTS.BOOKS);
