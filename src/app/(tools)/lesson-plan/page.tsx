"use client";

import SelectLesson from "@/components/templates/select-lesson";
import { useRouter, useSearchParams } from "next/navigation";
import LessonPlanTemplate from "@/components/templates/lesson-plan";
import { useEffect } from "react";

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

  // Chặn reload/thoát trang khi đang chỉnh sửa lesson plan
  useEffect(() => {
    if (lessonId) {
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        e.returnValue = "Các thay đổi bạn đã thực hiện có thể chưa được lưu.";
        return e.returnValue;
      };
      window.addEventListener("beforeunload", handleBeforeUnload);
      return () =>
        window.removeEventListener("beforeunload", handleBeforeUnload);
    }
  }, [lessonId]);

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
