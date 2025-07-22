"use client";

import React, { useState, useRef, useEffect } from "react";
import { useExamContext } from "@/contexts/ExamContext";
import { useExamTemplateContext } from "@/contexts/ExamTemplateContext";
import { Button } from "@/components/ui/Button";
import {
  Settings,
  Edit3,
  ChevronDown,
  ChevronRight,
  GripVertical,
} from "lucide-react";

export default function GradingPanel() {
  const {
    examQuestions,
    examYesNoQuestions,
    examShortQuestions,
    updateQuestion,
    updateYesNoQuestion,
    updateShortQuestion,
  } = useExamContext();
  const { templateMetadata, setTemplateMetadata } = useExamTemplateContext();

  // State for panel width and collapse
  const [panelWidth, setPanelWidth] = useState(320); // Default 320px (w-80)
  const [isResizing, setIsResizing] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState({
    grading: false,
    part1: false,
    part2: false,
    part3: false,
  });

  const panelRef = useRef<HTMLDivElement>(null);
  const resizeRef = useRef<HTMLDivElement>(null);

  const defaultGradingConfig = {
    "PHẦN I": 0.25,
    "PHẦN II": 1.0,
    "PHẦN III": 0.25,
  };

  const gradingConfig = templateMetadata?.gradingConfig || defaultGradingConfig;

  // Effect to ensure gradingConfig is synced to templateMetadata
  useEffect(() => {
    if (templateMetadata && !templateMetadata.gradingConfig) {
      console.log("=== SYNCING DEFAULT GRADING CONFIG ===");
      console.log("Current template metadata:", templateMetadata);
      console.log("Default grading config:", defaultGradingConfig);

      const updatedMetadata = {
        ...templateMetadata,
        gradingConfig: defaultGradingConfig,
      };

      console.log("Updated metadata with grading config:", updatedMetadata);
      setTemplateMetadata(updatedMetadata);
    }
  }, [templateMetadata, setTemplateMetadata]);

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
          case "0":
            e.preventDefault();
            toggleSection("grading");
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

  const handleGradingConfigChange = (part: string, value: number) => {
    console.log("=== UPDATING GRADING CONFIG ===");
    console.log("Part:", part);
    console.log("Value:", value);
    console.log("Current template metadata:", templateMetadata);

    const newGradingConfig = { ...gradingConfig, [part]: value };

    if (templateMetadata) {
      const updatedMetadata = {
        ...templateMetadata,
        gradingConfig: newGradingConfig,
      };

      console.log("New grading config:", newGradingConfig);
      console.log("Updated metadata:", updatedMetadata);

      setTemplateMetadata(updatedMetadata);
    } else {
      // Create default template metadata if it doesn't exist
      const defaultMetadata = {
        name: "Template mới",
        subject: "Chưa xác định",
        grade: 10,
        durationMinutes: 90,
        totalScore: 10,
        gradingConfig: newGradingConfig,
        description: "",
      };

      console.log("Creating default template metadata:", defaultMetadata);
      setTemplateMetadata(defaultMetadata);
    }
  };

  const handleMultipleChoiceAnswerChange = (
    questionId: string,
    newAnswer: number
  ) => {
    console.log("=== UPDATING MULTIPLE CHOICE ANSWER ===");
    console.log("Question ID:", questionId, typeof questionId);
    console.log("New Answer:", newAnswer);
    console.log(
      "All questions:",
      examQuestions.map((q) => ({ id: q.id, type: typeof q.id }))
    );

    // Try both string and number comparison
    const question = examQuestions.find(
      (q) => String(q.id) === String(questionId) || q.id === questionId
    );

    console.log("Found question:", question);

    if (question) {
      const updatedQuestion = {
        ...question,
        correctAnswer: newAnswer,
      };
      console.log("Updating question to:", updatedQuestion);
      updateQuestion(updatedQuestion);
    } else {
      console.warn("Question not found for ID:", questionId);
    }
  };

  const handleYesNoAnswerChange = (
    questionId: string,
    statementKey: string,
    newAnswer: boolean
  ) => {
    console.log("=== UPDATING YES/NO ANSWER ===");
    console.log("Question ID:", questionId, typeof questionId);
    console.log("Statement Key:", statementKey);
    console.log("New Answer:", newAnswer);

    // Try both string and number comparison
    const question = examYesNoQuestions.find(
      (q) => String(q.id) === String(questionId) || q.id === questionId
    );

    console.log("Found YesNo question:", question);

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
      console.log("Updating YesNo question to:", updatedQuestion);
      updateYesNoQuestion(updatedQuestion);
    } else {
      console.warn("YesNo question not found for ID:", questionId);
    }
  };

  const handleShortAnswerChange = (questionId: string, newAnswer: string) => {
    console.log("=== UPDATING SHORT ANSWER ===");
    console.log("Question ID:", questionId, typeof questionId);
    console.log("New Answer:", newAnswer);

    // Try both string and number comparison
    const question = examShortQuestions.find(
      (q) => String(q.id) === String(questionId) || q.id === questionId
    );

    console.log("Found Short question:", question);

    if (question) {
      const updatedQuestion = {
        ...question,
        answer: newAnswer,
      };
      console.log("Updating Short question to:", updatedQuestion);
      updateShortQuestion(updatedQuestion);
    } else {
      console.warn("Short question not found for ID:", questionId);
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
        className={`absolute left-0 top-0 w-2 h-full cursor-col-resize hover:bg-blue-500 transition-colors z-10 ${
          isResizing ? "bg-blue-500" : "bg-transparent"
        }`}
        onMouseDown={handleResizeStart}
        title="Kéo để thay đổi kích thước"
      >
        <div
          className={`absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 rounded-full p-1 transition-colors ${
            isResizing ? "bg-blue-500" : "bg-gray-300 hover:bg-blue-500"
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

        {/* Grading Configuration */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection("grading")}
            className="w-full flex items-center justify-between text-sm font-calsans border shadow-2xs text-gray-700 mb-3 p-2 hover:bg-gray-50 rounded-sm transition-colors"
          >
            <div className="flex items-center gap-2">
              <span>Thang điểm</span>
            </div>
            {collapsedSections.grading ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
          {!collapsedSections.grading && (
            <>
              {Object.keys(gradingConfig).length > 0 ? (
                <div className="space-y-3">
                  {Object.entries(gradingConfig).map(([part, score]) => (
                    <div
                      key={part}
                      className="flex items-center justify-between p-2 rounded"
                    >
                      <span className="text-sm font-calsans text-gray-700">
                        {part}
                      </span>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          step="0.25"
                          min="0"
                          max="10"
                          value={score}
                          onChange={(e) =>
                            handleGradingConfigChange(
                              part,
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-xs text-gray-500">điểm/câu</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-500 italic">
                  Chưa có cấu hình thang điểm
                </div>
              )}
            </>
          )}
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
                className="w-full text-sm font-calsans text-gray-700 mb-3 flex items-center gap-2 p-2 bg-amber-300 rounded  transition-colors"
              >
                <span className="text-white">PHẦN I - Trắc nghiệm</span>
                <span className="ml-auto text-xs bg-white px-2 py-1 rounded-full">
                  {examQuestions.length} câu
                </span>
                {collapsedSections.part1 ? (
                  <ChevronRight className="h-4 w-4 text-amber-600" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-amber-600" />
                )}
              </button>
              {!collapsedSections.part1 && (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {examQuestions.map((question, index) => (
                    <div
                      key={question.id}
                      className="p-3 bg-amber-50 border-l-2 border-amber-500"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-calsans text-gray-700">
                          Câu {index + 1}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-1">
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
                className="w-full text-sm font-calsans text-gray-700 mb-3 flex items-center gap-2 p-2 bg-blue-300 rounded hover:bg-blue-100 transition-colors"
              >
                <span className="text-white">PHẦN II - Đúng/Sai</span>
                <span className="ml-auto text-xs bg-white px-2 py-1 rounded-full">
                  {examYesNoQuestions.length} câu
                </span>
                {collapsedSections.part2 ? (
                  <ChevronRight className="h-4 w-4 text-blue-600" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-blue-600" />
                )}
              </button>
              {!collapsedSections.part2 && (
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {examYesNoQuestions.map((question, index) => (
                    <div
                      key={question.id}
                      className="p-3 bg-sky-50 border-l-2 border-blue-400"
                    >
                      <div className="text-sm font-calsans text-gray-700 mb-2">
                        Câu {examQuestions.length + index + 1}
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
                className="w-full text-sm font-calsans text-gray-700 mb-3 flex items-center gap-2 p-2 bg-orange-400 rounded hover:bg-orange-100 transition-colors"
              >
                <span className="text-white">PHẦN III - Tự luận</span>
                <span className="ml-auto text-xs bg-white px-2 py-1 rounded-full">
                  {examShortQuestions.length} câu
                </span>
                {collapsedSections.part3 ? (
                  <ChevronRight className="h-4 w-4 text-orange-600" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-orange-600" />
                )}
              </button>
              {!collapsedSections.part3 && (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {examShortQuestions.map((question, index) => (
                    <div
                      key={question.id}
                      className="p-3 bg-orange-50 border-l-2 border-orange-400"
                    >
                      <div className="text-sm font-calsans text-gray-700 mb-2">
                        Câu{" "}
                        {examQuestions.length +
                          examYesNoQuestions.length +
                          index +
                          1}
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
                        className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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
