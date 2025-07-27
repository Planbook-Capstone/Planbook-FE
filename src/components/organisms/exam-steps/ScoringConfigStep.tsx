"use client";

import React from "react";
import ScoringConfigPanel, {
  ScoringConfig,
} from "@/components/organisms/scoring-config-panel";

interface ScoringConfigStepProps {
  scoringConfig: ScoringConfig;
  onScoringConfigChange: (newConfig: ScoringConfig) => void;
  questionsCount: number;
  yesNoQuestionsCount: number;
  shortQuestionsCount: number;
}

export default function ScoringConfigStep({
  scoringConfig,
  onScoringConfigChange,
  questionsCount,
  yesNoQuestionsCount,
  shortQuestionsCount,
}: ScoringConfigStepProps) {
  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-xl font-calsans text-gray-900">
          Cấu hình chấm điểm
        </h2>
        <p className="text-sm text-gray-600 font-questrial mt-1">
          Thiết lập thang điểm cho từng phần của đề thi
        </p>
      </div>

      <ScoringConfigPanel
        scoringConfig={scoringConfig}
        onScoringConfigChange={onScoringConfigChange}
        questionsCount={questionsCount}
        yesNoQuestionsCount={yesNoQuestionsCount}
        shortQuestionsCount={shortQuestionsCount}
      />
    </div>
  );
}
