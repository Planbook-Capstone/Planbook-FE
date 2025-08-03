"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  User,
  Calendar,
  Award,
  Target,
  BarChart3,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { SubmissionData, ResultDetail } from "@/services/examInstanceServices";
import { cn } from "@/lib/utils";

interface SubmissionDetailsProps {
  submission: SubmissionData;
  index: number;
  className?: string;
}

export function SubmissionDetails({
  submission,
  index,
  className,
}: SubmissionDetailsProps) {
  const [showDetails, setShowDetails] = useState(false);
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

  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return "text-emerald-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-rose-600";
  };

  const getScoreBgColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return "bg-emerald-50 border-emerald-200";
    if (percentage >= 60) return "bg-yellow-50 border-yellow-200";
    return "bg-rose-50 border-rose-200";
  };

  const formatQuestionDisplay = (result: ResultDetail) => {
    // Use the new question field if available, otherwise fallback to questionNumber
    if (result.question) {
      const section =
        result.partName?.replace("PHẦN", "Phần") ||
        result.questionId.split("_")[0]?.replace("PHẦN", "Phần") ||
        "";
      return `${section} - Câu ${result.question}`;
    }

    // Fallback to old format
    const parts = result.questionId.split("_");
    if (parts.length >= 1) {
      const section = parts[0].replace("PHẦN", "Phần");
      return `${section} - Câu ${result.questionNumber}`;
    }
    return `Câu ${result.questionNumber}`;
  };

  // Helper function to sort sub-questions (a, b, c, d)
  const getSubQuestionOrder = (questionId: string): number => {
    const subMatch = questionId.match(/_([abcd])$/);
    return subMatch ? subMatch[1].charCodeAt(0) : 0;
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

  const groupResultsBySection = (results: ResultDetail[]) => {
    const grouped: { [key: string]: ResultDetail[] } = {};

    results.forEach((result) => {
      const section =
        result.partName ||
        result.questionId.match(/^(PHẦN [IVX]+)/)?.[1] ||
        "Khác";

      if (!grouped[section]) {
        grouped[section] = [];
      }
      grouped[section].push(result);
    });

    // Sort sections in order: PHẦN I, PHẦN II, PHẦN III
    const sortedGrouped: { [key: string]: ResultDetail[] } = {};
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

  const percentage = ((submission.score / submission.maxScore) * 100).toFixed(
    1
  );

  return (
    <Card className={cn("transition-all duration-200", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 border rounded-full flex items-center justify-center">
              <span className="text-sm font-questrial text-neutral-700">
                {index + 1}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-calsans text-base text-gray-900">
                  {submission.studentName}
                </h3>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Calendar className="w-3 h-3" />
                <span>
                  Nộp lúc:{" "}
                  {format(
                    new Date(submission.submittedAt),
                    "dd/MM/yyyy HH:mm",
                    { locale: vi }
                  )}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div
              className={cn(
                "px-4 py-2 rounded-full",
                getScoreBgColor(submission.score, submission.maxScore)
              )}
            >
              <div className="text-center flex items-center gap-2">
                <div
                  className={cn(
                    "text-xl font-calsans",
                    getScoreColor(submission.score, submission.maxScore)
                  )}
                >
                  {submission.score}/{submission.maxScore}
                </div>
                <div className="text-xs text-gray-600">({percentage}%)</div>
              </div>
            </div>

            {submission.resultDetails &&
              submission.resultDetails.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDetails(!showDetails)}
                  className="flex items-center gap-2 py-5"
                >
                  {showDetails ? (
                    <>
                      <EyeOff className="w-4 h-4" />
                      Ẩn chi tiết
                      <ChevronUp className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4" />
                      Xem chi tiết
                      <ChevronDown className="w-4 h-4" />
                    </>
                  )}
                </Button>
              )}
          </div>
        </div>
      </CardHeader>

      {/* Thống kê tổng quan */}
      <CardContent className="pt-0">
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center p-3 bg-emerald-50 rounded-lg border border-emerald-200">
            <div className="flex items-center justify-center gap-1 mb-1">
              <span className="text-sm font-medium text-emerald-700">Đúng</span>
            </div>
            <div className="text-xl font-bold text-emerald-900">
              {submission.correctCount}
            </div>
          </div>

          <div className="text-center p-3 bg-rose-50 rounded-lg border border-rose-200">
            <div className="flex items-center justify-center gap-1 mb-1">
              <span className="text-sm font-medium text-rose-700">Sai</span>
            </div>
            <div className="text-xl font-bold text-rose-900">
              {submission.totalQuestions - submission.correctCount}
            </div>
          </div>

          <div className="text-center p-3 bg-sky-50 rounded-lg border border-sky-200">
            <div className="flex items-center justify-center gap-1 mb-1">
              <span className="text-sm font-medium text-sky-700">Tổng</span>
            </div>
            <div className="text-xl font-bold text-sky-900">
              {submission.totalQuestions}
            </div>
          </div>
        </div>

        {/* Chi tiết từng câu */}
        {showDetails &&
          submission.resultDetails &&
          submission.resultDetails.length > 0 && (
            <div className="pt-4">
              <h4 className="font-calsans text-base text-gray-900 mb-3 flex items-center gap-2">
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
                    className="mb-4 border rounded-lg overflow-hidden"
                  >
                    <button
                      onClick={() => toggleSection(section)}
                      className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <h5 className="font-medium text-gray-800 text-sm">
                        {sectionName}
                      </h5>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-600">
                          {results.length} câu
                        </span>
                        {isCollapsed ? (
                          <ChevronDown className="h-3 w-3 text-gray-600" />
                        ) : (
                          <ChevronUp className="h-3 w-3 text-gray-600" />
                        )}
                      </div>
                    </button>

                    {!isCollapsed && (
                      <div className="space-y-2">
                        {section === "PHẦN II"
                          ? // Group PHẦN II by question number
                            Object.entries(groupPart2ByQuestion(results)).map(
                              ([questionKey, questionResults]) => (
                                <div key={questionKey} className="space-y-1">
                                  <div className="text-xs font-medium text-gray-600 bg-gray-50 px-2 py-1 rounded">
                                    Câu {questionResults[0].questionNumber} -
                                  </div>
                                  <div className="ml-3 space-y-1">
                                    {questionResults?.map((result, idx) => (
                                      <div
                                        key={`${result.questionId}-${idx}`}
                                        className={cn(
                                          "flex items-center justify-between p-2 rounded border text-sm",
                                          result.isCorrect
                                            ? "bg-emerald-50 border-emerald-200"
                                            : "bg-rose-50 border-rose-200"
                                        )}
                                      >
                                        <div className="flex items-center gap-3">
                                          {result.isCorrect ? (
                                            <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                                          ) : (
                                            <XCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                                          )}
                                          <span className="font-medium text-gray-700">
                                            {formatQuestionDisplay(result)}
                                          </span>
                                        </div>

                                        <div className="flex items-center gap-4 text-xs">
                                          <div className="text-right">
                                            <div className="text-gray-600">
                                              Trả lời:
                                            </div>
                                            <div
                                              className={cn(
                                                "font-medium",
                                                result.isCorrect
                                                  ? "text-emerald-700"
                                                  : "text-rose-700"
                                              )}
                                            >
                                              {result.studentAnswer}
                                            </div>
                                          </div>
                                          <div className="text-right">
                                            <div className="text-gray-600">
                                              Đáp án:
                                            </div>
                                            <div className="font-medium text-emerald-700">
                                              {result.correctAnswer}
                                            </div>
                                          </div>
                                          <Badge
                                            variant={
                                              result.isCorrect
                                                ? "default"
                                                : "destructive"
                                            }
                                            className="text-xs"
                                          >
                                            {result.isCorrect ? "Đúng" : "Sai"}
                                          </Badge>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )
                            )
                          : // Regular display for PHẦN I and PHẦN III
                            results.map((result, idx) => (
                              <div
                                key={`${result.questionId}-${idx}`}
                                className={cn(
                                  "flex items-center justify-between p-3 rounded-lg border text-sm",
                                  result.isCorrect
                                    ? "bg-emerald-50 border-emerald-200"
                                    : "bg-rose-50 border-rose-200"
                                )}
                              >
                                <div className="flex items-center gap-3">
                                  {result.isCorrect ? (
                                    <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                                  ) : (
                                    <XCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                                  )}
                                  <span className="font-medium text-gray-700">
                                    {formatQuestionDisplay(result)}
                                  </span>
                                </div>

                                <div className="flex items-center gap-4 text-xs">
                                  <div className="text-right">
                                    <div className="text-gray-600">
                                      Trả lời:
                                    </div>
                                    <div
                                      className={cn(
                                        "font-medium",
                                        result.isCorrect
                                          ? "text-emerald-700"
                                          : "text-rose-700"
                                      )}
                                    >
                                      {result.studentAnswer}
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-gray-600">Đáp án:</div>
                                    <div className="font-medium text-emerald-700">
                                      {result.correctAnswer}
                                    </div>
                                  </div>
                                  <Badge
                                    variant={
                                      result.isCorrect
                                        ? "default"
                                        : "destructive"
                                    }
                                    className="text-xs"
                                  >
                                    {result.isCorrect ? "Đúng" : "Sai"}
                                  </Badge>
                                </div>
                              </div>
                            ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
      </CardContent>
    </Card>
  );
}
