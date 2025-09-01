import { createQueryHook, createDynamicQueryHook } from "@/hooks/react-query";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

export const useWalletService = createQueryHook("wallet", API_ENDPOINTS.WALLET);
export const useWalletTransactionsService = createDynamicQueryHook(
  "wallet-transactions",
  API_ENDPOINTS.WALLET_TRANSACTIONS
);
