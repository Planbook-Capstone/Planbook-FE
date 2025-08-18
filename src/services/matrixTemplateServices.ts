"use client";

import { EXAM_ENDPOINTS } from "@/constants/apiEndpoints";
import {
  createMutationHook,
  createQueryHook,
  createQueryWithPathParamHook,
  updateMutationHook,
  deleteMutationHook,
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
  parts: MatrixPart[];
}

export interface UpdateMatrixTemplateRequest {
  name?: string;
  description?: string;
  parts?: MatrixPart[];
  status?: "ACTIVE" | "INACTIVE";
}

/**
 * Hook for fetching all matrix templates
 */
export const useMatrixTemplatesService = createQueryHook(
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

/**
 * Default matrix template configurations
 */
export const DEFAULT_MATRIX_TEMPLATES: MatrixTemplateConfig[] = [
  {
    id: "default-3-parts",
    name: "Ma trận 3 phần chuẩn",
    description:
      "Ma trận đề thi chuẩn với 3 phần: Trắc nghiệm, Đúng/Sai, Tự luận",
    parts: [
      {
        id: "part1",
        name: "Phần 1",
        label: "Trắc nghiệm",
        color: "bg-amber-50",
        difficultyLevels: [
          { id: "nb", name: "NB", label: "Nhận biết", color: "text-amber-700" },
          {
            id: "th",
            name: "TH",
            label: "Thông hiểu",
            color: "text-amber-700",
          },
          { id: "vd", name: "VD", label: "Vận dụng", color: "text-amber-700" },
        ],
      },
      {
        id: "part2",
        name: "Phần 2",
        label: "Đúng/Sai",
        color: "bg-green-50",
        difficultyLevels: [
          { id: "nb", name: "NB", label: "Nhận biết", color: "text-green-700" },
          {
            id: "th",
            name: "TH",
            label: "Thông hiểu",
            color: "text-green-700",
          },
          { id: "vd", name: "VD", label: "Vận dụng", color: "text-green-700" },
        ],
      },
      {
        id: "part3",
        name: "Phần 3",
        label: "Tự luận",
        color: "bg-sky-50",
        difficultyLevels: [
          { id: "nb", name: "NB", label: "Nhận biết", color: "text-sky-700" },
          { id: "th", name: "TH", label: "Thông hiểu", color: "text-sky-700" },
          { id: "vd", name: "VD", label: "Vận dụng", color: "text-sky-700" },
        ],
      },
    ],
    status: "ACTIVE",
  },
  {
    id: "simple-2-parts",
    name: "Ma trận 2 phần đơn giản",
    description: "Ma trận đề thi đơn giản với 2 phần: Trắc nghiệm và Tự luận",
    parts: [
      {
        id: "part1",
        name: "Phần 1",
        label: "Trắc nghiệm",
        color: "bg-blue-50",
        difficultyLevels: [
          { id: "easy", name: "Dễ", label: "Dễ", color: "text-blue-700" },
          {
            id: "medium",
            name: "TB",
            label: "Trung bình",
            color: "text-blue-700",
          },
          { id: "hard", name: "Khó", label: "Khó", color: "text-blue-700" },
        ],
      },
      {
        id: "part2",
        name: "Phần 2",
        label: "Tự luận",
        color: "bg-purple-50",
        difficultyLevels: [
          { id: "easy", name: "Dễ", label: "Dễ", color: "text-purple-700" },
          {
            id: "medium",
            name: "TB",
            label: "Trung bình",
            color: "text-purple-700",
          },
          { id: "hard", name: "Khó", label: "Khó", color: "text-purple-700" },
        ],
      },
    ],
    status: "ACTIVE",
  },
];

/**
 * Utility function to get default template by ID
 */
export const getDefaultTemplate = (
  id: string
): MatrixTemplateConfig | undefined => {
  return DEFAULT_MATRIX_TEMPLATES.find((template) => template.id === id);
};

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

  config.parts?.forEach((part, index) => {
    if (!part.name?.trim()) {
      errors.push(`Phần ${index + 1}: Tên không được để trống`);
    }

    if (!part.difficultyLevels || part.difficultyLevels.length === 0) {
      errors.push(`Phần ${index + 1}: Phải có ít nhất một mức độ khó`);
    }

    part.difficultyLevels?.forEach((difficulty, diffIndex) => {
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
