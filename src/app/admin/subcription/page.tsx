"use client";

import { Button } from "@/components/ui/Button";
import { Row } from "@tanstack/react-table";
import { useState } from "react";
import SubscriptionTable from "@/components/organisms/subscription-table";
import { SubscriptionResponse } from "@/types";
import { Input } from "@/components/ui/input";

function SubscriptionManagementPage() {
  const [selected, setSelected] = useState<Row<SubscriptionResponse>[]>([]);

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center gap-2.5">
        <Input placeholder="Tìm kiếm" className="max-w-sm" />
        {selected.length > 0 && (
          <div className="flex gap-1.5 items-center">
            <p className="text-sm text-muted-foreground pr-2.5">
              Đã chọn {selected.length}
            </p>
            <Button>Xoá</Button>
          </div>
        )}
      </div>

      <SubscriptionTable
        onSelectionChange={(rows) => {
          setSelected(rows);
        }}
      />
    </div>
  );
}

export default SubscriptionManagementPage;
