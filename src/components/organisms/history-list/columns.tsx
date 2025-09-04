import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { getToolActionName } from "@/constants";
import LessonNamesCell from "./LessonNamesCell";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import HistoryDetailModal from "./HistoryDetailModal";

export type HistoryItem = {
  id: number;
  code: string;
  description?: string;
  updatedAt: string;
  sources?: string;
  lessonIds: string | number[];
  tokenUsed: number;
  input?: any;
  output?: any;
  userId?: string;
  toolId?: string;
  academicYearId?: number;
  resultId?: number | null;
  templateId?: number | null;
  status?: string;
  toolType?: string;
  createdAt?: string;
};

export const historyColumns: ColumnDef<HistoryItem>[] = [
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
    accessorKey: "code",
    header: "Chức năng sử dụng",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span className="font-medium truncate max-w-[200px]">
          {getToolActionName(row.original.code)}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "lessonIds",
    header: "Bài học đã chọn",
    cell: ({ row }) => {
      // Parse lessonIds if it's a string
      let lessonIds: string[] | number[] = [];
      const originalLessonIds = row.original?.lessonIds;

      if (typeof originalLessonIds === "string") {
        try {
          // Try to parse as JSON array
          const parsed = JSON.parse(originalLessonIds);
          lessonIds = Array.isArray(parsed) ? parsed : [parsed];
        } catch {
          // If parsing fails, treat as comma-separated string
          lessonIds = originalLessonIds
            .split(",")
            .map((id) => id.trim())
            .filter(Boolean);
        }
      } else if (Array.isArray(originalLessonIds)) {
        lessonIds = originalLessonIds;
      }

      return (
        <div className="max-w-[240px]">
          <LessonNamesCell lessonIds={lessonIds} />
        </div>
      );
    },
  },
  {
    accessorKey: "updatedAt",
    header: "Cập nhật lần cuối",
    cell: ({ row }) => (
      <span>
        {new Date(row.original.updatedAt).toLocaleString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false, // để dùng định dạng 24h thay vì AM/PM
        })}
      </span>
    ),
  },
  {
    accessorKey: "tokenUsed",
    header: "Token đã sử dụng",
    cell: ({ row }) => <span>{row.original.tokenUsed}</span>,
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const [isModalOpen, setIsModalOpen] = useState(false);

      return (
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1"
          >
            Chi tiết
          </Button>
          <HistoryDetailModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            historyItem={row.original}
          />
        </div>
      );
    },
  },
];
