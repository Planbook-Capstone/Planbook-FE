import {
  createMutationHook,
  createQueryHook,
  createQueryWithPathParamHook,
  updateMutationHook,
} from "@/hooks/react-query";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

export const useFormsService = createQueryHook("forms", API_ENDPOINTS.FORMS);
export const useFormByIdService = createQueryWithPathParamHook(
  "formById",
  API_ENDPOINTS.FORMS
);
export const useCreateFormService = createMutationHook(
  "forms",
  API_ENDPOINTS.FORMS
);
export const useUpdateFormService = updateMutationHook(
  "forms",
  API_ENDPOINTS.FORMS
);

//GET ALL LESSON PLAN
export const useLessonPlanService = createQueryHook(
  "lesson-plan",
  API_ENDPOINTS.LESSON_PLANS.BASE
);

//GET LESSON PLAN BY ID
export const useLessonPlanByIdService = createQueryWithPathParamHook(
  "lesson-plan",
  API_ENDPOINTS.LESSON_PLANS.BASE
);

//CREATE LESSON PLAN
export const useCreateLessonPlanService = createMutationHook(
  "lesson-plan",
  API_ENDPOINTS.LESSON_PLANS.BASE
);
