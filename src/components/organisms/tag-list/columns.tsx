import { ColumnDef } from "@tanstack/react-table";

import { TagResponse } from "@/types";
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

export const tagColumns: ColumnDef<TagResponse>[] = [
  {
    id: "index",
    header: "STT",
    cell: ({ row }) => row.index + 1,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Tên loại",
    cell: ({ row }) => row.original.name,
  },
  {
    accessorKey: "description",
    header: "Mô tả",
    cell: ({ row }) => row.original.description,
  },
];
