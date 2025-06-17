
import { Row } from "@tanstack/react-table";
import { LessonPlanResponse } from "@/types";
import { DataTable } from "../data-table";
import { lessonPlanColumns } from "./column";
import { useFormsService } from "@/services/lessonPlanServices";

interface LessonPlanTableProps {
  onSelectionChange?: (selectedRows: Row<LessonPlanResponse>[]) => void;
}

export default function LessonPlanTable({
  onSelectionChange,
}: LessonPlanTableProps) {
  const { data: lessonPlans } = useFormsService();

  return (
    <DataTable
      columns={lessonPlanColumns}
      data={lessonPlans?.data || []}
      onSelectionChange={onSelectionChange}
    />
  );
}
