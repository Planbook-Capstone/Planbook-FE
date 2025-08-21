import { ColumnDef } from "@tanstack/react-table";
import { UserWithWalletResponse } from "@/types";
import { ROLE_LABELS, ROLE_COLORS } from "@/constants";
import { Button } from "@/components/ui/Button";
import { Eye, UserCheck, UserX } from "lucide-react";

// Handler function types
interface UserColumnHandlers {
  onViewUser: (user: UserWithWalletResponse) => void;
  onToggleUserStatus: (user: UserWithWalletResponse) => void;
  currentUserId?: string; // Thêm currentUserId để so sánh
}

export const createUserColumns = (
  handlers: UserColumnHandlers
): ColumnDef<UserWithWalletResponse>[] => [
  {
    id: "index",
    header: "STT",
    cell: ({ row }) => row.index + 1,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "fullName",
    header: "Họ và tên",
    cell: ({ row }) => (
      <div className="font-medium text-gray-900 font-questrial">
        {row.original.fullName}
      </div>
    ),
  },
  {
    accessorKey: "Email",
    header: "Email",
    cell: ({ row }) => (
      <div className="font-medium text-gray-600 font-questrial">
        {row.original.email}
      </div>
    ),
  },
  {
    accessorKey: "username",
    header: "Username",
    cell: ({ row }) => (
      <div className="text-gray-600 font-questrial">
        {row.original.username}
      </div>
    ),
  },
  {
    accessorKey: "role",
    header: "Vai trò",
    cell: ({ row }) => {
      const role = row.getValue("role") as keyof typeof ROLE_LABELS;
      const roleColor = ROLE_COLORS[role] || "bg-gray-100 text-gray-800";
      const roleLabel = ROLE_LABELS[role] || role;

      return (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleColor}`}
        >
          {roleLabel}
        </span>
      );
    },
  },

  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      const isDisabled = row.original.status === "ACTIVE";
      return (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            row.original.status === "DELETED"
              ? "bg-red-100 text-red-800"
              : isDisabled
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {row.original.status === "DELETED"
            ? "Đã bị vô hiệu hóa"
            : isDisabled
            ? "Hoạt động"
            : "Chưa xác thực tài khoản"}
        </span>
      );
    },
  },

  {
    id: "actions",
    header: "Hành động",
    cell: ({ row }) => {
      const user = row.original;

      // Kiểm tra nếu user hiện tại trùng với user đang xem
      const isCurrentUser = handlers.currentUserId === user.id;

      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handlers.onViewUser(user)}
            className="p-2 hover:bg-blue-50 hover:text-blue-600"
            title="Xem chi tiết"
          >
            <Eye size={16} />
          </Button>
          {/* Ẩn button active/inactive nếu là user hiện tại */}
          {!isCurrentUser && user.status !== "INACTIVE" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handlers.onToggleUserStatus(user)}
              className={`p-2 ${
                user.status === "ACTIVE"
                  ? "hover:bg-red-50 hover:text-red-600"
                  : "hover:bg-green-50 hover:text-green-600"
              }`}
              title={user.status === "ACTIVE" ? "Vô hiệu hóa" : "Kích hoạt"}
            >
              {user.status === "ACTIVE" ? (
                <UserX size={16} />
              ) : (
                <UserCheck size={16} />
              )}
            </Button>
          )}
        </div>
      );
    },
  },
];
