import {
  createMutationHook,
  createQueryHook,
  createQueryWithPathParamHook,
  updateMutationHook,
  deleteMutationHook,
} from "@/hooks/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/config/axios";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

// External Tools Services

// GET /api/external-tools - Lấy danh sách cấu hình công cụ bên ngoài
export const useExternalToolsService = createQueryHook(
  "external-tools",
  API_ENDPOINTS.EXTERNAL_TOOLS
);

// GET /api/external-tools/{id} - Lấy chi tiết cấu hình công cụ theo ID
export const useExternalToolWithParmsService = createQueryWithPathParamHook(
  "external-tool",
  API_ENDPOINTS.EXTERNAL_TOOLS
);

// POST /api/external-tools - Tạo cấu hình công cụ bên thứ ba
export const useCreateExternalToolService = createMutationHook(
  "external-tools",
  API_ENDPOINTS.EXTERNAL_TOOLS
);

// PUT /api/external-tools/{id} - Cập nhật cấu hình công cụ
export const useUpdateExternalToolService = updateMutationHook(
  "external-tools",
  API_ENDPOINTS.EXTERNAL_TOOLS
);

// DELETE /api/external-tools/{id} - Xóa cấu hình công cụ
export const useDeleteExternalToolService = deleteMutationHook(
  "external-tools",
  API_ENDPOINTS.EXTERNAL_TOOLS
);

// PATCH /api/external-tools/{id}/status - Thay đổi trạng thái công cụ
export const useUpdateExternalToolStatusService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await api.patch(
        `${API_ENDPOINTS.EXTERNAL_TOOLS}/${id}/status?status=${status}`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["external-tools"] });
    },
  });
};
