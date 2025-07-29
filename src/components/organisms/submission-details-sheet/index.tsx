"use client";

import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Eye } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SubmissionData, ResultDetail } from "@/services/examInstanceServices";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface SubmissionDetailsSheetProps {
  submission: SubmissionData;
  trigger?: React.ReactNode;
}

// Helper function to group results by section
const groupResultsBySection = (results: ResultDetail[]) => {
  return results.reduce((acc, result) => {
    // Extract section from questionId (assuming format like "PHẦN I_1", "PHẦN II_1", etc.)
    const section = result.questionId.split("_")[0] || "PHẦN KHÁC";
    if (!acc[section]) {
      acc[section] = [];
    }
    acc[section].push(result);
    return acc;
  }, {} as Record<string, ResultDetail[]>);
};

// Helper function to format question ID
const formatQuestionId = (questionId: string) => {
  const parts = questionId.split("_");
  if (parts.length >= 2) {
    return `Câu ${parts[1]}`;
  }
  return questionId;
};

export function SubmissionDetailsSheet({
  submission,
  trigger,
}: SubmissionDetailsSheetProps) {
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
              ).map(([section, results]) => (
                <div key={section} className="space-y-3">
                  <h5 className="font-semibold text-gray-800 text-base border-b border-gray-200 pb-2">
                    {section.replace("PHẦN", "Phần")}
                  </h5>
                  <div className="space-y-3">
                    {results.map((result, idx) => (
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
                              {formatQuestionId(result.questionId)}
                            </span>
                          </div>
                          <Badge
                            variant={
                              result.isCorrect ? "default" : "destructive"
                            }
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
                            <div className="text-gray-600 font-medium">
                              Đáp án đúng:
                            </div>
                            <div className="font-semibold text-emerald-700 p-2 rounded bg-white border border-emerald-300">
                              {result.correctAnswer}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
