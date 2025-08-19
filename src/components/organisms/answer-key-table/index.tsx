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


interface Question {
  questionNumber: number;
  answer?: string;
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



  return (
    <div className="space-y-6">
      {/* Exam Header */}
      <div className="mb-8">
        {/* Top row with ministry and exam info */}
        <div className="flex justify-between items-start mb-4">
          <div className="text-center" style={{ width: "30%" }}>
            <p className="font-bold text-sm">
              SỞ GIÁO DỤC VÀ ĐÀO TẠO
            </p>
            <p className="font-bold text-sm text-center mt-1">
              ĐÁP ÁN CHÍNH THỨC
            </p>
          </div>
          <div className="text-center flex-1">
            <p className="font-bold text-lg">
              {answerData?.examTitle?.toUpperCase() || "ĐỀ KIỂM TRA ......"}
            </p>
            <p className="font-bold text-base mt-1">
              Môn: {answerData?.subject || "......"}. - Lớp{" "}
              {answerData?.grade || "....."}
            </p>
            <p className="text-sm mt-1">
              Thời gian làm bài:{answerData?.duration || "..."} phút, không
              kể thời gian phát đề
            </p>
          </div>
        </div>

        {/* Exam code section */}
        <div className="flex justify-end mt-8">
          <div className="border-2 border-black px-6 py-2 flex items-center justify-center">
            <p className="text-sm text-center">
              Mã đề: {answerData?.examCode || "001"}
            </p>
          </div>
        </div>
      </div>

      {/* Answer tables for each part */}
      {answerData.parts?.map((part, partIndex) => (
        <div key={partIndex} className="w-full space-y-4">
          <h3 className="text-lg font-semibold">
            {part.part || `PHẦN ${partIndex + 1}`}
          </h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16 text-center font-semibold">Câu</TableHead>
                <TableHead className="w-32 text-center font-semibold">Đáp án</TableHead>
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ))}
    </div>
  );
};

export default AnswerKeyTable;
