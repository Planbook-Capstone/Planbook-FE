"use client";

import SelectLesson from "@/components/templates/select-lesson";
import { use, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLessonByIdService } from "@/services/lessonServices";
import { useFormByIdService } from "@/services/lessonPlanServices";
import { FormPreview } from "@/components/organisms/form-preview";
import { Button } from "@/components/ui/Button";

function LessonPlanPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const lessonId = searchParams.get("lessonId");

  const { data: lessonById } = useLessonByIdService(lessonId?.toString());
  const { data: formById } = useFormByIdService("9");

  useEffect(() => {
    console.log("Current lessonId from URL:", lessonId);
  }, [lessonId]);

  // Handle lesson selection - set lessonId to URL params
  const handleLessonSelect = (lessonId: string) => {
    // Update URL with lessonId parameter
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set("lessonId", lessonId);
    router.push(newUrl.pathname + newUrl.search);
  };
  if (lessonId) {
    return (
      <div className="p-5">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-calsans text-lg mb-4">
            {lessonById?.data?.name}
          </h3>
          <Button
            onClick={() => {
              // Remove lessonId from URL to go back to lesson selection
              const newUrl = new URL(window.location.href);
              newUrl.searchParams.delete("lessonId");
              router.push(newUrl.pathname + newUrl.search);
            }}
            variant={"outline"}
          >
            Quay lại chọn bài học
          </Button>
        </div>
        <FormPreview config={formById?.data?.formData || []} />
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
