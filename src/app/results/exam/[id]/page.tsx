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
  console.log(examResultResponse?.data?.data);
  return (
    <div>
      <ExamResultEditorTemplate examResult={examResultResponse?.data?.data} />
    </div>
  );
}

export default ExamResultPage;
