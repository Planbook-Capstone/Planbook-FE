"use client";
import TemplatePreview from "@/components/organisms/template-preview";
import PreviewModal from "@/components/PreviewModalv2";
import { SlidePreview } from "@/components/ui/SlidePreview";
import { useLessonsByIdsService } from "@/services/lessonServices";
import { useToolResultByIdService } from "@/services/toolResultService";
import React from "react";

interface Props {
  params: Promise<{
    fileId: string;
  }>;
}

function FileDetailPage({ params }: Props) {
  const { fileId } = React.use(params);
  const { data } = useToolResultByIdService(fileId);
  console.log(data?.data?.data);

  const lessonQueries = useLessonsByIdsService(data?.data?.lessonIds || []);

  // Get all lessons data
  const lessons = lessonQueries
    .filter((query: any) => query.data)
    .map((query: any) => query.data?.data)
    .filter(Boolean);

  console.log(lessons[0]?.name);

  return (
    <div
      className={`p-6 ${data?.data?.type === "SLIDE" ? "h-auto" : "h-screen"}`}
    >
      <div className="space-y-2 h-full">
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
