import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Play, Square } from "lucide-react";
import { AcademicYearResponse } from "@/types";
import { format } from "date-fns";
import { translateAcademicYearStatus } from "@/utils/translateEnum";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { useUpdateAcademicYearStatus } from "@/services/academicYearServices";

export const yearColumns: ColumnDef<AcademicYearResponse>[] = [
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
    accessorKey: "startDate",
    header: "Năm bắt đầu",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span className="font-medium">
          {row.original?.startDate
            ? format(new Date(row.original.startDate), "dd/MM/yyyy")
            : "N/A"}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "endDate",
    header: "Năm kết thúc",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span className="font-medium">
          {row.original?.endDate
            ? format(new Date(row.original.endDate), "dd/MM/yyyy")
            : "N/A"}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "yearLabel",
    header: "Năm học",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span className="font-medium">{row.original.yearLabel}</span>
      </div>
    ),
  },

  {
    accessorKey: "updatedAt",
    header: "Ngày cập nhật",
    cell: ({ row }) => (
      <span>
        {row.original?.updatedAt
          ? format(new Date(row.original.updatedAt), "dd/MM/yyyy HH:mm")
          : "N/A"}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      const status = row.original.status;
      const statusText = translateAcademicYearStatus(status || "");

      const getStatusVariant = (status: string | null | undefined) => {
        switch (status) {
          case "ACTIVE":
            return "success";
          case "INACTIVE":
            return "warning";
          default:
            return "outline";
        }
      };

      return <Badge variant={getStatusVariant(status)}>{statusText}</Badge>;
    },
  },
  {
    id: "actions",
    header: "Hành động",
    cell: ({ row }) => {
      const academicYear = row.original;
      const updateStatusMutation = useUpdateAcademicYearStatus();

      const handleChangeStatus = (newStatus: "ACTIVE" | "INACTIVE") => {
        updateStatusMutation.mutate(
          {
            id: String(academicYear.id),
            field: "status",
            queryParams: { newStatus },
          },
          {
            onSuccess: () => {
              toast.success(
                newStatus === "ACTIVE"
                  ? "Kích hoạt thành công"
                  : "Vô hiệu hóa thành công"
              );
            },
            onError: () => {
              toast.error("Cập nhật thất bại");
            },
          }
        );
      };

      // Chỉ hiển thị nút action cho UPCOMING và ACTIVE
      if (academicYear.status === "INACTIVE") {
        return <div className="w-8"></div>; // Placeholder để giữ alignment
      }

      return (
        <div className="flex items-center gap-2">
          {academicYear.status === "UPCOMING" ? (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleChangeStatus("ACTIVE")}
              className="p-2 hover:bg-green-50 hover:text-green-600"
              title="Kích hoạt năm học"
            >
              <Play size={16} />
            </Button>
          ) : academicYear.status === "ACTIVE" ? (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleChangeStatus("INACTIVE")}
              className="p-2 hover:bg-red-50 hover:text-red-600"
              title="Vô hiệu hóa năm học"
            >
              <Square size={16} />
            </Button>
          ) : null}
        </div>
      );
    },
  },
];
