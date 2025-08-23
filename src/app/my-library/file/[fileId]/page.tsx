"use client";
import { GridSkeleton } from "@/components/molecules/grid-skeleton";
import TemplatePreview from "@/components/organisms/template-preview";
import PreviewModal from "@/components/PreviewModalv2";
import { SlidePreview } from "@/components/ui/SlidePreview";
import { useLessonsByIdsService } from "@/services/lessonServices";
import { useToolResultByIdService } from "@/services/toolResultService";
import { useRecentFilesWithHelpers } from "@/store";
import { notFound, useRouter } from "next/navigation";
import React, { useEffect } from "react";

interface Props {
  params: Promise<{
    fileId: string;
  }>;
}

function FileDetailPage({ params }: Props) {
  const { fileId } = React.use(params);
  const { data, isError, error, isLoading } = useToolResultByIdService(fileId);
  const { addFileFromApiResponse } = useRecentFilesWithHelpers();
  const router = useRouter();
  console.log(data?.data?.status, "tran");

  useEffect(() => {
    if (isError || error) {
      notFound();
    }
    // if (data?.data?.status !== "ARCHIVED ") {
    //   notFound();
    // }
  }, [isError, error, router]);

  const lessonQueries = useLessonsByIdsService(data?.data?.lessonIds || []);

  // Get all lessons data
  const lessons = lessonQueries
    .filter((query: any) => query.data)
    .map((query: any) => query.data?.data)
    .filter(Boolean);

  // Thêm file vào recent files (chỉ chạy 1 lần khi có data)
  React.useEffect(() => {
    if (data?.data) {
      const fileData = data.data;

      // Xác định loại file
      let fileType: "exam" | "lesson-plan" | "slide" | "other" = "other";

      if (fileData.type === "EXAM") {
        fileType = "exam";
      } else if (fileData.type === "LESSON_PLAN") {
        fileType = "lesson-plan";
      } else if (fileData.type === "SLIDE") {
        fileType = "slide";
      }

      // Thêm vào recent files
      addFileFromApiResponse(
        {
          ...fileData,
          id: fileData.id || fileId,
          name: fileData.name || `File ${fileId}`,
          path: `/my-library/file/${fileId}`,
        },
        fileType
      );
    }
  }, [data?.data?.id, fileId]); // Chỉ depend vào data ID và fileId

  return (
    <div
      className={`p-6 ${data?.data?.type === "SLIDE" ? "h-auto" : "h-screen"}`}
    >
      <div className="space-y-2 h-full">
        {isLoading && (
          <div>
            <GridSkeleton
              count={4}
              height={130}
              cols="grid-cols-1 lg:grid-cols-1"
            />
          </div>
        )}
        {data?.data?.type === "EXAM" && (
          <TemplatePreview data={data?.data?.data} />
        )}

        {data?.data?.type === "LESSON_PLAN" && (
          <div className="w-full h-screen">
            <PreviewModal
              isOpen={true}
              onClose={() => {}}
              data={data?.data?.data}
              onDownload={() => {}}
              lesson={lessons[0]}
              mode={false}
            />
          </div>
        )}

        {data?.data?.type === "SLIDE" && (
          <SlidePreview data={data?.data?.data} />
        )}
      </div>
    </div>
  );
}

export default FileDetailPage;
