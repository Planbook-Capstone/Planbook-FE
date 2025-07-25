import { ColumnDef } from "@tanstack/react-table";
import { UserWithWalletResponse } from "@/types";
import { ROLE_LABELS, ROLE_COLORS } from "@/constants";
import { Button } from "@/components/ui/Button";
import { Eye, UserCheck, UserX } from "lucide-react";
import { toast } from "sonner";

export const userColumns: ColumnDef<UserWithWalletResponse>[] = [
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
       const isDisabled = row.original.status;
       return (
         <span
           className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
             isDisabled
               ? "bg-red-100 text-red-800"
               : "bg-green-100 text-green-800"
           }`}
         >
           {isDisabled ? "Đã vô hiệu hóa" : "Hoạt động"}
         </span>
       );
     },
   },

  //  {
  //    id: "actions",
  //    header: "Hành động",
  //    cell: ({ row }) => {
  //      const user = row.original;
  //      return (
  //        <div className="flex items-center gap-2">
  //          <Button
  //            variant="ghost"
  //            size="sm"
  //            onClick={() => handleViewUser(user)}
  //            className="p-2 hover:bg-blue-50 hover:text-blue-600"
  //            title="Xem chi tiết"
  //          >
  //            <Eye size={16} />
  //          </Button>
  //          <Button
  //            variant="ghost"
  //            size="sm"
  //            onClick={() => handleToggleUserStatus(user)}
  //            className={`p-2 ${
  //              user.isDisabled
  //                ? "hover:bg-green-50 hover:text-green-600"
  //                : "hover:bg-red-50 hover:text-red-600"
  //            }`}
  //            title={user.isDisabled ? "Kích hoạt" : "Vô hiệu hóa"}
  //          >
  //            {user.isDisabled ? <UserCheck size={16} /> : <UserX size={16} />}
  //          </Button>
  //        </div>
  //      );
  //    },
  //  },
];
