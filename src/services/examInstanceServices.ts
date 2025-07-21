"use client";

import {
  createMutationHook,
  createQueryHook,
  createQueryWithPathParamHook,
  updateMutationHook,
  deleteMutationHook,
} from "@/hooks/react-query";
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
  status: "DRAFT" | "ACTIVE" | "COMPLETED" | "CANCELLED";
  statusChangedAt: string | null;
  statusChangeReason: string | null;
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
 * Hook for deleting an exam instance
 */
export const useDeleteExamInstanceService = deleteMutationHook(
  "examInstance",
  EXAM_INSTANCES_ENDPOINT
);
