"use client";

import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  XCircle,
  Eye,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SubmissionData, ResultDetail } from "@/services/examInstanceServices";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface SubmissionDetailsSheetProps {
  submission: SubmissionData;
  trigger?: React.ReactNode;
}

// Helper function to sort sub-questions (a, b, c, d)
const getSubQuestionOrder = (questionId: string): number => {
  const subMatch = questionId.match(/_([abcd])$/);
  return subMatch ? subMatch[1].charCodeAt(0) : 0;
};

// Helper function to group and sort results by section
const groupResultsBySection = (results: ResultDetail[]) => {
  const grouped = results.reduce((acc, result) => {
    const section =
      result.partName || result.questionId.split("_")[0] || "PHẦN KHÁC";
    if (!acc[section]) {
      acc[section] = [];
    }
    acc[section].push(result);
    return acc;
  }, {} as Record<string, ResultDetail[]>);

  const sortedGrouped: Record<string, ResultDetail[]> = {};
  const sectionOrder = ["PHẦN I", "PHẦN II", "PHẦN III"];

  sectionOrder.forEach((section) => {
    if (!grouped[section]) return;

    // Sort results within each section
    grouped[section].sort((a, b) => {
      if (a.questionNumber !== b.questionNumber) {
        return a.questionNumber - b.questionNumber;
      }
      return (
        getSubQuestionOrder(a.questionId) - getSubQuestionOrder(b.questionId)
      );
    });

    sortedGrouped[section] = grouped[section];
  });

  // Add remaining sections
  Object.keys(grouped).forEach((section) => {
    if (!sectionOrder.includes(section)) {
      sortedGrouped[section] = grouped[section];
    }
  });

  return sortedGrouped;
};

// Helper function to group PHẦN II results by question number
const groupPart2ByQuestion = (results: ResultDetail[]) => {
  return results.reduce((acc, result) => {
    const questionKey = `question_${result.questionNumber}`;
    if (!acc[questionKey]) {
      acc[questionKey] = [];
    }
    acc[questionKey].push(result);
    return acc;
  }, {} as Record<string, ResultDetail[]>);
};

// Helper function to format question display
const formatQuestionDisplay = (result: ResultDetail) => {
  if (result.question) {
    return `Câu ${result.questionNumber}: ${result.question}`;
  }
  return `Câu ${result.questionNumber}`;
};

// Helper function to render PHẦN II questions with grouping
const renderPart2Questions = (results: ResultDetail[]) => {
  const groupedQuestions = groupPart2ByQuestion(results);

  return Object.entries(groupedQuestions).map(
    ([questionKey, questionResults]) => (
      <div key={questionKey} className="space-y-2">
        <div className="text-sm font-medium text-gray-700 bg-gray-50 px-3 py-2 rounded-md">
          Câu {questionResults[0].questionNumber} - Đúng/Sai
        </div>
        <div className="ml-4 space-y-2">
          {questionResults.map((result, idx) =>
            renderQuestionCard(result, idx)
          )}
        </div>
      </div>
    )
  );
};

// Helper function to render regular questions (PHẦN I, III)
const renderRegularQuestions = (results: ResultDetail[]) => {
  return results.map((result, idx) => renderQuestionCard(result, idx));
};

// Helper function to render individual question card
const renderQuestionCard = (result: ResultDetail, idx: number) => (
  <div
    key={`${result.questionId}-${idx}`}
    className={cn(
      "p-4 rounded-lg border",
      result.isCorrect
        ? "bg-emerald-50 border-emerald-200"
        : "bg-rose-50 border-rose-200"
    )}
  >
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center gap-3">
        {result.isCorrect ? (
          <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
        ) : (
          <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
        )}
        <span className="font-semibold text-gray-800">
          {formatQuestionDisplay(result)}
        </span>
      </div>
      <Badge
        variant={result.isCorrect ? "default" : "destructive"}
        className="text-xs"
      >
        {result.isCorrect ? "Đúng" : "Sai"}
      </Badge>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
      <div className="space-y-1">
        <div className="text-gray-600 font-medium">
          Câu trả lời của học sinh:
        </div>
        <div
          className={cn(
            "font-semibold p-2 rounded bg-white border",
            result.isCorrect
              ? "text-emerald-700 border-emerald-300"
              : "text-rose-700 border-rose-300"
          )}
        >
          {result.studentAnswer}
        </div>
      </div>
      <div className="space-y-1">
        <div className="text-gray-600 font-medium">Đáp án đúng:</div>
        <div className="font-semibold text-emerald-700 p-2 rounded bg-white border border-emerald-300">
          {result.correctAnswer}
        </div>
      </div>
    </div>
  </div>
);

