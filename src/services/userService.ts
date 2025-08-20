import {
  createDynamicQueryHook,
  createMutationHook,
  createQueryHook,
  createQueryWithPathParamHook,
  createMultiQueryHook,
  patchMutationHook,
  updateMutationHook,
} from "@/hooks/react-query";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/config/axios";

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
export const useVerifyUserService = (token?: string) => {
  return useQuery({
    queryKey: ["verify-user", token],
    queryFn: async () => {
      const response = await api.get(API_ENDPOINTS.AUTH.VERIFY, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined
      });
      return response.data;
    },
    enabled: !!token,
    retry: false,
  });
};

export const useForgotPasswordService = createMutationHook(
  "forgot-password",
  API_ENDPOINTS.AUTH.FORGOT_PASSWORD
);

export const useResetPasswordService = (token?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { password: string }) => {
      const response = await api.patch(API_ENDPOINTS.AUTH.RESET_PASSWORD, data, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reset-password"] });
    },
  });
};

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

export const useUserByIdService = createQueryWithPathParamHook(
  "user-by-id",
  API_ENDPOINTS.USERS_MANAGEMENT.BASE
);

export const useUsersByIdsService = createMultiQueryHook(
  "user-by-id",
  (userId) => `${API_ENDPOINTS.USERS_MANAGEMENT.BASE}/${userId}`
);
