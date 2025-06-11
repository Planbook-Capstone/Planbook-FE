import { createMutationHook, createQueryHook, createQueryWithPathParamHook } from "@/hooks/react-query";

export const useSubjectsService = createQueryHook("subjects", "/subject");
export const useSubjectsByGradeService = createQueryWithPathParamHook("subjectsByGrade", "/subject/by-grade");
export const useCreateSubjectService = createMutationHook("subjects", "/subject");