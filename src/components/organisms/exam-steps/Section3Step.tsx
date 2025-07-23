"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Plus, ChevronDown, ChevronRight } from "lucide-react";
import ShortQuestionItem from "@/components/organisms/short-question-item";
import { ShortQuestion } from "@/components/organisms/short-question-item/types";
import { ScoringConfig } from "@/components/organisms/scoring-config-panel";

interface Section3StepProps {
  shortQuestions: ShortQuestion[];
  onShortQuestionUpdate: (question: ShortQuestion) => void;
  onShortQuestionDelete: (questionId: string) => void;
  onAddShortQuestion: () => void;
  scoringConfig: ScoringConfig;
}

export default function Section3Step({
  shortQuestions,
  onShortQuestionUpdate,
  onShortQuestionDelete,
  onAddShortQuestion,
  scoringConfig,
}: Section3StepProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Calculate section score
  const calculateSectionScore = () => {
    if (scoringConfig.useStandardScoring) {
      return shortQuestions.length * 0.25;
    } else {
      return shortQuestions.length * scoringConfig.part3Score;
    }
  };

  const sectionScore = calculateSectionScore();

  return (
    <div className="space-y-6">
      <div
        className="flex justify-between items-center gap-2 cursor-pointer border-b border-gray-200"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className=" pb-4">
          <h2 className="text-xl font-calsans text-gray-900">
            Phần III: Câu hỏi tự luận ({shortQuestions.length})
          </h2>
          <p className="text-sm text-gray-600 font-questrial mt-1">
            Tạo và quản lý các câu hỏi tự luận
          </p>
        </div>

        <span className="bg-emerald-50 rounded-full text-emerald-500 px-3 py-2 text-sm font-calsans">
          {sectionScore} điểm
        </span>
      </div>

      <div className="space-y-4">
        {shortQuestions.map((question, index) => (
          <ShortQuestionItem
            key={question.id}
            question={question}
            index={index}
            onUpdate={onShortQuestionUpdate}
            onDelete={onShortQuestionDelete}
          />
        ))}

        <Button variant="dash" onClick={onAddShortQuestion} className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Thêm câu hỏi tự luận
        </Button>
      </div>
    </div>
  );
}
