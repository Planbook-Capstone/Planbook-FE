"use client";

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
  console.log("Exam result ID:", examResultResponse?.data);
  return <div>ExamResultPage {id}</div>;
}

export default ExamResultPage;
