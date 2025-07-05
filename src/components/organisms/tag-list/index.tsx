import { DataTable } from "../data-table";

import { Row } from "@tanstack/react-table";
import { TagResponse } from "@/types";
import { tagColumns } from "./columns";
import { useTagService } from "@/services/tagServices";

interface TagTableProps {
  onSelectionChange?: (selectedRows: Row<TagResponse>[]) => void;
}

export default function TagTable({ onSelectionChange }: TagTableProps) {
  const { data: tags } = useTagService();

  return (
    <>
      <DataTable
        columns={tagColumns}
        data={tags?.data || []}
        onSelectionChange={onSelectionChange}
      />
    </>
  );
}
