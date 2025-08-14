"use client";
import React, { useState, useEffect } from "react";
import {
  useToolResultsWithParamsService,
  useDeleteToolResultService,
} from "@/services/toolResultService";
import { useDeleteMaterialService } from "@/services/materialServices";
import DocumentItem from "@/components/molecules/document-item";
import { getLibraryTypeName } from "@/constants";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useAuth } from "@/hooks/useAuth";
import { NoneExamIcon } from "@/constants/icon";
import { Skeleton } from "@/components/ui/skeleton";
import DeleteConfirmDialog from "@/components/organisms/delete-confirm-dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import InternalMaterial from "@/components/templates/internal-material";
interface Props {
  params: Promise<{
    id: string;
  }>;
}

function MyLibraryDetail({ params }: Props) {
  const { id } = React.use(params);

  const { user } = useAuth();
  const router = useRouter();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(13);

  // Modal state
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);

  // Reset currentPage to 0 when id (type) changes
  useEffect(() => {
    setCurrentPage(0);
  }, [id]);

  const {
    data: toolResults,
    refetch,
    isLoading,
  } = useToolResultsWithParamsService(
    [id, currentPage, pageSize], // dependencies for query key
    { retry: 1, staleTime: 0 }, // options
    {
      userId: user?.id,
      page: currentPage + 1,
      size: pageSize,
      sort: "createdAt,desc",
      type: id,
      status: "ARCHIVED",
    }
  );

  // Delete service
  const { mutate: deleteToolResult, isPending: isDeleting } =
    useDeleteToolResultService();
  const { mutate: deleteMaterial, isPending: isDeletingMaterial } =
    useDeleteMaterialService();

  const handlePageChange = (page: number) => {
    // Update current page state - this will trigger refetch automatically
    setCurrentPage(page);
  };

  // Handle remove item
  const handleRemoveClick = (item: any) => {
    setItemToDelete(item);
    setShowConfirmModal(true);
  };

  // Handle confirm delete
  const handleConfirmDelete = () => {
    if (itemToDelete?.id) {
      deleteToolResult(itemToDelete.id, {
        onSuccess: () => {
          // Close modal and reset state
          setShowConfirmModal(false);
          setItemToDelete(null);

          // Refetch data to update the list
          refetch();

          // Show success message
          toast.success("Xóa tài liệu thành công!");
        },
        onError: (error) => {
          console.error("Error deleting item:", error);
          toast.error("Có lỗi xảy ra khi xóa tài liệu");
        },
      });
    }
  };

  // Handle cancel delete
  const handleCancelDelete = () => {
    setShowConfirmModal(false);
    setItemToDelete(null);
  };

  // Handle material deletion
  const handleDeleteMaterial = (materialId: string) => {
    deleteMaterial(materialId, {
      onSuccess: () => {
        toast.success("Xóa học liệu thành công!");
        // Optionally refetch data if needed
      },
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message || "Có lỗi xảy ra khi xóa học liệu"
        );
      },
    });
  };

  // Handle click on tool result item
  const handleItemClick = (item: any) => {
    // For other types, you can add different handling here
    router.push(`/my-library/file/${item.id}`);
  };

  if (isLoading) {
    return (
      <>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {[...Array(7)].map((_, index) => (
            <Skeleton
              key={index}
              className="h-[150px] w-full rounded-md bg-neutral-300"
            />
          ))}
        </div>
      </>
    );
  }

  if (id === "OTHER") {
    return (
      <>
        <InternalMaterial
          deleteMaterial={handleDeleteMaterial}
        />
      </>
    );
  }

  return (
    <div>
      {toolResults?.data?.content?.length === 0 && (
        <div className="text-center py-12">
          <div className="w-56 h-56 mx-auto mb-4">{NoneExamIcon}</div>
          <h3 className="text-2xl font-calsans text-gray-900 mb-2">
            Chưa có tài liệu
          </h3>
          <h3 className="text-lg text-gray-900 mb-2">
            Chưa có tài liệu trong thư mục này
          </h3>
        </div>
      )}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {toolResults?.data?.content?.map((data: any, index: number) => (
          <div key={index} className="col-span-1 cursor-pointer">
            <DocumentItem
              type={data?.type == "SLIDE" ? "PPTX" : "DOCX"}
              name={data?.name}
              description={data?.description}
              lastModifiedTime={new Date(data?.updatedAt).toLocaleString(
                "vi-VN",
                {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                }
              )}
              onRemove={() => handleRemoveClick(data)}
              onClick={() => handleItemClick(data)}
            />
          </div>
        ))}
      </div>
      {/* Pagination using shadcn/ui */}
      {toolResults?.data && toolResults.data.totalPages > 1 && (
        <div className="float-end space-y-4">
          {/* Pagination */}
          <Pagination className="!text-black">
            <PaginationContent className="!text-black">
              {/* Previous Button */}
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 0) {
                      handlePageChange(currentPage - 1);
                    }
                  }}
                  className={
                    currentPage === 0
                      ? "!text-black pointer-events-none opacity-50"
                      : "!text-black hover:!text-black"
                  }
                />
              </PaginationItem>

              {/* Page Numbers */}
              {(() => {
                const totalPages = toolResults.data.totalPages;
                const pages = [];

                // Show first page
                if (totalPages > 0) {
                  pages.push(
                    <PaginationItem key={0}>
                      <PaginationLink
                        href="#"
                        isActive={currentPage === 0}
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage !== 0) {
                            handlePageChange(0);
                          }
                        }}
                        className="!text-black hover:text-black"
                      >
                        1
                      </PaginationLink>
                    </PaginationItem>
                  );
                }

                // Show ellipsis if needed
                if (currentPage > 2) {
                  pages.push(
                    <PaginationItem key="ellipsis-start">
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }

                // Show pages around current page
                const start = Math.max(1, currentPage - 1);
                const end = Math.min(totalPages - 1, currentPage + 1);

                for (let i = start; i <= end; i++) {
                  if (i !== 0 && i !== totalPages - 1) {
                    pages.push(
                      <PaginationItem key={i}>
                        <PaginationLink
                          href="#"
                          isActive={currentPage === i}
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage !== i) {
                              handlePageChange(i);
                            }
                          }}
                          className="!text-black hover:text-black"
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  }
                }

                // Show ellipsis if needed
                if (currentPage < totalPages - 3) {
                  pages.push(
                    <PaginationItem key="ellipsis-end">
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }

                // Show last page (if different from first)
                if (totalPages > 1) {
                  pages.push(
                    <PaginationItem key={totalPages - 1}>
                      <PaginationLink
                        href="#"
                        isActive={currentPage === totalPages - 1}
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage !== totalPages - 1) {
                            handlePageChange(totalPages - 1);
                          }
                        }}
                        className="!text-black hover:text-black"
                      >
                        {totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }

                return pages;
              })()}

              {/* Next Button */}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < toolResults.data.totalPages - 1) {
                      handlePageChange(currentPage + 1);
                    }
                  }}
                  className={
                    currentPage >= toolResults.data.totalPages - 1
                      ? "!text-black pointer-events-none opacity-50"
                      : "!text-black hover:!text-black"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={showConfirmModal}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa tài liệu"
        itemName={itemToDelete?.name}
        isLoading={isDeleting}
      />
    </div>
  );
}

export default MyLibraryDetail;
