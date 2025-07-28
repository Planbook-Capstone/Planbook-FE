import { DataTable } from "../data-table";
import { ordersColumns } from "./columns";
import { Row } from "@tanstack/react-table";
import { ExamInstanceData } from "@/services/examInstanceServices";

interface ExamInstanceTableProps {
  examInstances: ExamInstanceData[];
  onSelectionChange?: (selectedRows: Row<ExamInstanceData>[]) => void;
  onViewDetail: (order: ExamInstanceData) => void;
  // onToggleUserStatus?: (order: Order) => void;
}

export default function ExamInstanceTable({
  examInstances,
  onSelectionChange,
  onViewDetail,
}: // onToggleUserStatus,
ExamInstanceTableProps) {
  const columns = ordersColumns({
    onViewDetail,
    // onToggleUserStatus,
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
