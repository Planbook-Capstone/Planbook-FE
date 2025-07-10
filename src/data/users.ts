// Mock data for users management
export interface User {
  id: string; // UUID
  fullName: string; // Required, tên đầy đủ
  email: string; // Required, unique, validate định dạng email
  username: string; // Required, unique, định dạng không dấu, viết liền
  password?: string; // Optional (chỉ khi tạo mới), min 6 ký tự
  role: "admin" | "staff" | "teacher" | "tool-manager"; // Enum, Required
  isDisabled?: boolean; // Optional, mặc định false, dùng để hiển thị trạng thái vô hiệu hóa
}

export const mockUsers: User[] = [
  {
    id: "uuid-1",
    fullName: "Nguyễn Văn Admin",
    email: "admin@planbook.edu.vn",
    username: "nguyenvanadmin",
    role: "admin",
    isDisabled: false,
  },
  {
    id: "uuid-2",
    fullName: "Trần Thị Staff",
    email: "staff@planbook.edu.vn",
    username: "tranthistaff",
    role: "staff",
    isDisabled: false,
  },
  {
    id: "uuid-3",
    fullName: "Lê Văn Teacher",
    email: "teacher@planbook.edu.vn",
    username: "levanteacher",
    role: "teacher",
    isDisabled: false,
  },
  {
    id: "uuid-4",
    fullName: "Phạm Thị Tool Manager",
    email: "toolmanager@planbook.edu.vn",
    username: "phamthitoolmanager",
    role: "tool-manager",
    isDisabled: false,
  },
  {
    id: "uuid-5",
    fullName: "Hoàng Văn Teacher Disabled",
    email: "teacher2@planbook.edu.vn",
    username: "hoangvanteacher2",
    role: "teacher",
    isDisabled: true,
  },
  {
    id: "uuid-6",
    fullName: "Vũ Thị Staff 2",
    email: "staff2@planbook.edu.vn",
    username: "vuthistaff2",
    role: "staff",
    isDisabled: false,
  },
  {
    id: "uuid-7",
    fullName: "Đặng Văn Tool Manager 2",
    email: "toolmgr2@planbook.edu.vn",
    username: "dangvantoolmgr2",
    role: "tool-manager",
    isDisabled: false,
  },
  {
    id: "uuid-8",
    fullName: "Bùi Thị Admin 2",
    email: "admin2@planbook.edu.vn",
    username: "buithiadmin2",
    role: "admin",
    isDisabled: false,
  },
];

// Role labels for display
export const roleLabels = {
  admin: "Quản trị viên",
  staff: "Nhân viên",
  teacher: "Giáo viên",
  "tool-manager": "Quản lý công cụ",
} as const;

// Role options for forms
export const roleOptions = [
  { value: "admin", label: "Quản trị viên" },
  { value: "staff", label: "Nhân viên" },
  { value: "teacher", label: "Giáo viên" },
  { value: "tool-manager", label: "Quản lý công cụ" },
] as const;
