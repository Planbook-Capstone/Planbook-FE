import { ColumnDef } from "@tanstack/react-table";
import { LessonPlanResponse } from "@/types";
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

export const lessonPlanColumns: ColumnDef<LessonPlanResponse>[] = [
  {
    id: "id",
    header: "STT",
    cell: ({ row }) => row.index + 1,
    enableSorting: false,
  },
  {
    accessorKey: "name",
    header: "Tên giáo án",
    cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
  },
  {
    accessorKey: "createdAt",
    header: "Ngày tạo",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.createdAt}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      const status = row.original.status;
      const getVariant = (status: string) =>
        status === "DRAFT"
          ? "secondary"
          : status === "PUBLISHED"
          ? "success"
          : "outline";
      return <Badge variant={getVariant(status)}>{status}</Badge>;
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const lesson = row.original;

      const handleEdit = () => {
        toast.info(`Chỉnh sửa giáo án: ${lesson.name}`);
      };

      const handleDelete = () => {
        toast.error("Chức năng xóa chưa được triển khai");
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost" className="rounded-full">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={-10}>
            <DropdownMenuItem onClick={handleEdit}>Chỉnh sửa</DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete} className="text-red-600">
              Xóa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
