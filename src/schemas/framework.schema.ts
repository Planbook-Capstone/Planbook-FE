import { z } from "zod";

export const frameworkSchema = z.object({
  framework_name: z
    .string()
    .min(1, "Vui lòng nhập tên framework")
    .refine((val) => val.trim().length > 0, {
      message: "Không được để trống hoặc chỉ chứa khoảng trắng",
    }),
  framework_file: z
    .any()
    .refine((file) => {
      // Check if File constructor exists (client-side)
      if (typeof File === 'undefined') return true;
      return file instanceof File;
    }, {
      message: "Vui lòng chọn file hợp lệ",
    })
    .refine((file) => {
      if (typeof File === 'undefined') return true;
      return file && file.size > 0;
    }, {
      message: "Vui lòng chọn file framework",
    })
    .refine((file) => {
      if (typeof File === 'undefined') return true;
      return file && file.size <= 50 * 1024 * 1024;
    }, {
      message: "File phải nhỏ hơn 50MB",
    })
    .refine(
      (file) => {
        if (typeof File === 'undefined') return true;
        if (!file || !file.type) return false;
        const allowedTypes = [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "text/plain",
        ];
        return allowedTypes.includes(file.type);
      },
      {
        message: "Chỉ được upload file PDF, DOC, DOCX hoặc TXT",
      }
    ),
});

export type FrameworkFormData = z.infer<typeof frameworkSchema>;
