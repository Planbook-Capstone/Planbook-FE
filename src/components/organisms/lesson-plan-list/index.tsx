
import { Row } from "@tanstack/react-table";
import { LessonPlanResponse } from "@/types";
import { DataTable } from "../data-table";
import { lessonPlanColumns } from "./column";

interface LessonPlanTableProps {
  onSelectionChange?: (selectedRows: Row<LessonPlanResponse>[]) => void;
}

export default function LessonPlanTable({
  onSelectionChange,
}: LessonPlanTableProps) {
  const lessonPlans: any = null;

  return (
    <DataTable
      columns={lessonPlanColumns}
      data={lessonPlans?.data?.content || []}
      onSelectionChange={onSelectionChange}
    />
  );
}
