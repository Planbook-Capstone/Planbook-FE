import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { SubscriptionResponse } from "@/types";

export const subscriptionColumns: ColumnDef<SubscriptionResponse>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Gói dịch vụ",
    cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
  },
  {
    accessorKey: "tokenAmount",
    header: "Số token",
    cell: ({ row }) => <span>{row.original.tokenAmount.toLocaleString()}</span>,
  },
  {
    accessorKey: "price",
    header: "Giá (VNĐ)",
    cell: ({ row }) => <span>{row.original.price.toLocaleString()} đ</span>,
  },
  {
    accessorKey: "description",
    header: "Mô tả",
    cell: ({ row }) => (
      <span className="max-w-xs truncate" title={row.original.description}>
        {row.original.description}
      </span>
    ),
  },
  // {
  //   accessorKey: "priority",
  //   header: "Thứ tự",
  //   cell: ({ row }) => <span>{row.original.priority || "N/A"}</span>,
  // },

  {
    accessorKey: "updatedAt",
    header: "Ngày cập nhật",
    cell: ({ row }) => (
      <span>
        {new Date(row.original.updatedAt).toLocaleDateString("vi-VN")}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          row.original.status === "ACTIVE"
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
        }`}
      >
        {row.original.status === "ACTIVE"
          ? "Đang hoạt động"
          : "Ngưng hoạt động"}
      </span>
    ),
  },
];
