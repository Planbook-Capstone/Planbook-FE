import { DataTable } from "../data-table";
import { subjectColumns } from "./columns";
import { Row } from "@tanstack/react-table";
import { useSubjectsService } from "@/services/subjectServices";
import { SubjectResponse } from "@/types";

interface SubjectTableProps {
  onSelectionChange?: (selectedRows: Row<SubjectResponse>[]) => void;
}

export default function SubjectTable({ onSelectionChange }: SubjectTableProps) {
  const { data: subjects } = useSubjectsService();

  return (
    <DataTable
      columns={subjectColumns}
      data={subjects?.data?.content || []}
      onSelectionChange={onSelectionChange}
    />
  );
}
