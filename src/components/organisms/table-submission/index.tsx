import { DataTable } from "../data-table";
import { ordersColumns } from "./columns";
import { Row } from "@tanstack/react-table";
import { SubmissionData } from "@/services/examInstanceServices";

interface SubmissionTableProps {
  submitions: SubmissionData[];
  onSelectionChange?: (selectedRows: Row<SubmissionData>[]) => void;
  onViewDetail?: (order: SubmissionData) => void; // Made optional for backward compatibility
  // onToggleUserStatus?: (order: Order) => void;
}

export default function SubmissionTable({
  submitions,
  onSelectionChange,
  onViewDetail,
}: // onToggleUserStatus,
SubmissionTableProps) {
  const columns = ordersColumns({
    onViewDetail,
    // onToggleUserStatus,
  });

  return (
    <>
      <DataTable
        columns={columns}
        data={submitions}
        onSelectionChange={onSelectionChange}
      />
    </>
  );
}
