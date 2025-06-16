import { createMutationHook } from "@/hooks/react-query";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

export const useUserServices = createMutationHook("user", API_ENDPOINTS.AUTH.LOGIN);
export const useLoginGoogleService = createMutationHook("user", API_ENDPOINTS.AUTH.LOGIN_GOOGLE);
