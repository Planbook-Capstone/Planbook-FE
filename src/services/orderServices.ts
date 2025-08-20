import {
  createMutationHook,
  createQueryHook,
  updateMutationHook,
  patchMutationHook,
  createSearchQueryHook,
  createQueryWithPathParamHook,
  createDynamicQueryHook,
} from "@/hooks/react-query";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import { OrderFilterParams } from "@/types/order";
import { useMutation, useQueryClient, UseMutationResult } from "@tanstack/react-query";
import { AxiosError } from "axios";
import api from "@/config/axios";

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

export const useOrdersFilterService = (filterParams?: OrderFilterParams) => {
  // Only include defined parameters in the search params
  const searchParams = filterParams
    ? Object.fromEntries(
        Object.entries(filterParams).filter(([_, value]) => value !== undefined)
      )
    : undefined;

  return createSearchQueryHook("orders-filter", API_ENDPOINTS.ORDERS)(
    searchParams,
    {
      enabled: true, // Always enable the query
    }
  );
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
// Service with pagination params
export const useOrdersWithParamsService = createDynamicQueryHook(
  "order",
  API_ENDPOINTS.ORDERS
);

export const useCancelPaymentService = (): UseMutationResult<
  any,
  AxiosError<{ message: string }>,
  { orderId: string; data?: any }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, data }: { orderId: string; data?: any }) =>
      api.patch(`${API_ENDPOINTS.CANCEL_PAYMENT}/${orderId}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cancel-payment"] });
      queryClient.invalidateQueries({ queryKey: ["order"] });
      queryClient.invalidateQueries({ queryKey: ["orders-filter"] });
    },
  });
};
