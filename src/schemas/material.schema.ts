import { z } from "zod";
import { TagResponse } from "@/types";

// File validation schema
const fileSchema = z
  .any()
  .refine((file) => {
    // Check if file exists first
    if (!file) return false;
    // Check if it's a File-like object
    return (
      typeof file === "object" &&
      "size" in file &&
      "type" in file &&
      "name" in file
    );
  }, "Vui lòng chọn file")
  .refine((file) => {
    if (!file) return false;
    return file.size > 0;
  }, "Vui lòng chọn file")
  .refine(
    (file) => {
      if (!file) return false;
      return file.size <= 100 * 1024 * 1024; // 100MB
    },
    "File phải nhỏ hơn 100MB"
  )
  .refine((file) => {
    if (!file) return false;
    const allowedTypes = [
      // Images
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
      // Videos
      "video/mp4",
      "video/avi",
      "video/mov",
      "video/wmv",
      "video/webm",
      // Audio
      "audio/mpeg", // MP3 files
      "audio/mp3",  // Some browsers might use this
      "audio/wav",
      "audio/ogg",
      "audio/m4a",
      "audio/mp4",  // M4A files sometimes use this MIME type
      // Documents
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];
    return allowedTypes.includes(file.type);
  }, "Chỉ được upload file ảnh (JPG, PNG, GIF, WebP), video (MP4, AVI, MOV, WMV, WebM), âm thanh (MP3, WAV, OGG, M4A) hoặc tài liệu (PDF, DOC, DOCX, TXT)");

// Material form schema
export const materialSchema = z.object({
  name: z
    .string()
    .min(1, "Tên material không được để trống")
    .min(3, "Tên material phải có ít nhất 3 ký tự")
    .max(100, "Tên material không được quá 100 ký tự"),

  description: z
    .string()
    .min(1, "Mô tả không được để trống")
    .min(10, "Mô tả phải có ít nhất 10 ký tự")
    .max(500, "Mô tả không được quá 500 ký tự"),

  tags: z
    .array(z.string())
    .min(1, "Vui lòng chọn ít nhất 1 loại học liệu")
    .max(5, "Chỉ được chọn tối đa 5 loại học liệu"),

  file: fileSchema,
});

// Type inference
export type MaterialFormData = z.infer<typeof materialSchema>;

// File type for better type safety
export interface FileData {
  size: number;
  type: string;
  name: string;
}

// Material tag interface
export interface MaterialTag {
  id: string;
  name: string;
  color: string;
  icon: string;
}

// Helper function to get file type category
export const getFileCategory = (file: FileData | undefined): string => {
  if (!file || !file.type) return "other";

  const type = file.type;

  if (type.startsWith("image/")) return "image";
  if (type.startsWith("video/")) return "video";
  if (type.startsWith("audio/")) return "audio";
  if (type.includes("pdf") || type.includes("word") || type.includes("text"))
    return "document";

  return "other";
};

// Helper function to format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// File type icons mapping
export const getFileIcon = (file: FileData | undefined): string => {
  if (!file) return "📁";

  const category = getFileCategory(file);

  switch (category) {
    case "image":
      return "🖼️";
    case "video":
      return "🎥";
    case "audio":
      return "🎵";
    case "document":
      return "📄";
    default:
      return "📁";
  }
};
