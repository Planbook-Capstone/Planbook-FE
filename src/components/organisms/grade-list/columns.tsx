import { ColumnDef } from "@tanstack/react-table";

import { GradeResponse } from "@/types";
import { translateStatus } from "@/utils/translateEnum";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import UpdateGradeModal from "../update-grade-modal";
import { useState } from "react";
import { useUpdateGradeStatus } from "@/services/gradeServices";

export const gradeColumns: ColumnDef<GradeResponse>[] = [
  {
    id: "index",
    header: "STT",
    cell: ({ row }) => row.index + 1,
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: "name",
    header: "Tên khối",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span className="font-medium">{row.original.name}</span>
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Ngày tạo",
    cell: ({ row }) => (
      <div className="text-muted-foreground truncate">
        {row.original.createdAt}
      </div>
    ),
  },
  {
    accessorKey: "updatedAt",
    header: "Ngày cập nhật",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.updatedAt}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      const status = row.original.status;
      const statusText = translateStatus(status || "");

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
    header: "",
    cell: ({ row }) => {
      const grade = row.original;
      const [modalOpen, setModalOpen] = useState(false);
      const [selectedGrade, setSelectedGrade] = useState<GradeResponse | null>(
        null
      );

      const updateStatusMutation = useUpdateGradeStatus();

      const handleEdit = () => {
        setModalOpen(true);
        setSelectedGrade(grade);
      };

      const handleChangeStatus = (newStatus: "ACTIVE" | "INACTIVE") => {
        updateStatusMutation.mutate(
          {
            id: String(grade.id), // ✅ truyền đúng id đang được chọn
            field: "status",
            queryParams: { newStatus }, // ✅ dùng biến động
          },
          {
            onSuccess: () => {
              toast.success(
                newStatus === "ACTIVE"
                  ? "Khôi phục thành công"
                  : "Xoá thành công"
              );
            },
            onError: () => {
              toast.error("Cập nhật thất bại");
            },
          }
        );
      };

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost" className="rounded-full">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={-10}>
              <DropdownMenuItem onClick={handleEdit}>
                Chỉnh sửa
              </DropdownMenuItem>

              {grade.status === "ACTIVE" ? (
                <DropdownMenuItem
                  onClick={() => handleChangeStatus("INACTIVE")}
                  className="text-red-600"
                >
                  Xoá
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  onClick={() => handleChangeStatus("ACTIVE")}
                  className="text-green-600"
                >
                  Khôi phục
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <UpdateGradeModal
            open={modalOpen}
            onOpenChange={setModalOpen}
            grade={selectedGrade}
          />
        </>
      );
    },
  },
];
