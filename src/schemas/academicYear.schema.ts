import { z } from "zod";

export const academicYearSchema = z
  .object({
    start_date: z.date({
      required_error: "Vui lòng chọn ngày bắt đầu năm học.",
    }),
    end_date: z.date({
      required_error: "Vui lòng chọn ngày kết thúc năm học.",
    }),
  })
  .refine(
    (data) => {
      const startYear = data.start_date.getFullYear();
      const endYear = data.end_date.getFullYear();
      const yearDiff = endYear - startYear;

      return yearDiff >= 1;
    },
    {
      path: ["end_date"],
      message: "Ngày kết thúc phải lớn hơn ngày bắt đầu ít nhất 1 năm.",
    }
  )
  .refine(
    (data) => {
      const startYear = data.start_date.getFullYear();
      const endYear = data.end_date.getFullYear();
      const yearDiff = endYear - startYear;

      return yearDiff <= 2;
    },
    {
      path: ["end_date"],
      message: "Ngày kết thúc không được quá 2 năm so với ngày bắt đầu.",
    }
  );

export type AcademicYearFormData = z.infer<typeof academicYearSchema>;
