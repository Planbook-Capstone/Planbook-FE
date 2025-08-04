import React from "react";
import { useLessonsByIdsService } from "@/services/lessonServices";

interface LessonNamesCellProps {
  lessonIds: string[] | number[];
}

const LessonNamesCell: React.FC<LessonNamesCellProps> = ({ lessonIds }) => {
  // Convert to string array if needed
  const stringIds = lessonIds?.map(id => String(id)) || [];
  
  // Fetch multiple lessons by IDs using the service
  const lessonQueries = useLessonsByIdsService(stringIds);

  // Get all lessons data
  const lessons = lessonQueries
    .filter((query: any) => query.data)
    .map((query: any) => query.data?.data)
    .filter(Boolean);

  // Show loading state
  const isLoading = lessonQueries.some((query: any) => query.isLoading);
  
  if (isLoading) {
    return <div className="text-xs text-gray-500">Đang tải...</div>;
  }

  if (lessons.length === 0) {
    return <div className="text-xs text-gray-500">Không có bài học</div>;
  }

  return (
    <div className="text-xs">
      {lessons.map((lesson: any, index: number) => (
        <div key={index} className="truncate">
          {lesson?.name}
        </div>
      ))}
    </div>
  );
};

export default LessonNamesCell;
