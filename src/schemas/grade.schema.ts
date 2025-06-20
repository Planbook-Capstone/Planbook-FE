import { z } from "zod";

export const gradeItemSchema = z.object({
  name: z
    .string()
    .min(1, "Vui lòng nhập tên khối")
    .refine((val) => val.trim().length > 0, {
      message: "Không được để trống hoặc chỉ chứa khoảng trắng",
    }),
});

export const gradeFormSchema = z.object({
  grades: z.array(gradeItemSchema).min(1, "Phải có ít nhất 1 khối"),
});

export type GradeItemFormData = z.infer<typeof gradeItemSchema>;
export type GradeFormData = z.infer<typeof gradeFormSchema>;
