import {
  createMutationHook,
  createQueryHook,
  createQueryWithPathParamHook,
  patchMutationHook,
  updateMutationHook,
} from "@/hooks/react-query";

export const useSubjectsService = createQueryHook("subjects", "/subject");
export const useSubjectsByGradeService = createQueryWithPathParamHook(
  "subjectsByGrade",
  "/subject/by-grade"
);
export const useCreateSubjectService = createMutationHook(
  "subjects",
  "/subject"
);
export const useUpdateSubjectService = updateMutationHook(
  "subjects",
  "/subject"
);

export const useUpdateSubjectStatus = patchMutationHook("subjects", "/subject");
