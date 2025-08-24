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
import { EXAM_ENDPOINTS } from "@/constants/apiEndpoints";

// Define the base endpoint for exam instances
const EXAM_INSTANCES_ENDPOINT = EXAM_ENDPOINTS.EXAM_INSTANCES;

/**
 * Interface for exam instance creation data
 */
export interface CreateExamInstanceData {
  templateId: string;
  description: string;
  startAt: string; // ISO datetime string
  endAt: string; // ISO datetime string
}

/**
 * Interface for exam instance response data
 */
export interface ExamInstanceData {
  id: string;
  templateId: string;
  templateName: string;
  code: string;
  description: string;
  startAt: string;
  endAt: string;
  excelUrl: string | null;
  createdAt: string;
  durationMinutes: number;
  subject: string;
  grade: number;
  status:
    | "DRAFT"
    | "SCHEDULED"
    | "ACTIVE"
    | "PAUSED"
    | "COMPLETED"
    | "CANCELLED";
  statusChangedAt: string | null;
  statusChangeReason: string | null;
}

/**
 * Interface for status change data
 */
export interface ChangeStatusData {
  status: ExamInstanceData["status"];
  reason?: string;
}

/**
 * Interface for updating instance basic info
 */
export interface UpdateInstanceData {
  templateName: string;
  description: string;
}

/**
 * Interface for result details
 */
export interface ResultDetail {
  questionId: string;
  questionNumber: number;
  partName?: string;
  question?: string;
  studentAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

/**
 * Interface for submission data
 */
export interface SubmissionData {
  id: string;
  examInstanceId: string;
  studentName: string;
  score: number;
  correctCount: number;
  totalQuestions: number;
  maxScore: number;
  submittedAt: string;
  answersJson?: {
    answers: any[];
  };
  resultDetails?: ResultDetail[];
}

/**
 * Hook for fetching all exam instances
 */
export const useExamInstancesService = createQueryHook(
  "examInstances",
  EXAM_INSTANCES_ENDPOINT
);

/**
 * Hook for creating a new exam instance
 */
export const useCreateExamInstanceService = createMutationHook(
  "createExamInstance",
  EXAM_INSTANCES_ENDPOINT
);

/**
 * Hook for fetching a specific exam instance by ID
 */
export const useExamInstanceByIdService = createQueryWithPathParamHook(
  "examInstanceById",
  EXAM_INSTANCES_ENDPOINT
);

/**
 * Hook for updating an existing exam instance
 */
export const useUpdateExamInstanceService = updateMutationHook(
  "examInstance",
  EXAM_INSTANCES_ENDPOINT
);

/**
 * Hook for updating exam instance basic info (templateName, description)
 */
export const useUpdateExamInstanceInfoService = (instanceId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateInstanceData) =>
      api.put(`${EXAM_INSTANCES_ENDPOINT}/${instanceId}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["examInstanceById", instanceId],
      });
      queryClient.invalidateQueries({
        queryKey: ["examInstances"],
      });
    },
  });
};

/**
 * Hook for deleting an exam instance
 */
export const useDeleteExamInstanceService = deleteMutationHook(
  "examInstance",
  EXAM_INSTANCES_ENDPOINT
);

/**
 * Hook for changing exam instance status
 */
export const useChangeExamInstanceStatusService = (instanceId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ChangeStatusData) =>
      api.put(`${EXAM_INSTANCES_ENDPOINT}/${instanceId}/status`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["examInstanceById", instanceId],
      });
      queryClient.invalidateQueries({
        queryKey: ["examInstances"],
      });
    },
  });
};

/**
 * Hook for fetching exam instance submissions
 */
export const useExamInstanceSubmissionsService = (instanceId: string) => {
  return createQueryHook(
    `examInstanceSubmissions-${instanceId}`,
    `${EXAM_INSTANCES_ENDPOINT}/${instanceId}/submissions`
  )();
};

/**
 * Hook for downloading Excel report
 */
export const useDownloadExcelReportService = (instanceId: string) => {
  return useMutation({
    mutationFn: () =>
      api.get(`${EXAM_INSTANCES_ENDPOINT}/${instanceId}/excel`, {
        responseType: "blob",
      }),
  });
};

export const useSubmissionById = createQueryWithPathParamHook(
  "student",
  `${EXAM_INSTANCES_ENDPOINT}/submission`
);
