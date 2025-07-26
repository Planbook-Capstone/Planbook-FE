'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Question } from '@/components/organisms/exam-question-item/types';
import { YesNoQuestion } from '@/components/organisms/yes-no-question-item/types';
import { ShortQuestion } from '@/components/organisms/short-question-item/types';
import { BasicExamInfo, defaultBasicExamInfo } from "@/components/organisms/basic-exam-info/types";

interface ExamContextType {
  basicExamInfo: BasicExamInfo;
  examQuestions: Question[];
  examYesNoQuestions: YesNoQuestion[];
  examShortQuestions: ShortQuestion[];
  updateBasicExamInfo: (info: BasicExamInfo) => void;
  updateQuestion: (question: Question) => void;
  updateYesNoQuestion: (question: YesNoQuestion) => void;
  updateShortQuestion: (question: ShortQuestion) => void;
  deleteQuestion: (questionId: string) => void;
  deleteYesNoQuestion: (questionId: string) => void;
  deleteShortQuestion: (questionId: string) => void;
  addQuestion: () => void;
  addYesNoQuestion: () => void;
  addShortQuestion: () => void;
  updateQuestionImage: (questionId: string, imagePath: string) => void;
  updateYesNoQuestionImage: (questionId: string, imagePath: string) => void;
  updateShortQuestionImage: (questionId: string, imagePath: string) => void;
  setExamFromApiResponse: (apiResponse: any) => void;
}

const ExamContext = createContext<ExamContextType | undefined>(undefined);

export const useExamContext = () => {
  const context = useContext(ExamContext);
  if (!context) {
    throw new Error('useExamContext must be used within an ExamProvider');
  }
  return context;
};

interface ExamProviderProps {
  children: ReactNode;
}

