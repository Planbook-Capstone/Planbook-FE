import {
  createMutationHook,
  createQueryHook,
  deleteMutationHook,
  patchMutationHook,
  updateMutationHook,
} from "@/hooks/react-query";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

export const useGradesService = createQueryHook("grades", API_ENDPOINTS.MASTER_DATA.GRADES);
export const useCreateGradeService = createMutationHook("grades", API_ENDPOINTS.MASTER_DATA.GRADES);
export const useUpdateGradeService = updateMutationHook("grades", API_ENDPOINTS.MASTER_DATA.GRADES);
export const useDeleteGradeService = deleteMutationHook("grades", API_ENDPOINTS.MASTER_DATA.GRADES);
export const useUpdateGradeStatus = patchMutationHook("grades", API_ENDPOINTS.MASTER_DATA.GRADES);
