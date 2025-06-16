import {
  createMutationHook,
  createQueryHook,
  deleteMutationHook,
  updateMutationHook,
} from "@/hooks/react-query";

export const useFormsService = createQueryHook("forms", "/form");
export const useCreateFormService = createMutationHook("forms", "/form");
export const useUpdateFormService = updateMutationHook("forms", "/form");
