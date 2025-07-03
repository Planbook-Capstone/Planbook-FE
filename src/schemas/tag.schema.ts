import { z } from "zod";

export const tagSchema = z.object({
  name: z
    .string()
    .transform((val) => val.trim())
    .refine((val) => val.length > 0, {
      message: "Tên chức năng không được để trống",
    }),
  description: z
    .string({ required_error: "Mô tả không được để trống" })
    .transform((val) => val.trim())
    .refine((val) => val.length > 0, {
      message: "Mô tả không được để trống",
    }),
});

export type TagData = z.infer<typeof tagSchema>;
