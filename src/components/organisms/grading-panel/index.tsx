"use client";

import React, { useState, useRef, useEffect } from "react";
import { useExamContext } from "@/contexts/ExamContext";

import { Edit3, ChevronDown, ChevronRight, GripVertical } from "lucide-react";
import {
  calculateYesNoQuestionScore,
  calculateYesNoQuestionScoreStandard,
} from "@/utils/scoringUtils";
import { useExamTemplateContext } from "@/contexts/ExamTemplateContext";
import { defaultScoringConfig } from "@/components/organisms/scoring-config-panel";

export default function GradingPanel() {
  const {
    examQuestions,
    examYesNoQuestions,
    examShortQuestions,
    updateQuestion,
    updateYesNoQuestion,
    updateShortQuestion,
  } = useExamContext();

  const { templateMetadata } = useExamTemplateContext();
  const currentScoringConfig =
    templateMetadata?.scoringConfig || defaultScoringConfig;

  // State for panel width and collapse
  const [panelWidth, setPanelWidth] = useState(320); // Default 320px (w-80)
  const [isResizing, setIsResizing] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState({
    part1: false,
    part2: false,
    part3: false,
  });

  const panelRef = useRef<HTMLDivElement>(null);
  const resizeRef = useRef<HTMLDivElement>(null);

  // Resize functionality
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      const newWidth = window.innerWidth - e.clientX;
      const minWidth = 280;
      const maxWidth = 600;

      if (newWidth >= minWidth && newWidth <= maxWidth) {
        setPanelWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  // Keyboard shortcuts for collapse
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "1":
            e.preventDefault();
            toggleSection("part1");
            break;
          case "2":
            e.preventDefault();
            toggleSection("part2");
            break;
          case "3":
            e.preventDefault();
            toggleSection("part3");
            break;
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleResizeStart = () => {
    setIsResizing(true);
  };

  const toggleSection = (section: keyof typeof collapsedSections) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Calculate number of correct answers for Yes/No question
  const getCorrectAnswersCount = (question: any): number => {
    if (!question.statements) return 0;

    return Object.values(question.statements).filter(
      (statement: any) => statement.answer === true
    ).length;
  };

  // Calculate score for Yes/No question based on current scoring config
  const getYesNoQuestionScore = (question: any): number => {
    const correctCount = getCorrectAnswersCount(question);

    if (currentScoringConfig.part2ScoringType === "standard") {
      // Chuẩn: 0.1/0.25/0.5/1.0
      return calculateYesNoQuestionScoreStandard(correctCount);
    } else if (currentScoringConfig.part2ScoringType === "auto") {
      // Tự động: điểm tối đa ÷ 4
      return calculateYesNoQuestionScore(
        correctCount,
        currentScoringConfig.part2CustomScore
      );
    } else {
      // Manual: sử dụng điểm đã cấu hình cho từng số ý đúng
      return (
        currentScoringConfig.part2ManualScores[correctCount as 1 | 2 | 3 | 4] ||
        0
      );
    }
  };

  const handleMultipleChoiceAnswerChange = (
    questionId: string,
    newAnswer: number
  ) => {
    const question = examQuestions.find(
      (q) => String(q.id) === String(questionId) || q.id === questionId
    );

    if (question) {
      const updatedQuestion = {
        ...question,
        correctAnswer: newAnswer,
      };
      updateQuestion(updatedQuestion);
    }
  };

  const handleYesNoAnswerChange = (
    questionId: string,
    statementKey: string,
    newAnswer: boolean
  ) => {
    const question = examYesNoQuestions.find(
      (q) => String(q.id) === String(questionId) || q.id === questionId
    );

    if (question && question.statements) {
      const newStatements = { ...question.statements };
      if (statementKey in newStatements) {
        newStatements[statementKey as keyof typeof newStatements] = {
          ...newStatements[statementKey as keyof typeof newStatements],
          answer: newAnswer,
        };
      }
      const updatedQuestion = {
        ...question,
        statements: newStatements,
      };
      updateYesNoQuestion(updatedQuestion);
    }
  };

  const handleShortAnswerChange = (questionId: string, newAnswer: string) => {
    const question = examShortQuestions.find(
      (q) => String(q.id) === String(questionId) || q.id === questionId
    );

    if (question) {
      const updatedQuestion = {
        ...question,
        answer: newAnswer,
      };
      updateShortQuestion(updatedQuestion);
    }
  };

  return (
    <div
      ref={panelRef}
      className={`bg-white border-l border-gray-200 flex-shrink-0 h-screen overflow-y-auto hidden lg:block relative transition-all duration-200 ${
        isResizing ? "select-none" : ""
      }`}
      style={{ width: `${panelWidth}px` }}
    >
      {/* Resize Handle */}
      <div
        ref={resizeRef}
        className={`absolute left-0 top-0 w-2 h-full cursor-col-resize hover:bg-neutral-500 transition-colors z-10 ${
          isResizing ? "bg-neutral-500" : "bg-transparent"
        }`}
        onMouseDown={handleResizeStart}
        title="Kéo để thay đổi kích thước"
      >
        <div
          className={`absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 rounded-full p-1 transition-colors ${
            isResizing ? "bg-neutral-500" : "bg-gray-300 hover:bg-neutral-500"
          }`}
        >
          <GripVertical
            className={`h-3 w-3 transition-colors ${
              isResizing ? "text-white" : "text-gray-600 hover:text-white"
            }`}
          />
        </div>
      </div>
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <div className="flex-1">
            <h2 className="text-lg font-calsans">Cấu hình & Đáp án</h2>
            {isResizing && (
              <div className="text-xs text-gray-500">
                Độ rộng: {panelWidth}px
              </div>
            )}
          </div>
        </div>

        {/* Questions and Answers */}
        <div className="space-y-6">
          {examQuestions.length === 0 &&
            examYesNoQuestions.length === 0 &&
            examShortQuestions.length === 0 && (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-2">
                  <Edit3 className="h-8 w-8 mx-auto" />
                </div>
                <p className="text-sm text-gray-500">Chưa có câu hỏi nào</p>
              </div>
            )}
          {/* Multiple Choice Questions */}
          {examQuestions.length > 0 && (
            <div>
              <button
                onClick={() => toggleSection("part1")}
                className="w-full text-sm font-calsans text-gray-700 mb-3 flex items-center gap-2 p-2 bg-neutral-700 rounded  transition-colors"
              >
                <span className="text-white">PHẦN I - Trắc nghiệm</span>
                <span className="ml-auto text-xs bg-white px-2 py-1 rounded-full">
                  {examQuestions.length} câu
                </span>
                {collapsedSections.part1 ? (
                  <ChevronRight className="h-4 w-4 text-neutral-100" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-neutral-100" />
                )}
              </button>
              {!collapsedSections.part1 && (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {examQuestions.map((question, index) => (
                    <div key={question.id} className="p-3 ">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-calsans text-gray-700">
                          Câu {index + 1}
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-1">
                        {["A", "B", "C", "D"].map((option, optionIndex) => (
                          <button
                            key={option}
                            onClick={() =>
                              handleMultipleChoiceAnswerChange(
                                String(question.id),
                                optionIndex
                              )
                            }
                            className={`px-2 py-1 text-xs rounded transition-colors font-calsans ${
                              question.correctAnswer === optionIndex
                                ? "bg-neutral-600 text-white shadow-sm"
                                : "bg-white border border-gray-300 hover:bg-gray-100 hover:border-gray-400"
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Yes/No Questions */}
          {examYesNoQuestions.length > 0 && (
            <div>
              <button
                onClick={() => toggleSection("part2")}
                className="w-full text-sm font-calsans text-gray-700 mb-3 flex items-center gap-2 p-2 bg-neutral-500 rounded transition-colors"
              >
                <span className="text-white">PHẦN II - Đúng/Sai</span>
                <span className="ml-auto text-xs bg-white px-2 py-1 rounded-full">
                  {examYesNoQuestions.length} câu
                </span>
                {collapsedSections.part2 ? (
                  <ChevronRight className="h-4 w-4 text-neutral-100" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-neutral-100" />
                )}
              </button>
              {!collapsedSections.part2 && (
                <div className="space-y-3 max-h-60 overflow-y-auto font-questrial">
                  {examYesNoQuestions.map((question, index) => (
                    <div key={question.id} className="p-3 ">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-calsans text-gray-700">
                          Câu {index + 1}
                        </span>
                        <div className="text-xs bg-neutral-100 text-neutral-700 px-2 py-1 rounded">
                          {getCorrectAnswersCount(question)}/4 ý đúng ={" "}
                          {getYesNoQuestionScore(question).toFixed(2)} điểm
                        </div>
                      </div>
                      {question.statements && (
                        <div className="space-y-2">
                          {Object.entries(question.statements).map(
                            ([key, statement]) => (
                              <div
                                key={key}
                                className="flex items-center gap-2"
                              >
                                <span className="text-xs text-gray-600">
                                  {key.toUpperCase()})
                                </span>
                                <div className="flex gap-1">
                                  <button
                                    onClick={() =>
                                      handleYesNoAnswerChange(
                                        String(question.id),
                                        key,
                                        true
                                      )
                                    }
                                    className={`px-2 py-1 text-xs rounded transition-colors ${
                                      statement.answer === true
                                        ? "bg-neutral-600 text-white"
                                        : "bg-white border border-gray-300 hover:bg-gray-100"
                                    }`}
                                  >
                                    Đúng
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleYesNoAnswerChange(
                                        String(question.id),
                                        key,
                                        false
                                      )
                                    }
                                    className={`px-2 py-1 text-xs rounded transition-colors ${
                                      statement.answer === false
                                        ? "bg-neutral-600 text-white"
                                        : "bg-white border border-gray-300 hover:bg-gray-100"
                                    }`}
                                  >
                                    Sai
                                  </button>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Short Answer Questions */}
          {examShortQuestions.length > 0 && (
            <div>
              <button
                onClick={() => toggleSection("part3")}
                className="w-full text-sm font-calsans text-gray-700 mb-3 flex items-center gap-2 p-2 bg-neutral-200 rounded transition-colors"
              >
                <span className="text-neutral-700">PHẦN III - Tự luận</span>
                <span className="ml-auto text-xs bg-white px-2 py-1 rounded-full">
                  {examShortQuestions.length} câu
                </span>
                {collapsedSections.part3 ? (
                  <ChevronRight className="h-4 w-4 text-neutral-500" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-neutral-500" />
                )}
              </button>
              {!collapsedSections.part3 && (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {examShortQuestions.map((question, index) => (
                    <div key={question.id} className="p-3 ">
                      <div className="text-sm font-calsans text-gray-700 mb-2">
                        Câu {index + 1}
                      </div>
                      <input
                        type="text"
                        value={question.answer || ""}
                        onChange={(e) =>
                          handleShortAnswerChange(
                            String(question.id),
                            e.target.value
                          )
                        }
                        placeholder="Nhập đáp án..."
                        className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
