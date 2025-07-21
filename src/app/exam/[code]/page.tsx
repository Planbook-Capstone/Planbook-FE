"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { StudentInfoForm } from "@/components/organisms/student-info-form";
import { StudentQuestion } from "@/components/organisms/student-question";
import { QuestionNavigation } from "@/components/organisms/question-navigation";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useExamByCodeService,
  useSubmitExamService,
  ExamContentData,
  StudentAnswer,
} from "@/services/studentExamServices";
import { toast } from "sonner";
import { AlertTriangle, CheckCircle } from "lucide-react";

interface ExamPageProps {
  params: Promise<{
    code: string;
  }>;
}

export default function ExamPage({ params }: ExamPageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [studentName, setStudentName] = useState<string>("");
  const [hasStarted, setHasStarted] = useState(false);
  const [currentQuestionId, setCurrentQuestionId] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // localStorage keys
  const STORAGE_KEYS = {
    studentName: `exam_student_name_${resolvedParams.code}`,
    hasStarted: `exam_has_started_${resolvedParams.code}`,
    currentQuestionId: `exam_current_question_${resolvedParams.code}`,
    answers: `exam_answers_${resolvedParams.code}`,
    timeRemaining: `exam_time_remaining_${resolvedParams.code}`,
    startTime: `exam_start_time_${resolvedParams.code}`,
  };

  // API hooks
  const {
    data: examResponse,
    isLoading: isLoadingExam,
    error: examError,
  } = useExamByCodeService(resolvedParams.code);

  const { mutate: submitExam } = useSubmitExamService(resolvedParams.code);

  const examData = examResponse?.data as ExamContentData;

  // Load saved data from localStorage on component mount
  useEffect(() => {
    const savedStudentName = localStorage.getItem(STORAGE_KEYS.studentName);
    const savedHasStarted = localStorage.getItem(STORAGE_KEYS.hasStarted);
    const savedCurrentQuestionId = localStorage.getItem(
      STORAGE_KEYS.currentQuestionId
    );
    const savedAnswers = localStorage.getItem(STORAGE_KEYS.answers);
    const savedTimeRemaining = localStorage.getItem(STORAGE_KEYS.timeRemaining);
    const savedStartTime = localStorage.getItem(STORAGE_KEYS.startTime);

    if (savedStudentName) setStudentName(savedStudentName);
    if (savedHasStarted === "true") setHasStarted(true);
    if (savedCurrentQuestionId)
      setCurrentQuestionId(parseInt(savedCurrentQuestionId));
    if (savedAnswers) {
      try {
        setAnswers(JSON.parse(savedAnswers));
      } catch (error) {
        console.error("Error parsing saved answers:", error);
      }
    }

    // Calculate remaining time based on saved start time and duration
    if (savedStartTime && savedHasStarted === "true" && examData) {
      const startTime = parseInt(savedStartTime);
      const currentTime = Date.now();
      const elapsedSeconds = Math.floor((currentTime - startTime) / 1000);
      const totalDurationSeconds = examData.durationMinutes * 60;
      const remainingSeconds = Math.max(
        0,
        totalDurationSeconds - elapsedSeconds
      );

      if (remainingSeconds > 0) {
        setTimeRemaining(remainingSeconds);
      } else {
        // Time is up, auto submit
        handleAutoSubmit();
      }
    }
  }, [examData]);

  // Initialize timer when exam starts
  useEffect(() => {
    if (hasStarted && examData && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          const newTime = prev - 1;
          // Save time to localStorage every 5 seconds to avoid too frequent writes
          if (newTime % 5 === 0) {
            localStorage.setItem(
              STORAGE_KEYS.timeRemaining,
              newTime.toString()
            );
          }

          if (newTime <= 0) {
            clearInterval(timer);
            handleAutoSubmit();
            return 0;
          }
          return newTime;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [hasStarted, examData, timeRemaining]);

  // Set first question as current when exam starts
  useEffect(() => {
    if (hasStarted && examData && currentQuestionId === 0) {
      const firstQuestion = examData.contentJson.parts[0]?.questions[0];
      if (firstQuestion) {
        setCurrentQuestionId(firstQuestion.id);
      }
    }
  }, [hasStarted, examData, currentQuestionId]);

  // Prevent page refresh/close during exam
  useEffect(() => {
    if (hasStarted && !isSubmitting) {
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        e.returnValue =
          "Bạn có chắc chắn muốn rời khỏi trang? Dữ liệu làm bài sẽ được lưu tự động.";
        return e.returnValue;
      };

      window.addEventListener("beforeunload", handleBeforeUnload);
      return () =>
        window.removeEventListener("beforeunload", handleBeforeUnload);
    }
  }, [hasStarted, isSubmitting]);

  const handleStartExam = (name: string) => {
    setStudentName(name);
    setHasStarted(true);

    // Save to localStorage
    localStorage.setItem(STORAGE_KEYS.studentName, name);
    localStorage.setItem(STORAGE_KEYS.hasStarted, "true");
    localStorage.setItem(STORAGE_KEYS.startTime, Date.now().toString());

    // Initialize time if not already set
    if (examData && timeRemaining === 0) {
      const durationInSeconds = examData.durationMinutes * 60;
      setTimeRemaining(durationInSeconds);
      localStorage.setItem(
        STORAGE_KEYS.timeRemaining,
        durationInSeconds.toString()
      );
    }
  };

  const handleAnswerChange = (questionId: number, answer: any) => {
    const newAnswers = {
      ...answers,
      [questionId]: answer,
    };
    setAnswers(newAnswers);

    // Save to localStorage
    localStorage.setItem(STORAGE_KEYS.answers, JSON.stringify(newAnswers));
  };

  const handleQuestionSelect = (questionId: number) => {
    setCurrentQuestionId(questionId);
    localStorage.setItem(STORAGE_KEYS.currentQuestionId, questionId.toString());
  };

  const handleAutoSubmit = () => {
    toast.warning("Hết thời gian! Bài thi sẽ được nộp tự động.");
    handleSubmitExam();
  };

  const handleSubmitExam = () => {
    if (!examData) return;

    setIsSubmitting(true);

    // Prepare answers for submission
    const studentAnswers: StudentAnswer[] = [];

    examData.contentJson.parts.forEach((part) => {
      part.questions.forEach((question) => {
        const answer = answers[question.id];

        let questionType: "multiple_choice" | "true_false" | "short_answer";
        if (part.part === "PHẦN I") questionType = "multiple_choice";
        else if (part.part === "PHẦN II") questionType = "true_false";
        else questionType = "short_answer";

        studentAnswers.push({
          questionId: question.id,
          answer: answer || (questionType === "true_false" ? {} : ""),
          questionType,
        });
      });
    });

    const submitData = {
      studentName,
      answers: studentAnswers,
    };

    submitExam(submitData, {
      onSuccess: (response: any) => {
        console.log("🎉 Submit success response:", response);
        toast.success("Nộp bài thành công!");
        setShowSubmitModal(false);

        // Store result data and redirect to success page
        const resultData = response?.data;
        console.log("📊 Result data to store:", resultData);

        if (resultData) {
          const storageKey = `exam_result_${resolvedParams.code}`;
          const dataToStore = JSON.stringify(resultData);
          localStorage.setItem(storageKey, dataToStore);
          console.log("💾 Stored in localStorage:", storageKey, dataToStore);
        }

        // Clear exam progress data from localStorage
        Object.values(STORAGE_KEYS).forEach((key) => {
          localStorage.removeItem(key);
        });

        router.push(`/exam/${resolvedParams.code}/success`);
      },
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message || "Có lỗi xảy ra khi nộp bài"
        );
        setIsSubmitting(false);
      },
    });
  };

  // Prepare question status for navigation
  const getQuestionStatuses = () => {
    if (!examData) return [];

    const statuses: any[] = [];
    examData.contentJson.parts.forEach((part) => {
      part.questions.forEach((question) => {
        const isAnswered =
          answers[question.id] !== undefined &&
          answers[question.id] !== "" &&
          (typeof answers[question.id] !== "object" ||
            Object.keys(answers[question.id]).length > 0);

        statuses.push({
          questionId: question.id,
          questionNumber: question.questionNumber,
          partType: part.part,
          isAnswered,
        });
      });
    });
    return statuses;
  };

  const getCurrentQuestion = () => {
    if (!examData) return null;

    for (const part of examData.contentJson.parts) {
      const question = part.questions.find((q) => q.id === currentQuestionId);
      if (question) {
        return {
          question,
          partType: part.part as "PHẦN I" | "PHẦN II" | "PHẦN III",
        };
      }
    }
    return null;
  };

  if (isLoadingExam) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải bài thi...</p>
        </div>
      </div>
    );
  }

  if (examError || !examData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Không tìm thấy bài thi
          </h1>
          <p className="text-gray-600 mb-6">
            Mã đề "{resolvedParams.code}" không tồn tại hoặc đã hết hạn.
          </p>
          <Button onClick={() => router.push("/")}>Quay về trang chủ</Button>
        </div>
      </div>
    );
  }

  if (!hasStarted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <StudentInfoForm
          examInfo={{
            examName: examData.examName,
            subject: examData.subject,
            grade: examData.grade,
            durationMinutes: examData.durationMinutes,
            code: examData.code,
          }}
          onSubmit={handleStartExam}
        />
      </div>
    );
  }

  const currentQuestionData = getCurrentQuestion();
  const questionStatuses = getQuestionStatuses();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {examData.examName}
              </h1>
              <p className="text-sm text-gray-600">Học sinh: {studentName}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Mã đề: {examData.code}</p>
              <p className="text-sm text-gray-600">
                {examData.subject} - Lớp {examData.grade}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question Content */}
          <div className="lg:col-span-3">
            {currentQuestionData && (
              <StudentQuestion
                question={currentQuestionData.question}
                partType={currentQuestionData.partType}
                answer={answers[currentQuestionData.question.id]}
                onAnswerChange={handleAnswerChange}
              />
            )}
          </div>

          {/* Navigation Sidebar */}
          <div className="lg:col-span-1">
            <QuestionNavigation
              questions={questionStatuses}
              currentQuestionId={currentQuestionId}
              onQuestionSelect={handleQuestionSelect}
              timeRemaining={timeRemaining}
              onSubmit={() => setShowSubmitModal(true)}
            />
          </div>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      <Modal
        isOpen={showSubmitModal}
        onClose={() => !isSubmitting && setShowSubmitModal(false)}
        title="Xác nhận nộp bài"
        size="md"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-lg">
            <AlertTriangle className="w-6 h-6 text-yellow-600" />
            <div>
              <p className="font-medium text-yellow-800">
                Bạn có chắc chắn muốn nộp bài?
              </p>
              <p className="text-sm text-yellow-700">
                Sau khi nộp bài, bạn không thể thay đổi đáp án.
              </p>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            <p>
              Số câu đã trả lời:{" "}
              {questionStatuses.filter((q) => q.isAnswered).length}/
              {questionStatuses.length}
            </p>
            <p>
              Thời gian còn lại: {Math.floor(timeRemaining / 60)}:
              {(timeRemaining % 60).toString().padStart(2, "0")}
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowSubmitModal(false)}
              disabled={isSubmitting}
              className="flex-1"
            >
              Tiếp tục làm bài
            </Button>
            <Button
              onClick={handleSubmitExam}
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? "Đang nộp..." : "Nộp bài"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
