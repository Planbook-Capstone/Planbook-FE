import { DataTable } from "../data-table";
import { trashsColumns } from "./columns";
import { Row } from "@tanstack/react-table";
import { ToolResultResponse } from "@/types";

interface TrashTableProps {
  trashData: any[];
  onSelectionChange?: (selectedRows: Row<ToolResultResponse>[]) => void;
  onRestore?: (item: ToolResultResponse) => void;
}

export default function TrashTable({
  trashData,
  onSelectionChange,
  onRestore,
}: TrashTableProps) {
  const columns = trashsColumns({
    onRestore: onRestore || (() => {}),
  });

  return (
    <>
      <DataTable
        columns={columns}
        data={trashData}
        onSelectionChange={onSelectionChange}
      />
    </>
  );
}
