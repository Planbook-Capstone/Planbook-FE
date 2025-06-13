import { DataTable } from "../data-table";

import { Row } from "@tanstack/react-table";
import { GradeResponse } from "@/types";
import { useGradesService } from "@/services/gradeServices";
import { useState } from "react";
import { gradeColumns } from "./columns";

interface GradeTableProps {
  onSelectionChange?: (selectedRows: Row<GradeResponse>[]) => void;
}

export default function GradeTable({ onSelectionChange }: GradeTableProps) {
  const { data: grades } = useGradesService();

  return (
    <>
      <DataTable
        columns={gradeColumns}
        data={grades?.data?.content || []}
        onSelectionChange={onSelectionChange}
      />
    </>
  );
}
