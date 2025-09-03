/**
 * Upload utilities for handling file uploads with Supabase and Execute Tool
 */

import { toast } from "sonner";
import { useUploadAndExecuteToolService } from "@/services/materialServices";

/**
 * Configuration for upload and execute tool
 */
export interface UploadExecuteConfig {
  toolId: string;
  bookId?: number;
  lessonId?: number;
  academicYearId?: number;
  bucketName?: string;
  onSuccess?: (result: { supabaseUrl: string; toolResult: any }) => void;
  onError?: (error: any) => void;
  loadingMessage?: string;
  successMessage?: string;
  errorMessage?: string;
}

/**
 * Default configuration values
 */
export const DEFAULT_UPLOAD_CONFIG: Partial<UploadExecuteConfig> = {
  bookId: 1,
  lessonId: 1,
  academicYearId: 1,
  bucketName: "planbook",
  loadingMessage: "Đang tải file lên Supabase và xử lý...",
  successMessage: "Xử lý hoàn tất!",
  errorMessage: "Có lỗi xảy ra khi xử lý file",
};

/**
 * Hook for simplified upload and execute workflow
 * @param config - Upload configuration
 * @returns Object with handleFileUpload function and mutation state
 */
export const useUploadExecuteWorkflow = (config: UploadExecuteConfig) => {
  const uploadAndExecuteMutation = useUploadAndExecuteToolService();

  const handleFileUpload = async (file: File) => {
    const finalConfig = { ...DEFAULT_UPLOAD_CONFIG, ...config };
    try {
      if (finalConfig.loadingMessage) {
        toast.success(finalConfig.loadingMessage);
      }

      const result = await uploadAndExecuteMutation.mutateAsync({
        file,
        toolId: finalConfig.toolId,
        bookId: finalConfig.bookId!,
        lessonId: finalConfig.lessonId!,
        academicYearId: finalConfig.academicYearId!,
        bucketName: finalConfig.bucketName!,
      });

      if (finalConfig.successMessage) {
        toast.success(finalConfig.successMessage);
      }

      if (finalConfig.onSuccess) {
        finalConfig.onSuccess(result);
      }

      return result;
    } catch (error) {
      console.error("Upload and execute error:", error);
      if (finalConfig?.errorMessage) {
        toast.error(finalConfig?.errorMessage);
      }

      if (finalConfig?.onError) {
        finalConfig?.onError(error);
      }

      throw error;
    }
  };

  return {
    handleFileUpload,
    isLoading: uploadAndExecuteMutation.isPending,
    error: uploadAndExecuteMutation.error,
    reset: uploadAndExecuteMutation.reset,
  };
};

/**
 * Extract tool ID from URL search params
 * @param searchParams - URLSearchParams or similar object
 * @param paramKey - Key to extract from params (default: 'bookTypeId')
 * @param fallback - Fallback value if param not found
 * @returns Tool ID string
 */
export const extractToolIdFromParams = (
  searchParams: URLSearchParams | { get: (key: string) => string | null },
  paramKey: string = "bookTypeId",
  fallback: string = "a1b2c3d4-e5f6-7890-1234-567890abcdef"
): string => {
  return searchParams.get(paramKey) || fallback;
};

/**
 * Validate file before upload
 * @param file - File to validate
 * @param options - Validation options
 * @returns Validation result
 */
export interface FileValidationOptions {
  maxSize?: number; // in bytes
  allowedTypes?: string[];
  allowedExtensions?: string[];
}

export const validateFile = (
  file: File,
  options: FileValidationOptions = {}
): { isValid: boolean; error?: string } => {
  const {
    maxSize = 50 * 1024 * 1024, // 50MB default
    allowedTypes = [],
    allowedExtensions = [],
  } = options;

  // Check file size
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `File quá lớn. Kích thước tối đa: ${Math.round(
        maxSize / 1024 / 1024
      )}MB`,
    };
  }

  // Check file type
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `Loại file không được hỗ trợ. Chỉ chấp nhận: ${allowedTypes.join(
        ", "
      )}`,
    };
  }

  // Check file extension
  if (allowedExtensions.length > 0) {
    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
      return {
        isValid: false,
        error: `Phần mở rộng file không được hỗ trợ. Chỉ chấp nhận: ${allowedExtensions.join(
          ", "
        )}`,
      };
    }
  }

  return { isValid: true };
};

/**
 * Format file size for display
 * @param bytes - File size in bytes
 * @returns Formatted string
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

/**
 * Generate unique filename for Supabase upload
 * @param originalName - Original file name
 * @param prefix - Optional prefix (default: 'uploads')
 * @returns Unique filename
 */
export const generateUniqueFilename = (
  originalName: string,
  prefix: string = "uploads"
): string => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(7);
  const extension = originalName.split(".").pop();
  return `${prefix}/${timestamp}_${randomString}.${extension}`;
};

/**
 * Common file type configurations
 */
export const FILE_CONFIGS = {
  EXCEL: {
    allowedTypes: [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
      "text/csv",
    ],
    allowedExtensions: ["xlsx", "xls", "csv"],
    maxSize: 10 * 1024 * 1024, // 10MB
  },
  IMAGES: {
    allowedTypes: [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ],
    allowedExtensions: ["jpg", "jpeg", "png", "gif", "webp"],
    maxSize: 5 * 1024 * 1024, // 5MB
  },
  DOCUMENTS: {
    allowedTypes: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    allowedExtensions: ["pdf", "doc", "docx"],
    maxSize: 20 * 1024 * 1024, // 20MB
  },
} as const;
