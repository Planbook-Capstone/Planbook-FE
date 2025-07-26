import { createMutationHook, createQueryHook } from "@/hooks/react-query";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

export const useUserServices = createMutationHook(
  "user",
  API_ENDPOINTS.AUTH.LOGIN
);
export const useRegisterService = createMutationHook(
  "user",
  API_ENDPOINTS.AUTH.REGISTER
);
export const useLoginGoogleService = createMutationHook(
  "user",
  API_ENDPOINTS.AUTH.LOGIN_GOOGLE
);

//API FOR USER MANAGEMENT
export const useAllUsersService = createQueryHook(
  "all-users",
  API_ENDPOINTS.USERS_MANAGEMENT.BASE
);
export const useCreateUserService = createMutationHook(
  "all-users",
  API_ENDPOINTS.USERS_MANAGEMENT.BASE
);
