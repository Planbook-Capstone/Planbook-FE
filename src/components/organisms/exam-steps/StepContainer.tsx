"use client";

import React from "react";
import { useStepContext } from "@/contexts/StepContext";
import { useExamContext } from "@/contexts/ExamContext";
import { useExamTemplateContext } from "@/contexts/ExamTemplateContext";
import {
  defaultScoringConfig,
  ScoringConfig,
} from "@/components/organisms/scoring-config-panel";
import BasicInfoStep from "./BasicInfoStep";
import ScoringConfigStep from "./ScoringConfigStep";
import Section1Step from "./Section1Step";
import Section2Step from "./Section2Step";
import Section3Step from "./Section3Step";
import { Button } from "@/components/ui/Button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface StepContainerProps {
  className?: string;
}

export default function StepContainer({ className }: StepContainerProps) {
  const {
    currentStep,
    steps,
    nextStep,
    previousStep,
    hasNextStep,
    hasPreviousStep,
    getStepIndex,
  } = useStepContext();

  const {
    examQuestions,
    examYesNoQuestions,
    examShortQuestions,
    updateQuestion,
    updateYesNoQuestion,
    updateShortQuestion,
    deleteQuestion,
    deleteYesNoQuestion,
    deleteShortQuestion,
    addQuestion,
    addYesNoQuestion,
    addShortQuestion,
  } = useExamContext();

  const { templateMetadata, setTemplateMetadata } = useExamTemplateContext();

  // Get current scoring config from template metadata
  const currentScoringConfig =
    templateMetadata?.scoringConfig || defaultScoringConfig;

  // Handle scoring config changes
  const handleScoringConfigChange = (newConfig: ScoringConfig) => {
    if (templateMetadata) {
      setTemplateMetadata({
        ...templateMetadata,
        scoringConfig: newConfig,
      });
    }
  };

  // Calculate scores for each section based on current config
  const calculateSectionScores = () => {
    if (currentScoringConfig.useStandardScoring) {
      // Thang điểm chuẩn
      const section1Score = examQuestions.length * 0.25;
      const section2Score = examYesNoQuestions.length * 1.0;
      const section3Score = examShortQuestions.length * 0.25;
      const totalScore = section1Score + section2Score + section3Score;

      return { section1Score, section2Score, section3Score, totalScore };
    } else {
      // Thang điểm tùy chỉnh
      const section1Score =
        examQuestions.length * currentScoringConfig.part1Score;

      let part2Score: number;
      if (currentScoringConfig.part2ScoringType === "standard") {
        part2Score = 1.0;
      } else if (currentScoringConfig.part2ScoringType === "auto") {
        part2Score = currentScoringConfig.part2CustomScore;
      } else {
        // manual - sử dụng điểm tối đa (4 ý đúng)
        part2Score = currentScoringConfig.part2ManualScores[4];
      }

      const section2Score = examYesNoQuestions.length * part2Score;
      const section3Score =
        examShortQuestions.length * currentScoringConfig.part3Score;
      const totalScore = section1Score + section2Score + section3Score;

      return { section1Score, section2Score, section3Score, totalScore };
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case "basic-info":
        return <BasicInfoStep />;
      case "scoring-config":
        return (
          <ScoringConfigStep
            scoringConfig={currentScoringConfig}
            onScoringConfigChange={handleScoringConfigChange}
            questionsCount={examQuestions.length}
            yesNoQuestionsCount={examYesNoQuestions.length}
            shortQuestionsCount={examShortQuestions.length}
          />
        );
      case "section-1":
        return (
          <Section1Step
            questions={examQuestions}
            onQuestionUpdate={updateQuestion}
            onQuestionDelete={deleteQuestion}
            onAddQuestion={addQuestion}
            scoringConfig={currentScoringConfig}
          />
        );
      case "section-2":
        return (
          <Section2Step
            yesNoQuestions={examYesNoQuestions}
            onYesNoQuestionUpdate={updateYesNoQuestion}
            onYesNoQuestionDelete={deleteYesNoQuestion}
            onAddYesNoQuestion={addYesNoQuestion}
            scoringConfig={currentScoringConfig}
          />
        );
      case "section-3":
        return (
          <Section3Step
            shortQuestions={examShortQuestions}
            onShortQuestionUpdate={updateShortQuestion}
            onShortQuestionDelete={deleteShortQuestion}
            onAddShortQuestion={addShortQuestion}
            scoringConfig={currentScoringConfig}
          />
        );
      default:
        return <BasicInfoStep />;
    }
  };

  return (
    <div className={className}>
      {/* Step Content */}
      <div className="flex-1 overflow-y-auto pb-4">{renderCurrentStep()}</div>

      {/* Navigation Buttons - Fixed at bottom */}
      <div className="flex-shrink-0 bg-white border-t border-gray-200 p-4 shadow-sm">
        <div className="flex justify-between items-center max-w-4xl mx-auto">
          <Button
            variant="outline"
            onClick={previousStep}
            disabled={!hasPreviousStep}
            className="flex items-center gap-2 min-w-[120px]"
          >
            <ChevronLeft className="w-4 h-4" />
            Quay lại
          </Button>

          <div className="text-sm text-gray-500 font-questrial bg-gray-50 px-3 py-1 rounded-full">
            Bước {getStepIndex(currentStep) + 1} / {steps.length}
          </div>

          <Button
            onClick={nextStep}
            disabled={!hasNextStep}
            className="flex items-center gap-2 min-w-[120px]"
          >
            Tiếp theo
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
