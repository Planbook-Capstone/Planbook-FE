"use client";

import {
  createMutationHook,
  createQueryHook,
  createQueryWithPathParamHook,
  updateMutationHook,
  deleteMutationHook,
} from "@/hooks/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/config/axios";

// Define the base endpoint for exam templates
const EXAM_TEMPLATES_ENDPOINT = "/exam-service/api/exam-templates";

/**
 * Interface for exam template data
 */
export interface ExamTemplateData {
  name: string;
  subject: string;
  grade: number;
  durationMinutes: number;
  totalScore: number;
  gradingConfig?: Record<string, number>;
  contentJson: {
    parts: {
      part: string;
      title: string;
      questions: {
        id: number;
        question: string;
        options: Record<string, string>;
        answer: string;
        illustrationImage?: string;
      }[];
    }[];
  };
}

/**
 * Hook for fetching all exam templates
 */
export const useExamTemplatesService = createQueryHook(
  "examTemplates",
  EXAM_TEMPLATES_ENDPOINT
);

/**
 * Hook for creating a new exam template
 */
export const useCreateExamTemplateService = createMutationHook(
  "createExamTemplate",
  EXAM_TEMPLATES_ENDPOINT
);

/**
 * Hook for fetching a specific exam template by ID
 */
export const useExamTemplateByIdService = createQueryWithPathParamHook(
  "examTemplateById",
  EXAM_TEMPLATES_ENDPOINT
);

/**
 * Hook for updating an existing exam template
 */
export const useUpdateExamTemplateService = updateMutationHook(
  "examTemplate",
  EXAM_TEMPLATES_ENDPOINT
);

/**
 * Hook for deleting an exam template
 */
export const useDeleteExamTemplateService = deleteMutationHook(
  "examTemplate",
  EXAM_TEMPLATES_ENDPOINT
);

/**
 * Hook for cloning an exam template
 */
export const useCloneExamTemplateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (templateId: string) =>
      api.post(`${EXAM_TEMPLATES_ENDPOINT}/${templateId}/clone`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["examTemplates"],
      });
    },
  });
};
