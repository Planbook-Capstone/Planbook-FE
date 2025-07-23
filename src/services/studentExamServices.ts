"use client";

import { createMutationHook, createQueryHook } from "@/hooks/react-query";
import { EXAM_ENDPOINTS } from "@/constants/apiEndpoints";

/**
 * Interface for exam content data
 */
export interface ExamQuestion {
  id: string; // UUID từ backend
  question: string;
  questionNumber: number;
  originalQuestionNumber?: number; // Số thứ tự gốc
  options?: Record<string, string>; // For multiple choice questions
  answer?: string; // For short answer questions
  statements?: Record<string, { text: string; answer?: boolean }>; // For true/false questions
  illustrationImage?: string; // URL to illustration image
}

export interface ExamPart {
  part: string;
  title: string;
  questions: ExamQuestion[];
}

export interface ExamInfo {
  title: string;
  header: string;
  subject: string;
  duration: string;
  examCode: string;
  totalQuestions: number;
}

export interface ExamContentData {
  examInstanceId: string;
  examName: string;
  subject: string;
  grade: number;
  durationMinutes: number;
  contentJson: {
    parts: ExamPart[];
    examInfo?: ExamInfo; // Optional vì format mới có thể không có
  };
  startAt: string;
  endAt: string;
  code: string;
}

/**
 * Interface for student answers
 */
export interface StudentAnswer {
  questionId: number | string;
  answer: string | boolean | Record<string, boolean>;
  questionType: "multiple_choice" | "true_false" | "short_answer";
}

export interface SubmitExamData {
  studentName: string;
  answers: StudentAnswer[];
}

/**
 * Interface for submit exam response
 */
export interface SubmitExamResponse {
  submissionId: string;
  studentName: string;
  score: number;
  correctCount: number;
  totalQuestions: number;
  maxScore: number;
  submittedAt: string;
  message: string;
}

/**
 * Hook for fetching exam content by code
 */
export const useExamByCodeService = (code: string) => {
  return createQueryHook(
    `examByCode-${code}`,
    EXAM_ENDPOINTS.EXAM_BY_CODE(code)
  )();
};

/**
 * Hook for submitting exam answers
 */
export const useSubmitExamService = (code: string) => {
  return createMutationHook(
    `submitExam-${code}`,
    EXAM_ENDPOINTS.SUBMIT_EXAM(code)
  )();
};
