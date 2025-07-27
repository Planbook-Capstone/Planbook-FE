"use client";

import React, { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
    return "text-rose-700";
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
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
      {/* Video Background - Cloudinary với URL đúng */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover z-0"
        style={{ pointerEvents: "none" }}
      >
        <source
          src="https://res.cloudinary.com/dpo0ad3aq/video/upload/Typography_02_1_q3lngm.mp4"
          type="video/mp4"
        />
        <source
          src="https://res.cloudinary.com/dpo0ad3aq/video/upload/f_webm,q_auto/Typography_02_1_q3lngm.webm"
          type="video/webm"
        />
      </video>

      {/* Overlay để làm mờ video */}
      <div className="absolute inset-0 bg-white/20 z-10"></div>

      {/* Confetti/Ribbon Animation */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
              animationIterationCount: "1",
              animationFillMode: "forwards",
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          >
            <div
              className={`w-2 h-8 ${
                [
                  "bg-yellow-400",
                  "bg-blue-400",
                  "bg-green-400",
                  "bg-red-400",
                  "bg-purple-400",
                  "bg-pink-400",
                ][Math.floor(Math.random() * 6)]
              } opacity-80 animate-pulse`}
              style={{
                animation: `fall ${3 + Math.random() * 2}s linear infinite`,
              }}
            ></div>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes fall {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>

      {/* Content wrapper */}
      <div className="relative z-20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto space-y-6">
            {examResult && (
              <Card className="bg-white border border-gray-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl text-center text-black">
                    Kết quả bài thi
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center space-y-4">
                    <div className="space-y-2">
                      <p className="text-sm text-black">Điểm số của bạn</p>
                      <div
                        className={`text-4xl font-calsans ${getScoreColor(
                          examResult.score,
                          examResult.maxScore
                        )}`}
                      >
                        {examResult.score}/{examResult.maxScore}
                      </div>
                      <p className="text-sm text-black">
                        (
                        {(
                          (examResult.score / examResult.maxScore) *
                          100
                        ).toFixed(1)}
                        %)
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center rounded-lg">
                      <p className="text-2xl font-bold text-black">
                        {examResult.correctCount}
                      </p>
                      <p className="text-sm text-black">Câu đúng</p>
                    </div>

                    <div className="text-center rounded-lg">
                      <p className="text-2xl font-bold text-black">
                        {examResult.totalQuestions - examResult.correctCount}
                      </p>
                      <p className="text-sm text-black">Câu sai</p>
                    </div>

                    <div className="text-center rounded-lg">
                      <p className="text-2xl font-bold text-black">
                        {examResult.totalQuestions}
                      </p>
                      <p className="text-sm text-black">Tổng câu</p>
                    </div>
                  </div>

                  <div className="pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 rounded-lg">
                        <div>
                          <p className="text-sm text-black">Học sinh</p>
                          <p className="font-medium text-black">
                            {examResult.studentName}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 rounded-lg">
                        <div>
                          <p className="text-sm text-black">Thời gian nộp</p>
                          <p className="font-medium text-black">
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

            <Card className="bg-white border border-gray-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-center text-black">
                  Thông tin bài thi
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 rounded-lg">
                    <div>
                      <p className="text-sm text-black">Mã đề thi</p>
                      <p className="font-medium font-mono text-black">
                        {resolvedParams.code}
                      </p>
                    </div>
                  </div>

                  {examResult && examResult.submissionId && (
                    <div className="flex items-center gap-3 rounded-lg">
                      <div>
                        <p className="text-sm text-black">Mã bài nộp</p>
                        <p className="font-medium font-mono text-xs text-black">
                          {examResult.submissionId.slice(0, 8)}...
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" onClick={handleGoHome}>
                Về trang chủ
              </Button>

              <Button onClick={() => window.print()}>In xác nhận</Button>
            </div>

            <div className="text-center text-sm text-black pt-6">
              <p>Cảm ơn bạn đã tham gia bài thi. Chúc bạn đạt kết quả tốt!</p>
              <p className="mt-1">
                Hệ thống thi trực tuyến PlanBook - {new Date().getFullYear()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
