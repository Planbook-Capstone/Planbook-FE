import {
  createMutationHook,
  createQueryHook,
  deleteMutationHook,
  updateMutationHook,
} from "@/hooks/react-query";

export const useGradesService = createQueryHook("grades", "/grade");
export const useCreateGradeService = createMutationHook("grades", "/grade");
export const useUpdateGradeService = updateMutationHook("grades", "/grade");
export const useDeleteGradeService = deleteMutationHook("grades", "/grade");
