"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Plus, ChevronDown, ChevronRight } from "lucide-react";
import QuestionItem from "@/components/organisms/exam-question-item";
import { Question } from "@/components/organisms/exam-question-item/types";
import { ScoringConfig } from "@/components/organisms/scoring-config-panel";

interface Section1StepProps {
  questions: Question[];
  onQuestionUpdate: (question: Question) => void;
  onQuestionDelete: (questionId: string) => void;
  onAddQuestion: () => void;
  scoringConfig: ScoringConfig;
}

export default function Section1Step({
  questions,
  onQuestionUpdate,
  onQuestionDelete,
  onAddQuestion,
  scoringConfig,
}: Section1StepProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Calculate section score
  const calculateSectionScore = () => {
    if (scoringConfig.useStandardScoring) {
      return questions.length * 0.25;
    } else {
      return questions.length * scoringConfig.part1Score;
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
            Phần I: Câu trắc nghiệm nhiều phương án lựa chọn ({questions.length}
            )
          </h2>
          <p className="text-sm text-gray-600 font-questrial mt-1">
            Tạo và quản lý các câu hỏi trắc nghiệm với nhiều phương án lựa chọn
          </p>
        </div>

        <span className="bg-emerald-50 rounded-full text-emerald-500 px-3 py-2 text-sm font-calsans">
          {sectionScore} điểm
        </span>
      </div>
      <div className="space-y-4">
        {questions?.map((question, index) => (
          <QuestionItem
            key={question.id}
            question={question}
            index={index}
            onUpdate={onQuestionUpdate}
            onDelete={onQuestionDelete}
          />
        ))}

        <Button variant="dash" onClick={onAddQuestion} className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Thêm câu hỏi
        </Button>
      </div>
    </div>
  );
}
