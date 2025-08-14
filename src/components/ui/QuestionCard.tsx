"use client";

import React from "react";
import { CheckCircle, BookOpen } from "lucide-react";
import { QuestionBankItem } from "@/services/questionBankServices";

interface QuestionCardProps {
  question: QuestionBankItem;
  isSelected: boolean;
  onToggleSelection: (question: QuestionBankItem) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  isSelected,
  onToggleSelection,
}) => {
  const getQuestionTypeLabel = (type: string) => {
    switch (type) {
      case "PART_I":
        return "1";
      case "PART_II":
        return "2";
      case "PART_III":
        return "3";
      default:
        return "1";
    }
  };

  const renderQuestionOptions = () => {
    if (question.questionType !== "PART_I" || !question.questionContent.options) {
      return null;
    }

    return (
      <div className="space-y-2">
        {Object.entries(question.questionContent.options).map(([key, value]) => (
          <div
            key={key}
            className={`flex items-start gap-2 p-2 rounded ${
              question.questionContent.answer === key
                ? "bg-green-50 border border-green-200"
                : "bg-gray-50"
            }`}
          >
            <span className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium">
              {key.toUpperCase()}
            </span>
            <span
              className="text-sm text-gray-700 flex-1"
              dangerouslySetInnerHTML={{ __html: value }}
            />
            {question.questionContent.answer === key && (
              <CheckCircle className="w-4 h-4 text-green-600" />
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderQuestionStatements = () => {
    if (question.questionType !== "PART_II" || !question.questionContent.statements) {
      return null;
    }

    return (
      <div className="space-y-2">
        {Object.entries(question.questionContent.statements).map(([key, value]) => {
          // Handle both old format (answers separate) and new format (answer in statement)
          const statementData =
            typeof value === "object" && value !== null && "text" in value
              ? (value as { text: string; answer: boolean })
              : {
                  text: String(value),
                  answer: question.questionContent.answers?.[key] || false,
                };

          const isCorrect = statementData.answer;
          return (
            <div
              key={key}
              className={`flex items-start gap-2 p-2 rounded ${
                isCorrect
                  ? "bg-green-50 border border-green-200"
                  : "bg-gray-50"
              }`}
            >
              <span className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium">
                {key.toUpperCase()}
              </span>
              <div className="flex-1">
                <span
                  className="text-sm text-gray-700 block"
                  dangerouslySetInnerHTML={{ __html: statementData.text }}
                />
                <span
                  className={`text-xs font-medium ${
                    isCorrect ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {isCorrect ? "✓ Đúng" : "✗ Sai"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderQuestionAnswer = () => {
    if (question.questionType !== "PART_III" || !question.questionContent.answer) {
      return null;
    }

    return (
      <div className="p-2 bg-blue-50 rounded border border-blue-200">
        <span className="text-sm font-medium text-blue-800">Đáp án: </span>
        <span
          className="text-sm text-blue-700"
          dangerouslySetInnerHTML={{ __html: question.questionContent.answer }}
        />
      </div>
    );
  };

  return (
    <div
      className={`bg-white border rounded-lg hover:shadow-sm transition-all ${
        isSelected
          ? "border-green-400 bg-green-50 shadow-sm"
          : "border-gray-200"
      }`}
    >
      {/* Question Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
            Phần {getQuestionTypeLabel(question.questionType)}
          </span>
          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">
            Bài {question.id}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <BookOpen className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleSelection(question);
            }}
            className={`px-3 py-1 rounded text-sm font-medium transition-all flex items-center gap-1 ${
              isSelected
                ? "bg-green-100 text-green-700 hover:bg-green-200"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {isSelected ? (
              <>
                <CheckCircle className="w-3 h-3" />
                Đã chọn
              </>
            ) : (
              "Chọn"
            )}
          </button>
        </div>
      </div>

      {/* Question Content */}
      <div className="p-4">
        <div className="text-gray-800 font-medium mb-3">
          <span>Câu {question.id}: </span>
          <span dangerouslySetInnerHTML={{ __html: question.questionContent.question }} />
        </div>

        {/* Question Image */}
        {question.questionContent.image && (
          <div className="mb-3">
            <img
              src={question.questionContent.image}
              alt="Hình minh họa"
              className="max-w-full h-auto max-h-32 rounded border"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
        )}

        {/* Render different question types */}
        {renderQuestionOptions()}
        {renderQuestionStatements()}
        {renderQuestionAnswer()}

        {/* Explanation */}
        {question.explanation && (
          <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded">
            <div className="text-sm">
              <span className="font-medium text-amber-800">Giải thích: </span>
              <span
                className="text-amber-700"
                dangerouslySetInnerHTML={{ __html: question.explanation }}
              />
            </div>
          </div>
        )}

        {/* View Detail Button */}
        <div className="mt-3 flex justify-end">
          <button className="text-blue-600 text-sm hover:text-blue-800 transition-colors flex items-center gap-1">
            <BookOpen className="w-3 h-3" />
            Xem chi tiết
          </button>
        </div>
      </div>
    </div>
  );
};
