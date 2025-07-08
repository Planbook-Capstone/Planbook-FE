import * as z from "zod";

// Configuration schema - chỉ cần name và file DOCX/PDF
export const configurationSchema = z.object({
  name: z
    .string()
    .min(1, "Tên configuration không được để trống")
    .min(3, "Tên configuration phải có ít nhất 3 ký tự")
    .max(100, "Tên configuration không được quá 100 ký tự")
    .regex(
      /^[a-zA-Z0-9\s\-_\.]+$/,
      "Tên configuration chỉ được chứa chữ cái, số, dấu gạch ngang, gạch dưới và dấu chấm"
    ),
  file: z
    .instanceof(File, { message: "Vui lòng chọn file" })
    .refine((file) => file.size > 0, "File không được để trống")
    .refine(
      (file) => file.size <= 50 * 1024 * 1024, // 50MB
      "Kích thước file không được vượt quá 50MB"
    )
    .refine(
      (file) => {
        const allowedTypes = [
          "application/pdf", // PDF files
          "application/msword", // DOC files
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // DOCX files
        ];
        return allowedTypes.includes(file.type);
      },
      "Chỉ chấp nhận file PDF, DOC, DOCX"
    ),
});

export type ConfigurationFormData = z.infer<typeof configurationSchema>;

// Helper functions for file handling
export const getConfigurationFileIcon = (file: File): string => {
  const type = file.type.toLowerCase();
  
  if (type.includes("pdf")) {
    return "📄"; // PDF icon
  }
  if (type.includes("word") || type.includes("document")) {
    return "📝"; // Word document icon
  }
  
  return "📄"; // Default document icon
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const getFileExtension = (fileName: string): string => {
  return fileName.split('.').pop()?.toUpperCase() || "";
};

export const isValidConfigurationFile = (file: File): boolean => {
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  
  const allowedExtensions = [".pdf", ".doc", ".docx"];
  const fileExtension = "." + file.name.split('.').pop()?.toLowerCase();
  
  return allowedTypes.includes(file.type) || allowedExtensions.includes(fileExtension);
};

// Configuration file type enum
export enum ConfigurationFileType {
  PDF = "PDF",
  DOC = "DOC", 
  DOCX = "DOCX",
}

export const getConfigurationFileType = (file: File): ConfigurationFileType => {
  const type = file.type.toLowerCase();
  const extension = file.name.split('.').pop()?.toLowerCase();
  
  if (type.includes("pdf") || extension === "pdf") {
    return ConfigurationFileType.PDF;
  }
  if (type.includes("word") || extension === "doc") {
    return ConfigurationFileType.DOC;
  }
  if (type.includes("document") || extension === "docx") {
    return ConfigurationFileType.DOCX;
  }
  
  return ConfigurationFileType.PDF; // Default
};

// Validation messages
export const CONFIGURATION_VALIDATION_MESSAGES = {
  name: {
    required: "Tên configuration không được để trống",
    minLength: "Tên configuration phải có ít nhất 3 ký tự",
    maxLength: "Tên configuration không được quá 100 ký tự",
    pattern: "Tên configuration chỉ được chứa chữ cái, số, dấu gạch ngang, gạch dưới và dấu chấm",
  },
  file: {
    required: "Vui lòng chọn file",
    empty: "File không được để trống",
    size: "Kích thước file không được vượt quá 50MB",
    type: "Chỉ chấp nhận file PDF, DOC, DOCX",
  },
} as const;
