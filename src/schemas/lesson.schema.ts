import { z } from "zod";

export const lessonSchema = z.object({
  lessonTitle: z
    .string()
    .min(1, "Vui lòng nhập tiêu đề bài học")
    .refine((val) => val.trim().length > 0, {
      message: "Không được để trống hoặc chỉ chứa khoảng trắng",
    }),
  pdfFile: z
    .instanceof(File)
    .refine((file) => file.type === "application/pdf", {
      message: "Chỉ được upload file PDF",
    })
    .refine((file) => file.size <= 10 * 1024 * 1024, {
      message: "File phải nhỏ hơn 10MB",
    })
    .refine((file) => file.size > 0, {
      message: "Vui lòng chọn file PDF",
    }),
});

export type LessonFormData = z.infer<typeof lessonSchema>;
