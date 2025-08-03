import { ColumnDef } from "@tanstack/react-table";
import { Order } from "@/types";
import { Button } from "@/components/ui/Button";

import { getOrderStatusLabel } from "@/constants/enum";

import { ORDER_STATUS_COLOR } from "@/constants";

// Handler function types
interface OrderColumnHandlers {
  onViewDetail: (order: Order) => void;
  // onToggleUserStatus: (order: Order) => void;
  mode?: "admin" | "user";
}

export const ordersColumns = (
  handlers: OrderColumnHandlers
): ColumnDef<Order>[] => {
  const columns: ColumnDef<Order>[] = [
    {
      id: "index",
      header: "STT",
      cell: ({ row }) => row.index + 1,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => (
        <div className="font-medium text-gray-900 font-questrial">
          {row.original.id}
        </div>
      ),
    },
  ];

  // Chỉ hiển thị cột User ID khi mode là admin
  if (handlers.mode === "admin") {
    columns.push({
      accessorKey: "userId",
      header: "User ID",
      cell: ({ row }) => (
        <div className="font-medium text-gray-900 font-questrial">
          {row.original.userId}
        </div>
      ),
    });
  }

  columns.push(
    {
      accessorKey: "createdAt",
      header: "Ngày tạo",
      cell: ({ row }) => {
        const formatDate = (dateString: string) => {
          const date = new Date(dateString);
          return date.toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          });
        };

        return (
          <div className="font-medium text-gray-900 font-questrial">
            {formatDate(row.original.createdAt)}
          </div>
        );
      },
    },
    {
      accessorKey: "subscriptionPackage.name",
      header: "Tên gói",
      cell: ({ row }) => (
        <div className="font-medium text-gray-900 font-questrial">
          {row.original.subscriptionPackage.name}
        </div>
      ),
    },
    {
      accessorKey: "amount",
      header: "Giá tiền",
      cell: ({ row }) => {
        const formatCurrency = (amount: number) => {
          return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(amount);
        };

        return (
          <div className="font-medium text-gray-600 font-questrial">
            {formatCurrency(row.original.amount)}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ row }) => {
        const status = row.original.status;
        const colorClass =
          ORDER_STATUS_COLOR[status] || "bg-gray-100 text-gray-800";

        return (
          <span
            className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${colorClass}`}
          >
            {getOrderStatusLabel(status)}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "Hành động",
      cell: ({ row }) => {
        const order = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handlers.onViewDetail(order)}
              className="p-2 hover:bg-blue-50 hover:text-blue-600"
              title="Xem chi tiết"
            >
              Chi tiết
            </Button>
          </div>
        );
      },
    }
  );

  return columns;
};
