"use client";

import React from "react";
import { DataTable } from "../data-table";
import { createQuestionBankColumns } from "./columns";
import { Row } from "@tanstack/react-table";
import { QuestionBankItem } from "@/services/questionBankServices";
import { TooltipProvider } from "@/components/ui/Tooltip";

interface QuestionBankTableProps {
  questions: QuestionBankItem[];
  loading?: boolean;
  onEdit: (question: QuestionBankItem) => void;
  onDelete: (id: number) => void;
  onSelectionChange?: (selectedRows: Row<QuestionBankItem>[]) => void;
  lessonsData?: any;
}

export default function QuestionBankTable({
  questions,
  loading,
  onEdit,
  onDelete,
  onSelectionChange,
  lessonsData,
}: QuestionBankTableProps) {
  const getLessonName = (lessonId: number) => {
    try {
      // Handle different API response structures
      if (!lessonsData) {
        return `Lesson ${lessonId}`;
      }

      let lessons = [];

      // Try different possible data structures
      if (
        lessonsData.data?.content &&
        Array.isArray(lessonsData.data.content)
      ) {
        lessons = lessonsData.data.content;
      } else if (lessonsData.data && Array.isArray(lessonsData.data)) {
        lessons = lessonsData.data;
      } else if (Array.isArray(lessonsData)) {
        lessons = lessonsData;
      }

      const lesson = lessons.find((l: any) => l && l.id === lessonId);
      return lesson?.name || `Lesson ${lessonId}`;
    } catch (error) {
      console.error("Error in getLessonName:", error);
      return `Lesson ${lessonId}`;
    }
  };

  const columns = createQuestionBankColumns({
    onEdit,
    onDelete,
    getLessonName,
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-gray-500">Đang tải...</div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <DataTable
        columns={columns}
        data={questions || []}
        onSelectionChange={onSelectionChange}
      />
    </TooltipProvider>
  );
}
