import React, { useState, useMemo } from "react";
import { DataTable } from "../data-table";
import { historyColumns, HistoryItem } from "./columns";

import { Card, CardContent } from "@/components/ui/card";

interface HistoryListProps {
  data: HistoryItem[];
}

export default function HistoryList({ data }: HistoryListProps) {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="space-y-4">
      {/* Data Table */}
      <DataTable columns={historyColumns} data={data} />
    </div>
  );
}
