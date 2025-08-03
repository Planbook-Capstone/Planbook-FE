"use client";
import TrashTable from "@/components/organisms/table-trash";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useToolResultsWithParamsService } from "@/services/toolResultService";
import { ToolResultResponse } from "@/types";
import { useState } from "react";

function TrashPage() {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);

  const {
    data: toolResults,
    refetch,
    isLoading,
  } = useToolResultsWithParamsService(
    [currentPage, pageSize], // dependencies for query key
    { retry: 1, staleTime: 0 }, // options
    {
      userId: user?.id,
      page: currentPage + 1,
      size: pageSize,
      sort: "createdAt,desc",

      status: "DELETED",
    }
  );

  // Handle restore function
  const handleRestore = (item: ToolResultResponse) => {
    console.log("Item ID:", item.id);

    // TODO: Call API to restore item
    // Example: updateToolResult(item.id, { status: "ARCHIVED" })
  };

  return (
    <div className="min-h-screen  p-2">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-calsans text-gray-900">Thùng rác</h1>
      </div>
      {isLoading ? (
        <Skeleton className="h-[200px] w-full rounded-md bg-neutral-300" />
      ) : (
        <TrashTable
          trashData={toolResults?.data?.content || []}
          onRestore={handleRestore}
        />
      )}
    </div>
  );
}

export default TrashPage;
