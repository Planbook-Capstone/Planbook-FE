"use client";

import { EXAM_ENDPOINTS } from "@/constants/apiEndpoints";
import {
  createMutationHook,
  createQueryHook,
  createQueryWithPathParamHook,
  updateMutationHook,
  deleteMutationHook,
  patchMutationHook,
} from "@/hooks/react-query";

/**
 * Types for matrix template configuration
 */
export interface DifficultyLevel {
  id: string;
  name: string;
  label: string;
  color: string;
}

export interface MatrixPart {
  id: string;
  name: string;
  label: string;
  color: string;
  maximum?: number;
  difficultyLevels: DifficultyLevel[];
}

export interface MatrixTemplateConfig {
  id?: string;
  name: string;
  description: string;
  parts: MatrixPart[];
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  status?: "ACTIVE" | "INACTIVE";
}

export interface CreateMatrixTemplateRequest {
  name: string;
  description: string;
  matrixJson: {
    parts: MatrixPart[];
  };
  status?: "ACTIVE" | "INACTIVE";
}

export interface UpdateMatrixTemplateRequest {
  name?: string;
  description?: string;
  matrixJson?: {
    parts: MatrixPart[];
  };
  status?: "ACTIVE" | "INACTIVE";
}

/**
 * Hook for fetching all matrix templates
 */
export const useMatrixTemplatesService = createQueryHook(
  "matrixTemplates",
  EXAM_ENDPOINTS.MATRIX_CONFIGS
);
export const useMatrixTemplateActiveService = createQueryHook(
  "matrixTemplates",
  `${EXAM_ENDPOINTS.MATRIX_CONFIGS}?status=ACTIVE`
);

/**
 * Hook for fetching a specific matrix template by ID
 */
export const useMatrixTemplateByIdService = createQueryWithPathParamHook(
  "matrixTemplate",
  EXAM_ENDPOINTS.MATRIX_CONFIGS
);

/**
 * Hook for creating a new matrix template
 */
export const useCreateMatrixTemplateService = createMutationHook(
  "createMatrixTemplate",
  EXAM_ENDPOINTS.MATRIX_CONFIGS
);

/**
 * Hook for updating an existing matrix template
 */
export const useUpdateMatrixTemplateService = updateMutationHook(
  "matrixTemplates",
  EXAM_ENDPOINTS.MATRIX_CONFIGS
);

/**
 * Hook for deleting a matrix template
 */
export const useDeleteMatrixTemplateService = deleteMutationHook(
  "matrixTemplates",
  EXAM_ENDPOINTS.MATRIX_CONFIGS
);

export const useUpdateMatrixTemplateStatusService = patchMutationHook(
  "matrixTemplates",
  EXAM_ENDPOINTS.MATRIX_CONFIGS
);

/**
 * Utility function to validate matrix template config
 */
export const validateMatrixTemplate = (
  config: MatrixTemplateConfig
): string[] => {
  const errors: string[] = [];

  if (!config.name?.trim()) {
    errors.push("Tên template không được để trống");
  }

  if (!config.parts || config.parts.length === 0) {
    errors.push("Template phải có ít nhất một phần");
  }

  // Check for duplicate part IDs
  const partIds =
    config.parts?.map((part) => part.id?.trim()).filter(Boolean) || [];
  if (partIds.length !== new Set(partIds).size) {
    errors.push("ID của các phần không được trùng lặp");
  }

  config.parts?.forEach((part, index) => {
    if (!part.id?.trim()) {
      errors.push(`Phần ${index + 1}: ID không được để trống`);
    }

    if (!part.name?.trim()) {
      errors.push(`Phần ${index + 1}: Tên không được để trống`);
    }

    if (part.maximum !== undefined && (part.maximum < 0 || !Number.isInteger(part.maximum))) {
      errors.push(`Phần ${index + 1}: Số câu tối đa phải là số nguyên không âm`);
    }

    if (!part.difficultyLevels || part.difficultyLevels.length === 0) {
      errors.push(`Phần ${index + 1}: Phải có ít nhất một mức độ khó`);
    }

    // Check for duplicate difficulty IDs within each part
    const difficultyIds =
      part.difficultyLevels?.map((d) => d.id?.trim()).filter(Boolean) || [];
    if (difficultyIds.length !== new Set(difficultyIds).size) {
      errors.push(
        `Phần ${index + 1}: ID của các mức độ khó không được trùng lặp`
      );
    }

    part.difficultyLevels?.forEach((difficulty, diffIndex) => {
      if (!difficulty.id?.trim()) {
        errors.push(
          `Phần ${index + 1}, Mức độ ${diffIndex + 1}: ID không được để trống`
        );
      }

      if (!difficulty.name?.trim()) {
        errors.push(
          `Phần ${index + 1}, Mức độ ${diffIndex + 1}: Tên không được để trống`
        );
      }
    });
  });

  return errors;
};

/**
 * Utility function to convert matrix data to backend format
 */
export const convertMatrixToBackendFormat = (
  matrixData: { [partId: string]: { [difficultyId: string]: number } },
  config: MatrixTemplateConfig
) => {
  return config.parts.map((part, index) => ({
    part: index + 1,
    objectives: part.difficultyLevels.reduce((acc, difficulty) => {
      const key = difficulty.label || difficulty.name;
      acc[key] = matrixData[part.id]?.[difficulty.id] || 0;
      return acc;
    }, {} as { [key: string]: number }),
  }));
};
