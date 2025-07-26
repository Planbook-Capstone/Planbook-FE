import { z } from "zod";

export const subscriptionSchema = z.object({
  name: z
    .string()
    .min(1, "Tên gói không được để trống")
    .min(3, "Tên gói phải có ít nhất 3 ký tự")
    .max(100, "Tên gói không được quá 100 ký tự")
    .transform((val) => val.trim()),

  tokenAmount: z
    .number({
      required_error: "Số lượng token không được để trống",
      invalid_type_error: "Số lượng token phải là số",
    })
    .int("Số lượng token phải là số nguyên")
    .min(1, "Số lượng token phải lớn hơn 0")
    .max(999999, "Số lượng token không được quá 999,999"),

  price: z
    .number({
      required_error: "Giá không được để trống",
      invalid_type_error: "Giá phải là số",
    })
    .int("Giá phải là số nguyên")
    .min(1, "Giá phải lớn hơn 0")
    .max(999999999, "Giá không được quá 999,999,999 VNĐ"),

  description: z
    .string()
    .min(1, "Mô tả không được để trống")
    .min(10, "Mô tả phải có ít nhất 10 ký tự")
    .max(500, "Mô tả không được quá 500 ký tự")
    .transform((val) => val.trim()),

  highlight: z
    .boolean()
    .default(false),

  features: z
    .record(z.string().min(1, "Tính năng không được để trống"))
    .refine((features) => Object.keys(features).length >= 1, {
      message: "Phải có ít nhất 1 tính năng"
    })
    .refine((features) => Object.keys(features).length <= 10, {
      message: "Không được quá 10 tính năng"
    }),

  // priority: z
  //   .number({
  //     required_error: "Thứ tự ưu tiên không được để trống",
  //     invalid_type_error: "Thứ tự ưu tiên phải là số",
  //   })
  //   .int("Thứ tự ưu tiên phải là số nguyên")
  //   .min(1, "Thứ tự ưu tiên phải lớn hơn 0")
  //   .max(999, "Thứ tự ưu tiên không được quá 999"),
});

// Type inference
export type SubscriptionFormData = z.infer<typeof subscriptionSchema>;

// Create subscription request type
export interface CreateSubscriptionRequest {
  name: string;
  tokenAmount: number;
  price: number;
  description: string;
  highlight: boolean;
  features: Record<string, string>;
  priority: number;
}

// Update subscription request type (for edit functionality)
export interface UpdateSubscriptionRequest extends CreateSubscriptionRequest {
  id: string | number;
}
