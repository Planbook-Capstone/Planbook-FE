"use client";

import React, { useState } from "react";
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
    <ExamCreationTemplate
      documentInfo={documentInfo}
      onQuestionUpdate={handleQuestionUpdate}
      examData={examData}
    />
  );
}
