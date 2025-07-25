import { z } from "zod";
import { ROLE } from "@/constants/enum";

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Username validation regex (no special characters, no spaces)
const usernameRegex = /^[a-zA-Z0-9_]+$/;

// Password validation regex (at least 1 uppercase, 1 lowercase, 1 number)
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;

export const createUserSchema = z.object({
  fullName: z
    .string()
    .min(1, "Họ và tên không được để trống")
    .min(2, "Họ và tên phải có ít nhất 2 ký tự")
    .max(100, "Họ và tên không được quá 100 ký tự")
    .transform((val) => val.trim())
    .refine((val) => val.length > 0, {
      message: "Họ và tên không được chỉ chứa khoảng trắng",
    }),

  email: z
    .string()
    .min(1, "Email không được để trống")
    .email("Email không đúng định dạng")
    .regex(emailRegex, "Email không đúng định dạng")
    .max(255, "Email không được quá 255 ký tự")
    .transform((val) => val.trim().toLowerCase()),

  username: z
    .string()
    .min(1, "Username không được để trống")
    .min(5, "Username phải có ít nhất 5 ký tự")
    .max(10, "Username không được quá 50 ký tự")
    .regex(usernameRegex, "Username chỉ được chứa chữ cái, số và dấu gạch dưới")
    .transform((val) => val.trim().toLowerCase()),

  password: z
    .string()
    .min(1, "Mật khẩu không được để trống")
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .max(100, "Mật khẩu không được quá 100 ký tự")
    .regex(
      passwordRegex,
      "Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số"
    ),

  role: z
    .enum([ROLE.TEACHER, ROLE.ADMIN, ROLE.STAFF, ROLE.PARTNER], {
      required_error: "Vai trò không được để trống",
      invalid_type_error: "Vai trò không hợp lệ",
    })
    .refine((val) => Object.values(ROLE).includes(val), {
      message: "Vai trò không hợp lệ",
    }),
});

// Type inference
export type CreateUserFormData = z.infer<typeof createUserSchema>;

// Role options for Select component
export const roleOptions = [
  { value: ROLE.TEACHER, label: "Giáo viên" },
  { value: ROLE.ADMIN, label: "Quản trị viên" },
  { value: ROLE.STAFF, label: "Nhân viên" },
  { value: ROLE.PARTNER, label: "Đối tác" },
];

// Update user schema (for editing existing users)
export const updateUserSchema = createUserSchema.partial({
  password: true, // Password is optional when updating
});

export type UpdateUserFormData = z.infer<typeof updateUserSchema>;

// User response type (what we get from API)
export interface UserResponse {
  id: string;
  fullName: string;
  email: string;
  username: string;
  role: ROLE;
  createdAt?: string;
  updatedAt?: string;
  isDisabled?: boolean;
}

// Create user request type (what we send to API)
export interface CreateUserRequest {
  fullName: string;
  email: string;
  username: string;
  password: string;
  role: ROLE;
}

// Update user request type (what we send to API for updates)
export interface UpdateUserRequest {
  fullName?: string;
  email?: string;
  username?: string;
  password?: string;
  role?: ROLE;
}
