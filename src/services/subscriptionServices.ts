import {
  createMutationHook,
  createQueryHook,
  updateMutationHook,
  patchMutationHook,
  deleteMutationHook,
} from "@/hooks/react-query";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

export const useSubscriptionsService = createQueryHook(
  "subscriptions", 
  API_ENDPOINTS.SUBSCRIPTIONS
);

export const useCreateSubscriptionService = createMutationHook(
  "subscriptions",
  API_ENDPOINTS.SUBSCRIPTIONS
);

export const useUpdateSubscriptionService = updateMutationHook(
  "subscriptions",
  API_ENDPOINTS.SUBSCRIPTIONS
);

export const useUpdateSubscriptionStatus = patchMutationHook(
  "subscriptions", 
  API_ENDPOINTS.SUBSCRIPTIONS
);

export const useDeleteSubscriptionService = deleteMutationHook(
  "subscriptions",
  API_ENDPOINTS.SUBSCRIPTIONS
);
