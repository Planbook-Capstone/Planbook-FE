"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { AlertTriangle, FileText, Download } from "lucide-react";

interface ExamSidebarProps {
  totalQuestions?: number;
  currentQuestion?: number;
  onQuestionSelect?: (questionNumber: number) => void;
}

export default function ExamSidebar({
  totalQuestions = 10,
  currentQuestion = 4,
  onQuestionSelect,
}: ExamSidebarProps) {
  const [selectedQuestion, setSelectedQuestion] = useState(currentQuestion);

  const handleQuestionClick = (questionNumber: number) => {
    setSelectedQuestion(questionNumber);
    onQuestionSelect?.(questionNumber);
  };

  return (
    <aside className="w-full px-2 py-6 space-y-6">
      {/* Question Navigation */}
      <div className="grid grid-cols-6 gap-1">
        {Array.from({ length: totalQuestions }).map((_, i) => (
          <Button
            key={i}
            variant="outline"
            size="sm"
            className={`aspect-square text-sm border ${
              selectedQuestion === i + 1
                ? "bg-blue-500 border-blue-500 text-white hover:bg-blue-600"
                : i === 6
                ? "bg-gray-800 border-gray-800 text-white hover:bg-gray-700"
                : "border-gray-200 text-gray-600 hover:border-gray-300"
            }`}
            onClick={() => handleQuestionClick(i + 1)}
          >
            {i + 1}
          </Button>
        ))}
      </div>

      {/* Legend */}
      <div className="space-y-1 text-sm text-gray-600 grid grid-cols-2">
        <div className="flex items-center gap-1">
          <div className="w-5 h-5 rounded-sm  bg-neutral-300"></div>
          <span className="text-nowrap">Một lựa chọn</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-5 h-5 rounded-sm  bg-blue-500"></div>
          <span className="text-nowrap">Nhiều lựa chọn</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-5 h-5 rounded-sm  bg-blue-400"></div>
          <span>Tự luận</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-5 h-5 rounded-sm border-2 border-gray-400 bg-gray-100"></div>
          <span>Chưa có đáp án</span>
        </div>
      </div>
    </aside>
  );
}

export type { ExamSidebarProps };
