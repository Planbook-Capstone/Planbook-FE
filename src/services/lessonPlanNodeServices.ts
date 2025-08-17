import { createMutationHook, createQueryHook, updateMutationHook } from "@/hooks/react-query";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

export const useCreateLessonPlanNodeService = createMutationHook(
  "lesson-plan-node",
  API_ENDPOINTS.LESSON_PLANS.NODES
);

export const useLessonPlanNodeTreeService = (id: string) =>
  createQueryHook(
    `lesson-plan-node-tree-${id}`,
    API_ENDPOINTS.LESSON_PLANS.TREE(id)
  );

export const useLessonPlanNodeChildrenService = (id: string) =>
  createQueryHook(
    `lesson-plan-node-chidren-${id}`,
    API_ENDPOINTS.LESSON_PLANS.CHIDREN(id)
  );
export const useLessonPlanAllNodeService = (id: string) =>
  createQueryHook(
    `lesson-plan-node-tree-${id}`,
    API_ENDPOINTS.LESSON_PLANS.ALL_NODES(id)
  );

export const useUpdateLessonPlanNodeService = updateMutationHook(
  "lesson-plan-node",
  API_ENDPOINTS.LESSON_PLANS.NODES
);
