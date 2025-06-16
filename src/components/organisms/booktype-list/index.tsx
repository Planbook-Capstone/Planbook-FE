import { DataTable } from "../data-table";
import { bookTypeColumns } from "./columns";
import { Row } from "@tanstack/react-table";
import { BookTypeResponse } from "@/types";
import { useBookTypesService } from "@/services/bookTypeServices";

interface BookTypeTableProps {
  onSelectionChange?: (selectedRows: Row<BookTypeResponse>[]) => void;
}

export default function BookTypeTable({
  onSelectionChange,
}: BookTypeTableProps) {
  const { data: bookTypes } = useBookTypesService();

  return (
    <DataTable
      columns={bookTypeColumns}
      data={bookTypes?.data?.content || []}
      onSelectionChange={onSelectionChange}
    />
  );
}
