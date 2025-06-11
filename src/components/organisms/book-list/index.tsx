import { useBooksService } from "@/services/bookServices";
import { DataTable } from "../data-table";
import { bookColumns } from "./columns";
import { Row } from "@tanstack/react-table";
import { BookResponse } from "@/types";

interface BookTableProps {
  onSelectionChange?: (selectedRows: Row<BookResponse>[]) => void;
}

export default function BookTable({ onSelectionChange }: BookTableProps) {
  const { data: books } = useBooksService();

  return (
    <DataTable
      columns={bookColumns}
      data={books?.data?.content || []}
      onSelectionChange={onSelectionChange}
    />
  );
}
