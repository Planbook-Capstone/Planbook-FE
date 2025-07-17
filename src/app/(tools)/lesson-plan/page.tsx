"use client";

import SelectLesson from "@/components/templates/select-lesson";
import { useRouter, useSearchParams } from "next/navigation";
import LessonPlanTemplate from "@/components/templates/lesson-plan";

function LessonPlanPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const lessonId = searchParams.get("lessonId");

  // Handle lesson selection - set lessonId to URL params
  const handleLessonSelect = (lessonId: string) => {
    // Update URL with lessonId parameter
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set("lessonId", lessonId);
    router.push(newUrl.pathname + newUrl.search);
  };
  
  if (lessonId) {
    return (
      <div>
        <LessonPlanTemplate />
      </div>
    );
  }

  return (
    <div className="p-6">
      <SelectLesson
        onLessonSelect={handleLessonSelect}
        title="Vui lòng chọn bài cần tạo giáo án"
      />
    </div>
  );
}

export default LessonPlanPage;
