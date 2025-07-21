"use client";

import React, { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Clock,
  FileText,
  User,
  Award,
  Target,
  TrendingUp,
} from "lucide-react";
import { SubmitExamResponse } from "@/services/studentExamServices";

interface ExamSuccessPageProps {
  params: Promise<{
    code: string;
  }>;
}

export default function ExamSuccessPage({ params }: ExamSuccessPageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [examResult, setExamResult] = useState<SubmitExamResponse | null>(null);

  useEffect(() => {
    const loadExamResult = () => {
      const storageKey = `exam_result_${resolvedParams.code}`;
      const resultData = localStorage.getItem(storageKey);

      if (resultData) {
        try {
          const parsedResult = JSON.parse(resultData);
          console.log(parsedResult.data);
          setExamResult(parsedResult.data);
          return true;
        } catch (error) {
          console.error("Error parsing exam result:", error);
        }
      }
      return false;
    };

    if (!loadExamResult()) {
      const timeout = setTimeout(() => {
        loadExamResult();
      }, 100);

      return () => clearTimeout(timeout);
    }
  }, [resolvedParams.code]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === `exam_result_${resolvedParams.code}` && e.newValue) {
        try {
          const parsedResult = JSON.parse(e.newValue);
          setExamResult(parsedResult);
        } catch (error) {
          console.error("Error parsing storage event data:", error);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [resolvedParams.code]);

  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadgeColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return "bg-green-100 text-green-800";
    if (percentage >= 60) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const handleGoHome = () => {
    localStorage.removeItem(`exam_result_${resolvedParams.code}`);
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Nộp bài thành công!
            </h1>
            <p className="text-gray-600 text-lg">
              Bài thi của bạn đã được chấm điểm và lưu trữ an toàn
            </p>
            {examResult && (
              <Badge
                className={getScoreBadgeColor(
                  examResult.score,
                  examResult.maxScore
                )}
              >
                Điểm: {examResult.score}/{examResult.maxScore}
              </Badge>
            )}
          </div>

          {examResult && (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-center flex items-center justify-center gap-2">
                  <Award className="w-6 h-6 text-yellow-600" />
                  Kết quả bài thi
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">Điểm số của bạn</p>
                    <div
                      className={`text-4xl font-bold ${getScoreColor(
                        examResult.score,
                        examResult.maxScore
                      )}`}
                    >
                      {examResult.score}/{examResult.maxScore}
                    </div>
                    <p className="text-sm text-gray-600">
                      (
                      {((examResult.score / examResult.maxScore) * 100).toFixed(
                        1
                      )}
                      %)
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-green-600">
                      {examResult.correctCount}
                    </p>
                    <p className="text-sm text-gray-600">Câu đúng</p>
                  </div>

                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <TrendingUp className="w-8 h-8 text-red-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-red-600">
                      {examResult.totalQuestions - examResult.correctCount}
                    </p>
                    <p className="text-sm text-gray-600">Câu sai</p>
                  </div>

                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-blue-600">
                      {examResult.totalQuestions}
                    </p>
                    <p className="text-sm text-gray-600">Tổng câu</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <User className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="text-sm text-gray-500">Học sinh</p>
                        <p className="font-medium">{examResult.studentName}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Clock className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="text-sm text-gray-500">Thời gian nộp</p>
                        <p className="font-medium">
                          {new Date(examResult.submittedAt).toLocaleString(
                            "vi-VN"
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-center">
                Thông tin bài thi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-500">Mã đề thi</p>
                    <p className="font-medium font-mono">
                      {resolvedParams.code}
                    </p>
                  </div>
                </div>

                {examResult && examResult.submissionId && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <FileText className="w-5 h-5 text-orange-600" />
                    <div>
                      <p className="text-sm text-gray-500">Mã bài nộp</p>
                      <p className="font-medium font-mono text-xs">
                        {examResult.submissionId.slice(0, 8)}...
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-green-800 font-medium">
                  {examResult
                    ? "Bài thi đã được chấm điểm thành công"
                    : "Bài thi đã được nộp thành công"}
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="outline"
              onClick={handleGoHome}
              className="flex items-center gap-2"
            >
              <User className="w-4 h-4" />
              Về trang chủ
            </Button>

            <Button
              onClick={() => window.print()}
              className="flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              In xác nhận
            </Button>
          </div>

          <div className="text-center text-sm text-gray-500 pt-6 border-t">
            <p>Cảm ơn bạn đã tham gia bài thi. Chúc bạn đạt kết quả tốt!</p>
            <p className="mt-1">
              Hệ thống thi trực tuyến PlanBook - {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
