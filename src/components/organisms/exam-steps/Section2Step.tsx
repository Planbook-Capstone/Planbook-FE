"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Plus, ChevronDown, ChevronRight } from "lucide-react";
import YesNoQuestionItem from "@/components/organisms/yes-no-question-item";
import { YesNoQuestion } from "@/components/organisms/yes-no-question-item/types";
import { ScoringConfig } from "@/components/organisms/scoring-config-panel";

interface Section2StepProps {
  yesNoQuestions: YesNoQuestion[];
  onYesNoQuestionUpdate: (question: YesNoQuestion) => void;
  onYesNoQuestionDelete: (questionId: string) => void;
  onAddYesNoQuestion: () => void;
  scoringConfig: ScoringConfig;
}

export default function Section2Step({
  yesNoQuestions,
  onYesNoQuestionUpdate,
  onYesNoQuestionDelete,
  onAddYesNoQuestion,
  scoringConfig,
}: Section2StepProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Calculate section score
  const calculateSectionScore = () => {
    if (scoringConfig.useStandardScoring) {
      return yesNoQuestions.length * 1.0;
    } else {
      let part2Score: number;
      if (scoringConfig.part2ScoringType === "standard") {
        part2Score = 1.0;
      } else if (scoringConfig.part2ScoringType === "auto") {
        part2Score = scoringConfig.part2CustomScore;
      } else {
        // manual - sử dụng điểm tối đa (4 ý đúng)
        part2Score = scoringConfig.part2ManualScores[4];
      }
      return yesNoQuestions.length * part2Score;
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
            Phần II: Câu trắc nghiệm đúng sai ({yesNoQuestions.length})
          </h2>
          <p className="text-sm text-gray-600 font-questrial mt-1">
            Tạo và quản lý các câu hỏi trắc nghiệm đúng/sai
          </p>
        </div>

        <span className="bg-emerald-50 rounded-full text-emerald-500 px-3 py-2 text-sm font-calsans">
          {sectionScore} điểm
        </span>
      </div>
      <div className="space-y-4">
        {yesNoQuestions.map((question, index) => (
          <YesNoQuestionItem
            key={question.id}
            question={question}
            index={index}
            onUpdate={onYesNoQuestionUpdate}
            onDelete={onYesNoQuestionDelete}
          />
        ))}

        <Button variant="dash" onClick={onAddYesNoQuestion} className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Thêm câu hỏi đúng/sai
        </Button>
      </div>
    </div>
  );
}
