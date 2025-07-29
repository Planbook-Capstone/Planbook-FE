import { DataTable } from "../data-table";
import { ordersColumns } from "./columns";
import { Row } from "@tanstack/react-table";
import { ExamInstanceData } from "@/services/examInstanceServices";

interface ExamInstanceTableProps {
  examInstances: ExamInstanceData[];
  onSelectionChange?: (selectedRows: Row<ExamInstanceData>[]) => void;
  onViewDetail: (order: ExamInstanceData) => void;
  onPause?: (examInstance: ExamInstanceData) => void;
  onResume?: (examInstance: ExamInstanceData) => void;
  onStop?: (examInstance: ExamInstanceData) => void;
  onCancel?: (examInstance: ExamInstanceData) => void;
}

export default function ExamInstanceTable({
  examInstances,
  onSelectionChange,
  onViewDetail,
  onPause,
  onResume,
  onStop,
  onCancel,
}: ExamInstanceTableProps) {
  const columns = ordersColumns({
    onViewDetail,
    onPause,
    onResume,
    onStop,
    onCancel,
  });

  return (
    <>
      <DataTable
        columns={columns}
        data={examInstances}
        onSelectionChange={onSelectionChange}
      />
    </>
  );
}
