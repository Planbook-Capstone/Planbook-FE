import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/Button";

import { SubmissionData } from "@/services/examInstanceServices";
import { Badge } from "@/components/ui/badge";
import { SubmissionDetailsSheet } from "@/components/organisms/submission-details-sheet";
import { formatVietnamDate } from "@/utils/dateUtils";

// Handler function types (keeping for backward compatibility)
interface OrderColumnHandlers {
  onViewDetail?: (examInstance: SubmissionData) => void;
  // onToggleUserStatus: (order: Order) => void;
}

export const ordersColumns = (
  handlers?: OrderColumnHandlers
): ColumnDef<SubmissionData>[] => [
  {
    id: "index",
    header: "STT",
    cell: ({ row }) => row.index + 1,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "studentName",
    header: "Tên học sinh",
    cell: ({ row }) => (
      <div className="font-medium text-gray-900 font-questrial">
        {row.original.studentName}
      </div>
    ),
  },
  {
    accessorKey: "score",
    header: "Điểm",
    cell: ({ row }) => (
      <div className="font-medium text-gray-900 font-questrial">
        {row.original.score}
      </div>
    ),
  },
  {
    accessorKey: "submittedAt",
    header: "Nộp vào lúc",
    cell: ({ row }) => {
      const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return formatVietnamDate(date, "dd/MM/yyyy HH:mm");
      };

      return (
        <div className="font-medium text-gray-900 font-questrial">
          {formatDate(row.original.submittedAt)}
        </div>
      );
    },
  },

  // {
  //   accessorKey: "status",
  //   header: "Trạng thái",
  //   cell: ({ row }) => {
  //     // const statusInfo = statusConfig[instance.status];

  //     return <Badge variant={"success"}>{row.original.status}</Badge>;
  //   },
  // },

  {
    id: "actions",
    header: "Hành động",
    cell: ({ row }) => {
      const submission = row.original;
      return (
        <div className="flex items-center gap-2">
          <SubmissionDetailsSheet
            submission={submission}
            trigger={
              <Button
                variant="ghost"
                size="sm"
                className="p-2 hover:bg-blue-50 hover:text-blue-600"
                title="Xem chi tiết"
              >
                Chi tiết
              </Button>
            }
          />
        </div>
      );
    },
  },
];
