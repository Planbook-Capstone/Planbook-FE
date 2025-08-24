import AudioPreview from "@/components/molecules/audio-preview";
import MediaPreview from "@/components/molecules/media-preview";
import PreviewImage from "@/components/molecules/preview-image/page";
import {
  useMaterialSearchService,
  useUpdateMaterialService,
  useMaterialByIdService,
  useDeleteMaterialService,
  useMaterialsExternalWithParamsService,
} from "@/services/materialServices";
import { useTagService } from "@/services/tagServices";
import { TagResponse } from "@/types";
import { Tabs } from "antd";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Eye, X } from "lucide-react";
import EditMaterialModal from "@/components/organisms/edit-material-modal";
import { EditMaterialFormData } from "@/schemas/material.schema";
import { toast } from "sonner";
import DeleteConfirmDialog from "@/components/organisms/delete-confirm-dialog";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { GridSkeleton } from "@/components/molecules/grid-skeleton";
function MaterialContent() {
  const { data: tag } = useTagService();
  const [activeTabId, setActiveTabId] = useState<string>("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [materialToDelete, setMaterialToDelete] = useState<any>(null);

  const { mutate, isPending } = useUpdateMaterialService();
  const { mutate: deleteMaterial, isPending: isDeleting } =
    useDeleteMaterialService();

  // Get current material data to preserve existing values
  const { data: currentMaterialData } =
    useMaterialByIdService(selectedMaterialId);

  useEffect(() => {
    if (tag?.data?.length > 0 && !activeTabId) {
      setActiveTabId(tag.data[0].id);
    }
  }, [tag?.data, activeTabId]);

  // const { data: materials, refetch: refetchMaterials } =
  //   useMaterialSearchService(activeTabId);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const {
    data: materials,
    refetch: refetchMaterials,
    isLoading,
  } = useMaterialsExternalWithParamsService(
    [currentPage, pageSize, activeTabId],
    { retry: 1, staleTime: 0 }, // options
    {
      page: currentPage,
      pageSize: pageSize,
      sortBy: "CREATED_AT",
      sortDirection: "DESC",
      tagIds: activeTabId,
      visibility: "EXTERNAL",
    } // pagination params
  );
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleTabChange = (key: string) => {
    setActiveTabId(key);
  };

  const handleViewDetail = (materialId: string) => {
    setSelectedMaterialId(materialId);
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setSelectedMaterialId("");
  };

  const handleUpdateMaterial = async (data: EditMaterialFormData) => {
    try {
      if (!selectedMaterialId || !currentMaterialData?.data) {
        toast.error("Không tìm thấy thông tin học liệu!");
        return;
      }

      const currentMaterial = currentMaterialData.data;

      // Prepare update data with only name and description, preserve other fields
      const updateData: any = {
        name: data.name,
        description: data.description,
        // Preserve existing values for other fields
        lessonId: currentMaterial.lessonId,
        tags: currentMaterial.tags,
        // Add any other fields that should be preserved
      };

      // Only include lessonId from form if it's provided
      if (data.lessonId) {
        updateData.lessonId = data.lessonId;
      }

      // Use the mutation service
      mutate(
        {
          id: selectedMaterialId,
          data: updateData,
        },
        {
          onSuccess: () => {
            toast.success("Cập nhật học liệu thành công!");
            handleCloseModal();
            // Refetch materials to update the list
            refetchMaterials();
          },
          onError: (error: any) => {
            console.error("Error updating material:", error);
            toast.error(
              error?.response?.data?.message ||
                "Có lỗi xảy ra khi cập nhật học liệu!"
            );
          },
        }
      );
    } catch (error) {
      console.error("Error updating material:", error);
      toast.error("Có lỗi xảy ra khi cập nhật học liệu!");
    }
  };

  const handleDeleteClick = (material: any) => {
    setMaterialToDelete(material);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (materialToDelete?.id) {
      deleteMaterial(materialToDelete.id, {
        onSuccess: () => {
          toast.success("Xóa học liệu thành công!");
          setIsDeleteModalOpen(false);
          setMaterialToDelete(null);
          // Refetch materials to update the list
          refetchMaterials();
        },
        onError: (error: any) => {
          console.error("Error deleting material:", error);
          toast.error(
            error?.response?.data?.message || "Có lỗi xảy ra khi xóa học liệu!"
          );
        },
      });
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setMaterialToDelete(null);
  };

  return (
    <div>
      <Tabs
        defaultActiveKey={activeTabId}
        onChange={handleTabChange}
        items={
          tag?.data?.map((item: TagResponse, index: number) => ({
            label: item.name || `Tab-${index}`,
            key: String(item.id || index), // key chính là id nếu có
            // children: `Nội dung của tag "${item.name}"`,
          })) || []
        }
      />

      {isLoading && (
        <div>
          <GridSkeleton
            count={6}
            height={130}
            cols="grid-cols-3 lg:grid-cols-4"
          />
        </div>
      )}

      <div className="mt-4 grid grid-cols-5 gap-2 ">
        {/* Đang chọn tag ID: <strong>{activeTabId}</strong> */}
        {materials?.data?.content?.map((item: any, idx: any) => {
          const extension = item?.url?.split(".")?.pop();

          const renderMaterialWithButton = (content: React.ReactNode) => (
            <div key={idx} className="relative group">
              {content}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleViewDetail(item.id)}
                  className="flex items-center gap-1 text-xs"
                >
                  <Eye className="w-3 h-3" />
                  Chi tiết
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDeleteClick(item)}
                  className="flex items-center justify-center w-8 h-8 p-0 bg-red-500 hover:bg-red-600 text-white"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          );

          switch (extension) {
            case "mp3":
              return renderMaterialWithButton(<AudioPreview item={item} />);

            case "png":
            case "jpg":
            case "jpeg":
            case "gif":
              return renderMaterialWithButton(<PreviewImage item={item} />);
            case "mp4":
            case "webm":
            case "ogg":
              return renderMaterialWithButton(<MediaPreview item={item} />);
            default:
              return null;
          }
        })}
      </div>

      {materials?.data && materials.data.totalPages > 1 && (
        <div className="float-end mt-5 space-y-4">
          <Pagination>
            <PaginationContent>
              {/* Previous Button */}
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) {
                      handlePageChange(currentPage - 1);
                    }
                  }}
                  className={
                    currentPage === 1 ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>

              {/* Page Numbers */}
              {(() => {
                const totalPages = materials.data.totalPages;
                const pages = [];

                // Show first page
                if (totalPages > 0) {
                  pages.push(
                    <PaginationItem key={1}>
                      <PaginationLink
                        href="#"
                        isActive={currentPage === 1}
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage !== 1) {
                            handlePageChange(1);
                          }
                        }}
                      >
                        1
                      </PaginationLink>
                    </PaginationItem>
                  );
                }

                // Show ellipsis if needed
                if (currentPage > 3) {
                  pages.push(
                    <PaginationItem key="ellipsis-start">
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }

                // Show pages around current page
                const start = Math.max(2, currentPage - 1);
                const end = Math.min(totalPages - 1, currentPage + 1);

                for (let i = start; i <= end; i++) {
                  if (i !== 1 && i !== totalPages) {
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
                        >
                          {i}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  }
                }

                // Show ellipsis if needed
                if (currentPage < totalPages - 2) {
                  pages.push(
                    <PaginationItem key="ellipsis-end">
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }

                // Show last page (if different from first)
                if (totalPages > 1) {
                  pages.push(
                    <PaginationItem key={totalPages}>
                      <PaginationLink
                        href="#"
                        isActive={currentPage === totalPages}
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage !== totalPages) {
                            handlePageChange(totalPages);
                          }
                        }}
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
                    if (currentPage < materials.data.totalPages) {
                      handlePageChange(currentPage + 1);
                    }
                  }}
                  className={
                    currentPage >= materials.data.totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Edit Material Modal */}
      {selectedMaterialId && (
        <EditMaterialModal
          open={isEditModalOpen}
          onClose={handleCloseModal}
          materialId={selectedMaterialId}
          onSubmit={handleUpdateMaterial}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={isDeleteModalOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa học liệu"
        itemName={materialToDelete?.name}
        isLoading={isDeleting}
      />
    </div>
  );
}

export default MaterialContent;
