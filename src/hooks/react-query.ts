/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from "axios";
import {
  useMutation,
  UseMutationResult,
  useQueries,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import api from "@/config/axios";

export const createQueryHook =
  (queryKey: string, url: string) =>
  (
    options?: any,
    params?: any
  ): UseQueryResult<any, AxiosError<{ message: string }>> =>
    useQuery({
      queryKey: [queryKey],
      queryFn: async () => (await api.get(url, { params })).data,
      ...options,
    });

// Hook with dynamic query key - automatically refetches when dependencies change
export const createDynamicQueryHook =
  (baseQueryKey: string, url: string) =>
  (
    dependencies?: any[], // Array of dependencies to include in queryKey
    options?: any,
    params?: any
  ): UseQueryResult<any, AxiosError<{ message: string }>> => {
    const queryKey = dependencies
      ? [baseQueryKey, ...dependencies]
      : [baseQueryKey];

    return useQuery({
      queryKey,
      queryFn: async () => (await api.get(url, { params })).data,
      ...options,
    });
  };

// Hook for search with automatic refetch when search params change
export const createSearchQueryHook =
  (baseQueryKey: string, url: string) =>
  (
    searchParams?: Record<string, any>, // Search parameters object
    options?: any
  ): UseQueryResult<any, AxiosError<{ message: string }>> => {
    // Create queryKey from search params for automatic refetch
    const queryKey = searchParams
      ? [baseQueryKey, searchParams]
      : [baseQueryKey];

    return useQuery({
      queryKey,
      queryFn: async () => (await api.get(url, { params: searchParams })).data,
      enabled: !!searchParams && Object.keys(searchParams).length > 0,
      ...options,
    });
  };

export const createQueryWithPathParamHook =
  (queryKey: string, url: string) =>
  (
    id?: string,
    options?: any
  ): UseQueryResult<any, AxiosError<{ message: string }>> => {
    return useQuery({
      queryKey: id ? [queryKey, id] : [queryKey],
      queryFn: async () => (await api.get(`${url}/${id}`)).data,
      ...options,
    });
  };

export const createMutationHook =
  (queryKey: string, url: string) =>
  (
    id?: string
  ): UseMutationResult<any, AxiosError<{ message: string }>, any> => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (data) => api.post(`${url}${id ? `/${id}` : ""}`, data),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: id ? [queryKey, id] : [queryKey],
        });
      },
    });
  };

export const createMutationUploadFilesHook =
  (queryKey: string, url: string) =>
  (
    id?: string
  ): UseMutationResult<any, AxiosError<{ message: string }>, any> => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (data) =>
        api.post(url, data, {
          headers: { "Content-Type": "multipart/form-data" },
        }),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: id ? [queryKey, id] : [queryKey],
        });
      },
    });
  };

export const updateMutationUploadFilesHook =
  (queryKeys: string[], url: string) =>
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
        api.put(`${url}/${idToUpdate}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        }),
      onSuccess: () => {
        queryKeys.forEach((queryKey) => {
          queryClient.invalidateQueries({
            queryKey: id ? [queryKey, id] : [queryKey],
          });
        });
      },
    });
  };

export const updateMutationHook =
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
        api.put(`${url}/${idToUpdate}`, data),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: id ? [queryKey, id] : [queryKey],
        });
      },
    });
  };

export const deleteMutationHook =
  (queryKey: string, url: string) =>
  (
    id?: string
  ): UseMutationResult<any, AxiosError<{ message: string }>, string> => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (idToDelete: string) => api.delete(`${url}/${idToDelete}`),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: id ? [queryKey, id] : [queryKey],
        });
      },
    });
  };

/**
 * Hook để tạo ra nhiều truy vấn đồng thời.
 * @param queryKeyPrefix: key tiền tố cho react-query
 * @param urlGenerator: function để tạo URL dựa vào item đầu vào
 */
export const createMultiQueryHook = (
  queryKeyPrefix: string,
  urlGenerator: (input: any) => string
) => {
  return (
    inputs: any[]
  ): UseQueryResult<any, AxiosError<{ message: string }>>[] => {
    return useQueries({
      queries: inputs.map((input) => ({
        queryKey: [queryKeyPrefix, input],
        queryFn: async () => (await api.get(urlGenerator(input))).data,
        enabled: !!input,
      })),
    });
  };
};

/**
 * Hook để update 1 field thông qua endpoint có path param và query param
 * @param queryKey react-query key để invalidate
 * @param baseUrl ví dụ: /api/book-type
 */
export const patchMutationHook =
  (queryKey: string, baseUrl: string) =>
  (): UseMutationResult<
    any,
    AxiosError<{ message: string }>,
    {
      id: string;
      field: string;
      queryParams: Record<string, string | number>;
      body?: any;
    }
  > => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async ({
        id,
        field,
        queryParams,
        body,
      }: {
        id: string;
        field: string;
        queryParams: Record<string, string | number>;
        body?: any;
      }) => {
        const searchParams = new URLSearchParams(queryParams as any).toString();
        const fullUrl = `${baseUrl}/${id}/${field}?${searchParams}`; // ✅ chính xác theo yêu cầu
        return await api.patch(fullUrl, body);
      },
      onSuccess: (_data, { id }) => {
        queryClient.invalidateQueries({ queryKey: [queryKey] });
      },
    });
  };
