"use client";

import React from "react";
import Image from "next/image";
import { QuestionBankItem } from "@/services/questionBankServices";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import ChemicalFormula from "@/components/ChemicalFormula";
import { getDifficultyText, getVariant } from "@/constants";

interface QuestionRendererProps {
  question: QuestionBankItem;
  questionNumber?: number;
  showAnswer?: boolean;
  showExplanation?: boolean;
  className?: string;
  onAnswerSelect?: (answer: string | boolean, statementKey?: string) => void;
  selectedAnswers?: Record<string, string | boolean>;
  getLessonNames?: (question: QuestionBankItem) => string;
}

export const QuestionRenderer: React.FC<QuestionRendererProps> = ({
  question,
  questionNumber,
  showAnswer = true,
  showExplanation = true,
  className,
  onAnswerSelect,
  selectedAnswers = {},
  getLessonNames,
}) => {
  const { questionContent, questionType, explanation } = question;

  const renderMultipleChoice = () => {
    if (!questionContent.options) return null;

    return (
      <div className="pl-12 grid grid-cols-1 space-y-2 mt-2 text-lg">
        {Object.entries(questionContent.options).map(([key, value]) => (
          <p key={key}>
            {key}. <ChemicalFormula formula={String(value)} />
          </p>
        ))}
        {showAnswer && questionContent.answer && (
          <p className="text-green-700 font-[600]">
            Đáp án: <ChemicalFormula formula={String(questionContent.answer)} />
          </p>
        )}
      </div>
    );
  };

  const renderTrueFalse = () => {
    if (!questionContent.statements) return null;

    return (
      <div className="pl-12 grid grid-cols-1 space-y-2 mt-2 text-lg">
        {Object.entries(questionContent.statements).map(([key, statement]) => {
          const statementValue = statement as { text: string; answer: boolean };
          return (
            <p key={key}>
              {key}. <ChemicalFormula formula={statementValue.text} />{" "}
              {showAnswer && (
                <span className="text-green-700 font-bold">
                  {statementValue.answer ? "Đúng" : "Sai"}
                </span>
              )}
            </p>
          );
        })}
      </div>
    );
  };

  const renderShortAnswer = () => {
    return (
      <div className="pl-12 grid grid-cols-1 space-y-2 mt-2 text-lg">
        {showAnswer && questionContent.answer && (
          <p className="text-green-700 font-[600]">
            Đáp án: <ChemicalFormula formula={String(questionContent.answer)} />
          </p>
        )}
      </div>
    );
  };

  const renderQuestionContent = () => {
    switch (questionType) {
      case "PART_I":
        return renderMultipleChoice();
      case "PART_II":
        return renderTrueFalse();
      case "PART_III":
        return renderShortAnswer();
      default:
        return (
          <div className="text-gray-500">Loại câu hỏi không được hỗ trợ</div>
        );
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="text-base">
        <div className="gap-2">
          <div className="flex gap-2 items-center justify-between">
            <div className="flex gap-2 items-center">
              {questionNumber && (
                <p className="font-bold">Câu {questionNumber}:</p>
              )}
              <p className="text-gray-500">
                {question.questionTypeDescription}
              </p>
              <p className="text-blue-500 font-semibold">
                [{question.referenceSource || "-"}]
              </p>
              {getLessonNames && (
                <p className="text-orange-500">
                  [{getLessonNames(question) || "-"}]
                </p>
              )}
              <Badge
                variant={getVariant(question.difficultyLevel)}
                className="text-xs"
              >
                {getDifficultyText(question.difficultyLevel)}
              </Badge>
            </div>
          </div>
          <p className="text-lg">
            <ChemicalFormula formula={questionContent.question} />
          </p>
          {questionContent.image && (
            <div className="max-w-full max-h-[250px] overflow-auto">
              <Image
                src={questionContent.image}
                alt="Question"
                width={0}
                height={0}
                sizes="100vw"
                className="h-auto w-auto max-w-full max-h-[250px] rounded-md object-contain"
              />
            </div>
          )}
        </div>
        {renderQuestionContent()}
        {showExplanation && explanation && (
          <p className="text-purple-700 text-lg">
            <span className="font-bold">Giải thích: </span>
            <ChemicalFormula formula={explanation} />
          </p>
        )}
      </div>
    </div>
  );
};

export default QuestionRenderer;
