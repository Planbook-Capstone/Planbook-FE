import { DataTable } from "../data-table";
import { AcademicYear, yearColumns } from "./columns";
import { Row } from "@tanstack/react-table";

interface AcademicYearTableProps {
  onSelectionChange?: (selectedRows: Row<AcademicYear>[]) => void;
}

export default function AcademicYearTable({
  onSelectionChange,
}: AcademicYearTableProps) {
  const data: AcademicYear[] = [
    {
      id: 1,
      start_date: "2024-08-01",
      end_date: "2025-05-31",
      year_label: "Năm học 2024-2025",
      status: "active",
      created_at: "2024-06-01T10:00:00Z",
      updated_at: "2024-06-01T10:00:00Z",
    },
    {
      id: 2,
      start_date: "2023-08-01",
      end_date: "2024-05-31",
      year_label: "Năm học 2023-2024",
      status: "inactive",
      created_at: "2023-06-01T09:30:00Z",
      updated_at: "2024-05-31T15:45:00Z",
    },
    {
      id: 3,
      start_date: "2022-08-15",
      end_date: "2023-05-20",
      year_label: "Năm học 2022-2023",
      status: "inactive",
      created_at: "2022-06-10T14:20:00Z",
      updated_at: "2023-05-21T10:10:00Z",
    },
  ];

  return (
    <DataTable
      columns={yearColumns}
      data={data}
      onSelectionChange={onSelectionChange}
    />
  );
}
