"use client";

import React, { useState } from "react";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import ExamCreationTemplate from "@/components/templates/exam-creation";
import ExamFileImport from "@/components/organisms/exam-file-import";
import CanvaLayout from "@/components/templates/canva-layout";
import { useExamImportService } from "@/services/examImportServices";
import { toast } from "sonner";

export default function ExamCreationPage() {
  const [hasData, setHasData] = useState(false);
  const [examData, setExamData] = useState<any>(null);

  // Initialize the exam import service
  const { mutate: importExam, isPending: isImporting } = useExamImportService();

  const handleQuestionUpdate = (questions: any[]) => {
    console.log("Questions updated:", questions);
    // Handle question updates here - save to backend, etc.
  };

  const handleFileSubmit = (files: File[]) => {
    console.log("=== FILE SUBMIT HANDLER ===");
    console.log("Number of files:", files.length);
    console.log("File details:", files.map(file => ({
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: new Date(file.lastModified)
    })));

    // Create FormData for file upload
    const formData = new FormData();

    // Add each file to FormData
    files.forEach((file) => {
      formData.append(`file`, file);
    });

    // Log FormData contents
    console.log("FormData contents:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    // Call the exam import service
    importExam(formData, {
      onSuccess: (response) => {
        console.log("✅ Exam import successful:", response);
        toast.success("Import đề thi thành công!");

        // Set exam data and show canvas
        setExamData(response);
        setHasData(true);
      },
      onError: (error) => {
        console.error("❌ Exam import failed:", error);
        toast.error("Import đề thi thất bại. Vui lòng thử lại!");
      }
    });
  };

  const handleCreateManually = () => {
    console.log("Creating exam manually");
    setHasData(true);
  };

  const handleImageDrop = (questionId: string, imageSrc: string, questionType: string = "multiple") => {
    console.log("🖼️ Image dropped on question:", questionId, imageSrc, "Type:", questionType);
    // This will be handled by the ExamContext in CanvaLayout
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    // Check if dropping an image asset onto any type of question
    if (
      active.data.current?.type === "image" &&
      over.id.toString().includes("question") &&
      over.id.toString().includes("image-drop")
    ) {
      console.log("🖼️ Dropping image:", active.data.current.content);
      console.log("📍 Drop target:", over.id);

      let questionId = "";
      let questionType = "";

      // Extract question ID and type from drop zone ID
      if (over.id.toString().includes("yes-no-question")) {
        // Format: yes-no-question-{id}-image-drop
        questionId = over.id
          .toString()
          .replace("yes-no-question-", "")
          .replace("-image-drop", "");
        questionType = "yes-no";
      } else if (over.id.toString().includes("short-question")) {
        // Format: short-question-{id}-image-drop
        questionId = over.id
          .toString()
          .replace("short-question-", "")
          .replace("-image-drop", "");
        questionType = "short";
      } else {
        // Format: question-{id}-image-drop (multiple choice)
        questionId = over.id
          .toString()
          .replace("question-", "")
          .replace("-image-drop", "");
        questionType = "multiple";
      }

      console.log("🎯 Question ID:", questionId, "Type:", questionType);

      // Call the appropriate image drop handler
      handleImageDrop(questionId, active.data.current.content, questionType);
    }
  };

  const documentInfo = {
    title: "Kiểm tra hoá cuối kì - THPT Trần Phú",
    description:
      "Nghiên cứu các yếu tố ảnh hưởng đến tốc độ phản ứng, cơ chế phản ứng và biểu diễn cân bằng động.",
    creator: "Nguyễn Văn A",
    createdAt: "15:23 14/5/2025",
  };

  // Show file import interface when there's no data
  if (!hasData) {
    return (
      <div className="w-full">
        <ExamFileImport
          onSubmit={handleFileSubmit}
          isLoading={isImporting}
        />
      </div>
    );
  }

  // Show exam creation template when there's data
  return (
    <div className="h-screen w-full">
      <CanvaLayout />
    </div>
  );
}
