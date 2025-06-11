import { createMutationHook, createQueryHook } from "@/hooks/react-query";

export const useGradesService = createQueryHook("grades", "/grade");
export const useCreateGradeService = createMutationHook("grades", "/grade");