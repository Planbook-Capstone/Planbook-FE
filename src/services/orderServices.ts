import {
  createMutationHook,
  createQueryHook,
  updateMutationHook,
  patchMutationHook,
} from "@/hooks/react-query";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

export const useOrderService = createQueryHook("order", API_ENDPOINTS.ORDERS);

export const useCreateOrderService = createMutationHook(
  "order",
  API_ENDPOINTS.ORDERS
);

export const useUpdateOrderService = updateMutationHook(
  "order",
  API_ENDPOINTS.ORDERS
);

export const useUpdateOrderStatus = patchMutationHook(
  "order",
  API_ENDPOINTS.ORDERS
);
