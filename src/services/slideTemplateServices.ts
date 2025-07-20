import {
  createMutationHook,
  createQueryHook,
  createQueryWithPathParamHook,
  updateMutationHook,
  deleteMutationHook,
  patchMutationHook,
} from "@/hooks/react-query";
import { createSecondaryMutationHook } from "@/hooks/useApiFactory";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/config/axios";

// Slide Template Services

// GET /api/slide-templates - Lấy danh sách slide templates
export const useSlideTemplatesService = createQueryHook(
  "slide-templates",
  API_ENDPOINTS.SLIDE_TEMPLATES
);

// GET /api/slide-templates/{id} - Lấy chi tiết slide template theo ID
export const useSlideTemplateByIdService = createQueryWithPathParamHook(
  "slide-template",
  API_ENDPOINTS.SLIDE_TEMPLATES
);

// POST /api/slide-templates - Tạo mới slide template
export const useCreateSlideTemplateService = createMutationHook(
  "slide-templates",
  API_ENDPOINTS.SLIDE_TEMPLATES
);

// PUT /api/slide-templates/{id} - Cập nhật slide template
export const useUpdateSlideTemplateService = updateMutationHook(
  "slide-templates",
  API_ENDPOINTS.SLIDE_TEMPLATES
);

// DELETE /api/slide-templates/{id} - Xóa slide template
export const useDeleteSlideTemplateService = deleteMutationHook(
  "slide-templates",
  API_ENDPOINTS.SLIDE_TEMPLATES
);

// PATCH /api/slide-templates/{id}/status - Thay đổi trạng thái slide template
export const useUpdateSlideTemplateStatusService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: SlideTemplateStatus;
    }) => {
      const response = await api.patch(
        `${API_ENDPOINTS.SLIDE_TEMPLATES}/${id}/status`,
        { status }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["slide-templates"] });
    },
  });
};

// PUT /api/slide-templates/{id}/textBlocks - Cập nhật textBlocks từ slide editor
export const useUpdateSlideTemplateTextBlocksService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      textBlocks,
    }: {
      id: string;
      textBlocks: Record<string, any>;
    }) => {
      const response = await api.put(`${API_ENDPOINTS.SLIDE_TEMPLATES}/${id}`, {
        textBlocks,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["slide-templates"] });
    },
  });
};

// POST /api/v1/slides/process-json-template - Xử lý JSON template
export const useProcessJsonTemplateService = createSecondaryMutationHook(
  "processJsonTemplate",
  API_ENDPOINTS.SLIDE_PROCESS_JSON_TEMPLATE
);

// Types for slide template API
export type SlideTemplateStatus = "ACTIVE" | "INACTIVE" | "DRAFT";

export interface CreateSlideTemplateRequest {
  name: string;
  description?: string;
  textBlocks?: Record<string, any>;
  imageBlocks?: Record<string, string>;
}

export interface UpdateSlideTemplateRequest {
  name?: string;
  description?: string;
  textBlocks?: Record<string, any>;
  imageBlocks?: Record<string, string>;
}

export interface SlideTemplateResponse {
  id: number;
  name: string;
  status: SlideTemplateStatus;
  description?: string;
  textBlocks?: Record<string, any>;
  imageBlocks?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

// Helper types for form handling
export interface TextBlockItem {
  key: string;
  value: any;
}

export interface ImageBlockItem {
  key: string;
  value: string;
}

// Types for process JSON template API
export interface ProcessJsonTemplateRequest {
  lesson_id: string;
  template: Record<string, any>;
  config_prompt: string;
}
