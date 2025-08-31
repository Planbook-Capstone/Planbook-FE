"use client";
import React, { useState, useEffect } from "react";
import {
  useToolResultsWithParamsService,
  useDeleteToolResultService,
} from "@/services/toolResultService";
import { useDeleteMaterialService } from "@/services/materialServices";
import {
  useExamTemplatesService,
  useDeleteExamTemplateService,
} from "@/services/examTemplateServices";
import DocumentItem from "@/components/molecules/document-item";
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
import { useRecentFilesWithHelpers } from "@/store/recentFilesHelpers";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/Button";
import { Grid3X3, List, Search, Filter } from "lucide-react";
import { useMemo } from "react";
import LibraryList from "@/components/organisms/library-list";
import LibraryFilterModal, {
  FilterData,
} from "@/components/organisms/library-filter-modal";

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
  const [pageSize] = useState(15);

  // Modal state
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);

  // Filter and view state
  const [view, setView] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterData>({
    lessonIds: [],
  });

  // Reset currentPage to 0 when id (type) changes
  useEffect(() => {
    setCurrentPage(0);
  }, [id]);

  // Conditionally use different services based on id
  const {
    data: toolResults,
    refetch,
    isLoading,
  } = useToolResultsWithParamsService(
    [id, currentPage, pageSize, sortBy, activeFilters], // dependencies for query key
    { retry: 1, staleTime: 0, enabled: id !== "QUIZ" }, // options - disable for QUIZ
    {
      userId: user?.id,
      page: currentPage + 1,
      size: pageSize,
      sortBy: "CREATED_AT",
      sortDirection: sortBy === "newest" ? "DESC" : "ASC",
      type: id,
      status: "ARCHIVED",
      source: "AI",
      // Filter parameters - convert array to comma-separated string
      ...(activeFilters.lessonIds.length > 0 && {
        lessonIds: activeFilters.lessonIds.map((id) => parseInt(id)).join(","),
      }),
    }
  );

  // Use exam templates service for QUIZ
  const {
    data: templates,
    isLoading: isLoadingTemplates,
    refetch: refetchTemplates,
  } = useExamTemplatesService();

  // Delete services
  const { mutate: deleteToolResult, isPending: isDeleting } =
    useDeleteToolResultService();
  const { mutate: deleteMaterial, isPending: isDeletingMaterial } =
    useDeleteMaterialService();
  const { mutate: deleteExamTemplate, isPending: isDeletingTemplate } =
    useDeleteExamTemplateService();

  // Recent files store
  const { closeFile } = useRecentFilesWithHelpers();

  // Filter data based on search query
  // Client-side filtering for search by name (faster than server-side)
  const filteredData = useMemo(() => {
    if (id === "QUIZ") {
      const data = templates?.data || [];
      if (!searchQuery) return data;
      return data.filter(
        (item: any) =>
          item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    } else {
      const data = toolResults?.data?.content || [];
      if (!searchQuery) return data;
      return data.filter(
        (item: any) =>
          item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
  }, [id, templates?.data, toolResults?.data?.content, searchQuery]);

  // Handle filter apply
  const handleApplyFilter = (filters: FilterData) => {
    setActiveFilters(filters);
    // Reset to first page when applying filters
    setCurrentPage(0);
  };

  // Helper function to generate file ID for recent files
  const getRecentFileId = (item: any) => {
    if (id === "QUIZ") {
      return `exam-${item.id}`;
    } else {
      // Determine file type based on item.type
      let fileType = "other";
      if (item.type === "EXAM") {
        fileType = "exam";
      } else if (item.type === "LESSON_PLAN") {
        fileType = "lesson-plan";
      } else if (item.type === "SLIDE") {
        fileType = "slide";
      }
      return `${fileType}-${item.id}`;
    }
  };

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
      if (id === "QUIZ") {
        // Delete exam template
        deleteExamTemplate(itemToDelete.id, {
          onSuccess: () => {
            // Remove from recent files if exists
            const recentFileId = getRecentFileId(itemToDelete);
            closeFile(recentFileId);

            // Close modal and reset state
            setShowConfirmModal(false);
            setItemToDelete(null);

            // Refetch data to update the list
            currentRefetch();

            // Show success message
            toast.success("Xóa template thành công!");
          },
          onError: (error) => {
            console.error("Error deleting template:", error);
            toast.error("Có lỗi xảy ra khi xóa template");
          },
        });
      } else {
        // Delete tool result
        deleteToolResult(itemToDelete.id, {
          onSuccess: () => {
            // Remove from recent files if exists
            const recentFileId = getRecentFileId(itemToDelete);
            closeFile(recentFileId);

            // Close modal and reset state
            setShowConfirmModal(false);
            setItemToDelete(null);

            // Refetch data to update the list
            currentRefetch();

            // Show success message
            toast.success("Xóa tài liệu thành công!");
          },
          onError: (error) => {
            console.error("Error deleting item:", error);
            toast.error("Có lỗi xảy ra khi xóa tài liệu");
          },
        });
      }
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
    if (id === "QUIZ") {
      // For QUIZ items (exam templates), navigate to exam template editor
      router.push(`/exam-templates/${item.id}`);
    } else {
      // For other types, navigate to the file viewer
      router.push(`/my-library/file/${item.id}`);
    }
  };

  // Determine which loading state and refetch function to use
  const currentIsLoading = id === "QUIZ" ? isLoadingTemplates : isLoading;
  const currentRefetch = id === "QUIZ" ? refetchTemplates : refetch;

  if (currentIsLoading) {
    return (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
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
        <InternalMaterial deleteMaterial={handleDeleteMaterial} />
      </>
    );
  }

  return (
    <div>
      {/* Filter Controls */}
      <div className="mb-6 space-y-4">
        {/* Search and Sort Row */}
        <div className="flex flex-col  md:flex-row gap-4 items-start sm:items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1 md:max-w-md min-w-64 w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Tìm kiếm theo tên..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Sort and View Controls */}
          <div className="flex flex-col md:flex-row justify-end items-stretch md:items-center gap-2.5 w-full md:w-auto">
            <div className="flex gap-2">
              {/* Filter Button */}
              <Button
                variant="outline"
                size="default"
                onClick={() => setShowFilterModal(true)}
                className="flex items-center justify-center gap-2 flex-1 md:flex-none md:w-auto"
              >
                <Filter className="h-4 w-4" />
                <span className="hidden xs:inline">Bộ lọc theo bài</span>
                <span className="xs:hidden">Lọc</span>
                {activeFilters.lessonIds.length > 0 && (
                  <span className="bg-red-500 text-white text-xs px-[7px] py-0.5 rounded-full">
                    {activeFilters.lessonIds.length}
                  </span>
                )}
              </Button>

              {/* Sort Dropdown */}
              <Select
                value={sortBy}
                onValueChange={(value: "newest" | "oldest") => setSortBy(value)}
              >
                <SelectTrigger className="min-w-[100px] flex-1 md:flex-none md:w-auto rounded-sm">
                  <SelectValue placeholder="Sắp xếp" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Mới nhất</SelectItem>
                  <SelectItem value="oldest">Cũ nhất</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* View Toggle */}
            <div className="flex items-center bg-white border rounded-full p-1 w-full md:w-auto">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setView("grid")}
                className={`rounded-full px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium transition-all flex-1 md:flex-none ${
                  view === "grid"
                    ? "bg-white text-black border border-gray-200 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Grid3X3 className="h-4 w-4 mr-1" />
                <span className="hidden xs:inline">Hàng lưới</span>
                <span className="xs:hidden">Lưới</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setView("list")}
                className={`rounded-full px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium transition-all flex-1 md:flex-none ${
                  view === "list"
                    ? "bg-white text-black border border-gray-200 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <List className="h-4 w-4 mr-1" />
                <span className="hidden xs:inline">Danh sách</span>
                <span className="xs:hidden">Danh sách</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Active Filters Display */}
        {(activeFilters.lessonIds.length > 0 || searchQuery) && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-calsans text-gray-600">
              Đang lọc:
            </span>
            {activeFilters.lessonIds.length > 0 && (
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                {activeFilters.lessonIds.length} bài học
              </span>
            )}
            {searchQuery && (
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                Tìm kiếm: "{searchQuery}"
              </span>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setActiveFilters({ lessonIds: [] });
                setSearchQuery("");
                setCurrentPage(0);
              }}
              className="text-red-500 hover:text-red-700 text-xs"
            >
              Xóa bộ lọc
            </Button>
          </div>
        )}
      </div>

      {/* Handle empty state for both data sources */}
      {((id === "QUIZ" && (!templates?.data || templates.data.length === 0)) ||
        (id !== "QUIZ" &&
          (!toolResults?.data?.content ||
            toolResults.data.content.length === 0))) && (
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
      {/* Data Display */}
      {view === "list" ? (
        /* List View - Using LibraryList component */
        <LibraryList
          data={filteredData.map((item: any) => ({
            ...item,
            itemType: id,
          }))}
          onItemClick={handleItemClick}
          onRemoveClick={handleRemoveClick}
          type={id}
        />
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
          {filteredData.map((data: any, index: number) => (
            <div key={index} className="col-span-1 cursor-pointer">
              <DocumentItem
                type={
                  id === "QUIZ"
                    ? "DOCX"
                    : data?.type === "SLIDE"
                    ? "PPTX"
                    : "DOCX"
                }
                name={data?.name}
                description={
                  id === "QUIZ"
                    ? data?.subject || data?.description
                    : data?.description
                }
                lastModifiedTime={new Date(
                  data?.updatedAt || data?.createdAt
                ).toLocaleString("vi-VN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })}
                onRemove={() => handleRemoveClick(data)}
                onClick={() => handleItemClick(data)}
              />
            </div>
          ))}
        </div>
      )}
      {/* Pagination using shadcn/ui - only show for toolResults, not for templates */}
      {id !== "QUIZ" &&
        toolResults?.data &&
        toolResults.data.totalPages > 1 && (
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
        isLoading={id === "QUIZ" ? isDeletingTemplate : isDeleting}
      />

      {/* Filter Modal */}
      <LibraryFilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApplyFilter={handleApplyFilter}
        initialFilters={activeFilters}
      />
    </div>
  );
}

export default MyLibraryDetail;
