"use client";

import LessonPlanTable from "@/components/organisms/lesson-plan-list";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { LessonPlanResponse } from "@/types";
import { Row } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LessonPlanManagementPage() {
  const [selected, setSelected] = useState<Row<LessonPlanResponse>[]>([]);
  const router = useRouter();

  const handleCreateLessonPlan = () => {
    router.push("/admin/lesson-plan/new");
  };

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <Input placeholder="Tìm kiếm" className="max-w-sm" />
        {selected.length > 0 ? (
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">
              Đã chọn {selected.length}
            </p>
            <Button>Chỉnh sửa</Button>
          </div>
        ) : (
          <Button
            className="bg-[linear-gradient(227deg,_#20DCDF_5.38%,_#25BEE5_16.58%,_#2C99EE_26.8%,_#368BEB_39.32%,_#3860D2_50.53%,_#3A39BB_60.74%,_#3714A2_73.92%)]"
            onClick={handleCreateLessonPlan}
          >
            <Plus /> Tạo giáo án mới
          </Button>
        )}
      </div>

      <LessonPlanTable onSelectionChange={(rows) => setSelected(rows)} />
    </div>
  );
}
