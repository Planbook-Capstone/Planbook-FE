import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { SubjectResponse } from "@/types";
import { translateStatus } from "@/utils/translateEnum";
import { Badge } from "@/components/ui/badge";
import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import UpdateSubjectModal from "../update-subject-modal";
import { useState } from "react";
import { useUpdateSubjectStatus } from "@/services/subjectServices";

export const subjectColumns: ColumnDef<SubjectResponse>[] = [
  {
    id: "index",
    header: "STT",
    cell: ({ row }) => row.index + 1,
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: "name",
    header: "Tên môn",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span className="font-medium">{row.original.name}</span>
      </div>
    ),
  },
  {
    accessorKey: "grade",
    header: "Tên khối",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span className="font-medium">{row.original.grade?.name}</span>
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
      const subject = row.original;
      const [modalOpen, setModalOpen] = useState(false);
      const [selectedSubject, setSelectedSubject] =
        useState<SubjectResponse | null>(null);
      const updateStatusMutation = useUpdateSubjectStatus();
      const handleEdit = () => {
        setModalOpen(true);
        setSelectedSubject(subject);
      };

      const handleChangeStatus = (newStatus: "ACTIVE" | "INACTIVE") => {
        updateStatusMutation.mutate(
          {
            id: String(subject.id), // ✅ truyền đúng id đang được chọn
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

              {subject.status === "ACTIVE" ? (
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
          <UpdateSubjectModal
            open={modalOpen}
            onOpenChange={setModalOpen}
            subject={selectedSubject}
          />
        </>
      );
    },
  },
];