export function SubmissionDetailsSheet({
  submission,
  trigger,
}: SubmissionDetailsSheetProps) {
  // State for collapsible panels
  const [collapsedSections, setCollapsedSections] = useState<
    Record<string, boolean>
  >({});

  // Helper function to toggle section collapse
  const toggleSection = (section: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const defaultTrigger = (
    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
      <Eye className="h-4 w-4" />
    </Button>
  );

  return (
    <Sheet>
      <SheetTrigger asChild>{trigger || defaultTrigger}</SheetTrigger>
      <SheetContent
        side="left"
        className="w-1/3 !max-w-none  sm:w-[500px] overflow-y-auto"
      >
        <SheetHeader className="space-y-4">
          <SheetTitle className="text-xl font-calsans font-normal">
            Chi tiết bài làm của - {submission.studentName}
          </SheetTitle>
          <SheetDescription className="text-sm text-gray-600">
            Nộp lúc:{" "}
            {format(new Date(submission.submittedAt), "dd/MM/yyyy HH:mm", {
              locale: vi,
            })}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 p-10">
          {/* Score Overview */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-900 mb-1">
                {submission.score}
              </div>
              <div className="text-sm text-blue-700">
                điểm / {submission.maxScore} điểm
              </div>
            </div>
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <div className="flex items-center justify-center gap-1 mb-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-700">
                  Đúng
                </span>
              </div>
              <div className="text-2xl font-bold text-emerald-900">
                {submission.correctCount}
              </div>
            </div>

            <div className="text-center p-4 bg-rose-50 rounded-lg border border-rose-200">
              <div className="flex items-center justify-center gap-1 mb-2">
                <XCircle className="w-4 h-4 text-rose-600" />
                <span className="text-sm font-medium text-rose-700">Sai</span>
              </div>
              <div className="text-2xl font-bold text-rose-900">
                {submission.totalQuestions - submission.correctCount}
              </div>
            </div>

            <div className="text-center p-4 bg-sky-50 rounded-lg border border-sky-200">
              <div className="flex items-center justify-center gap-1 mb-2">
                <span className="text-sm font-medium text-sky-700">Tổng</span>
              </div>
              <div className="text-2xl font-bold text-sky-900">
                {submission.totalQuestions}
              </div>
            </div>
          </div>

          {/* Detailed Results */}
          {submission.resultDetails && submission.resultDetails.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-calsans text-lg text-gray-900 flex items-center gap-2">
                Chi tiết từng câu hỏi
              </h4>

              {Object.entries(
                groupResultsBySection(submission.resultDetails)
              ).map(([section, results]) => {
                const isCollapsed = collapsedSections[section];
                const sectionName = section.replace("PHẦN", "Phần");

                return (
                  <div
                    key={section}
                    className="border rounded-lg overflow-hidden"
                  >
                    <button
                      onClick={() => toggleSection(section)}
                      className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <h5 className="font-semibold text-gray-800 text-base">
                        {sectionName}
                      </h5>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">
                          {results.length} câu
                        </span>
                        {isCollapsed ? (
                          <ChevronDown className="h-4 w-4 text-gray-600" />
                        ) : (
                          <ChevronUp className="h-4 w-4 text-gray-600" />
                        )}
                      </div>
                    </button>

                    {!isCollapsed && (
                      <div className="p-4 space-y-3">
                        {section === "PHẦN II"
                          ? renderPart2Questions(results)
                          : renderRegularQuestions(results)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
