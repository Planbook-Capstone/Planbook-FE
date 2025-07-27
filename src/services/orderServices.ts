import {
  createMutationHook,
  createQueryHook,
  updateMutationHook,
  patchMutationHook,
  createSearchQueryHook,
  createQueryWithPathParamHook,
} from "@/hooks/react-query";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

export const useOrderService = createQueryHook("order", API_ENDPOINTS.ORDERS);

export const useCreateOrderService = createMutationHook(
  "order",
  API_ENDPOINTS.ORDERS
);

export const useOrderByUserIdService = (userId?: string) => {
  const searchParams = userId ? { userId } : undefined;

  return createSearchQueryHook(
    "orderByUserId",
    API_ENDPOINTS.ORDERS
  )(searchParams);
};

export const useUpdateOrderService = updateMutationHook(
  "orderByUserId",
  API_ENDPOINTS.ORDERS
);

export const useUpdateOrderStatus = patchMutationHook(
  "order",
  API_ENDPOINTS.ORDERS
);

export const useOrderDetailService = createQueryWithPathParamHook(
  "order-detail",
  API_ENDPOINTS.ORDERS
);
// export const useOrderDetailService = (orderId: string) => {
//   return createQueryHook(
//     `order-detail-${orderId}`,
//     `${API_ENDPOINTS.ORDERS}/${orderId}`
//   )();
// };
