import { createMutationHook } from "@/hooks/react-query";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import { uploadFileToSupabase } from "./materialServices";
import { useMutation } from "@tanstack/react-query";

export const useExecuteToolService = createMutationHook(
  "execute-tool",
  API_ENDPOINTS.EXECUTE_TOOL
);

export const useEstimateTokenService = createMutationHook(
  "estimate-token",
  API_ENDPOINTS.ESTIMATE_TOKEN
);

export const useUploadAndExecuteToolService = () => {
    const executeToolMutation  = useExecuteToolService();

  return useMutation({
    mutationFn: async ({
      file,
      toolId,
      bookId = 1,
      lessonId = 1,
      academicYearId = 1,
      bucketName = "planbook",
    }: {
      file: File;
      toolId: string;
      bookId?: number;
      lessonId?: number;
      academicYearId?: number;
      bucketName?: string;
    }) => {
      // Step 1: Upload file to Supabase
      const supabaseUrl = await uploadFileToSupabase(file, bucketName);

      // Step 2: Execute tool with the uploaded file URL
      const payload = {
        toolId,
        toolType: "EXTERNAL",
        book_id: bookId,
        lesson_id: lessonId,
        academicYearId,
        input: {
          link: supabaseUrl,
        },
      };

      const result = await executeToolMutation.mutateAsync(payload);

      return {
        supabaseUrl,
        toolResult: result,
      };
    },
  });
};
