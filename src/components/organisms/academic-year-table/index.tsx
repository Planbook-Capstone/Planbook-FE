import { DataTable } from "../data-table";
import {  yearColumns } from "./columns";
import { Row } from "@tanstack/react-table";
import { useAcademicYearsService } from "@/services/academicYearServices";
import { AcademicYearResponse } from "@/types";

interface AcademicYearTableProps {
  onSelectionChange?: (selectedRows: Row<AcademicYearResponse>[]) => void;
}

export default function AcademicYearTable({
  onSelectionChange,
}: AcademicYearTableProps) {
  const { data, isLoading, error } = useAcademicYearsService();

  if (isLoading) {
    return <div>Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div>Có lỗi xảy ra khi tải dữ liệu năm học</div>;
  }

  return (
    <DataTable
      columns={yearColumns}
      data={data?.data || []}
      onSelectionChange={onSelectionChange}
    />
  );
}
