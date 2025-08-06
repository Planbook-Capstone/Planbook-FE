"use client";
import PreviewModal from "@/components/PreviewModalv2";
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
  console.log(data?.data?.data?.edit);

  const lessonQueries = useLessonsByIdsService(data?.data?.lessonIds || []);

  // Get all lessons data
  const lessons = lessonQueries
    .filter((query: any) => query.data)
    .map((query: any) => query.data?.data)
    .filter(Boolean);
  
    console.log(lessons[0]?.name);
  
  return (
    <div className="p-6 h-screen">
      <div className="space-y-2 h-full">
        {data?.data?.type === "EXAM" && (
          <div className="w-full h-full">
            <iframe
              src={data?.data?.data?.edit}
              className="w-full h-full border-0"
              title="Document Preview"
            />
          </div>
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
      </div>
    </div>
  );
}

export default FileDetailPage;
