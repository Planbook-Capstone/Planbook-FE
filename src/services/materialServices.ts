import {
  createMutationHook,
  createQueryHook,
  createSearchQueryHook,
  createQueryWithPathParamHook,
  updateMutationHook,
  createDynamicQueryHook,
  deleteMutationHook,
} from "@/hooks/react-query";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import api from "@/config/axios";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import { supabase } from "@/config/supabaseClient";

export const useMaterialervice = createQueryHook(
  "materials",
  API_ENDPOINTS.ACADEMIC_RESOURCE
);

// Using search query hook - automatically refetches when search params change
export const useMaterialSearchService = (tagIds?: string) => {
  const searchParams = tagIds ? { tagIds } : undefined;

  return createSearchQueryHook(
    "materials-search",
    API_ENDPOINTS.ACADEMIC_RESOURCE_SEARCH
  )(searchParams);
};

// Service with pagination params
export const useMaterialsExternalWithParamsService = createDynamicQueryHook(
  "materials",
  API_ENDPOINTS.ACADEMIC_RESOURCE_SEARCH
);

export const useCreateMaterialService = createMutationHook(
  "materials",
  API_ENDPOINTS.ACADEMIC_RESOURCE_UPLOAD
);

export const useCreateMaterialInternalService = createMutationHook(
  "private-materials",
  API_ENDPOINTS.ACADEMIC_RESOURSE_INTERNAL
);

export const useMaterialInternalService = createQueryHook(
  "private-materials",
  API_ENDPOINTS.ACADEMIC_RESOURSE_INTERNAL
);

// Infinite query hook for lazy loading materials
export const useMaterialInternalInfiniteService = () => {
  return useInfiniteQuery({
    queryKey: ["private-materials-infinite"],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await api.get(API_ENDPOINTS.ACADEMIC_RESOURSE_INTERNAL, {
        params: {
          page: pageParam,
          size: 20, // Load 20 items per page
        },
      });
      return response.data;
    },
    getNextPageParam: (lastPage, allPages) => {
      // Check if last page has content
      const content = lastPage?.data?.content || lastPage?.data;
      if (!content || content.length === 0) {
        return undefined; // No more pages
      }

      // If we got less than page size, no more pages
      if (content.length < 20) {
        return undefined;
      }

      return allPages.length; // Next page number
    },
    initialPageParam: 0,
  });
};

// Get material by ID
export const useMaterialByIdService = createQueryWithPathParamHook(
  "material-detail",
  API_ENDPOINTS.ACADEMIC_RESOURCE
);

// Update material service
export const useUpdateMaterialService = updateMutationHook(
  "materials",
  API_ENDPOINTS.ACADEMIC_RESOURCE
);

// export const useUpdateBookStatus = patchMutationHook("books", API_ENDPOINTS.BOOKS);
export const useMaterialsWithParamsService = createDynamicQueryHook(
  "materials",
  API_ENDPOINTS.ACADEMIC_RESOURSE_INTERNAL
);

export const useDeleteMaterialService = deleteMutationHook(
  "materials",
  API_ENDPOINTS.ACADEMIC_RESOURCE
);

// ===== SUPABASE UPLOAD SERVICE =====

/**
 * Upload file to Supabase Storage
 * @param file - File to upload
 * @param bucketName - Supabase bucket name (default: 'planbook')
 * @returns Promise with file URL
 */
export const uploadFileToSupabase = async (
  file: File,
  bucketName: string = "planbook"
): Promise<string> => {
  try {
    // Generate unique filename with timestamp
    const timestamp = Date.now();
    const fileExtension = file.name.split(".").pop();
    const fileName = `uploads/${timestamp}_${Math.random()
      .toString(36)
      .substring(7)}.${fileExtension}`;

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Supabase upload error:", error);
      throw new Error(`Upload failed: ${error.message}`);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName);

    if (!urlData?.publicUrl) {
      throw new Error("Failed to get public URL");
    }

    return urlData.publicUrl;
  } catch (error) {
    console.error("Error uploading to Supabase:", error);
    throw error;
  }
};

/**
 * Hook for uploading file to Supabase and executing tool
 */
