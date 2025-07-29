import { DataTable } from "../data-table";
import { examTemplateColumns } from "./columns";
import { Row } from "@tanstack/react-table";
import { ExamTemplate } from "@/components/molecules/exam-template-card";

interface ExamTemplateTableProps {
  examTemplates: ExamTemplate[];
  onSelectionChange?: (selectedRows: Row<ExamTemplate>[]) => void;
  onViewDetail: (examTemplate: ExamTemplate) => void;
  onEdit?: (examTemplate: ExamTemplate) => void;
  onDelete?: (examTemplate: ExamTemplate) => void;
  onDuplicate?: (examTemplate: ExamTemplate) => void;
}

export default function ExamTemplateTable({
  examTemplates,
  onSelectionChange,
  onViewDetail,
  onEdit,
  onDelete,
  onDuplicate,
}: ExamTemplateTableProps) {
  const columns = examTemplateColumns({
    onViewDetail,
    onEdit,
    onDelete,
    onDuplicate,
  });

  return (
    <>
      <DataTable
        columns={columns}
        data={examTemplates}
        onSelectionChange={onSelectionChange}
      />
    </>
  );
}
