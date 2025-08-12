"use client";

import { useState } from "react";

import MainLayout from "@/components/layout/MainLayout";
import CardFeature from "@/components/organisms/card-feature";
import { HistoryIcon } from "@/constants/icon";
import ItemSection from "@/components/organisms/item-section";
import HistoryCard from "@/components/organisms/history-card";
import HistoryList from "@/components/organisms/history-list";
import { useSearchParams } from "next/navigation";
import { useBookTypesService } from "@/services/bookTypeServices";
import BannerOverlay from "@/components/organisms/banner/BannerWithOverlay";
import SpotlightCard from "@/components/ui/SpotlightCard";
import { useAuth } from "@/hooks/useAuth";
import { useToolLogsWithParamsService } from "@/services/toolLogServices";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useExternalToolsService } from "@/services/externalToolsServices";

export default function Home() {
  const searchParams = useSearchParams();
  const view = searchParams.get("view") || "grid";
  const { data: bookTypes } = useBookTypesService();
  const {
    data: externalTools,
    isLoading: isLoadingTools,
    error: apiError,
  } = useExternalToolsService(
    {
      retry: 1,
      staleTime: 0,
    },
    {
      offset: 1,
      pageSize: 10,
      sortBy: "createdAt",
      sortDirection: "desc",
    }
  );
  const { user } = useAuth();
  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);

  // Use the paginated service
  const { data: toolLogs, refetch } = useToolLogsWithParamsService(
    [currentPage, pageSize], // dependencies for query key
    { retry: 1, staleTime: 0 }, // options
    {
      userId: user?.id,
      offset: currentPage,
      pageSize: pageSize,
      sort: "createdAt,desc",
    } // pagination params
  );

  const { displayName } = useAuth();

  const getRandomColorClass = () => {
    const colorClasses = [
      "text-teal-300",
      "text-gray-600",
      "text-green-300",
      "text-blue-500",
      "text-gray-600",
      "text-violet-400",
      "text-cyan-300",
      "text-gray-600",
      "text-gray-600",
      "text-rose-700",
      "text-pink-600",
      "text-gray-600",
    ];
    const randomIndex = Math.floor(Math.random() * colorClasses.length);
    return colorClasses[randomIndex];
  };

  // Handle pagination change
  const handlePageChange = (page: number) => {
    console.log("Pagination onChange - Page data:", {
      currentPage: currentPage,
      newPage: page,
      totalPages: toolLogs?.data?.totalPages,
      totalElements: toolLogs?.data?.totalElements,
      pageSize: toolLogs?.data?.size,
    });

    // Update current page state - this will trigger refetch automatically
    setCurrentPage(page);
  };

  return (
    <MainLayout>
      {/* <Banner /> */}
      <BannerOverlay
        imageSrc="/images/background/abstract-bg.svg"
        videoSrc="https://res.cloudinary.com/dpo0ad3aq/video/upload/Scene_03_-_4K_3840x2160_h0awgk.mp4"
        title={"Chào mừng " + displayName || "Chào mừng Người dùng ẩn danh"}
        onSearch={(query) => console.log("Searching for:", query)}
        height="h-80"
        grid={10}
        mouse={0.1}
        strength={0.15}
        relaxation={0.9}
        className="mb-8"
      />

      <section className="grid grid-cols-1 lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 gap-5">
        {bookTypes?.data?.content
          ?.sort((a: any, b: any) => a.priority - b.priority)
          ?.map((feature: any) => (
            <CardFeature
              id={feature.id}
              key={feature.id}
              icon={feature.icon}
              title={feature.name}
              description={feature.description}
              href={feature.href}
            />
          ))}
        {externalTools?.data?.content
          ?.sort((a: any, b: any) => a.priority - b.priority)
          ?.map((feature: any) => (
            <CardFeature
              id={feature.id}
              key={feature.id}
              icon={feature.icon}
              title={feature.name}
              description={feature.description}
              href={feature.href}
            />
          ))}
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
        <SpotlightCard
          className="!p-0 !bg-transparent !border-0 w-full aspect-[4/3] rounded-lg overflow-hidden"
          spotlightColor="rgba(59, 130, 246, 0.3)"
        >
          <img
            src="/images/background/LessonPlanCreation.svg"
            className="w-full h-full object-cover"
          />
        </SpotlightCard>
        <SpotlightCard
          className="!p-0 !bg-transparent !border-0 w-full aspect-[4/3] rounded-lg overflow-hidden"
          spotlightColor="rgba(34, 197, 94, 0.3)"
        >
          <img
            src="/images/background/ExamCreation.svg"
            className="w-full h-full object-cover"
          />
        </SpotlightCard>
        <SpotlightCard
          className="!p-0 !bg-transparent !border-0 w-full aspect-[4/3] rounded-lg overflow-hidden"
          spotlightColor="rgba(168, 85, 247, 0.3)"
        >
          <img
            src="/images/background/SlideCreation.svg"
            className="w-full h-full object-cover"
          />
        </SpotlightCard>
      </section>

      <ItemSection
        title={
          <>
            {HistoryIcon}
            Lịch sử
          </>
        }
      />
      {view === "list" ? (
        <HistoryList data={toolLogs?.data?.content || []} />
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {toolLogs?.data?.content?.map((data: any, index: number) => (
            <HistoryCard
              key={index}
              data={data}
              className={getRandomColorClass()}
            />
          ))}
        </section>
      )}

      {toolLogs?.data && toolLogs.data.totalPages > 1 && (
        <div className="float-end mt-5 space-y-4">
          {/* Info text */}
          {/* <div className="text-center">
            <p className="text-sm text-gray-700">
              Hiển thị{" "}
              <span className="font-medium">
                {toolLogs.data.numberOfElements > 0
                  ? (toolLogs.data.number * toolLogs.data.size) + 1
                  : 0}
              </span>{" "}
              đến{" "}
              <span className="font-medium">
                {Math.min(
                  (toolLogs.data.number + 1) * toolLogs.data.size,
                  toolLogs.data.totalElements
                )}
              </span>{" "}
              trong tổng số{" "}
              <span className="font-medium">{toolLogs.data.totalElements}</span>{" "}
              kết quả
            </p>
          </div> */}

          {/* Pagination */}
          <Pagination>
            <PaginationContent>
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
                    currentPage === 0 ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>

              {/* Page Numbers */}
              {(() => {
                const totalPages = toolLogs.data.totalPages;
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
                    if (currentPage < toolLogs.data.totalPages - 1) {
                      handlePageChange(currentPage + 1);
                    }
                  }}
                  className={
                    currentPage >= toolLogs.data.totalPages - 1
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </MainLayout>
  );
}
