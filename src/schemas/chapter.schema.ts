import { z } from "zod";
import { lessonSchema } from "./lesson.schema";

export const chapterSchema = z.object({
  chapterTitle: z
    .string()
    .min(1, "Vui lòng nhập tiêu đề chương")
    .refine((val) => val.trim().length > 0, {
      message: "Không được để trống hoặc chỉ chứa khoảng trắng",
    }),
  lessons: z.array(lessonSchema).min(1, "Chương phải có ít nhất 1 bài học"),
});

export type ChapterFormData = z.infer<typeof chapterSchema>;
