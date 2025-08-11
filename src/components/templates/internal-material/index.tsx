"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Play, X } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
import {
  useMaterialSearchService,
  useMaterialsWithParamsService,
} from "@/services/materialServices";
import { useTagService } from "@/services/tagServices";

interface InternalMaterialProps {
  deleteMaterial?: (materialId: string) => void;
}

interface MediaItem {
  id: string;
  url: string;
  name: string;
  type: "image" | "video";
}

export default function InternalMaterial({
  deleteMaterial,
}: InternalMaterialProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTagId, setActiveTagId] = useState<string>("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(20); // 8 columns x 3 rows for images

  // Delete confirmation modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [materialToDelete, setMaterialToDelete] = useState<MediaItem | null>(null);

  // Use paginated service for internal materials
  const { data: materialInternalData } = useMaterialsWithParamsService(
    [currentPage, pageSize], // dependencies for query key
    { retry: 1, staleTime: 0 }, // options
    {
      page: currentPage,
      size: pageSize,
      sort: "createdAt,desc",
    } // pagination params
  );

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Delete confirmation handlers
  const handleDeleteClick = (material: MediaItem) => {
    setMaterialToDelete(material);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (materialToDelete && deleteMaterial) {
      deleteMaterial(materialToDelete.id);
    }
    setShowDeleteModal(false);
    setMaterialToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setMaterialToDelete(null);
  };

  // Get all media files from both sources
  const allMediaFiles = useMemo(() => {
    const mediaFiles: MediaItem[] = [];

    // Add materials from search service (by tag)
    materialInternalData?.data?.content?.forEach((item: any, idx: number) => {
      const ext = item?.url?.split(".").pop()?.toLowerCase();
      const isImage = ["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(
        ext
      );
      const isVideo = ["mp4", "webm", "ogg", "avi", "mov", "wmv"].includes(ext);

      if (isImage || isVideo) {
        mediaFiles.push({
          id: `material-${idx}`,
          url: item.url,
          name: item.name,
          type: isVideo ? "video" : "image",
        });
      }
    });

    // Add internal materials from paginated service
    materialInternalData?.data?.content?.forEach((item: any, idx: number) => {
      const ext = item?.url?.split(".").pop()?.toLowerCase();
      const isImage = ["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(
        ext
      );
      const isVideo = ["mp4", "webm", "ogg", "avi", "mov", "wmv"].includes(ext);

      if (isImage || isVideo) {
        mediaFiles.push({
          id: `internal-${idx}`,
          url: item.url,
          name: item.name,
          type: isVideo ? "video" : "image",
        });
      }
    });

    return mediaFiles;
  }, [materialInternalData]);

  // Filter media files by search query and type
  const filteredImages = useMemo(() => {
    return allMediaFiles
      .filter((item) => item.type === "image")
      .filter((item) =>
        searchQuery
          ? item.name.toLowerCase().includes(searchQuery.toLowerCase())
          : true
      );
  }, [allMediaFiles, searchQuery]);

  const filteredVideos = useMemo(() => {
    return allMediaFiles
      .filter((item) => item.type === "video")
      .filter((item) =>
        searchQuery
          ? item.name.toLowerCase().includes(searchQuery.toLowerCase())
          : true
      );
  }, [allMediaFiles, searchQuery]);

  // Get pagination info from server response
  const totalPages = materialInternalData?.data?.totalPages || 0;
  const totalElements = materialInternalData?.data?.totalElements || 0;

  return (
    <div className="flex-1 flex flex-col px-4 min-h-0 overflow-y-scroll">
      <Tabs defaultValue="images" className="w-full flex flex-col flex-1">
        <TabsList className="grid w-1/3 grid-cols-2">
          <TabsTrigger value="images">
            Ảnh ({filteredImages.length})
          </TabsTrigger>
          <TabsTrigger value="videos">
            Video ({filteredVideos.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="images" className="flex-1">
          <div className="flex-1">
            {filteredImages.length > 0 ? (
              <div className="space-y-4">
                {/* Simple Grid Layout */}
                <div className="grid grid-cols-8 gap-3">
                  {filteredImages.map((image) => (
                    <div
                      key={image.id}
                      className="group relative cursor-pointer rounded-lg overflow-hidden bg-white shadow-sm border-2 transition-all duration-200 hover:shadow-md hover:transform hover:scale-[1.02] border-gray-300 hover:border-blue-300"
                    >
                      <div className="aspect-square">
                        <img
                          src={image.url}
                          alt={image.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/placeholder-image.png"; // Fallback image
                          }}
                        />
                      </div>

                      {/* Delete button */}
                      {deleteMaterial && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent triggering the parent onClick
                            handleDeleteClick(image);
                          }}
                          className="cursor-pointer absolute top-0 right-0 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
                          title="Xóa ảnh"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}

                      {/* Image overlay with name */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                        <p className="text-white text-xs truncate">
                          {image.name}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination for Images */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-6">
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
                              if (currentPage < totalPages - 1) {
                                handlePageChange(currentPage + 1);
                              }
                            }}
                            className={
                              currentPage >= totalPages - 1
                                ? "!text-black pointer-events-none opacity-50"
                                : "!text-black hover:!text-black"
                            }
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-16 text-sm text-gray-500">
                {searchQuery
                  ? "Không tìm thấy ảnh nào"
                  : "Chưa có ảnh, vui lòng tải lên"}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="videos" className="flex-1">
          <div className="grid grid-cols-3">
            <div className="p-4">
              {filteredVideos.length > 0 ? (
                <div className="space-y-3">
                  {filteredVideos.map((video) => (
                    <div
                      key={video.id}
                      className="group relative border border-gray-200 rounded-lg p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      {/* Delete button */}
                      {deleteMaterial && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent triggering the parent onClick
                            handleDeleteClick(video);
                          }}
                          className="absolute top-2 right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
                          title="Xóa video"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}

                      <div className="flex items-center gap-3">
                        {/* Video Thumbnail */}
                        <div className="w-16 h-12 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                          <video
                            src={video.url}
                            className="w-full h-full object-cover rounded"
                            muted
                            preload="metadata"
                            onError={(e) => {
                              const target = e.target as HTMLVideoElement;
                              target.style.display = "none";
                              const parent = target.parentElement;
                              if (parent) {
                                parent.innerHTML =
                                  '<div class="text-purple-500"><svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M8 5v10l8-5-8-5z"/></svg></div>';
                              }
                            }}
                          />
                        </div>

                        {/* Video Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <Play className="w-4 h-4 text-purple-500 flex-shrink-0" />
                            <h3 className="text-sm font-medium text-gray-900 truncate">
                              {video.name}
                            </h3>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            🎬 Video file
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 text-sm text-gray-500">
                  {searchQuery
                    ? "Không tìm thấy video nào"
                    : "Chưa có video, vui lòng tải lên"}
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmDialog
        isOpen={showDeleteModal}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa tài liệu"
        itemName={materialToDelete?.name}
        isLoading={false}
      />
    </div>
  );
}
