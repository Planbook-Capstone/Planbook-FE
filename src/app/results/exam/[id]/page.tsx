"use client";

import ExamResultEditorTemplate from "@/components/templates/exam-result-editor/ExamResultEditor";
import { useToolResultByIdService } from "@/services/toolResultService";
import { use } from "react";

interface ExamResultPageProps {
  params: Promise<{
    id: string;
  }>;
}

function ExamResultPage({ params }: ExamResultPageProps) {
  const { id } = use(params);
  const {
    data: examResultResponse,
    isLoading,
    error,
  } = useToolResultByIdService(id);
  console.log(examResultResponse?.data,"ngoc");
  return (
    <div>
      <ExamResultEditorTemplate examResult={examResultResponse?.data} />
    </div>
  );
}

export default ExamResultPage;
