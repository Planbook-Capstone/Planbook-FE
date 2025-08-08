"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Question {
  questionNumber: number;
  answer?: string;
  explanation?: string;
  statements?: Record<string, boolean>;
  id?: string;
  difficultyLevel?: string;
  sourceType?: string;
  sourceExamId?: number;
  lessonIds?: number[] | null;
}

interface Part {
  part: string;
  questions: Question[];
}

interface AnswerKeyData {
  examCode: string;
  examTitle: string;
  school: string;
  subject: string;
  grade: string;
  duration?: number;
  parts: Part[];
}

interface AnswerKeyTableProps {
  answerData: AnswerKeyData;
}

const AnswerKeyTable: React.FC<AnswerKeyTableProps> = ({ answerData }) => {
  // Handle case when answerData is null or undefined
  if (!answerData) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Không có dữ liệu đáp án</p>
      </div>
    );
  }

  const formatAnswer = (question: Question, partIndex: number): string => {
    switch (partIndex) {
      case 0: // PHẦN I - Multiple choice
        return question.answer || "";
      case 1: // PHẦN II - True/False
        if (question.statements) {
          return Object.entries(question.statements)
            .map(([key, value]: [string, any]) => `${key.toUpperCase()}: ${value ? "Đúng" : "Sai"}`)
            .join(", ");
        }
        return "";
      case 2: // PHẦN III - Short answer
        return question.answer || "";
      default:
        return question.answer || "";
    }
  };

  const formatExplanation = (explanation?: string): string => {
    if (!explanation) return "Không có giải thích";

    // Remove HTML tags for display but keep basic formatting
    return explanation
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, " ")
      .trim();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">{answerData.school || "TRƯỜNG THPT"}</h1>
        <h2 className="text-xl font-semibold">
          ĐÁP ÁN {answerData.subject?.toUpperCase() || "MÔN HỌC"} - LỚP {answerData.grade || ""}
        </h2>
        <h3 className="text-lg font-medium">{answerData.examTitle || "KIỂM TRA"}</h3>
        <p className="text-base font-medium">Mã đề: {answerData.examCode || ""}</p>
      </div>

      {/* Answer tables for each part */}
      {answerData.parts?.map((part, partIndex) => (
        <Card key={partIndex} className="w-full">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              {part.part || `PHẦN ${partIndex + 1}`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16 text-center font-semibold">Câu</TableHead>
                  <TableHead className="w-32 text-center font-semibold">Đáp án</TableHead>
                  <TableHead className="text-center font-semibold">Giải thích</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {part.questions?.map((question, questionIndex) => (
                  <TableRow key={questionIndex} className="hover:bg-gray-50">
                    <TableCell className="text-center font-medium">
                      {question.questionNumber || questionIndex + 1}
                    </TableCell>
                    <TableCell className="text-center font-semibold text-blue-600">
                      {formatAnswer(question, partIndex)}
                    </TableCell>
                    <TableCell className="text-sm">
                      <div className="max-w-prose whitespace-pre-line">
                        {formatExplanation(question.explanation)}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AnswerKeyTable;
