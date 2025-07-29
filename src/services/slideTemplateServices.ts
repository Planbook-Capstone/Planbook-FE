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
import { SlideTemplateStatus } from "@/types";

// Slide Template Services

export const useSlideTemplatesService = createQueryHook(
  "slide-templates",
  API_ENDPOINTS.SLIDE_TEMPLATES
);

export const useSlideTemplateByIdService = createQueryWithPathParamHook(
  "slide-template",
  API_ENDPOINTS.SLIDE_TEMPLATES
);

export const useCreateSlideTemplateService = createMutationHook(
  "slide-templates",
  API_ENDPOINTS.SLIDE_TEMPLATES
);

export const useUpdateSlideTemplateService = updateMutationHook(
  "slide-templates",
  API_ENDPOINTS.SLIDE_TEMPLATES
);

export const useDeleteSlideTemplateService = deleteMutationHook(
  "slide-templates",
  API_ENDPOINTS.SLIDE_TEMPLATES
);

export const useSlideTemplateDetailByIdService = createQueryWithPathParamHook(
  "template-details",
  API_ENDPOINTS.SLIDE_DETAILS
);

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

export const useProcessJsonTemplateService = createSecondaryMutationHook(
  "processJsonTemplate",
  API_ENDPOINTS.SLIDE_PROCESS_JSON_TEMPLATE
);
