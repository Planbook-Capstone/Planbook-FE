import { createDynamicQueryHook, createMutationHook, createQueryHook, patchMutationHook, updateMutationHook } from "@/hooks/react-query";
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

export const useForgotPasswordService = createMutationHook(
  "forgot-password",
  API_ENDPOINTS.AUTH.FORGOT_PASSWORD
);

//API FOR USER MANAGEMENT
export const useAllUsersService = createDynamicQueryHook(
  "all-users",
  API_ENDPOINTS.USERS_MANAGEMENT.BASE
);
export const useCreateUserService = createMutationHook(
  "all-users",
  API_ENDPOINTS.USERS_MANAGEMENT.BASE
);

export const useUpdateUserStatusService = patchMutationHook(
  "all-users",
  API_ENDPOINTS.USERS_MANAGEMENT.BASE
);

export const useUpdateProfileService = updateMutationHook(
  "user-profile",
  API_ENDPOINTS.USERS_MANAGEMENT.BASE
);

