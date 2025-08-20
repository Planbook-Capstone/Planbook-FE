/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError, AxiosInstance } from "axios";
import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import api, { apiSecondary } from "@/config/axios";

// Generic factory để tạo React Query hooks cho bất kỳ axios instance nào
export const createApiHooks = (
  axiosInstance: AxiosInstance,
  instanceName: string
) => {
  // Query hook factory
  const createQueryHook =
    (queryKey: string, url: string) =>
    (
      options?: any,
      params?: any
    ): UseQueryResult<any, AxiosError<{ message: string }>> =>
      useQuery({
        queryKey: [`${instanceName}-${queryKey}`],
        queryFn: async () => (await axiosInstance.get(url, { params })).data,
        ...options,
      });

  // Search query hook factory with dynamic query key
  const createSearchQueryHook =
    (baseQueryKey: string, url: string) =>
    (
      searchParams?: Record<string, any>, // Search parameters object
      options?: any
    ): UseQueryResult<any, AxiosError<{ message: string }>> => {
      // Create queryKey from search params for automatic refetch
      const queryKey = searchParams
        ? [`${instanceName}-${baseQueryKey}`, searchParams]
        : [`${instanceName}-${baseQueryKey}`];

      return useQuery({
        queryKey,
        queryFn: async () =>
          (await axiosInstance.get(url, { params: searchParams })).data,
        enabled: !!searchParams && Object.keys(searchParams).length > 0,
        ...options,
      });
    };

  // Query with path param hook factory
  const createQueryWithPathParamHook =
    (queryKey: string, url: string) =>
    (
      id?: string,
      options?: any
    ): UseQueryResult<any, AxiosError<{ message: string }>> => {
      return useQuery({
        queryKey: id
          ? [`${instanceName}-${queryKey}`, id]
          : [`${instanceName}-${queryKey}`],
        queryFn: async () => (await axiosInstance.get(`${url}/${id}`)).data,
        ...options,
      });
    };

  // Dynamic query hook factory with custom dependencies
  const createDynamicQueryHook =
    (baseQueryKey: string, url: string) =>
    (
      dependencies?: any[], // Array of dependencies to include in queryKey
      options?: any,
      params?: any
    ): UseQueryResult<any, AxiosError<{ message: string }>> => {
      const queryKey = dependencies
        ? [`${instanceName}-${baseQueryKey}`, ...dependencies]
        : [`${instanceName}-${baseQueryKey}`];

      return useQuery({
        queryKey,
        queryFn: async () => (await axiosInstance.get(url, { params })).data,
        ...options,
      });
    };

  // Mutation hook factory
  const createMutationHook =
    (queryKey: string, url: string) =>
    (
      id?: string
    ): UseMutationResult<any, AxiosError<{ message: string }>, any> => {
      const queryClient = useQueryClient();

      return useMutation({
        mutationFn: (data) =>
          axiosInstance.post(`${url}${id ? `/${id}` : ""}`, data),
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: id
              ? [`${instanceName}-${queryKey}`, id]
              : [`${instanceName}-${queryKey}`],
          });
        },
      });
    };

  // Upload files mutation hook factory
  const createMutationUploadFilesHook =
    (queryKey: string, url: string) =>
    (
      id?: string
    ): UseMutationResult<any, AxiosError<{ message: string }>, any> => {
      const queryClient = useQueryClient();

      return useMutation({
        mutationFn: (data) =>
          axiosInstance.post(url, data, {
            headers: { "Content-Type": "multipart/form-data" },
          }),
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: id
              ? [`${instanceName}-${queryKey}`, id]
              : [`${instanceName}-${queryKey}`],
          });
        },
      });
    };

  // Update mutation hook factory
  const updateMutationHook =
    (queryKey: string, url: string) =>
    (
      id?: string
    ): UseMutationResult<
      any,
      AxiosError<{ message: string }>,
      { id: string; data: any }
    > => {
      const queryClient = useQueryClient();

      return useMutation({
        mutationFn: ({ id: idToUpdate, data }: { id: string; data: any }) =>
          axiosInstance.put(`${url}/${idToUpdate}`, data),
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: id
              ? [`${instanceName}-${queryKey}`, id]
              : [`${instanceName}-${queryKey}`],
          });
        },
      });
    };

  // Delete mutation hook factory
  const deleteMutationHook =
    (queryKey: string, url: string) =>
    (
      id?: string
    ): UseMutationResult<any, AxiosError<{ message: string }>, string> => {
      const queryClient = useQueryClient();

      return useMutation({
        mutationFn: (idToDelete: string) =>
          axiosInstance.delete(`${url}/${idToDelete}`),
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: id
              ? [`${instanceName}-${queryKey}`, id]
              : [`${instanceName}-${queryKey}`],
          });
        },
      });
    };

  // Return all factory functions
  return {
    createQueryHook,
    createQueryWithPathParamHook,
    createSearchQueryHook,
    createDynamicQueryHook,
    createMutationHook,
    createMutationUploadFilesHook,
    updateMutationHook,
    deleteMutationHook,
    instanceName,
  };
};

// Pre-configured factories cho từng API
export const mainApiHooks = createApiHooks(api, "main");
export const secondaryApiHooks = createApiHooks(apiSecondary, "secondary");


// Export individual hook creators for convenience
export const {
  createQueryHook: createMainQueryHook,
  createQueryWithPathParamHook: createMainQueryWithPathParamHook,
  createMutationHook: createMainMutationHook,
  createMutationUploadFilesHook: createMainMutationUploadFilesHook,
  updateMutationHook: updateMainMutationHook,
  deleteMutationHook: deleteMainMutationHook,
} = mainApiHooks;

export const {
  createQueryHook: createSecondaryQueryHook,
  createQueryWithPathParamHook: createSecondaryQueryWithPathParamHook,
  createMutationHook: createSecondaryMutationHook,
  createMutationUploadFilesHook: createSecondaryMutationUploadFilesHook,
  updateMutationHook: updateSecondaryMutationHook,
  deleteMutationHook: deleteSecondaryMutationHook,
  createSearchQueryHook: createSecondarySearchQueryHook,
  createDynamicQueryHook: createSecondaryDynamicQueryHook,
} = secondaryApiHooks;


