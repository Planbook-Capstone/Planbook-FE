import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/Button";

import { getOrderStatusLabel } from "@/constants/enum";

import { ORDER_STATUS_COLOR } from "@/constants";
import { ExamInstanceData } from "@/services/examInstanceServices";
import { Badge } from "@/components/ui/badge";

// Handler function types
interface OrderColumnHandlers {
  onViewDetail: (examInstance: ExamInstanceData) => void;
  // onToggleUserStatus: (order: Order) => void;
}

export const ordersColumns = (
  handlers: OrderColumnHandlers
): ColumnDef<ExamInstanceData>[] => [
  {
    id: "index",
    header: "STT",
    cell: ({ row }) => row.index + 1,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "templateName",
    header: "Tên bài kiểm tra",
    cell: ({ row }) => (
      <div className="font-medium text-gray-900 font-questrial">
        {row.original.templateName}
      </div>
    ),
  },
  {
    accessorKey: "description",
    header: "Mô tả",
    cell: ({ row }) => (
      <div className="font-medium text-gray-900 font-questrial">
        {row.original.description}
      </div>
    ),
  },
  {
    accessorKey: "startAt_endAt",
    header: "Thời gian",
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
          {formatDate(row.original.startAt)} - {formatDate(row.original.endAt)}
        </div>
      );
    },
  },

  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      // const statusInfo = statusConfig[instance.status];

      return <Badge variant={"success"}>{row.original.status}</Badge>;
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
  },
];
