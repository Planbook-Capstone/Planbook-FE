import {
  createMutationHook,
  createQueryHook,
  createQueryWithPathParamHook,
  patchMutationHook,
  updateMutationHook,
} from "@/hooks/react-query";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

export const useSubjectsService = createQueryHook("subjects", API_ENDPOINTS.SUBJECTS);
export const useSubjectsByGradeService = createQueryWithPathParamHook(
  "subjectsByGrade",
  API_ENDPOINTS.SUBJECTS_BY_GRADE
);
export const useCreateSubjectService = createMutationHook(
  "subjects",
  API_ENDPOINTS.SUBJECTS
);
export const useUpdateSubjectService = updateMutationHook(
  "subjects",
  API_ENDPOINTS.SUBJECTS
);

export const useUpdateSubjectStatus = patchMutationHook("subjects", API_ENDPOINTS.SUBJECTS);
