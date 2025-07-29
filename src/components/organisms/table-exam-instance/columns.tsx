import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/Button";

import { getOrderStatusLabel } from "@/constants/enum";

import { ORDER_STATUS_COLOR } from "@/constants";
import { ExamInstanceData } from "@/services/examInstanceServices";
import { Badge } from "@/components/ui/badge";
import { CoppyIcon } from "@/constants/icon";
import { Copy, CopyPlus, Play, Pause, Square, XCircle } from "lucide-react";

// Handler function types
interface OrderColumnHandlers {
  onViewDetail: (examInstance: ExamInstanceData) => void;
  onPause?: (examInstance: ExamInstanceData) => void;
  onResume?: (examInstance: ExamInstanceData) => void;
  onStop?: (examInstance: ExamInstanceData) => void;
  onCancel?: (examInstance: ExamInstanceData) => void;
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
    accessorKey: "code",
    header: "Mã bài thi",
    cell: ({ row }) => (
      <div className="font-medium text-gray-900  font-questrial">
        {row.original.code}
        <Button variant={"menuitem"} size={"icon"}>
          {CoppyIcon}
        </Button>
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
      const examInstance = row.original;

      const renderActionButtons = () => {
        const buttons = [];

        // Always show detail button
        buttons.push(
          <Button
            key="detail"
            variant="ghost"
            size="sm"
            onClick={() => handlers.onViewDetail(examInstance)}
            className="p-2 hover:bg-blue-50 hover:text-blue-600"
            title="Xem chi tiết"
          >
            Chi tiết
          </Button>
        );

        // Status-specific buttons
        switch (examInstance.status) {
          case "ACTIVE":
            // Active: Show Pause and Stop buttons
            if (handlers.onPause) {
              buttons.push(
                <Button
                  key="pause"
                  variant="outline"
                  size="sm"
                  onClick={() => handlers.onPause!(examInstance)}
                  className="p-2 hover:bg-orange-50 hover:text-orange-600 border-orange-300"
                  title="Tạm dừng"
                >
                  <Pause className="w-4 h-4" />
                </Button>
              );
            }
            if (handlers.onStop) {
              buttons.push(
                <Button
                  key="stop"
                  variant="outline"
                  size="sm"
                  onClick={() => handlers.onStop!(examInstance)}
                  className="p-2 hover:bg-gray-50 hover:text-gray-600 border-gray-300"
                  title="Kết thúc"
                >
                  <Square className="w-4 h-4" />
                </Button>
              );
            }
            break;

          case "PAUSED":
            // Paused: Show Resume button
            if (handlers.onResume) {
              buttons.push(
                <Button
                  key="resume"
                  variant="outline"
                  size="sm"
                  onClick={() => handlers.onResume!(examInstance)}
                  className="p-2 hover:bg-green-50 hover:text-green-600 border-green-300"
                  title="Tiếp tục"
                >
                  <Play className="w-4 h-4" />
                </Button>
              );
            }
            break;

          case "DRAFT":
          case "SCHEDULED":
            // Draft/Scheduled: Show Cancel button
            if (handlers.onCancel) {
              buttons.push(
                <Button
                  key="cancel"
                  variant="outline"
                  size="sm"
                  onClick={() => handlers.onCancel!(examInstance)}
                  className="p-2 hover:bg-red-50 hover:text-red-600 border-red-300"
                  title="Hủy"
                >
                  <XCircle className="w-4 h-4" />
                </Button>
              );
            }
            break;

          default:
            // For COMPLETED or CANCELLED, only show detail button
            break;
        }

        return buttons;
      };

      return (
        <div className="flex items-center gap-2">
          {renderActionButtons()}
        </div>
      );
    },
  },
];
