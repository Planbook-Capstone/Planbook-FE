"use client";

import React, { useState } from "react";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import ExamCreationTemplate from "@/components/templates/exam-creation";
import ExamFileImport from "@/components/organisms/exam-file-import";

export default function ExamCreationPage() {
  const [hasData, setHasData] = useState(false);
  const [examData, setExamData] = useState<any>(null);

  const handleQuestionUpdate = (questions: any[]) => {
    console.log("Questions updated:", questions);
    // Handle question updates here - save to backend, etc.
  };

  const handleFileSubmit = (files: File[], apiResponse?: any) => {
    console.log("=== FILE SUBMIT HANDLER ===");
    console.log("Number of files:", files.length);
    console.log("API Response:", apiResponse);

    if (apiResponse) {
      console.log("Setting exam data from API response:", apiResponse);
      setExamData(apiResponse);
      setHasData(true);
    } else {
      console.log("No API response, creating manually");
      setHasData(true);
    }
  };

  const handleCreateManually = () => {
    console.log("Creating exam manually");
    setHasData(true);
  };

  const handleImageDrop = (questionId: string, imageSrc: string) => {
    console.log('🖼️ Image dropped on question:', questionId, imageSrc);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    // Check if dropping an image asset onto a question
    if (active.data.current?.type === 'image' && over.id.toString().includes('question') && over.id.toString().includes('image-drop')) {
      console.log('🖼️ Dropping image:', active.data.current.content);
      console.log('📍 Drop target:', over.id);

      // Extract question ID from drop zone ID (format: question-{id}-image-drop)
      const questionId = over.id.toString().replace('question-', '').replace('-image-drop', '');
      console.log('🎯 Question ID:', questionId);

      // Call the image drop handler
      handleImageDrop(questionId, active.data.current.content);
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
        <ExamFileImport onSubmit={handleFileSubmit} />
      </div>
    );
  }

  // Show exam creation template when there's data
  return (
    <DndContext onDragEnd={handleDragEnd}>
      <ExamCreationTemplate
        documentInfo={documentInfo}
        onQuestionUpdate={handleQuestionUpdate}
        examData={examData}
        onImageDrop={handleImageDrop}
      />
    </DndContext>
  );
}
