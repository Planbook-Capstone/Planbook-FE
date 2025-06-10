import { createMutationHook } from "@/hooks/react-query";

export const useUserServices = createMutationHook("user", "/login");
