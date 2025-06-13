/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from "axios";
import {
  useMutation,
  UseMutationResult,
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

