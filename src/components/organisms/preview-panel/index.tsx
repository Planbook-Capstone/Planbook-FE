"use client";

import React from "react";
import { CanvasElement } from "@/components/templates/canva-layout";
import ExamPreview from '@/components/organisms/exam-preview';
import { useExamContext } from '@/contexts/ExamContext';

interface PreviewPanelProps {
  elements: CanvasElement[];
}

export default function PreviewPanel({ elements }: PreviewPanelProps) {
  const { examQuestions, examYesNoQuestions, examShortQuestions } = useExamContext();

  return (
    <ExamPreview
      questions={examQuestions}
      yesNoQuestions={examYesNoQuestions}
      shortQuestions={examShortQuestions}
      examTitle="Đề thi mẫu"
      examSubject="Môn học"
      examTime="90 phút"
      examDate={new Date().toLocaleDateString('vi-VN')}
    />
  );
}
