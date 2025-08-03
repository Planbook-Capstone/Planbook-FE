"use client";

import React from "react";
import { Search, CheckCircle, BookOpen, X } from "lucide-react";
import { QuestionBankItem } from "@/services/questionBankServices";
import { QuestionCard } from "./QuestionCard";

interface QuestionContentProps {
  isLoading: boolean;
  error: any;
  questions: QuestionBankItem[];
  selectedQuestions: Set<number>;
  selectedQuestionsData: QuestionBankItem[];
  showSelectedQuestions: boolean;
  onToggleView: () => void;
  onToggleSelection: (question: QuestionBankItem) => void;
  onClearSelected: () => void;
  onAddSelectedToExam: () => void;
  lessonId?: number;
}

export const QuestionContent: React.FC<QuestionContentProps> = ({
  isLoading,
  error,
  questions,
  selectedQuestions,
  selectedQuestionsData,
  showSelectedQuestions,
  onToggleView,
  onToggleSelection,
  onClearSelected,
  onAddSelectedToExam,
  lessonId,
}) => {
  const displayQuestions = showSelectedQuestions ? selectedQuestionsData : questions;

  const renderEmptyState = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col justify-center items-center h-64">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 text-sm">Đang tải câu hỏi...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-red-600 mb-2">Có lỗi xảy ra</h3>
          <p className="text-red-500 text-sm max-w-md mx-auto">{error.message}</p>
        </div>
      );
    }

    if (questions.length === 0) {
      return (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Chưa có dữ liệu</h3>
          <p className="text-gray-500 text-sm">
            {lessonId
              ? `Không tìm thấy câu hỏi nào cho Bài học #${lessonId}`
              : "Vui lòng nhập ID bài học để tìm kiếm câu hỏi"}
          </p>
        </div>
      );
    }

    if (displayQuestions.length === 0) {
      return (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            {showSelectedQuestions ? (
              <CheckCircle className="w-8 h-8 text-yellow-600" />
            ) : (
              <Search className="w-8 h-8 text-yellow-600" />
            )}
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            {showSelectedQuestions
              ? "Chưa có câu hỏi nào được chọn"
              : "Không tìm thấy kết quả"}
          </h3>
          <p className="text-gray-500 text-sm">
            {showSelectedQuestions
              ? "Hãy chọn một số câu hỏi từ danh sách để xem ở đây"
              : "Thử thay đổi từ khóa tìm kiếm hoặc điều chỉnh bộ lọc"}
          </p>
        </div>
      );
    }

    return null;
  };

  const emptyState = renderEmptyState();
  if (emptyState) {
    return (
      <div className="flex-1 flex flex-col bg-white">
        {/* Content Header */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                {showSelectedQuestions ? "Câu hỏi đã chọn" : "Danh sách câu hỏi"}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {showSelectedQuestions
                  ? `${selectedQuestionsData.length} câu hỏi đã chọn`
                  : `${questions.length} câu hỏi được tìm thấy`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onToggleView}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  showSelectedQuestions
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {showSelectedQuestions ? (
                  <>
                    <Search className="w-4 h-4" />
                    Xem tất cả
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Xem đã chọn ({selectedQuestions.size})
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">{emptyState}</div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Content Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              {showSelectedQuestions ? "Câu hỏi đã chọn" : "Danh sách câu hỏi"}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {showSelectedQuestions
                ? `${selectedQuestionsData.length} câu hỏi đã chọn`
                : `${questions.length} câu hỏi được tìm thấy`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* Toggle view button */}
            <button
              onClick={onToggleView}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                showSelectedQuestions
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {showSelectedQuestions ? (
                <>
                  <Search className="w-4 h-4" />
                  Xem tất cả
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Xem đã chọn ({selectedQuestions.size})
                </>
              )}
            </button>

            {/* Clear selected questions button */}
            {selectedQuestions.size > 0 && showSelectedQuestions && (
              <button
                onClick={onClearSelected}
                className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-all flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Xóa tất cả
              </button>
            )}

            {/* Add selected questions to exam button */}
            {selectedQuestions.size > 0 && (
              <button
                onClick={onAddSelectedToExam}
                className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-all flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Thêm vào đề ({selectedQuestions.size})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Questions Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          {displayQuestions.map((question: QuestionBankItem) => (
            <QuestionCard
              key={question.id}
              question={question}
              isSelected={selectedQuestions.has(question.id)}
              onToggleSelection={onToggleSelection}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
