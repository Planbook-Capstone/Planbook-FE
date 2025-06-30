"use client";

import ExamCreationTemplate from "@/components/templates/exam-creation";

export default function ExamCreationPage() {
  const handleQuestionUpdate = (questions: any[]) => {
    console.log("Questions updated:", questions);
    // Handle question updates here - save to backend, etc.
  };

  const documentInfo = {
    title: "Kiểm tra hoá cuối kì - THPT Trần Phú",
    description: "Nghiên cứu các yếu tố ảnh hưởng đến tốc độ phản ứng, cơ chế phản ứng và biểu diễn cân bằng động.",
    creator: "Nguyễn Văn A",
    createdAt: "15:23 14/5/2025"
  };

  return (
    <ExamCreationTemplate 
      documentInfo={documentInfo}
      onQuestionUpdate={handleQuestionUpdate}
    />
  );
}
