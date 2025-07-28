import {
  createMutationHook,
  createQueryHook,
  updateMutationHook,
  patchMutationHook,
  createSearchQueryHook,
  createQueryWithPathParamHook,
} from "@/hooks/react-query";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";


export const useWalletService = createQueryHook(
  "wallet",
  API_ENDPOINTS.WALLET
);
