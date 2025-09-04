import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/Button";
import { ExamInstanceData } from "@/services/examInstanceServices";
import { Badge } from "@/components/ui/badge";
import { CoppyIcon } from "@/constants/icon";
import { Play, Pause, Square, XCircle, Info, Power } from "lucide-react";
import { statusConfig } from "@/constants/color";
import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { formatVietnamDate } from "@/utils/dateUtils";

// Handler function types
interface OrderColumnHandlers {
  onViewDetail: (examInstance: ExamInstanceData) => void;
  onPause?: (examInstance: ExamInstanceData) => void;
  onResume?: (examInstance: ExamInstanceData) => void;
  onStop?: (examInstance: ExamInstanceData) => void;
  onCancel?: (examInstance: ExamInstanceData) => void;
  onActivate?: (examInstance: ExamInstanceData) => void;
}

// Component for action guide modal
const ActionGuideModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    title="Hướng dẫn các hành động"
    size="lg"
  >
    <div className="space-y-4">
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">
          Các trạng thái và hành động:
        </h4>
        <div className="flex items-center gap-2">
          <Badge className="bg-yellow-100 text-yellow-800">Đã lên lịch</Badge>
          <span>→</span>
          <div className="flex gap-1">
            <Button size="sm" variant="outline" className="p-1 h-6">
              <XCircle className="w-3 h-3" />
            </Button>
            <span className="text-xs">Hủy</span>
          </div>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Badge className="bg-green-100 text-green-800">
              Đang hoạt động
            </Badge>
            <span>→</span>
            <div className="flex gap-1">
              <Button size="sm" variant="outline" className="p-1 h-6">
                <Pause className="w-3 h-3" />
              </Button>
              <span className="text-xs">Tạm dừng</span>
              <Button size="sm" variant="outline" className="p-1 h-6 ml-2">
                <Square className="w-3 h-3" />
              </Button>
              <span className="text-xs text-red-600 font-medium">
                Kết thúc (Không thể khôi phục)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge className="bg-orange-100 text-orange-800">Tạm dừng</Badge>
            <span>→</span>
            <div className="flex gap-1">
              <Button size="sm" variant="outline" className="p-1 h-6">
                <Play className="w-3 h-3" />
              </Button>
              <span className="text-xs">Tiếp tục</span>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t space-y-2">
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-sm text-red-800 font-medium">
            ⚠️ <strong>CHÚ Ý QUAN TRỌNG:</strong>
          </p>
          <p className="text-xs text-red-700 mt-1">
            Khi <strong>KẾT THÚC</strong> bài kiểm tra, hành động này{" "}
            <strong>KHÔNG THỂ KHÔI PHỤC LẠI</strong>. Bài kiểm tra sẽ chuyển
            sang trạng thái "Đã hoàn thành" và không thể tiếp tục được nữa.
          </p>
        </div>

        <p className="text-xs text-gray-600">
          <strong>Lưu ý:</strong> Tất cả các hành động đều yêu cầu xác nhận
          trước khi thực hiện. Một số hành động không thể hoàn tác.
        </p>
      </div>
    </div>
  </Modal>
);

export const ordersColumns = (
  handlers: OrderColumnHandlers
): ColumnDef<ExamInstanceData>[] => {
  const [showGuide, setShowGuide] = useState(false);

  return [
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
        </div>
      ),
    },
    {
      accessorKey: "startAt_endAt",
      header: "Thời gian bắt đầu - Thời gian kết thúc",
      cell: ({ row }) => {
        const formatDate = (dateString: string) => {
          const date = new Date(dateString);
          return formatVietnamDate(date, "dd/MM/yyyy HH:mm");
        };

        return (
          <div className="font-medium text-gray-900 font-questrial">
            {formatDate(row.original.startAt)} -{" "}
            {formatDate(row.original.endAt)}
          </div>
        );
      },
    },

    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ row }) => {
        const statusInfo = statusConfig[row.original.status];

        return (
          <Badge
            className={`${statusInfo.color} group-hover:bg-white group-hover:text-black transition-colors duration-300`}
          >
            {statusInfo.label}
          </Badge>
        );
      },
    },

    {
      id: "actions",
      header: () => (
        <div className="flex items-center gap-2">
          <span>Hành động</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowGuide(true)}
            className="p-1 h-6 w-6 hover:bg-blue-50"
            title="Hướng dẫn các hành động"
          >
            <Info className="w-4 h-4 text-blue-600" />
          </Button>
          <ActionGuideModal
            isOpen={showGuide}
            onClose={() => setShowGuide(false)}
          />
        </div>
      ),
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
              // Draft: Show Activate and Cancel buttons
              if (handlers.onActivate) {
                buttons.push(
                  <Button
                    key="activate"
                    variant="outline"
                    size="sm"
                    onClick={() => handlers.onActivate!(examInstance)}
                    className="p-2 hover:bg-green-50 hover:text-green-600 border-green-300"
                    title="Kích hoạt"
                  >
                    <Power className="w-4 h-4" />
                  </Button>
                );
              }
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

            case "SCHEDULED":
              // Scheduled: Show Cancel button
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
          <div className="flex items-center gap-2">{renderActionButtons()}</div>
        );
      },
    },
  ];
};
