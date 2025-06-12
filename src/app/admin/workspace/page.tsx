"use client";
import AcademicYearTable from "@/components/organisms/academic-year-table";
import { AcademicYear } from "@/components/organisms/academic-year-table/columns";
import CreateYearModal from "@/components/organisms/create-year-modal";
import { Button } from "@/components/ui/Button";
import { Row } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import { useState } from "react";

function WorkspaceManagementPage() {
  const [selected, setSelected] = useState<Row<AcademicYear>[]>([]);
  return (
    <div className="space-y-5">
      <div className="flex justify-end items-center gap-2.5">
        {selected.length > 0 ? (
          <div className="flex gap-1.5 items-center">
            <p className="text-sm text-muted-foreground pr-2.5">
              Đã chọn {selected.length}
            </p>
            <Button>Chỉnh sửa</Button>
          </div>
        ) : (
          <CreateYearModal/>
        )}
      </div>
      <AcademicYearTable
        onSelectionChange={(rows) => {
          setSelected(rows);
        }}
      />
    </div>
  );
}

export default WorkspaceManagementPage;