export const ExamProvider: React.FC<ExamProviderProps> = ({ children }) => {
  const [basicExamInfo, setBasicExamInfo] = useState<BasicExamInfo>(defaultBasicExamInfo);
  const [examQuestions, setExamQuestions] = useState<Question[]>([
    {
      id: '1',
      question: 'Câu hỏi mẫu?',
      options: ['Đáp án A', 'Đáp án B', 'Đáp án C', 'Đáp án D'],
      correctAnswer: 0,
      type: 'single'
    }
  ]);
  
  const [examYesNoQuestions, setExamYesNoQuestions] = useState<YesNoQuestion[]>([]);
  const [examShortQuestions, setExamShortQuestions] = useState<ShortQuestion[]>([]);

  const updateQuestion = (question: Question) => {
    setExamQuestions(prev => prev.map(q => q.id === question.id ? question : q));
  };

  const updateYesNoQuestion = (question: YesNoQuestion) => {
    setExamYesNoQuestions(prev => prev.map(q => q.id === question.id ? question : q));
  };

  const updateShortQuestion = (question: ShortQuestion) => {
    setExamShortQuestions(prev => prev.map(q => q.id === question.id ? question : q));
  };

  const deleteQuestion = (questionId: string) => {
    setExamQuestions(prev => prev.filter(q => q.id !== questionId));
  };

  const deleteYesNoQuestion = (questionId: string) => {
    setExamYesNoQuestions(prev => prev.filter(q => q.id !== questionId));
  };

  const deleteShortQuestion = (questionId: string) => {
    setExamShortQuestions(prev => prev.filter(q => q.id !== questionId));
  };

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      type: 'single'
    };
    setExamQuestions(prev => [...prev, newQuestion]);
  };

  const addYesNoQuestion = () => {
    const newQuestion: YesNoQuestion = {
      id: Date.now().toString(),
      question: '',
      statements: {
        a: { text: '', answer: true },
        b: { text: '', answer: false },
        c: { text: '', answer: true },
        d: { text: '', answer: false }
      },
      type: 'yes-no'
    };
    setExamYesNoQuestions(prev => [...prev, newQuestion]);
  };

  const addShortQuestion = () => {
    const newQuestion: ShortQuestion = {
      id: Date.now().toString(),
      question: '',
      answer: '',
      type: 'short'
    };
    setExamShortQuestions(prev => [...prev, newQuestion]);
  };

  const updateQuestionImage = (questionId: string, imagePath: string) => {
    setExamQuestions(prev =>
      prev.map(q =>
        q.id === questionId
          ? { ...q, illustrationImage: imagePath }
          : q
      )
    );
  };

  const updateYesNoQuestionImage = (questionId: string, imagePath: string) => {
    setExamYesNoQuestions(prev =>
      prev.map(q =>
        q.id === questionId
          ? { ...q, illustrationImage: imagePath }
          : q
      )
    );
  };

  const updateShortQuestionImage = (questionId: string, imagePath: string) => {
    setExamShortQuestions(prev =>
      prev.map(q =>
        q.id === questionId
          ? { ...q, illustrationImage: imagePath }
          : q
      )
    );
  };

  const updateBasicExamInfo = (info: BasicExamInfo) => {
    setBasicExamInfo(info);
  };

  const setExamFromApiResponse = (apiResponse: any) => {
    console.log("=== SETTING EXAM FROM API RESPONSE ===");
    console.log("API Response:", apiResponse);

    const examData = apiResponse?.data?.data;
    if (!examData) {
      console.error("No exam data found in API response");
      return;
    }

    // Update basic exam info
    const newBasicInfo: BasicExamInfo = {
      subject: examData.subject || "Hóa học",
      grade: examData.grade || 10,
      duration_minutes: examData.duration_minutes || 45,
      school: examData.school || "",
      exam_code: examData.exam_code || "1234",
      atomic_masses: examData.atomic_masses || null,
    };
    setBasicExamInfo(newBasicInfo);

    // Process parts and questions
    const parts = examData.parts || [];
    let allQuestions: Question[] = [];
    let allYesNoQuestions: YesNoQuestion[] = [];
    let allShortQuestions: ShortQuestion[] = [];

    parts.forEach((part: any, partIndex: number) => {
      const questions = part.questions || [];

      questions.forEach((q: any, qIndex: number) => {
        const questionId = `${partIndex}-${qIndex}`;

        // Determine question type based on part index
        if (partIndex === 0) {
          // PHẦN I - Multiple choice questions (parts[0])
          const question: Question = {
            id: questionId,
            question: q.question || "",
            options: q.options || ["", "", "", ""],
            correctAnswer: q.answer ? (q.answer.charCodeAt(0) - 65) : 0, // Convert A,B,C,D to 0,1,2,3
            answer: q.answer,
            type: "single"
          };
          allQuestions.push(question);
        } else if (partIndex === 1) {
          // PHẦN II - Yes/No questions (parts[1])
          const question: YesNoQuestion = {
            id: questionId,
            question: q.question || "",
            statements: q.statements || {
              a: { text: "", answer: true },
              b: { text: "", answer: false },
              c: { text: "", answer: true },
              d: { text: "", answer: false }
            },
            type: "yes-no"
          };
          allYesNoQuestions.push(question);
        } else if (partIndex === 2) {
          // PHẦN III - Short answer questions (parts[2])
          const question: ShortQuestion = {
            id: questionId,
            question: q.question || "",
            answer: q.answer || "",
            type: "short"
          };
          allShortQuestions.push(question);
        }
      });
    });

    console.log("Processed questions:", {
      multipleChoice: allQuestions.length,
      yesNo: allYesNoQuestions.length,
      short: allShortQuestions.length
    });

    // Update state
    setExamQuestions(allQuestions);
    setExamYesNoQuestions(allYesNoQuestions);
    setExamShortQuestions(allShortQuestions);
  };

  const value: ExamContextType = {
    basicExamInfo,
    examQuestions,
    examYesNoQuestions,
    examShortQuestions,
    updateBasicExamInfo,
    updateQuestion,
    updateYesNoQuestion,
    updateShortQuestion,
    deleteQuestion,
    deleteYesNoQuestion,
    deleteShortQuestion,
    addQuestion,
    addYesNoQuestion,
    addShortQuestion,
    updateQuestionImage,
    updateYesNoQuestionImage,
    updateShortQuestionImage,
    setExamFromApiResponse,
  };

  return (
    <ExamContext.Provider value={value}>
      {children}
    </ExamContext.Provider>
  );
};
