"use client";

import LessonPlanTemplate from "@/components/templates/lesson-plan";
import { useToolResultByIdService } from "@/services/toolResultService";
import { use } from "react";

interface LessonPlanResultPageProps {
  params: Promise<{
    id: string;
  }>;
}

function LessonPlanResultPage({ params }: LessonPlanResultPageProps) {
  const { id } = use(params);
  const {
    data: lessonPlanResultResponse,
    isLoading,
    error,
  } = useToolResultByIdService(id, {
    staleTime: 0, // Always refetch when component mounts
    refetchOnMount: true, // Force refetch on mount
    refetchOnWindowFocus: false, // Don't refetch on window focus
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Đang tải...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg text-red-500">
          Có lỗi xảy ra khi tải dữ liệu
        </div>
      </div>
    );
  }

  return (
    <div>
      <LessonPlanTemplate
        mode="edit"
        existingData={lessonPlanResultResponse?.data}
        editResultId={id}
      />
    </div>
  );
}

export default LessonPlanResultPage;
