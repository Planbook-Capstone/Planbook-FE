"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, Circle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuestionStatus {
  questionId: string;
  questionNumber: number;
  partType: "PHẦN I" | "PHẦN II" | "PHẦN III";
  isAnswered: boolean;
}

interface QuestionNavigationProps {
  questions: QuestionStatus[];
  currentQuestionId: string;
  onQuestionSelect: (questionId: string) => void;
  timeRemaining: number; // in seconds
  onSubmit: () => void;
  className?: string;
}

export function QuestionNavigation({
  questions,
  currentQuestionId,
  onQuestionSelect,
  timeRemaining,
  onSubmit,
  className,
}: QuestionNavigationProps) {
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const getTimeColor = () => {
    if (timeRemaining <= 300) return "text-red-600"; // 5 minutes
    if (timeRemaining <= 600) return "text-yellow-600"; // 10 minutes
    return "text-green-600";
  };

  const groupedQuestions = questions.reduce((acc, question) => {
    if (!acc[question.partType]) {
      acc[question.partType] = [];
    }
    acc[question.partType].push(question);
    return acc;
  }, {} as Record<string, QuestionStatus[]>);

  const answeredCount = questions.filter((q) => q.isAnswered).length;
  const totalCount = questions.length;

  return (
    <Card className={cn("sticky top-4", className)}>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Điều hướng câu hỏi</CardTitle>

        {/* Timer */}
        <div
          className={cn(
            "flex items-center gap-2 text-lg font-mono",
            getTimeColor()
          )}
        >
          <Clock className="w-5 h-5" />
          <span>{formatTime(timeRemaining)}</span>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Tiến độ</span>
            <span>
              {answeredCount}/{totalCount}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(answeredCount / totalCount) * 100}%` }}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Question Grid by Parts */}
        {Object.entries(groupedQuestions).map(([partType, partQuestions]) => (
          <div key={partType} className="space-y-3">
            <h4 className="font-medium text-gray-700 text-sm">{partType}</h4>
            <div className="grid grid-cols-6 gap-2">
              {partQuestions.map((question) => (
                <Button
                  key={question.questionId}
                  variant="outline"
                  size="sm"
                  className={cn(
                    "aspect-square text-sm relative",
                    currentQuestionId === question.questionId
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : question.isAnswered
                      ? "border-green-500 bg-green-50 text-green-700"
                      : "border-gray-300 text-gray-600 hover:border-gray-400"
                  )}
                  onClick={() => onQuestionSelect(question.questionId)}
                >
                  {question.questionNumber}
                  {question.isAnswered && (
                    <CheckCircle className="w-3 h-3 absolute -top-1 -right-1 text-green-600 bg-white rounded-full" />
                  )}
                </Button>
              ))}
            </div>
          </div>
        ))}

        {/* Legend */}
        <div className="space-y-2 pt-4 border-t">
          <h4 className="font-medium text-gray-700 text-sm">Chú thích</h4>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-blue-500 bg-blue-50 rounded"></div>
              <span>Câu hiện tại</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-green-500 bg-green-50 rounded relative">
                <CheckCircle className="w-2 h-2 absolute -top-0.5 -right-0.5 text-green-600 bg-white rounded-full" />
              </div>
              <span>Đã trả lời</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-gray-300 rounded"></div>
              <span>Chưa trả lời</span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t">
          <Button
            onClick={onSubmit}
            className="w-full"
            size="lg"
            variant={answeredCount === totalCount ? "default" : "outline"}
          >
            {answeredCount === totalCount
              ? "Nộp bài"
              : `Nộp bài (${answeredCount}/${totalCount})`}
          </Button>

          {answeredCount < totalCount && (
            <p className="text-xs text-gray-500 mt-2 text-center">
              Bạn chưa trả lời hết tất cả câu hỏi
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
