"use client";
import TrashTable from "@/components/organisms/table-trash";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import {
  useToolResultsWithParamsService,
  useUpdateToolResultStatusService,
} from "@/services/toolResultService";
import { ToolResultResponse } from "@/types";
import { useState } from "react";
import { toast } from "sonner";

function TrashPage() {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const { mutate } = useUpdateToolResultStatusService();
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

    mutate(
      {
        id: String(item.id),
        field: "status",
        queryParams: { status: "ARCHIVED" },
      },
      {
        onSuccess: () => {
          console.log("Restore successful");
          refetch(); // Refresh the data after successful restore
          toast.success("Khôi phục thành công");
        },
        onError: (error) => {
          console.error("Error restoring item:", error?.response?.data);
          toast.error(`Khôi phục thất bại: ${error?.response?.data}`);
        },
      }
    );
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
